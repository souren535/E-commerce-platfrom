import React from "react";
import { Mail, Phone, MapPin, Instagram, Github, Linkedin } from "lucide-react";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto text-center mb-12 mt-20">
        <h1 className="text-4xl font-extrabold text-indigo-400 mb-2">
          Contact Us
        </h1>
        <p className="text-zinc-400 text-lg">
          We'd love to hear from you! Whether you have a question, feedback, or
          a project in mind — reach out anytime.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Contact Info */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-indigo-700 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-white">Get in Touch</h2>
          <div className="space-y-4 text-zinc-300">
            <div className="flex items-center gap-3">
              <Mail className="text-indigo-400" />
              <span>support@yourapp.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-indigo-400" />
              <span>+91 9876543210</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-indigo-400" />
              <span>Kolkata, India</span>
            </div>
          </div>

          <div className="mt-8 flex gap-6 text-indigo-400">
            <a href="#" aria-label="Instagram">
              <Instagram />
            </a>
            <a href="#" aria-label="Github">
              <Github />
            </a>
            <a href="#" aria-label="LinkedIn">
              <Linkedin />
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-indigo-700 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-white">Send a Message</h2>
          <form className="space-y-5">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Message</label>
              <textarea
                rows="4"
                placeholder="Write your message..."
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white outline-none focus:border-indigo-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
