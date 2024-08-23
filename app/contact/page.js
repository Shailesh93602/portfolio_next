"use client";
import React, { useState } from "react";
import emailjs from "emailjs-com";

const Contact = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isConfirmed = window.confirm(
      "Are you sure you want to submit the form?"
    );
    if (!isConfirmed) {
      return;
    }

    const data = {
      from_name: fullName,
      from_email: email,
      from_phoneNumber: phoneNumber,
      from_subject: subject,
      from_message: message,
    };

    try {
      const response = await emailjs.send(
        "service_uh3jspq",
        "template_9jk3yw8",
        data,
        "LzBxIAKfE0LSvqFYw"
      );

      console.log("Email sent successfully:", response);

      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setSubject("");
      setMessage("");

      const successMessages = [
        "Form submitted successfully!",
        "Your message was sent successfully!",
        "Thanks for reaching out! Your form has been submitted.",
      ];

      const randomSuccessMessage =
        successMessages[Math.floor(Math.random() * successMessages.length)];

      alert(randomSuccessMessage);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <section className="py-16 px-8 bg-white dark:bg-gray-800" id="contact">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        Contact <span className="text-blue-600">Me!</span>
      </h2>
      <form
        id="contact-form"
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md"
      >
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            id="fullName"
            placeholder="Full Name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-600 dark:text-white"
          />
          <input
            type="email"
            id="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-600 dark:text-white"
          />
        </div>
        <div className="flex gap-4 mb-4">
          <input
            type="tel"
            id="phoneNumber"
            placeholder="Mobile Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-600 dark:text-white"
          />
          <input
            type="text"
            id="subject"
            placeholder="Email Subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-600 dark:text-white"
          />
        </div>
        <textarea
          id="message"
          placeholder="Your Message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-600 dark:text-white mb-4"
        ></textarea>
        <input
          type="submit"
          value="Send Message"
          className="w-full p-3 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
        />
      </form>
      <div className="flex justify-center gap-6 mt-6">
        <a
          href="mailto:shailesh93602@gmail.com"
          className="text-gray-900 dark:text-white text-2xl hover:text-blue-600"
        >
          <i className="bx bx-envelope"></i>
        </a>
        <a
          href="tel:+919313026530"
          className="text-gray-900 dark:text-white text-2xl hover:text-blue-600"
        >
          <i className="bx bx-phone-call"></i>
        </a>
        <a
          href="http://wa.me/9313026530"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-900 dark:text-white text-2xl hover:text-blue-600"
        >
          <i className="bx bxl-whatsapp"></i>
        </a>
      </div>
    </section>
  );
};

export default Contact;
