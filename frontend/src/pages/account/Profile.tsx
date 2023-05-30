import { notSignedIn } from "../../components/redirects";
import '../../style/profile.css';
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import qs from 'qs';

interface User {
    email: string;
    role: string;
    telephone?: string;
    addressLineOne?: string;
    addressLineTwo?: string;
    city?: string;
    region?: string;
    zip?: string;
    country?: string;
    suspended?: boolean;
}

interface Person {
    UserID: number;
    forename: string;
    surname: string;
    middle_name?: string;
    family_name?: string;
    date_of_birth?: Date;
}

interface Business {
    UserID: number;
    name: string;
    slogan?: string;
    description?: string;
}

interface Vehicle {
    registration_number: string;
    user_id: number;
    make: string;
    model: string;
    colour: string;
}

interface Booking {
    id: number;
    user_id: number;
    vehicle_registration_number: string;
    extras_id?: number;
    discount_id?: number;
    space: number;
    date_booked: Date;
    booked_from: Date;
    booked_until: Date;
    cost: number;
    paid: boolean;
}

const Page = () => {  
    notSignedIn();

    const { search } = useLocation();
    const { email } = qs.parse(search, { ignoreQueryPrefix: true });

    const [userProfile, setUserProfile] = useState<User>({
        email: '',
        role: '',
        telephone: '',
        addressLineOne: '',
        addressLineTwo: '',
        city: '',
        region: '',
        zip: '',
        country: '',
        suspended: false
    });
    const [person, setPerson] = useState<Person>({
        UserID: 0,
        forename: '',
        surname: '',
        middle_name: '',
        family_name: '',
        date_of_birth: new Date()
    });
    const [business, setBusiness] = useState<Business>({
        UserID: 0,
        name: '',
        slogan: '',
        description: ''
    });
    const [userVehicles, setUserVehicles] = useState<Vehicle[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/v1/users/find", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email })
        })
        .then(async res => {
            if (res.status === 200) {
                res.json().then((response) => {
                    setUserProfile(response.user);
                    setPerson(response.person);
                    setBusiness(response.business);
                    setUserVehicles(response.vehicles);
                    setBookings(response.bookings);
                });
            } else {
                const response = await res.json();
                console.error(`Error fetching user: ${response.error}`);
            }
        })
        .catch(error => {
            console.error("Failed to fetch user: " + error);
        });
    }, [email]);

    const deleteAccount = () => {
        fetch("http://localhost:5000/api/v1/users/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email })
        })
        .then(async res => {
            if (res.status !== 200) {
                const response = await res.json();
                console.error(`Error deleting user: ${response.error}`);
            }
        })
        .catch(error => {
            console.error("Failed to delete user: " + error);
        });
    }
    const deleteVehicle = (vehicle: Vehicle) => (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        fetch("http://localhost:5000/api/v1/vehicles/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ vehicle })
        })
        .then(async res => {
            if (res.status === 200) {
                res.json().then((response) => {
                    setUserVehicles(response.vehicles);
                });
            } else {
                const response = await res.json();
                console.error(`Error deleting vehicle: ${response.error}`);
            }
        })
        .catch(error => {
            console.error("Failed to delete vehicle: " + error);
        });
    }
    const cancelBooking = (booking: Booking) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    }

    return (
        <div className="profile-page">

            <div className="profile-header">
                <div className="profile-image">
                    <img src="/Profile_avatar_placeholder.png" alt="profile" />
                </div>

                <div className="profile-info">
                    <h1>{person.forename + ' ' + person.surname || business.name || 'Profile not found.'}</h1>
                    <ul>
                        <li>Email: {userProfile.email || ''}</li>
                        <li>Telephone: {userProfile.telephone || ''}</li>
                    </ul>
                    
                    <div className="actions">
                        <button onClick={deleteAccount}>Delete Account</button>
                        <button><Link to={"/account/edit?email=" + email}>Edit Account</Link></button>
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
                            <th>Paid</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        { bookings !== undefined && bookings.length > 0 ? bookings.map(booking => (
                            <tr className="item" key={booking.id}>
                                <td>{booking.space}</td>
                                <td>{new Date(booking.date_booked).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                <td>{new Date(booking.booked_from).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                <td>{new Date(booking.booked_until).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                <td>{booking.paid ? "Yes" : "No"}</td>

                                <td>
                                    <Link to={"/account/edit/booking?booking_id=" + booking.id}>Edit</Link>
                                    <Link to={"/booking/cancel?booking_id=" + booking.id}>Cancel</Link>
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
                        { userVehicles !== undefined && userVehicles.length > 0 ? userVehicles.map(vehicle => (
                            <tr className="item" key={vehicle.registration_number}>
                                <td>{vehicle.registration_number}</td>
                                <td>{vehicle.make}</td>
                                <td>{vehicle.model}</td>
                                <td>{vehicle.colour}</td>
                                
                                <td>
                                    <a href="" onClick={deleteVehicle(vehicle)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16"> 
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> 
                                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> 
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

export default Page;