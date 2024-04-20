"use client";

import React from "react";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

// import {
//   signInStart,
//   signInSuccess,
//   signInFailure,
// } from '../(redux)/user/userSlice';
// import { useDispatch, useSelector, useStore } from 'react-redux';

import useStore from '../zustand/store'
import { useRouter } from 'next/navigation';
import OAuth from "../(components)/OAuth";

const Login = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const signInStart = useStore((state:any) => state.signInStart)
  const signInSuccess = useStore((state:any) => state.signInSuccess)
  const signInFailure = useStore((state:any) => state.signInFailure)

  // const dispatch = useDispatch()
  const router = useRouter()

  // // Handle all value data
  // const handleChange = (e: any) => {
  //   setFormData({ ...formData, [e.target.id]: e.target.value });
  // };

  // console.log("bhar", formData);

  // // Handle Submit
  // const handleSubmit = async (e: any) => {
  //   e.preventDefault();
  //   try {
  //     setLoading(true);
  //     setError(false);
  //     // Making object of form data
  //     const formData = new FormData();

  //     formData.append("email", e.target.email.value);
  //     formData.append("password", e.target.password.value);
  //     // Append form data to FormData
  //     // if (e.target.email) {
  //     //   formData.append("email", e.target.email.value);
  //     // } else if (e.target.mobile) {
  //     //   formData.append("mobile", e.target.mobile.value);
  //     // } else (e.target.username)
  //     // {
  //     //   formData.append("username", e.target.username.value);
  //     // }

  //     console.log("Submit formdata", formData);

  //     const res = await axios.post(
  //       "http://localhost:8881/api/v1/users/login",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     const data = await res.data;
  //     console.log("data", data);
  //     setLoading(false);
  //     // if (!res.ok) {
  //     //   setError(true);
  //     //   return;
  //     // } else {
  //     //   setSuccess(true);
  //     //   return;
  //     // }
  //     // Redirect or perform other actions upon successful registration
  //   } catch (error) {
  //     setLoading(false);
  //     setError(true);
  //   }
  // };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLoginFieldChange = (event: any) => {
    const value = event.target.value.trim(); // Trim leading and trailing spaces

    // Check if the entered value looks like an email address
    if (/^\S+@\S+\.\S+$/.test(value)) {
      setFormData({ email: value });
      return;
    }

    // Check if the entered value looks like a mobile number
    if (/^\d{10}$/.test(value)) {
      setFormData({ mobile: value });
      return;
    }

    // Otherwise, assume it's a username
    setFormData({ username: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      // dispatch(signInStart());
      signInStart()
      const res = await fetch("http://localhost:8881/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("login", data)
      if (data.success === false) {
        setLoading(false);
        setError(true);
        setSuccess(false);
        // dispatch(signInFailure(data));
        signInFailure(data)
      } else {
        setLoading(false);
        setError(false);
        setSuccess(true);
        // dispatch(signInSuccess(data));
        signInSuccess(data)
      }
      router.push('/')
    } catch (error) {
      setLoading(false);
      setError(true);
      setSuccess(false);
      // dispatch(signInFailure(error));
      signInFailure(error)
    }
  };
  // Frontend static data
  return (
    <>
      <div className="h-screen mt-10">

        <div >
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg"
          >
            <h2 className="text-3xl font-semibold mb-6 text-center text-black">
              Login
            </h2>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email/Username/Mobile
              </label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Email, Mobile, or Username"
                className="mt-1 p-1 w-full border rounded-md focus:outline-none focus:border-blue-500 text-black"
                onChange={handleLoginFieldChange}
              />
            </div>

            <div className="mb-4">
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

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
            >
              {loading ? "Loading..." : "Login"}
            </button>
            <OAuth/>
          </form>
        </div>

        <div className="w-full text-center mt-2 text-blue-500">
          <Link
            href="/forget-password"
            className=" hover:text-blue-700"
          >
            Forget Password
          </Link>
          <p className="text-red-700 mt-5">
            {error && "Something went wrong !"}
          </p>
          <p className="text-green-700 mt-5">
            {success && "Login Successfully"}
          </p>
          <Link href="/signup" className=" hover:text-blue-700">
          Go to Signup
        </Link>
        </div>

     
      </div>
    </>
  );
};

export default Login;
