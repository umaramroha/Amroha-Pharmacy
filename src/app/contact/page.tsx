"use client";

import { useState } from "react";
import { getWhatsAppLink, getContactMessage } from "@/lib/whatsapp";

type FormData = {
  name: string;
  mobile: string;
  email: string;
  message: string;
};

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    mobile: "",
    email: "",
    message: "",
  });

  const [sent, setSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanMobile = formData.mobile.replace(/\D/g, "");

    if (cleanMobile.length < 10 || cleanMobile.length > 12) {
      alert("Please enter a valid mobile number.");
      return;
    }

    const message = `New Contact Message

Name: ${formData.name.trim()}
Mobile: ${formData.mobile.trim()}
Email: ${formData.email.trim() || "Not provided"}

Message:
${formData.message.trim()}

This message was submitted through the Amroha Pharmacy website.`;

    window.open(getWhatsAppLink(message), "_blank", "noopener,noreferrer");

    setSent(true);

    setTimeout(() => {
      setSent(false);

      setFormData({
        name: "",
        mobile: "",
        email: "",
        message: "",
      });
    }, 4000);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        {/* Header */}
        <header className="mb-10 text-center md:mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
            Customer Support
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Contact Amroha Pharmacy
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            Have a question about an order, product availability, delivery,
            payment or anything else? Our support team is here to help.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
          {/* Contact Information */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7 border-b border-gray-100 pb-5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
                Get in Touch
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                We’re here to help
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Contact us through any of the channels below for general
                customer support.
              </p>
            </div>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-primary">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"
                    />
                    <circle cx="12" cy="9" r="2.2" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Business Address
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Mohalla Nal, Amroha,
                    <br />
                    Uttar Pradesh, India
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-primary">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.5 4.5 8 3l3 5-2 1.5a15 15 0 0 0 5.5 5.5L16 13l5 3-1.5 2.5c-.6 1-1.7 1.5-2.9 1.3C9.7 18.3 5.7 14.3 4.2 7.4c-.2-1.2.3-2.3 1.3-2.9Z"
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Phone
                  </h3>

                  <a
                    href="tel:+918077988509"
                    className="mt-1 inline-block text-sm text-gray-600 transition hover:text-primary"
                  >
                    +91 80779 88509
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-primary">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4 7 8 6 8-6"
                    />
                  </svg>
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Email
                  </h3>

                  <a
                    href="mailto:Amrohapharmastore@gmail.com"
                    className="mt-1 block break-all text-sm text-gray-600 transition hover:text-primary"
                  >
                    Amrohapharmastore@gmail.com
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-green-200 bg-green-50 text-green-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="currentColor"
                  >
                    <path d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.54 0 .22 5.32.22 11.86c0 2.09.55 4.13 1.59 5.92L.12 24l6.36-1.67a11.84 11.84 0 0 0 5.6 1.41h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.14-3.43-8.4ZM12.09 21.74h-.01a9.83 9.83 0 0 1-5.01-1.37l-.36-.21-3.77.99 1.01-3.67-.23-.38a9.83 9.83 0 0 1-1.51-5.24c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.1 1.02 6.96 2.88a9.82 9.82 0 0 1 2.89 6.97c-.01 5.43-4.43 9.85-9.83 9.88Zm5.41-7.39c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.
