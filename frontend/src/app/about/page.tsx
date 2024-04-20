// pages/about.js
"use client"
import Head from 'next/head';
import Translator from '../(components)/Ollama';

export default function About() {
  return (
    <div className="container mx-auto py-8">
      <Head>
        <title>About Us</title>
        <meta name="description" content="Learn more about our company and mission." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-3xl font-bold mb-4">About Us</h1>

      <div className="max-w-lg mx-auto">
        <p className="text-lg mb-4">
          We are a passionate team dedicated to providing the best products and services to our customers. Our mission
          is to make a positive impact in the world by [insert your mission statement or description here].
        </p>
        <p className="text-lg mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non neque porttitor, finibus odio eu, lacinia
          sem. Integer nec arcu in enim feugiat interdum. Nunc ultricies feugiat tellus, vel finibus purus blandit vel.
        </p>
        <p className="text-lg mb-4">
          Sed lacinia nulla quis augue eleifend tincidunt. Vestibulum vulputate posuere nisi, nec posuere risus
          ullamcorper non. Phasellus tincidunt hendrerit ex, ac consequat enim fermentum eget.
        </p>
      </div>
      <Translator></Translator>
    </div>
  );
}
