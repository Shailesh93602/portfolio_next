"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, Loader2 } from "lucide-react";
import emailjs from "emailjs-com";

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await emailjs.send(
        "service_uh3jspq",
        "template_9jk3yw8",
        {
          from_name: formData.fullName,
          from_email: formData.email,
          from_phoneNumber: formData.phoneNumber,
          from_subject: formData.subject,
          from_message: formData.message,
        },
        "LzBxIAKfE0LSvqFYw"
      );

      console.log("Email sent successfully:", response);
      setSubmitStatus("success");
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 text-grayText">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-center text-text-primary">
          Get in Touch
        </h1>
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Full Name"
                  name="fullName"
                  type="text"
                  required={true}
                  value={formData.fullName}
                  onChange={handleChange}
                />
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  required={true}
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  required={false}
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
                <InputField
                  label="Subject"
                  name="subject"
                  type="text"
                  required={true}
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-grayText mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-gray-200 focus:ring-2 focus:ring-accent-blue transition duration-300"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full p-3 rounded-md bg-accent-blue text-white font-semibold hover:bg-accent-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-blue transition duration-300 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
            {submitStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-green-100 text-green-700 rounded-md"
              >
                Your message has been sent successfully!
              </motion.div>
            )}
            {submitStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-100 text-red-700 rounded-md"
              >
                There was an error sending your message. Please try again.
              </motion.div>
            )}
          </div>
          <div className=" px-8 py-6">
            <div className="flex justify-start gap-8">
              <ContactLink
                href="mailto:shailesh93602@gmail.com"
                icon={<Mail className="w-6 h-6" />}
                label="Email"
              />
              <ContactLink
                href="tel:+919313026530"
                icon={<Phone className="w-6 h-6" />}
                label="Phone"
              />
              <ContactLink
                href="http://wa.me/9313026530"
                icon={<MessageCircle className="w-6 h-6" />}
                label="WhatsApp"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function InputField({ label, name, type, required, value, onChange }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-grayText mb-1"
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full p-3 rounded-md border border-gray-600 bg-gray-700 text-grayText focus:ring-2 focus:ring-accent-blue transition duration-300"
      />
    </div>
  );
}

function ContactLink({ href, icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center text-text-secondary hover:text-accent-blue transition duration-300"
      aria-label={label}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </a>
  );
}
