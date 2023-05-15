import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import '../../style/admin-staff.css'

interface Profile {
    forename: string;
    lastname: string;
    email: string;
    role: string;
    bookings: number;
}

const Page = () => {
    const [optionsVisible, setOptionsVisible] = useState(false);

    const showOptions = () => {
        setOptionsVisible(true);
    };
    
    const hideOptions = () => {
        setOptionsVisible(false);
    };

    const [profiles, setProfiles] = useState<Profile[]>([]);

    useEffect(() => {
        fetch('http://localhost:5000/admin/get/staff', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(response => {
                    setProfiles(response);
                })
            } else {
                res.json().then(response => {
                    console.log(response.message);
                })
            }
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });            
    }, []);

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
                    <div className="profile" key={profile.email}>
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
                            <img src={'/Profile_avatar_placeholder.png'} alt="icon" />
                            <h2>{profile.forename + ' ' + profile.lastname}</h2>
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