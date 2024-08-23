"use client";
import React, { useState } from "react";
import Image from "next/image";

const About = () => {
  const [showFullContent, setShowFullContent] = useState(false);

  const toggleContent = () => {
    setShowFullContent(!showFullContent);
  };

  return (
    <section
      className="py-16 bg-gradient-to-b from-gray-50 to-gray-200 dark:from-black dark:to-black dark:text-white"
      id="about"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center px-6 lg:px-12">
        <div className="w-full lg:w-1/2 mb-12 lg:mb-0 flex justify-center lg:justify-start">
          <Image
            src="/images/home.webp"
            alt="about"
            width={400}
            height={400}
            className="rounded-full shadow-xl border-4 border-blue-500"
          />
        </div>
        <div id="aboutMe" className="w-full lg:w-1/2">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-bold mb-6">
              About <span className="text-blue-500">Me</span>
            </h2>
            <h3 className="text-2xl font-semibold mb-8 text-gray-700 dark:text-gray-200">
              Fullstack Developer
            </h3>
            {showFullContent ? (
              <div id="aboutMeFull">
                <p className="mb-6 text-lg text-gray-700 dark:text-gray-100 leading-relaxed">
                  I am a passionate Full Stack Developer based in Gujarat,
                  India, dedicated to crafting high-quality, user-centric web
                  applications. With a strong foundation in both front-end and
                  back-end technologies, I strive to deliver seamless user
                  experiences and efficient solutions.
                </p>
                <div className="skills-section mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    Skills
                  </h3>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-lg text-gray-700 dark:text-gray-200 list-disc list-inside">
                    <li>Next.js</li>
                    <li>Nest.js</li>
                    <li>Node.js</li>
                    <li>React</li>
                    <li>Express</li>
                    <li>MongoDB</li>
                    <li>MySQL</li>
                    <li>PostgreSQL</li>
                    <li>C++</li>
                    <li>HTML</li>
                    <li>CSS</li>
                    <li>Tailwind CSS</li>
                    <li>EJS</li>
                    <li>JavaScript</li>
                    <li>TypeScript</li>
                    <li>Java</li>
                    <li>Android</li>
                  </ul>
                </div>
                <p className="mb-6 text-lg text-gray-700 dark:text-gray-200">
                  For more details about my work and experience, check out my
                  resume:
                  <a
                    className="text-blue-500 underline ml-1"
                    href="https://drive.google.com/file/d/1bJjqTSmoIROSvH1vb8xoZ-zZDAC96eS5/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Resume
                  </a>
                </p>
                <button
                  className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                  onClick={toggleContent}
                >
                  Show Less
                </button>
              </div>
            ) : (
              <div id="aboutMeShort">
                <p className="mb-6 text-lg text-gray-700 leading-relaxed">
                  Hello, I&apos;m Shailesh Chaudhari, a Full Stack Developer
                  with a passion for creating impactful web solutions.
                </p>
                <button
                  className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                  onClick={toggleContent}
                >
                  Read More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
