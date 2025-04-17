"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import emailjs from "emailjs-com";
import { SOCIAL_LINKS, CONTACT_INFO } from "@/lib/constants";
import { useForm, UseFormRegister, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Define the form data type.
type FormData = {
  fullName: string;
  email: string;
  phoneNumber?: string;
  subject: string;
  message: string;
};

// Build the schema and cast it as a yup.ObjectSchema<FormData>
const schema = yup.object({
  fullName: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phoneNumber: yup
    .string()
    .transform((value, originalValue) => {
      // Convert empty strings or null values to undefined.
      return originalValue === "" || originalValue == null ? undefined : value;
    })
    .optional()
    .test(
      "is-valid-phone",
      "Please enter a valid 10-digit phone number",
      (value) => {
        if (!value) return true; // If not provided, skip validation.
        // Check if value is composed only of digits and has exactly 10 characters.
        return /^\d{10}$/.test(value);
      }
    ),
  subject: yup.string().required("Subject is required"),
  message: yup
    .string()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters"),
}) as yup.ObjectSchema<FormData>;

// Define props for the reusable InputField component.
interface InputFieldProps {
  label: string;
  name: keyof FormData;
  type: string;
  required?: boolean;
  error?: string;
  register: UseFormRegister<FormData>;
}

// Reusable InputField component.
const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type,
  required = false,
  error,
  register,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-text-primary mb-2"
      >
        {label}
      </label>
      <input
        id={name}
        type={type}
        {...register(name)}
        required={required}
        className="w-full px-4 py-2 bg-dark border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export const ContactContent: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      subject: "",
      message: "",
    },
  });

  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      // Build template parameters using data from the form.
      const templateParams = {
        from_name: data.fullName,
        from_email: data.email,
        from_phoneNumber: data.phoneNumber || "",
        from_subject: data.subject,
        from_message: data.message,
      };

      // Send email using EmailJS with keys from environment variables.
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ""
      );

      setSubmitStatus("success");
      reset();
    } catch (error) {
      console.error("Error sending email:", error);
      setSubmitStatus("error");
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
          Contact <span className="text-primary">Me</span>
        </h1>
        <p className="text-text-secondary">
          I&apos;m always open to discussing new projects, creative ideas, or
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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Full Name *"
                name="fullName"
                type="text"
                required={true}
                error={errors.fullName?.message}
                register={register}
              />
              <InputField
                label="Email Address *"
                name="email"
                type="email"
                required={true}
                error={errors.email?.message}
                register={register}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                error={errors.phoneNumber?.message}
                register={register}
              />
              <InputField
                label="Subject *"
                name="subject"
                type="text"
                required={true}
                error={errors.subject?.message}
                register={register}
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium"
              >
                Message *
              </label>
              <Textarea
                id="message"
                {...register("message")}
                required
                className="min-h-[150px]"
              />
              {errors.message && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>
            <div className="flex justify-center">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-primary text-white hover:bg-primary/90"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
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
};

export default ContactContent;
