import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import SignUp from "./pages/signUp";
import Home from "./pages/home";
import PublicTransport from "./pages/publicTransport";
import Parking from "./pages/parking";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/home" element={<Home />} />
      <Route path="/parking"    element={<Parking />} />
      <Route path="/transport"  element={<PublicTransport />} />
    </Routes>
  );
}
