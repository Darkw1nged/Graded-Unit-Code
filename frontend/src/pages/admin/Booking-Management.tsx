import { notSignedIn, protectRoute } from '../../components/redirects';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
    protectRoute();

    const [bookings, setBookings] = useState<Booking[]>([]);
    useEffect(() => {
        fetch("http://localhost:5000/api/v1/bookings", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(response => {
                    setBookings(response.bookings);
                });
            }
        })
        .catch(err => {
            console.error(`Error fetching discounts: ${err}`);
        });
    }, []);

    const deleteDiscount = (date_booked: string) => {
        fetch("http://localhost:5000/api/v1/bookings/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ date_booked })
        })
        .then(async res => {
            if (res.status === 200) {
                res.json().then(response => {
                    setBookings(response.bookings);
                });
            }
        })
        .catch(error => {
            console.error("Failed to delete user: " + error);
        });
    }

    return (
        <main>
            
            <div className="data">
                <div className="title">
                    <h1>Bookings</h1>
                    {/* <Link to="/admin/add/booking">Create Booking</Link> */}
                </div>

                <table>
                    <thead>
                        <tr className="heading">
                            <th>Space</th>
                            <th>Booked</th>
                            <th>Booked From</th>
                            <th>Booked Until</th>
                            <th>Paid</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        { bookings !== undefined && bookings.length > 0 ? bookings.map((booking) => (
                            <tr className="user" key={booking.date_booked.toString()}>
                                <td>{booking.space}</td>
                                <td>{new Date(booking.date_booked).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                <td>{new Date(booking.booked_from).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                <td>{new Date(booking.booked_until).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                <td>{booking.paid ? "Yes" : "No"}</td>
                                <td>
                                    <Link to={"/admin/edit/booking?booking_id=" + booking.id}>Edit</Link>
                                    <a onClick={() => deleteDiscount(booking.date_booked.toString())}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16"> 
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> 
                                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> 
                                        </svg>
                                    </a>
                                </td>
                            </tr>
                        )) : (
                            <tr className="user">
                                <td colSpan={5}>No bookings were found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </main>
    )
}

export default Page;