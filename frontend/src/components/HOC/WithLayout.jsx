import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";

// eslint-disable-next-line no-unused-vars
const WithLayout = (Component) => {
    const Layout = (props) => (
      <div className="flex flex-col min-h-screen bg-zinc-950">
        <Navbar />
        <main className="flex-grow">
          <Component {...props} />
        </main>
        <Footer />
      </div>
    );
  
    return Layout;
  };
  

export default WithLayout;
