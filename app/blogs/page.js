"use client";
import React, { useState } from "react";

const Blogs = () => {
  const blogLinks = [
    "https://guidetofullstack.blogspot.com/2023/12/demystifying-basics-of-full-stack.html",
    "https://guidetofullstack.blogspot.com/2024/02/mastering-frontend-development.html",
  ];

  const redirectToBlog = (number) => {
    const blogUrl = blogLinks[number - 1];
    window.open(blogUrl, "_blank");
  };

  return (
    <section className="py-12" id="blogs">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
          My <span className="text-blue-500">Blogs</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition-colors duration-300">
            <i className="bx bx-code text-blue-500 text-3xl mb-4"></i>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Demystifying the Basics of Full-Stack Development: A
              Beginner&apos;s Guide
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Hey everyone! 👋 I&apos;m Shaileshbhai Chaudhari, a final year
              student passionate about full-stack development. This guide is for
              anyone curious about how web development works!
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition duration-200"
              onClick={() => redirectToBlog(1)}
            >
              Read More
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition-colors duration-300">
            <i className="bx bx-code text-blue-500 text-3xl mb-4"></i>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Mastering Frontend Development: Essential Skills and Best
              Practices
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Explore the critical aspects of front-end development, from layout
              and styling to functionality and responsiveness.
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition duration-200"
              onClick={() => redirectToBlog(2)}
            >
              Read More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blogs;
