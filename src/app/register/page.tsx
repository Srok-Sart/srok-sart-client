"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation'; 
import { registerUser } from "../../api/register"; 

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      const data = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
  
      console.log("Registration successful:", data);
      alert("Registration successful!");
      router.push('/login'); 
    } catch (error) {
      console.error("Registration error:", error);
  
      if (error instanceof Error) {
        alert(error.message || "An error occurred during registration.");
      } else {
        alert("An unknown error occurred during registration.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md md:max-w-lg bg-white p-8 shadow-lg rounded-xl">
        {/* Heading */}
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Register Account
        </h2>

        {/* Input Fields */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label className="text-gray-600 block mb-1">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-[#6437A0]"
              required
            />
          </div>
          <div>
            <label className="text-gray-600 block mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-[#6437A0]"
              required
            />
          </div>
          <div>
            <label className="text-gray-600 block mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-[#6437A0]"
              required
            />
          </div>
          <div>
            <label className="text-gray-600 block mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-[#6437A0]"
              required
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full p-3 bg-[#6437A0] text-white rounded-lg hover:bg-[#4F2D83] transition"
          >
            Register
          </button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center space-x-2 my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="text-gray-500 text-sm">Or Register with</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Register Button */}
        <button className="flex w-full items-center justify-center space-x-3 border py-3 rounded-lg hover:bg-gray-100 transition">
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google Logo"
            className="h-5 w-5"
          />
          <span className="text-gray-700">Log in with Google</span>
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-[#6437A0] hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;