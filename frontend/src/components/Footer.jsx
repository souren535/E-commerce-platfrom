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
    <footer className="footer w-full bg-zinc-900 text-white py-8 mt-auto">
      {/* Main container */}
      <div className="footer container max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row md:text-left md:p-6 justify-between items-start gap-[1.5rem] text-zinc-300 text-base">
        {/* Section 1: Contact Us */}
        <div className="flex-1 min-w-[250px]">
          <div className="footer section flex-1 max-w-[250px] mb-8 w-full md:mb-0 md:w-auto">
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
        </div>

        {/* Section 2: Follow me */}
        <div className="social flex-1 flex-col items-center gap-7">
          <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">
            Follow me
          </h3>
          <div className="social links md:justify-start flex justify-center gap-4">
            <a
              href="#"
              className="hover:text-blue-400 transition-transform duration-300 transform hover:scale-110 text-[1.8rem] md:text-base"
            >
              <GitHub />
            </a>
            <a
              href="#"
              className="hover:text-blue-400 transition-transform duration-300 transform hover:scale-110 text-[1.8rem] md:text-base"
            >
              <LinkedIn />
            </a>
            <a
              href="#"
              className="hover:text-blue-400 transition-transform duration-300 transform hover:scale-110 text-[1.8rem] md:text-base"
            >
              <YouTube />
            </a>
            <a
              href="#"
              className="hover:text-blue-400 transition-transform duration-300 transform hover:scale-110 text-[1.8rem] md:text-base"
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
          <p className="text-[1rem] text-zinc-300 leading-[1.5] mb-[0.8rem]">
            Providing web development tutorials and courses to help you grow
            your skills.
          </p>
        </div>
      </div>

      {/* Bottom section */}
      <div className="w-full text-center mt-8 pt-7 border-t border-zinc-600 text-zinc-400 text-sm">
        &copy; 2025 sourentalpur. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
