import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import SignUp from "./pages/signUp";
import Home from "./pages/home";
import PublicTransport from "./pages/publicTransport";
import Parking from "./pages/parking";
import VehicleSearch from './pages/vehicleSearch';
import VehicleDetails from './pages/vehicleDetails';
import Payment from './pages/payment';
import RentalLifecycle from './pages/rentalLifecycle';

export default function App() {
  return (
    <Routes>
     <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/home" element={<Home />} />
      <Route path="/parking" element={<Parking />} />
      <Route path="/transport" element={<PublicTransport />} />
      <Route path="/vehicle-search" element={<VehicleSearch />} />
      <Route path="/vehicle/:id" element={<VehicleDetails />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/rental-lifecycle" element={<RentalLifecycle />} />
    </Routes>
  );
}
