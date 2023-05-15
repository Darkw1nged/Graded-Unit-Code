import React from "react";
import { Link } from "react-router-dom";
import { redirectIfNotLoggedIn } from "../../components/redirects";
import "../../style/profile.css";

const access_token = document.cookie.split("access_token=")[1]?.split(";")[0];

const profile = {
    BusinessName: "",
    forename: "",
    lastname: "",
    email: "",
    telephone: "",
    isCorporateUser: false
}

const vehicle = {
    registration: "",
    make: "",
    model: "",
    colour: ""
}

let booking = {
    spaceNumber: "",
    dateBooked: "",
    bookedFrom: "",
    bookedTo: "",
    cost: "",
    isCancelled: ""
}

let vehicles = [vehicle];
let bookings = [booking];

fetch("http://localhost:5000/account/get/profile-details", {
    method: "post",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        access_token: access_token,
    }),
})
.then(res => {
    if (res.status !== 200) {
        console.error("Error: " + res.status);
    } else {
        res.json().then(response => {
            profile.BusinessName = response.user.BusinessName;
            profile.forename = response.user.forename;
            profile.lastname = response.user.lastname;
            profile.email = response.user.email;
            profile.telephone = response.user.telephone;
            profile.isCorporateUser = response.isCorporateUser;
            
            vehicles = response.vehicles;
            bookings = response.bookings;
        });
    }
})
.catch(error => {
    console.error("Failed to fetch profile: " + error);
});

const deleteAccount = () => {
    fetch("http://localhost:5000/account/delete", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            access_token: access_token,
        }),
    })
    .then(res => {
        if (res.status !== 200) {
            console.error("Error: " + res.status);
        } else {
            window.location.href = "/account/logout";
        }
    })
    .catch(error => {
        console.error("Failed to delete account: " + error);
    });
}

const page = () => {  
    redirectIfNotLoggedIn();

    return (
        <div className="profile-page">

            <div className="profile-header">
                <div className="profile-image">
                    <img src="/Profile_avatar_placeholder.png" alt="profile" />
                </div>

                <div className="profile-info">
                    <h1>{profile.forename + profile.lastname || 'There was an error getting your profile.'}</h1>
                    <ul>
                        <li>Email: {profile.email || 'No email was found.'}</li>
                        <li>Telephone: {profile.telephone || 'No number was found.'}</li>
                    </ul>
                    
                    <div className="actions">
                        <button onClick={deleteAccount}>Delete Account</button>
                        <button><Link to="/account/edit">Edit Account</Link></button>
                    </div>
                </div>
            </div>

            <div className="table">
                <h1>Bookings</h1>
                <table>
                    <thead>
                        <tr className="heading">
                            <th>Space</th>
                            <th>Booked</th>
                            <th>Starts</th>
                            <th>Ends</th>
                            <th>Cost</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        { bookings.length > 0 ? bookings.map(booking => (
                            <tr className="item">
                                <td>{booking.spaceNumber}</td>
                                <td>{booking.dateBooked}</td>
                                <td>{booking.bookedFrom}</td>
                                <td>{booking.bookedTo}</td>
                                <td>£{booking.cost}</td>

                                <td>
                                    <a>Edit</a>
                                    <a>Cancel</a>
                                </td>
                            </tr>
                        )) : (
                            <tr className="item">
                                <td colSpan={6}>No bookings were found.</td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>

            <div className="table">
                <h1>Vehicles</h1>
                <table>
                    <thead>
                        <tr className="heading">
                            <th>Registration</th>
                            <th>Make</th>
                            <th>Model</th>
                            <th>Colour</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        { vehicles.length > 0 ? vehicles.map(vehicle => (
                            <tr className="item">
                                <td>{vehicle.registration}</td>
                                <td>{vehicle.make}</td>
                                <td>{vehicle.model}</td>
                                <td>{vehicle.colour}</td>
                                
                                <td>
                                    <a>View</a>
                                    <a>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16"> 
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> 
                                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> 
                                        </svg>
                                    </a>
                                </td>
                            </tr>
                        )) : (
                            <tr className="item">
                                <td colSpan={5}>No vehicles found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default page;