"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import emailjs from "emailjs-com";
import { SOCIAL_LINKS, CONTACT_INFO } from "@/lib/constants";

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
}

interface InputFieldProps {
  label: string;
  name: keyof FormData;
  type: string;
  required: boolean;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function ContactContent() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    subject: "",
    message: "",
  });
  const [, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
    <div className="container py-24">
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn(0.2)}
        className="mb-16 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Contact Me
        </h1>
        <p className="text-text-secondary">
          I&apos;m always open to discussing new projects, creative ideas or
          opportunities to be part of your visions.
        </p>
      </motion.section>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer(0.1)}
        className="grid gap-16 lg:grid-cols-2"
      >
        {/* Contact Information */}
        <motion.div variants={fadeIn(0.2)}>
          <h2 className="mb-8 text-2xl font-bold">Get in Touch</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Mail className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-muted-foreground">{CONTACT_INFO.EMAIL}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-muted-foreground">{CONTACT_INFO.PHONE}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">Location</h3>
                <p className="text-muted-foreground">{CONTACT_INFO.LOCATION}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-4 font-semibold">Follow Me</h3>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" asChild>
                <a
                  href={SOCIAL_LINKS.GITHUB}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href={SOCIAL_LINKS.LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href={SOCIAL_LINKS.TWITTER}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div variants={fadeIn(0.3)}>
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
                className="mb-2 block text-sm font-medium"
              >
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="min-h-[150px]"
              />
            </div>
            <div className="flex justify-center">
              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary text-white hover:bg-primary/90"
              >
                Send Message
              </Button>
            </div>
            {submitStatus === "success" && (
              <div className="text-green-500 text-center">
                Message sent successfully!
              </div>
            )}
            {submitStatus === "error" && (
              <div className="text-red-500 text-center">
                Error sending message. Please try again.
              </div>
            )}
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}

function InputField({
  label,
  name,
  type,
  required,
  value,
  onChange,
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 bg-dark border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
      />
    </div>
  );
}
