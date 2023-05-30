import { notSignedIn, protectRoute } from '../../components/redirects';
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

interface Extra {
    booking_id: number;
    mini_valet: boolean;
    full_valet: boolean;
    signature_valet: boolean;
}

const Page = () => {
    notSignedIn();
    protectRoute();

    const { search } = useLocation();
    const { booking_id } = qs.parse(search, { ignoreQueryPrefix: true });

    const [total, setTotal] = useState<number>();
    const [extra, setExtra] = useState<Extra>({
        booking_id: 0,
        mini_valet: false,
        full_valet: false,
        signature_valet: false
    });
    const [booking, setBooking] = useState<Booking>({
        id: 0,
        user_id: 0,
        vehicle_registration_number: '',
        space: 0,
        date_booked: new Date(),
        booked_from: new Date(),
        booked_until: new Date(),
        cost: 0,
        paid: false
    });
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
                await res.json().then((response) => {
                    setBooking(response.booking);
                    setTotal(response.booking.cost);
                    setExtra(response.extra);
                });
            } else {
                const response = await res.json();
                console.error(`Error fetching booking: ${response.error}`);
            }
        })
        .catch(error => {
            console.error("Failed to fetch booking: " + error);
        });
    }, [booking_id]);
    const created = new Date(booking.date_booked);
    const bookedFrom = new Date(booking.booked_from);
    const bookedUntil = new Date(booking.booked_until);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setBooking(prevBooking => ({
            ...prevBooking,
            [name]: value,
        }));
    }
    const handleExtraSelect = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setExtra(prevExtra => ({
            ...prevExtra,
            [name]: value,
        }));
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        fetch("http://localhost:5000/api/v1/bookings/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ booking, extra })
        })
        .then(async res => {
            if (res.status === 200) {
                await res.json().then((response) => {
                    const successMessage = document.querySelector('.success') as HTMLElement;
                    successMessage.innerHTML = response.message;
                    successMessage.classList.add('active');
                    document.querySelector('.error')?.classList.remove('active');
                });
            } else {
                res.json().then(response => {
                    const errorMessage = document.querySelector('.error') as HTMLElement;
                    errorMessage.innerHTML = response.message;
                    errorMessage.classList.add('active');
                    document.querySelector('.success')?.classList.remove('active');
                    console.error(`Error updating booking: ${response.error}`);
                })
            }
        })
        .catch(error => {
            console.error("Failed to fetch booking: " + error);
        });
    }

    const deleteBooking = (date_booked: string) => {
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
                    window.location.href = '/admin/booking-management';
                });
            }
        })
        .catch(error => {
            console.error("Failed to delete user: " + error);
        });
    }

    return (
        <main>
            <form onSubmit={handleSubmit}>
                <label htmlFor="">Booking ID</label>
                <input type="text" name="id" placeholder='Booking ID' value={booking.id} onChange={handleInputChange} disabled />
                
                <label htmlFor="">Vehicle Reg</label>
                <input type="text" name="vehicle_registration_number" placeholder='Vehicle Registration Number' value={booking.vehicle_registration_number} onChange={handleInputChange} />
                
                <label htmlFor="">Space</label>
                <input type="text" name="space" placeholder='Space' value={booking.space} onChange={handleInputChange} />
                
                <label htmlFor="">Date Booked</label>
                <input type="datetime-local" name="date_booked" placeholder='Date Booked' value={created.toISOString().substr(0, 16)} onChange={handleInputChange} disabled />
                
                <label htmlFor="">Booekd From</label>
                <input type="datetime-local" name="booked_from" placeholder='Booked From' value={bookedFrom.toISOString().substr(0, 16)} onChange={handleInputChange} min={new Date().toISOString().slice(0, 16)} />
                
                <label htmlFor="">Booked until</label>
                <input type="datetime-local" name="booked_until" placeholder='Booked Until' value={bookedUntil.toISOString().substr(0, 16)} onChange={handleInputChange} min={bookedFrom.toISOString().slice(0, 16)} />
                
                <label htmlFor="">Booking Cost</label>
                <input type="text" name="cost" placeholder='Cost' value={booking.cost} onChange={handleInputChange} />
                
                <label htmlFor="">Paid</label>
                <input type="checkbox" name="paid" placeholder='Paid' checked={booking.paid} onChange={handleInputChange}/>

                <label htmlFor="">Mini Valet</label>
                <input type="checkbox" name="mini_valet" checked={extra?.mini_valet} onChange={handleExtraSelect} />

                <label htmlFor="">Full Valet</label>
                <input type="checkbox" name="full_valet" checked={extra?.full_valet} onChange={handleExtraSelect} />

                <label htmlFor="">Signiture Valet</label>
                <input type="checkbox" name="signiture_valet" checked={extra?.signature_valet} onChange={handleExtraSelect} />

                <button type="submit">Update</button>
                <button onClick={() => deleteBooking(booking.date_booked.toString())}>Delete</button>
            </form>
        </main>
    )
}

export default Page;