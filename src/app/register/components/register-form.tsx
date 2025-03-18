/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { registerUser } from "@/api/register";
import { RegisterRequest } from "@/app/interfaces/register";
import { GoogleButton } from "@/components/auth/google-button";
import { Divider } from "@/components/common/divider";
import { ErrorMessage } from "@/components/common/error-message";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { LoginLink, SubmitButton } from "./register-button";
import { InputField } from "./register-input-field";

interface FormData extends RegisterRequest {
  confirmPassword: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = (): boolean => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      router.push("/login");
    } catch (error) {
      handleRegistrationError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationError = (error: unknown) => {
    if (error instanceof Error) {
      if ((error as any).response && (error as any).response.data?.message) {
        setError((error as any).response.data.message);
      } else {
        setError(error.message);
      }
    } else {
      setError("An unknown error occurred during registration.");
    }
  };

  return (
    <>
      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} className='space-y-4 mt-6'>
        <InputField
          label='Username'
          name='username'
          type='text'
          value={formData.username}
          onChange={handleChange}
          disabled={isLoading}
          required
        />

        <InputField
          label='Email'
          name='email'
          type='email'
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          required
        />

        <InputField
          label='Password'
          name='password'
          type='password'
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          required
        />

        <InputField
          label='Confirm Password'
          name='confirmPassword'
          type='password'
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isLoading}
          required
        />

        <SubmitButton isLoading={isLoading} />
      </form>

      <Divider text='Or Register with' />
      <GoogleButton isLoading={isLoading} />
      <LoginLink isLoading={isLoading} />
    </>
  );
}
