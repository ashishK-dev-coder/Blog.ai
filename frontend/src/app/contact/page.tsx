// pages/contact.js
"use client"
import Head from 'next/head';
import Translator from '../(components)/Ollama';
import SuggestionBox from '../(components)/Ollama-Suggestion';
import { useState } from 'react';

export default function Contact() {

  const [text, setText] = useState("");

  return (
    <div className="container mx-auto py-8">
      <Head>
        <title>Contact Us</title>
        <meta name="description" content="Contact us for any inquiries or feedback." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>

      <div className="max-w-lg mx-auto">
        <p className="text-lg mb-4">
          Have a question, feedback, or just want to say hello? Fill out the form below and we&aposll get back to you as soon
          as possible.
        </p>
        <form className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="name" className="block text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Your Name"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Your Email Address"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="mt-1 p-2 w-full border rounded-md text-black"
              placeholder="Your Message"
              required
              onChange={(e:any) => setText(e.target.value)}
              
            ></textarea>
          </div>
          <div>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
            >
              Send Message
            </button>
          </div>
        </form>
        {/* <Translator></Translator> */}
        <SuggestionBox type={text}></SuggestionBox>
      </div>
    </div>
  );
}
