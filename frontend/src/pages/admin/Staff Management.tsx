import { useState } from 'react';
import { Link } from 'react-router-dom';

import '../../style/admin-staff.css'

const Page = () => {
    const [optionsVisible, setOptionsVisible] = useState(false);

    const showOptions = () => {
        setOptionsVisible(true);
    };
    
    const hideOptions = () => {
        setOptionsVisible(false);
    };

    const profiles = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `John Doe ${i}`,
        role: 'Administrator',
        bookings: 200,
        imageUrl: 'images/Profile_avatar_placeholder.png',
    }));

    return (
        <main>
            <div className="staff-header">
                <ul>
                    <li>Staff</li>
                    <li><Link to="">Add User</Link></li>
                    <li>
                        <div className="search">
                            <input type="text" placeholder="Search" />
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/> 
                                </svg>
                            </button>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="staff">
                {profiles.map((profile) => (
                    <div className="profile" key={profile.id}>
                        <div className="options">
                            <div className="row" onMouseOver={showOptions} onMouseOut={hideOptions}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            
                            {optionsVisible && (
                                <div className="options-container">
                                    <a href="">Edit</a>
                                    <a href="">Delete</a>
                                </div>
                            )}
                        </div>
    
                        <div className="header">
                            <img src={profile.imageUrl} alt="icon" />
                            <h2>{profile.name}</h2>
                            <p>{profile.role}</p>
                        </div>
    
                        <div className="bookings">
                            <p>Bookings</p>
                            <span>{profile.bookings}</span>
                        </div>
                        <a href="">View Profile</a>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default Page;