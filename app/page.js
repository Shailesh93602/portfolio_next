"use client";
import Image from "next/image";
import React, { useState, useCallback, useMemo } from "react";
import { useInterval } from "react-use";

const Index = () => {
  const elements = useMemo(
    () => [
      "Full Stack Developer",
      "Software Engineer",
      "MERN Stack Developer",
      "Node.js Developer",
      "Next.js Developer",
      "React.js Developer",
    ],
    []
  );
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const typingTimer = useCallback(() => {
    setCharIndex((prevCharIndex) => prevCharIndex + 1);

    if (charIndex === elements[wordIndex].length) {
      setCharIndex(0);
      if (wordIndex === elements.length - 1) {
        setWordIndex(0);
      } else {
        setWordIndex(wordIndex + 1);
      }
    }
  }, [elements, charIndex, wordIndex]);

  useInterval(typingTimer, 150);

  return (
    <section
      className="min-h-screen flex flex-col-reverse lg:flex-row items-center justify-center bg-white text-black dark:text-white py-16 px-6 lg:px-20 dark:bg-black"
      id="home"
    >
      {/* Content Section */}
      <div className="lg:w-1/2 text-center lg:text-left space-y-6">
        <h3 className="text-xl text-gray-400">Hello, I&apos;m</h3>
        <h1 className="text-5xl font-bold text-white leading-tight">
          Shailesh Chaudhari
        </h1>
        <h3 className="text-2xl font-semibold text-blue-400">
          {elements[wordIndex].slice(0, charIndex)}|
        </h3>
        <p className="text-lg text-gray-300">
          Passionate Full Stack Developer with expertise in building dynamic web
          applications. Skilled in Node.js, React, and modern web technologies,
          dedicated to delivering high-quality code and seamless user
          experiences. Let&apos;s turn your ideas into reality!
        </p>
        {/* Social Links */}
        <div className="flex justify-center lg:justify-start space-x-6 mt-6">
          <a
            href="https://www.linkedin.com/in/shaileshbhai-chaudhari/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-300 transition-colors"
          >
            <i className="bx bxl-linkedin text-3xl"></i>
          </a>
          <a
            href="https://github.com/shailesh93602"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-400 transition-colors"
          >
            <i className="bx bxl-github text-3xl"></i>
          </a>
          <a
            href="https://www.codechef.com/users/shaileshbhai03"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-500 hover:text-yellow-300 transition-colors"
          >
            <i className="bx bxl-c-plus-plus text-3xl"></i>
          </a>
          <a
            href="https://www.hackerrank.com/profile/shailesh93602"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:text-green-300 transition-colors"
          >
            <i className="bx bx-code-alt text-3xl"></i>
          </a>
        </div>
      </div>

      {/* Image Section */}
      <div className="lg:w-1/2 flex justify-center mb-10 lg:mb-0">
        <Image
          src="/images/home.webp"
          alt="home"
          width={400}
          height={400}
          className="rounded-full shadow-2xl border-4 border-blue-500"
        />
      </div>
    </section>
  );
};

export default Index;
