"use client";
import { useState } from "react";
import Link from "next/link";
import useStore from "./zustand/store";
import { useRouter } from "next/navigation";
import Image from "next/image";


const Products = [
  {
    id: 1,
    name: "Product 1",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: 19.99,
    imageUrl: "/product1.jpg",
  },
  {
    id: 2,
    name: "Product 2",
    description:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    price: 29.99,
    imageUrl: "/product2.jpg",
  },
  {
    id: 3,
    name: "Product 3",
    description:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    price: 29.99,
    imageUrl: "/product3.jpg",
  },
  {
    id: 4,
    name: "Product 4",
    description:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    price: 29.99,
    imageUrl: "/product4.jpg",
  },
  {
    id: 5,
    name: "Product 5",
    description:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    price: 29.99,
    imageUrl: "/product5.jpg",
  },
  {
    id: 6,
    name: "Product 6",
    description:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    price: 29.99,
    imageUrl: "/product6.jpg",
  },
  {
    id: 7,
    name: "Product 7",
    description:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    price: 29.99,
    imageUrl: "/product7.jpg",
  },
  // Add more products as needed
];

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const router = useRouter();
  const currentUser = useStore((state) => state.currentUser);

  const signOut = useStore((state: any) => state.signOut);

  const haveCredentials =
    currentUser?.data.user._id && currentUser?.data.accessToken;

  const handleSignOut = async () => {
    try {
      await fetch("http://localhost:8881/api/v1/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: "Bearer" + " " + currentUser.data.accessToken,
          // token: {` Bearer ${currentUser.data.accessToken}`}
        }),
      });
      // dispatch(signOut())
      signOut();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`bg-${darkMode ? "gray-900" : "gray-100"} min-h-screen text-${
        darkMode ? "white" : "black"
      }`}
    >
      <nav className={`bg-${darkMode ? "gray-800" : "blue-500"} p-4`}>
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <Link
              href="/"
              className={`text-${
                darkMode ? "white" : "white"
              } font-bold text-xl`}
            >
              Dashboard
            </Link>
          </div>
          <div>
            {haveCredentials ? (
              <button
                onClick={handleSignOut}
                className={`text-${darkMode ? "white" : "white"} mr-4`}
              >
                Logout
              </button>
            ) : (
              <>
                {" "}
                <Link
                  href="/signup"
                  className={`text-${darkMode ? "white" : "white"} mr-4`}
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className={`text-${darkMode ? "white" : "white"} mr-4`}
                >
                  Log in
                </Link>
              </>
            )}

            <Link
              href="/contact"
              className={`text-${darkMode ? "white" : "white"} mr-4`}
            >
              Contact
            </Link>
            <Link
              href="/about"
              className={`text-${darkMode ? "white" : "white"} mr-3`}
            >
              About
            </Link>
            <button
              onClick={toggleDarkMode}
              className={`text-${darkMode ? "white" : "white"} ml-3`}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            {haveCredentials && <Link
              href="/profile"
              className={`text-${darkMode ? "white" : "white"} ml-3`}
            >
              Profile
            </Link>}
          </div>
        </div>
      </nav>
      <main className="container mx-auto py-8">
        <h1
          className={`text-3xl font-bold mb-4 ${
            darkMode ? "text-white" : "text-blue-400"
          }`}
        >
          Product List
        </h1>
        {haveCredentials ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Products.map((product) => (
              <div
                key={product.id}
                className={`bg-${
                  darkMode ? "gray-500" : "white"
                } p-4 rounded-lg shadow-md`}
              >
                <Image src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-64 object-cover mb-4"/>
                <h2
                  className={`text-lg font-bold mb-2 ${
                    darkMode ? "text-white" : "text-black"
                  }`}
                >
                  {product.name}
                </h2>
                <p
                  className={`text-${darkMode ? "gray-300" : "gray-700"} mb-4`}
                >
                  {product.description}
                </p>
                <p className={`text-${darkMode ? "white" : "black"} font-bold`}>
                  ${product.price}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Products.slice(0,2).map((product) => (
              <div
                key={product.id}
                className={`bg-${
                  darkMode ? "gray-500" : "white"
                } p-4 rounded-lg shadow-md`}
              >
                <Image  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-64 object-cover mb-4 "/>
                <h2
                  className={`text-lg font-bold mb-2 ${
                    darkMode ? "text-white" : "text-black"
                  }`}
                >
                  {product.name}
                </h2>
                <p
                  className={`text-${darkMode ? "gray-300" : "gray-700"} mb-4`}
                >
                  {product.description}
                </p>
                <p className={`text-${darkMode ? "white" : "black"} font-bold`}>
                  ${product.price}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
      <footer
        className={`bg-${
          darkMode ? "gray-800" : "blue-500"
        } p-4 mt-8 bottom-0 w-full`}
      >
        <div className="container mx-auto text-white text-center">
          <ul className="flex justify-center">
            <li className="mx-2">
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li className="mx-2">
              <Link href="/terms">Terms of Service</Link>
            </li>
            <li className="mx-2">
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
