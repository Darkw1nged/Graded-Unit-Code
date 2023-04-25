import { Outlet, Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./context";

import '../style/navigation.css'
import '../style/form-main.css'

type LayoutProps = {
    isAdmin: boolean;
};

const Layout = ({ isAdmin }: LayoutProps) => {
    const isLoggedIn = document.cookie.includes("userToken");
    const { toggleAdmin } = useContext(AppContext);

    const location = useLocation();

    // We dont want to show the navigation on the following pages
    if (
        location.pathname === "/account/register" ||
        location.pathname === "/account/register/personal" ||
        location.pathname === "/account/register/corporate" ||
        location.pathname === "/account/login" ||
        location.pathname === "/account/forgot-password" ||
        location.pathname === "/account/reset-password" ||
        location.pathname === "/"
    ) return <Outlet />;

    return (
    <>
        { isAdmin ? (
            <nav className="adminNav">
                <div className="header">
                    <img src="/Profile_avatar_placeholder.png" alt="profile" />
                    <h1>John Doe</h1>
                </div>
                <div onClick={toggleNav} className="arrow">
                    <span></span>
                    <span></span>
                </div>
                
                <h2>Management</h2>
                <ul>
                    <li><Link to="/admin/dashboard">
                        <svg width="24" height="24" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> 
                            <path d="M3 7.4V3.6C3 3.26863 3.26863 3 3.6 3H9.4C9.73137 3 10 3.26863 10 3.6V7.4C10 7.73137 9.73137 8 9.4 8H3.6C3.26863 8 3 7.73137 3 7.4Z" stroke="currentColor" stroke-width="1.5"/> 
                            <path d="M14 20.4V16.6C14 16.2686 14.2686 16 14.6 16H20.4C20.7314 16 21 16.2686 21 16.6V20.4C21 20.7314 20.7314 21 20.4 21H14.6C14.2686 21 14 20.7314 14 20.4Z" stroke="currentColor" stroke-width="1.5"/> 
                            <path d="M14 12.4V3.6C14 3.26863 14.2686 3 14.6 3H20.4C20.7314 3 21 3.26863 21 3.6V12.4C21 12.7314 20.7314 13 20.4 13H14.6C14.2686 13 14 12.7314 14 12.4Z" stroke="currentColor" stroke-width="1.5"/> 
                            <path d="M3 20.4V11.6C3 11.2686 3.26863 11 3.6 11H9.4C9.73137 11 10 11.2686 10 11.6V20.4C10 20.7314 9.73137 21 9.4 21H3.6C3.26863 21 3 20.7314 3 20.4Z" stroke="currentColor" stroke-width="1.5"/> 
                        </svg>
                        <span>Dashboard</span>
                    </Link></li>

                    <li><Link to="/admin/Analytics">
                        <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="currentColor">
                            <path d="M450,128a46,46,0,0,0-44.11,59l-71.37,71.36a45.88,45.88,0,0,0-29,0l-52.91-52.91a46,46,0,1,0-89.12,0L75,293.88A46.08,46.08,0,1,0,106.11,325l87.37-87.36a45.85,45.85,0,0,0,29,0l52.92,52.92a46,46,0,1,0,89.12,0L437,218.12A46,46,0,1,0,450,128Z"/>
                        </svg>
                        <span>Analytics</span>
                    </Link></li>

                    <li><Link to="/admin/Members">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
                            <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                        </svg>
                        <span>Members</span>
                    </Link></li>

                    <li><Link to="/admin/Staff">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17,11c0.34,0,0.67,0.04,1,0.09V6.27L10.5,3L3,6.27v4.91c0,4.54,3.2,8.79,7.5,9.82c0.55-0.13,1.08-0.32,1.6-0.55 C11.41,19.47,11,18.28,11,17C11,13.69,13.69,11,17,11z"/>
                            <path d="M17,13c-2.21,0-4,1.79-4,4c0,2.21,1.79,4,4,4s4-1.79,4-4C21,14.79,19.21,13,17,13z M17,14.38c0.62,0,1.12,0.51,1.12,1.12 s-0.51,1.12-1.12,1.12s-1.12-0.51-1.12-1.12S16.38,14.38,17,14.38z M17,19.75c-0.93,0-1.74-0.46-2.24-1.17 c0.05-0.72,1.51-1.08,2.24-1.08s2.19,0.36,2.24,1.08C18.74,19.29,17.93,19.75,17,19.75z"/>
                        </svg>
                        <span>Staff</span>
                    </Link></li>

                    <li><Link to="/admin/Bookings">
                        <svg width="45" height="45" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="9" y="8" width="30" height="36" rx="2" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
                            <path d="M18 4V10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M30 4V10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M16 19L32 19" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M16 27L28 27" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M16 35H24" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>Bookings</span>
                    </Link></li>

                    <li><Link to="/admin/Arrival-Times">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16"> 
                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                        </svg>
                        <span>Arrival Times</span>
                    </Link></li>

                    <li><Link to="/admin/Website-Settings">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-settings">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        <span>Website Settings</span>
                    </Link></li>
                </ul>
        
                <hr />
        
                <h2>Account</h2>
                <ul>
                    <li><Link to="/" onClick={toggleAdmin}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house" viewBox="0 0 16 16"> 
                            <path fill-rule="evenodd" d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/> 
                            <path fill-rule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"/> 
                        </svg>
                        <span>Home</span>
                    </Link></li>
                    <li><Link to="Logout" onClick={toggleAdmin}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8m4-9-4-4m4 4-4 4m4-4H9"/>
                        </svg>
                        <span>Logout</span>
                    </Link></li>
                </ul>
            </nav>
        ) : isLoggedIn ? (
            <nav className="default-navigation">
                <h1>ParkEasy</h1>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="book-space">Book</Link></li>
                    <li><Link to="contact">Contact</Link></li>
                    <li>
                        <img src="/Profile_avatar_placeholder.png" alt="profile" />
                        <div className="account-links">
                            <ul>
                                <li><Link to="/admin/dashboard" onClick={toggleAdmin}>Dashboard</Link></li>
                                <li><Link to="">Profile</Link></li>
                                <li><Link to="">Edit Profile</Link></li>
                                <li><Link to="/account/Logout">Logout</Link></li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </nav>
        ) : (
            <nav className="default-navigation">
                <h1>ParkEasy</h1>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="book-space">Book</Link></li>
                    <li><Link to="contact">Contact</Link></li>
                    <li><Link to="/account/login" className="important">Login</Link></li>
                </ul>
            </nav>
        )}

        <Outlet />
    </>
    )
};

export default Layout;

function toggleNav() {
    const nav = document.querySelector("nav");
    
    if (nav !== null) {
        nav.classList.toggle("open");
    }
}
