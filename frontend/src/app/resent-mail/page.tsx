"use client";
import React, { useState } from "react";
import useStore from "../zustand/store";

const ResentEmailpage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const currentUser = useStore((state) => state.currentUser);

  const handleVerifyEmail = async (e: any) => {
    try {
      e.preventDefault();
      setLoading(true);
      setError(false);
      const email = currentUser.data.user.email;
      const data = await fetch(
        "http://localhost:8882/api/v1/users/resend-mail-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(email),
        }
      );
      console.log(data)
      setSuccess(true)
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleVerifyEmail}
        className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-black">
          Resend Email Verification
        </h2>

        {error && (
          <p className="text-red-500 mb-4"> Sorry ! Resend Email not send</p>
        )}
        {success && (
          <p className="text-green-500 mb-4">
            Email verify link sent successfully.
          </p>
        )}

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="mt-1 p-1 w-full border rounded-md focus:outline-none focus:border-blue-500 text-black"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ResentEmailpage;
