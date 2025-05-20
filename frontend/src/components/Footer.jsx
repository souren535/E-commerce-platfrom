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
    <footer className="footer  w-full bg-zinc-800  py-7">
      <div className="footer-container max-w-screen-lg mx-auto flex flex-col md:flex-row gap-20 px-6">
        {/* section 1 */}
        <div className="w-full md:w-1/3">
          <h3 className="mb-3 text-white text-3xl font-[Merienda]">
            Contact Us
          </h3>
          <p className="mb-3 flex text-zinc-300 items-center gap-2">
            <Phone className="cursor-pointer hover:text-blue-400" />
            Phone: +91 7585013193
          </p>
          <p className="small flex text-zinc-300 items-center gap-2 ">
            <Mail className="cursor-pointer hover:text-blue-400" />
            Email: khan.sourentalpur@gmail.com
          </p>
        </div>

        {/* section 2 */}
        <div className="w-full md:w-1/3">
          <h3 className="mb-3 text-white text-3xl">Follow me</h3>
          <div className="flex text-zinc-300 gap-3">
            {[<GitHub />, <LinkedIn />, <YouTube />, <Instagram />].map(
              (item, index) => (
                <a
                  key={index}
                  className={`"text-lg cursor-pointer hover:text-blue-400" ${
                    index === 4 && "ml-10"
                  }`}
                >
                  {item}
                </a>
              )
            )}
          </div>
        </div>

        {/* section 3 */}
        <div className="w-full md:w-1/3">
          <h3 className="mb-3 text-3xl text-white ">About</h3>
          <p className="text-zinc-300">
            Providing web development tutorial and courses to help you grow your
            skills.
          </p>
        </div>
      </div>
      <div className="inline-block w-full text-center justify-center mt-8">
        <div className=" border-1  h-0.2 border-zinc-500"></div>
        <p className="text-zinc-300 mt-2">
          &copy; 2025 sourentalpur . All right reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
