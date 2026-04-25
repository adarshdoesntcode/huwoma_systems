import { createRoot } from "react-dom/client";
import PublicApp from "./PublicApp";
import { Toaster } from "./components/ui/toaster";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <>
    <PublicApp />
    <Toaster />
  </>,
);
