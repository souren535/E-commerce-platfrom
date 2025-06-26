import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import { ToastContainer } from "react-toastify";
import { Toaster } from "./components/ui/sonner.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Provider store={store}>
    <App />
    <Toaster
      closeButton
      position="top-right"
      // richColors="true"
      // toastOptions={{ style: { background: "white" } }}
    />
    <ToastContainer />
  </Provider>
  // {/* </StrictMode> */}
);
