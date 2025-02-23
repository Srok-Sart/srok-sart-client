"use client";

import { loginUser } from "@/api/login";
import { SubmitButton } from "@/app/register/components/register-button";
import { GoogleButton } from "@/components/auth/google-button";
import { Divider } from "@/components/common/divider";
import { ErrorMessage } from "@/components/common/error-message";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { CreateAccount, ForgotPassword } from "./login-button";
import { EmailInput, PasswordInput } from "./login-input-field";

interface FormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginUser(formData);
      console.log("Login success", response);
      router.push("/");
    } catch (error) {
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginError = (error: unknown) => {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Failed to connect to the server. Please try again later.");
    }
  };

  return (
    <>
      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} className='space-y-4 mt-6'>
        <EmailInput
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
        />

        <PasswordInput
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
        />

        <ForgotPassword disabled={isLoading} />

        <SubmitButton isLoading={isLoading} />
      </form>

      <Divider text='Or Login with' />
      <GoogleButton isLoading={isLoading} />
      <CreateAccount isLoading={isLoading} />
    </>
  );
}
