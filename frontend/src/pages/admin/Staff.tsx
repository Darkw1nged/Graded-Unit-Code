import { useState } from 'react';

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