import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./context";

// Components
import Layout from "./_Layout";

// Pages
import Home from "../pages/Home";
import Contact from "../pages/Contact";

import NoPageFound from "../pages/NoPageFound";

import Register from "../pages/Register";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

import BookSpace from "../pages/BookSpace";

// Admin Pages
import Dashboard from "../pages/admin/Dashboard";
import Members from "../pages/admin/User Management";
import Staff from "../pages/admin/Staff Management";
import Bookings from "../pages/admin/Booking Management";
import WebsiteSettings from "../pages/admin/Website Settings";
import Analytics from "../pages/admin/Analytics";
import ArrivalTimes from "../pages/admin/Arrival Times";

function Navigation() {
  const { isAdmin } = useContext(AppContext);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout isAdmin={isAdmin} />}>
            <Route index element={<Home />} />
            <Route path="contact" element={<Contact />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="logout" element={<Logout />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="book-space" element={<BookSpace />} />
            <Route path="admin/dashboard" element={<Dashboard />} />
            <Route path="admin/members" element={<Members />} />
            <Route path="admin/staff" element={<Staff />} />
            <Route path="admin/bookings" element={<Bookings />} />
            <Route path="admin/website-settings" element={<WebsiteSettings />} />
            <Route path="admin/analytics" element={<Analytics />} />
            <Route path="admin/arrival-times" element={<ArrivalTimes />} />
            <Route path="*" element={<NoPageFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Navigation;
