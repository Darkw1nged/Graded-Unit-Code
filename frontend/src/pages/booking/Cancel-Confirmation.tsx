import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import qs from 'qs';

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

    const { search } = useLocation();
    const { booking_id } = qs.parse(search, { ignoreQueryPrefix: true });

    const [refund, setRefund] = useState<number>();
    const [booking, setBooking] = useState<Booking>();
    useEffect(() => {
        fetch("http://localhost:5000/api/v1/bookings/find", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ booking_id })
        })
        .then(async res => {
            if (res.status === 200) {
                res.json().then((response) => {
                    setBooking(response.booking);
                    setRefund(response.refund);
                });
            } else {
                const response = await res.json();
                console.error(`Error fetching user: ${response.error}`);
            }
        })
        .catch(error => {
            console.error("Failed to fetch user: " + error);
        });
    }, [booking_id]);

    const back = () => {
        window.history.back();
    }
    const cancel = () => {
        fetch("http://localhost:5000/api/v1/bookings/cancel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ booking_id })
        })
        .then(async res => {
            if (res.status === 200) {
                res.json().then((response) => {
                    console.log(response);
                });
            } else {
                const response = await res.json();
                console.error(`Error fetching user: ${response.error}`);
            }
        })
        .catch(error => {
            console.error("Failed to fetch user: " + error);
        });
    }

    return (
        <div>
            <h1>Cancel Booking</h1>
            <p>Are you sure you want to cancel this booking?</p>

            <p>You will recieve: £{refund}</p>

            <button onClick={cancel}>Yes</button>
            <button onClick={back}>No</button>
        </div>
    )

}

export default Page;