import React, { useState } from "react";
import { styles } from "../styles/style";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import toast from "react-hot-toast";

type Props = {};

const Contact = (props: Props) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Message sent successfully! We'll get back to you soon.");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(data.message || "Failed to send message. Please try again.");
      }
    } catch (error: any) {
      toast.error("Something went wrong. Please try again later.");
      console.error("Contact form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="w-[95%] 800px:w-[85%] m-auto py-8 800px:py-12 text-black dark:text-white px-3">
        <h1 className={`${styles.title} !text-start pt-2`}>Get in Touch</h1>

        <p className="text-[18px] font-Poppins leading-7 mt-6">
          Have a question or want to work together? We would love to hear from you.
          Fill out the form below and we will get back to you as soon as possible.
        </p>

        <div className="mt-12 grid grid-cols-1 800px:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-[16px] font-Poppins mb-2"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-[#37a39a] dark:focus:border-[#37a39a] transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-[16px] font-Poppins mb-2"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-[#37a39a] dark:focus:border-[#37a39a] transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-[16px] font-Poppins mb-2"
                >
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-[#37a39a] dark:focus:border-[#37a39a] transition-colors"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-[16px] font-Poppins mb-2"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-[#37a39a] dark:focus:border-[#37a39a] transition-colors resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`${styles.button} !w-full !h-[45px] text-[18px] font-Poppins`}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <div className="space-y-8">
              <div>
                <h2 className="text-[24px] font-Poppins font-semibold mb-6">
                  Contact Information
                </h2>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <HiMail className="text-[24px] text-[#37a39a]" />
                    </div>
                    <div>
                      <h3 className="text-[18px] font-Poppins font-medium mb-1">
                        Email
                      </h3>
                      <p className="text-[16px] font-Poppins opacity-80">
                        support@bbedits.in
                      </p>
                      <p className="text-[16px] font-Poppins opacity-80">
                        info@bbedits.in
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <HiPhone className="text-[24px] text-[#37a39a]" />
                    </div>
                    <div>
                      <h3 className="text-[18px] font-Poppins font-medium mb-1">
                        Phone
                      </h3>
                      <p className="text-[16px] font-Poppins opacity-80">
                        +91 (XXX) XXX-XXXX
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <HiLocationMarker className="text-[24px] text-[#37a39a]" />
                    </div>
                    <div>
                      <h3 className="text-[18px] font-Poppins font-medium mb-1">
                        Location
                      </h3>
                      <p className="text-[16px] font-Poppins opacity-80">
                        India
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[24px] font-Poppins font-semibold mb-6">
                  Follow Us
                </h2>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="w-12 h-12 rounded-full bg-[#37a39a] flex items-center justify-center hover:bg-[#2d8578] transition-colors"
                    aria-label="Facebook"
                  >
                    <FaFacebook className="text-white text-[20px]" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 rounded-full bg-[#37a39a] flex items-center justify-center hover:bg-[#2d8578] transition-colors"
                    aria-label="Twitter"
                  >
                    <FaTwitter className="text-white text-[20px]" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 rounded-full bg-[#37a39a] flex items-center justify-center hover:bg-[#2d8578] transition-colors"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="text-white text-[20px]" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 rounded-full bg-[#37a39a] flex items-center justify-center hover:bg-[#2d8578] transition-colors"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin className="text-white text-[20px]" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
