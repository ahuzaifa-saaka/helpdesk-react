import {createRoot} from "react-dom/client";
// import {createBrowserRouter, RouterProvider} from "react-router-dom";
import "./ticket.css";
import App from "./App.jsx";
import {AppProvider} from "./context/AppContext.jsx";
import {StrictMode} from "react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
);
