import { Link } from "react-router-dom"
import '../style/home.css'

const Page = () => {
    const isLoggedIn = document.cookie.includes("access_token");

    return (
        <div className="home-container">
            { isLoggedIn ? (
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/booking/search">Book</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li>
                            <img src="/Profile_avatar_placeholder.png" alt="profile" />
                            <div className="account-links">
                                <ul>
                                    <li><Link to="/admin/dashboard">Dashboard</Link></li>
                                    <li><Link to={"/account?email=" + document.cookie.split("=")[2]}>Profile</Link></li>
                                    <li><Link to={"/account/edit?email=" + document.cookie.split("=")[2]}>Edit Profile</Link></li>
                                    <li><Link to="/account/logout">Logout</Link></li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </nav>
            ) : (
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/booking/search">Book</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/account/login" className="important">Login</Link></li>
                    </ul>
                </nav>
            )}

            <div className="content">
                <h1>Parkeasy Airport Parking</h1>
                <Link to="booking/search">Book Now</Link>
            </div>
        </div>
    )
};

export default Page;