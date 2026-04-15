import {createRoot} from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import "./ticket.css";
import App from "./App.jsx";
import {AppProvider} from "./context/Appcontext.jsx";
import {StrictMode} from "react";

const router = createBrowserRouter([
  {
    path: "/*",
    element: (
      <AppProvider>
        <App />
      </AppProvider>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
