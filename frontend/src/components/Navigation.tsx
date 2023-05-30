import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Layout from "./_Layout";

// Misulaneous Pages
import Home from "../pages/Home";
import Contact from "../pages/Contact";
import NoPageFound from "../pages/NoPageFound";

// Account Pages
import Register from "../pages/account/Register";
import PersonalRegister from "../pages/account/Register-Personal";
import CorporateRegister from "../pages/account/Register-Corporate";
import Login from "../pages/account/Login";
import Logout from "../pages/account/Logout";
import ForgotPassword from "../pages/account/Forgot-Password";
import ResetPassword from "../pages/account/Reset-Password";
import Profile from "../pages/account/Profile";
import EditProfile from "../pages/account/Edit-Profile";
import EditProfileBooking from "../pages/account/Edit-Booking";

// Booking Pages
import SearchBooking from "../pages/booking/Search";
import CreateBooking from "../pages/booking/Create";
import CancelBooking from "../pages/booking/Cancel-Confirmation";
import BookingSuccess from "../pages/booking/Payment-Success";
import BookingFailure from "../pages/booking/Payment-Rejected";

// Admin Pages
import Protection from "../pages/admin/Protection";
import Dashboard from "../pages/admin/Dashboard";
import UserManagement from "../pages/admin/User-Management";
import StaffManagement from "../pages/admin/Staff-Management";
import EditUser from "../pages/admin/User-Edit";
import AddStaff from "../pages/admin/Staff-Add";
import BookingManagement from "../pages/admin/Booking-Management";
import EditBooking from "../pages/admin/Booking-Edit";
import AddBooking from "../pages/admin/Booking-Add";
import Analytics from "../pages/admin/Analytics";
import Discounts from "../pages/admin/Discounts";
import AddDiscount from "../pages/admin/Discount-Add";
import EditDiscount from "../pages/admin/Discount-Edit";
import Prices from "../pages/admin/Prices";


function Navigation() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NoPageFound />} />

            <Route path="account/register" element={<Register />} />
            <Route path="account/register/personal" element={<PersonalRegister />} />
            <Route path="account/register/corporate" element={<CorporateRegister />} />
            <Route path="account/login" element={<Login />} />
            <Route path="account/logout" element={<Logout />} />
            <Route path="account/forgot-password" element={<ForgotPassword />} />
            <Route path="account/reset-password" element={<ResetPassword />} />
            <Route path="account" element={<Profile />} />
            <Route path="account/edit" element={<EditProfile />} />
            <Route path="account/edit/booking" element={<EditProfileBooking />} />

            <Route path="booking/search" element={<SearchBooking />} />
            <Route path="booking/create" element={<CreateBooking />} />
            <Route path="booking/success" element={<BookingSuccess />} />
            <Route path="booking/failure" element={<BookingFailure />} />
            <Route path="booking/cancel" element={<CancelBooking />} />

            <Route path="admin/dashboard" element={<Dashboard />} />
            <Route path="admin/dashboard/protection" element={<Protection />} />
            <Route path="admin/user-management" element={< UserManagement />} />
            <Route path="admin/staff-management" element={<StaffManagement />} />
            <Route path="admin/edit/user" element={<EditUser />} />
            <Route path="admin/add/staff" element={<AddStaff />} />
            <Route path="admin/booking-management" element={<BookingManagement />} />
            <Route path="admin/edit/booking" element={<EditBooking />} />
            <Route path="admin/add/booking" element={<AddBooking />} />
            <Route path="admin/analytics" element={<Analytics />} />
            <Route path="admin/discounts" element={<Discounts />} />
            <Route path="admin/add/discount" element={<AddDiscount />} />
            <Route path="admin/edit/discount" element={<EditDiscount />} />
            <Route path="admin/prices" element={<Prices />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Navigation;
