import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import SignUp from "./pages/signUp";
import Home from "./pages/home";
import PublicTransport from "./pages/publicTransport";
import Parking from "./pages/parking";
import VehicleSearch from './pages/vehicleSearch';
import VehicleDetails from './pages/vehicleDetails';
import Payment from './pages/payment';
import ProviderDashboard from "./pages/providerDashboard";
import AddVehicle from "./pages/addVehicle";
import ManageVehicles from "./pages/manageVehicles";
import ManageRentals from "./pages/manageRentals";
import UserDashboard from "./pages/userDashboard";
import ManageMyRentals from "./pages/manageMyRentals";
import ManageMyParkingReservations from "./pages/manageMyParkingReservations";
import ProviderProfit from "./pages/providerProfit";
import TripShare from "./pages/tripShare";
import AdminDashboard from "./pages/adminDashboard";

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
      <Route path="/provider" element={<ProviderDashboard />} />
      <Route path="/provider/add-vehicle" element={<AddVehicle />} />
      <Route path="/provider/vehicles" element={<ManageVehicles />} />
      <Route path="/provider/rentals" element={<ManageRentals />} />
      <Route path="/user" element={<UserDashboard />} />
      <Route path="/my-rentals" element={<ManageMyRentals />} />
      <Route path="/my-parking-reservations" element={<ManageMyParkingReservations />}/>
      <Route path="/provider/profit" element={<ProviderProfit />} />
      <Route path="/trip-share/:token" element={<TripShare />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} /><Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}
