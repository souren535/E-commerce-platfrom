import React from "react";
import {
  Phone,
  Mail,
  GitHub,
  LinkedIn,
  YouTube,
  Instagram,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <footer className="bg-zinc-800 text-sm md:text-base text-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] mt-8 py-8">
      {/* Main container */}
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row justify-between items-start gap-6 text-zinc-300 text-base">
        {/* Section 1: Contact Us */}
        <div className="flex-1 min-w-[250px]">
          <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">
            Contact Us
          </h3>
          <p className="mb-3 flex items-center gap-2">
            <Phone className="cursor-pointer text-xl hover:text-blue-400" />
            Phone: +91 7585013193
          </p>
          <p className="flex items-center gap-2">
            <Mail className="cursor-pointer text-xl hover:text-blue-400" />
            Email: khan.sourentalpur@gmail.com
          </p>
        </div>

        {/* Section 2: Follow me */}
        <div className="flex-1 min-w-[250px]">
          <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">
            Follow me
          </h3>
          <div className="flex gap-4 justify-start md:justify-start text-2xl">
            <a
              href="#"
              className="hover:text-blue-400 transition-transform duration-300 transform hover:scale-110"
            >
              <GitHub />
            </a>
            <a
              href="#"
              className="hover:text-blue-400 transition-transform duration-300 transform hover:scale-110"
            >
              <LinkedIn />
            </a>
            <a
              href="#"
              className="hover:text-blue-400 transition-transform duration-300 transform hover:scale-110"
            >
              <YouTube />
            </a>
            <a
              href="#"
              className="hover:text-blue-400 transition-transform duration-300 transform hover:scale-110"
            >
              <Instagram />
            </a>
          </div>
        </div>

        {/* Section 3: About */}
        <div className="flex-1 min-w-[250px]">
          <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">
            About
          </h3>
          <p className="leading-relaxed">
            Providing web development tutorials and courses to help you grow
            your skills.
          </p>
        </div>
      </div>

      {/* Bottom section */}
      <div className="w-full text-center mt-10 pt-6 border-t border-zinc-600 text-zinc-400 text-sm">
        &copy; 2025 sourentalpur. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
