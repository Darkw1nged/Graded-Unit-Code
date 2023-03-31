import { Link } from "react-router-dom"
import { useContext } from "react";
import { AppContext } from "../components/context";
import '../style/home.css'

type LayoutProps = {
  isAdmin: boolean;
};

const Home = () => {
    const isLoggedIn = document.cookie.includes("userToken");
    const { toggleAdmin } = useContext(AppContext);

    return (
      <div className="home-container">
        { isLoggedIn ? (
            <nav>
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
            <nav>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="book-space">Book</Link></li>
                <li><Link to="contact">Contact</Link></li>
                <li><Link to="/account/login" className="important">Login</Link></li>
              </ul>
            </nav>
          )
        }

        <div className="content">
          <h1>Parkeasy Airport Parking</h1>
          <Link to="book-space">Book Now</Link>
        </div>
      </div>
    )
  };
  
  export default Home;