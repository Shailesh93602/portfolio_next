"use client";
import Image from "next/image";
import React from "react";

const Portfolio = () => {
  return (
    <section className="py-12" id="portfolio">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
          Latest <span className="text-blue-500">Projects</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <Image
              src="/images/portfolio1.png"
              alt="Cricket Auction System"
              width={400}
              height={400}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Cricket Auction System
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                A web application developed for the college cricket league,
                simplifying the player registration and auction process. Built
                with Node.js, Express.js, EJS, and MongoDB.
              </p>
              <a
                href="https://sportifygec.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 transition duration-200"
              >
                <i className="bx bx-link-external"></i>
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <Image
              src="/images/portfolio1.png"
              alt="Jarvis AI"
              width={400}
              height={400}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Jarvis AI
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                An advanced Android app built with Java and XML, enabling voice
                commands for effortless task management on smartphones.
              </p>
              <a
                href="https://github.com/Shailesh93602/jarvis-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 transition duration-200"
              >
                <i className="bx bx-link-external"></i>
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <Image
              src="/images/portfolio1.png"
              alt="MasteryPrep"
              width={400}
              height={400}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                MasteryPrep
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                An online platform to learn programming fundamentals for
                technical interviews, built with the MERN stack.
              </p>
              <a
                href="https://www.github.com/shailesh93602/MasteryPrep/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 transition duration-200"
              >
                <i className="bx bx-link-external"></i>
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <Image
              src="/images/portfolio1.png"
              alt="TODO List"
              width={400}
              height={400}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                TODO List
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                A user-friendly task management application, built with HTML,
                CSS, and JavaScript.
              </p>
              <a
                href="https://github.com/Shailesh93602/todolist"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 transition duration-200"
              >
                <i className="bx bx-link-external"></i>
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <Image
              src="/images/portfolio1.png"
              alt="Tic Tac Toe"
              width={400}
              height={400}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Tic Tac Toe
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                A simple web-based game with sound effects, built with HTML,
                CSS, and JavaScript.
              </p>
              <a
                href="https://github.com/Shailesh93602/tictactoe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 transition duration-200"
              >
                <i className="bx bx-link-external"></i>
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <Image
              src="/images/portfolio1.png"
              alt="Book E Sell"
              width={400}
              height={400}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Book E Sell
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                A full-stack web application for buying and selling books
                online, built with React, Node.js, Express, and MongoDB.
              </p>
              <a
                href="https://github.com/Shailesh93602/todolist"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 transition duration-200"
              >
                <i className="bx bx-link-external"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
