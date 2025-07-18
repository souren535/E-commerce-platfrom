import React from "react";
import { Users, HeartHandshake, Star } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-12">
      <div className="max-w-5xl mx-auto mt-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-400 mb-4">
          About Us
        </h1>
        <p className="text-zinc-400 text-lg sm:text-xl mb-10">
          We are passionate developers building modern, scalable, and
          user-friendly e-commerce experiences for the world.
        </p>
      </div>

      {/* Mission Section */}
      <section className="bg-zinc-900 border border-zinc-700 rounded-xl p-8 mb-10 shadow-lg max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <HeartHandshake className="text-zinc-400" size={28} />
          <h2 className="text-2xl font-bold text-white">Our Mission</h2>
        </div>
        <p className="text-zinc-300 text-md">
          Our mission is to create seamless online shopping experiences through
          innovative design, robust backend infrastructure, and smooth user
          interfaces. We believe in empowering businesses and customers with
          modern tools to grow and connect.
        </p>
      </section>

      {/* Team Section */}
      <section className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Users className="text-zinc-400" size={28} />
          <h2 className="text-2xl font-bold text-white">Meet the Team</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { name: "Souren Khan", role: "Full Stack Developer" },
            { name: "Souren Khan", role: "UI/UX Designer" },
            { name: "Souren Khan", role: "Backend Engineer" },
          ].map((member, idx) => (
            <div
              key={idx}
              className="bg-zinc-800 p-5 rounded-xl text-center border border-zinc-700 hover:border-zinc-500 transition"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-zinc-700 border-1 border-zinc-500 flex items-center justify-center text-zinc-400 text-xl font-semibold mb-4">
                {member.name.charAt(0)}
              </div>
              <h3 className="text-lg font-bold text-white">{member.name}</h3>
              <p className="text-zinc-300 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quality Section */}
      <section className="bg-zinc-900 border border-zinc-700 rounded-xl p-8 mt-12 shadow-lg max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <Star className="text-yellow-400" size={28} />
          <h2 className="text-2xl font-bold text-white">Why Choose Us</h2>
        </div>
        <ul className="text-zinc-300 list-disc list-inside space-y-2">
          <li>Modern UI with fast performance</li>
          <li>Secure and scalable backend</li>
          <li>Responsive customer support</li>
          <li>100% customizable and open-source friendly</li>
        </ul>
      </section>
    </div>
  );
};

export default AboutUs;
