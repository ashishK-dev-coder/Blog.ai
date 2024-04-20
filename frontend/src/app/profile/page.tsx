"use client";
import { useRef, useState, useEffect, RefObject } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import useStore from "../zustand/store";
import { app } from "../firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Ollama } from "@langchain/community/llms/ollama";
import SuggestionBox from "../(components)/Ollama-Suggestion"



export default function Profile() {
  // const dispatch = useDispatch();

  type useRef = {
    profile?: any | undefined;
  };
  const router = useRouter();
  const fileRef = useRef(null);
  // const fileRef = useRef<FileType>(null);

  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  // const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  type FormData = {
    document?: any | undefined;
    profile?: any | undefined;
    // Add other form fields here if needed
  };

  // Initialize formData with an empty object
  const [formData, setFormData] = useState<FormData>({});

  // const { currentUser, loading, error } = useSelector((state:any) => state.user);
  // const {currentUser , loading , error} = useStore()
  const currentUser = useStore((state) => state.currentUser);
  const loading = useStore((state) => state.loading);
  const error = useStore((state) => state.error);

  const signOut = useStore((state: any) => state.signOut);

  console.log("profile", currentUser, loading, error);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);
  const handleFileUpload = async (image: any) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profile: downloadURL })
        );
      }
    );
  };
  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value || e.target.files[0],
    });
  };

  // console.log("userId",currentUser.data.user._id || "")
  // console.log("accessToken",currentUser.data.accessToken || '')

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const userId = currentUser.data.user._id;
      console.log("userid profile", userId);
      // dispatch(updateUserStart());
      const res = await fetch(
        `http://localhost:8881/api/v1/users/update-profile/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formData,
            token: "Bearer" + " " + currentUser.data.accessToken,
          }),
        }
      );
      const data = await res.json();
      console.log("data profile response", data);
      if (data.success === false) {
        // dispatch(updateUserFailure(data));
        return;
      }
      // dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      // dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const userId = currentUser.data.user._id || currentUser._id;
      console.log("delete woG", currentUser.data.user);
      console.log("deelete token", currentUser.data.accessToken);
      console.log("delete wG", currentUser);
      // dispatch(deleteUserStart());
      const res = await fetch(
        `http://localhost:8881/api/v1/users/delete/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: "Bearer" + " " + currentUser.data.accessToken,
          }),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        // dispatch(deleteUserFailure(data));
        return;
      }
      signOut();
      router.push("/signup");
      // dispatch(deleteUserSuccess(data));
    } catch (error) {
      // dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      const accessToken = currentUser.data.accessToken
      await fetch("http://localhost:8881/api/v1/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: "Bearer" + " " + accessToken,
        }),
      });
      // dispatch(signOut())
      signOut();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      router.push("/resent-mail");
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerifyEmailOtp = async () => {
    try {
      router.push("/resent-email-otp");
    } catch (error) {
      console.log(error);
    }
  };

  interface FileType {
    Click?: () => void;
  }

  // Type guard function
  function isFileType(obj: any): obj is FileType {
    return !!obj && typeof obj.Click() === "function";
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e: any) => setImage(e.target.files[0])}
        />
        {/*
      firebase storage rules:  
      allow read;
      allow write: if
      request.resource.size < 2 * 1024 * 1024 &&
      request.resource.contentType.matches('image/.*') */}
        <Image
          src={
            formData?.profile ||
            currentUser?.profile ||
            currentUser?.data.user.profile
          }
          alt="profile"
          className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
          // onClick={() => fileRef?.current }
          // onClick={() => fileRef && fileRef.current && isFileType(fileRef.current.Click()) && fileRef.current.Click() }
          // Inside your onClick handler
          // onClick={() => {
          //   if (fileRef && isFileType(fileRef.current)) {
          //     fileRef.current.Click();
          //   }
          // }}
        />

        <p className="text-sm self-center">
          {imageError ? (
            <span className="text-red-700">
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className="text-slate-700">{`Uploading: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className="text-green-700">Image uploaded successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          // defaultValue={currentUser.username}
          defaultValue={
            currentUser?.username || currentUser?.data.user.username || ""
          }
          type="text"
          id="username"
          placeholder="Username"
          className="bg-slate-100 rounded-lg p-3 text-black"
          onChange={handleChange}
        />
        <input
          // defaultValue={currentUser.email}
          defaultValue={
            currentUser?.email || currentUser?.data.user.email || ""
          }
          type="email"
          id="email"
          placeholder="Email"
          className="bg-slate-100 rounded-lg p-3 text-black"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className=" rounded-lg p-3 text-black"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <button
          onClick={handleDeleteAccount}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </button>
        <span onClick={handleVerifyEmail} className="text-red-700 cursor-pointer">
          Verify your email
        </span>
        <span onClick={handleVerifyEmailOtp} className="text-red-700 cursor-pointer">
           Email Otp
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>

      </div>
      <p className="text-red-700 mt-5">{error && "Something went wrong!"}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess && "User is updated successfully!"}
      </p>
      {/* <SuggestionBox ></SuggestionBox> */}
    </div>
  );
}
