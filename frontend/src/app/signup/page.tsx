"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Signup = () => {

  type FormData = {
    document?: any | undefined;
    profile?: any | undefined;
    // Add other form fields here if needed
  };
  
  // Initialize formData with an empty object
  const [formData, setFormData] = useState<FormData>({});

  // const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Handle all value data
  // const handleChange = (e: any) => {
  //   setFormData({ ...formData, [e.target.id]: e.target.value || e.target.files[0] });
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // If files are present, set the value of the input field
      setFormData({ ...formData, [e.target.id]: e.target.files[0] });
    } else {
      // If no files are present (input cleared), set the value to an empty string or null
      setFormData({ ...formData, [e.target.id]: "" });
    }
  };

  // Handle Submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      // Making object of form data
      const formData = new FormData();

      // Append form data to FormData
      formData.append("fullName", e.target.fullName.value);
      formData.append("email", e.target.email.value);
      formData.append("username", e.target.username.value);
      formData.append("password", e.target.password.value);
      formData.append("mobile", e.target.mobile.value);

      // Append files to FormData
      formData.append("document", e.target.document.files[0]);
      formData.append("profile", e.target.profile.files[0]);

      const res = await fetch("http://localhost:8880/api/v1/users/register", {
        method: "POST",
        body: formData,
      });
      console.log("insideformData", formData);
      const data = await res.json();
      console.log("data", data);
      setLoading(false);
      if (!res.ok) {
        setError(true);
        return;
      } else {
        setSuccess(true);
        router.push("/login");
        return;
      }

      // Redirect or perform other actions upon successful registration
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  // Frontend static data
  return (
    <div className="flex justify-center items-center h-screen">
      {/* Form start */}
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-black">
          Sign Up
        </h2>
        <div className="mb-4">
          {/* Fullname */}
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className="mt-1 p-1 w-full border rounded-md focus:outline-none focus:border-blue-500 text-black"
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          {/* Email */}
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 p-1 w-full border rounded-md focus:outline-none focus:border-blue-500 text-black"
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          {/* Username */}
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="mt-1 p-1 w-full border rounded-md focus:outline-none focus:border-blue-500 text-black"
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          {/* Password */}
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="mt-1 p-1 w-full border rounded-md focus:outline-none focus:border-blue-500 text-black"
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          {/* Mobile */}
          <label
            htmlFor="mobile"
            className="block text-sm font-medium text-gray-700"
          >
            Mobile
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            className="mt-1 p-1 w-full border rounded-md focus:outline-none focus:border-blue-500 text-black"
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          {/* Document */}
          <label
            htmlFor="document"
            className="block text-sm font-medium text-gray-700"
          >
            Document
          </label>
          <input
            type="file"
            id="document"
            name="document"
            className="hidden"
            // onChange={(e) => handleFileChange(e, "document")}
            onChange={handleChange}
          />
          <label
            htmlFor="document"
            className="w-full py-1 px-4 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-300 transition duration-300 ease-in-out"
          >
            Upload Document
          </label>

          {/* Display the name of the uploaded file */}
          {formData.document && formData.document.name && (
            <p className="text-black mt-2">Uploaded File: {formData.document.name}</p>
          )}

          {/* Optionally, you can show a message when no file is selected */}
          {!formData.document && <p className="text-black mt-2">No file selected</p>}
        </div>
        <div className="mb-8">
          {/* Profile image */}
          <label
            htmlFor="profilePic"
            className="block text-sm font-medium text-gray-700"
          >
            Profile Picture
          </label>
          <input
            type="file"
            id="profile"
            name="profile"
            className="hidden"
            // onChange={(e) => handleFileChange(e, "profile")}
            onChange={handleChange}
          />
          <label
            htmlFor="profile"
            className="w-full py-1 px-4 bg-gray-200 text-gray-700 rounded-md cursor-pointer hover:bg-gray-300 transition duration-300 ease-in-out"
          >
            Upload Profile Picture
          </label>

          {/* Display the name of the uploaded file */}
          {formData.profile && formData.profile.name && (
            <p className="text-black mt-2">Uploaded File: {formData.profile.name}</p>
          )}

          {/* Optionally, you can show a message when no file is selected */}
          {!formData.profile && <p className="text-black mt-2">No file selected</p>}
        </div>
        {/* Submit Button */}
        <button
          disabled={loading}
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <Link href="/login" className="text-black mr-4">
          Go to Login
        </Link>
      </form>
      {/* Error paragraph */}
      <p className="text-red-700 mt-5">{error && "Something went wrong !"}</p>
      <p className="text-green-700 mt-5">{success && "Sign Up Successfully"}</p>
    </div>
  );
};

export default Signup;
