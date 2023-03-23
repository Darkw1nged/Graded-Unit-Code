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
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import BookSpace from "../pages/BookSpace";

// Admin Pages
import Dashboard from "../pages/admin/Dashboard";
import Members from "../pages/admin/Members";
import Staff from "../pages/admin/Staff";
import Bookings from "../pages/admin/Bookings";

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
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="book-space" element={<BookSpace />} />
            <Route path="admin/dashboard" element={<Dashboard />} />
            <Route path="admin/members" element={<Members />} />
            <Route path="admin/staff" element={<Staff />} />
            <Route path="admin/bookings" element={<Bookings />} />
            <Route path="*" element={<NoPageFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Navigation;
