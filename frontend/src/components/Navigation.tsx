import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./context";

// Components
import Layout from "./_Layout";

// Pages
import Home from "../pages/Home";
import Contact from "../pages/Contact";

import NoPageFound from "../pages/NoPageFound";

import Register from "../pages/account/Register";
import RegisterPersonal from "../pages/account/register/personal";
import RegisterCorporate from "../pages/account/register/corporate";
import Login from "../pages/account/Login";
import Logout from "../pages/account/Logout";
import ForgotPassword from "../pages/account/ForgotPassword";
import ResetPassword from "../pages/account/ResetPassword";
import Profile from "../pages/account/Profile";
import EditProfile from "../pages/account/Edit-Profile";

import SearchBooking from "../pages/booking/Search";
import CreateBooking from "../pages/booking/Create";

// Admin Pages
import Protection from "../pages/admin/Protection";
import Dashboard from "../pages/admin/Dashboard";
import Members from "../pages/admin/User Management";
import Staff from "../pages/admin/Staff Management";
import Bookings from "../pages/admin/Booking Management";
import WebsiteSettings from "../pages/admin/Website Settings";
import Analytics from "../pages/admin/Analytics";
import ArrivalTimes from "../pages/admin/Arrival Times";
import EditUser from "../pages/admin/User-Edit";

function Navigation() {
  const { isAdmin } = useContext(AppContext);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="contact" element={<Contact />} />
            <Route path="account/register" element={<Register />} />
            <Route path="account/register/personal" element={<RegisterPersonal />} />
            <Route path="account/register/corporate" element={<RegisterCorporate />} />
            <Route path="account/login" element={<Login />} />
            <Route path="account/logout" element={<Logout />} />
            <Route path="account/forgot-password" element={<ForgotPassword />} />
            <Route path="account/reset-password" element={<ResetPassword />} />
            <Route path="account" element={<Profile />} />
            <Route path="account/edit" element={<EditProfile />} />
            <Route path="booking/search" element={<SearchBooking />} />
            <Route path="booking/create" element={<CreateBooking />} />
            <Route path="admin/protection" element={<Protection />} />
            <Route path="admin/dashboard" element={<Dashboard />} />
            <Route path="admin/members" element={<Members />} />
            <Route path="admin/staff" element={<Staff />} />
            <Route path="admin/bookings" element={<Bookings />} />
            <Route path="admin/website-settings" element={<WebsiteSettings />} />
            <Route path="admin/analytics" element={<Analytics />} />
            <Route path="admin/arrival-times" element={<ArrivalTimes />} />
            <Route path="admin/members/user-edit" element={<EditUser />} />
            <Route path="*" element={<NoPageFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Navigation;
