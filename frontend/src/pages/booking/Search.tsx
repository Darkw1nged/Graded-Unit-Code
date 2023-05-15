import { useState } from 'react';
import '../../style/booking-search.css';

const Page = () => {
    const [formValues, setFormValues] = useState({
        departureTime: '',
        arrivalTime: ''
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    }

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        fetch('http://localhost:5000/search-booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formValues),
        })
        .then(res => res.json())
        .then(response => {
            if (response.status === 200) {
                if (response.availableSpaces === 0) {
                    const error = document.querySelector('.error') as HTMLElement;
                    error.classList.add('active');

                    if (error.querySelector('p') != null) {
                        const p = error.querySelector('p') as HTMLElement;
                        p.innerHTML = response.message;
                    }

                    document.querySelector('.success')?.classList.remove('active');
                } else {
                    const success = document.querySelector('.success') as HTMLElement;
                    success.classList.add('active');

                    if (success.querySelector('a') !== null) {
                    }

                    document.querySelector('.error')?.classList.remove('active');
                }
            } else if (response.status === 400) {
                const error = document.querySelector('.error') as HTMLElement;
                error.classList.add('active');

                if (error.querySelector('p') !== null) {
                    const p = error.querySelector('p') as HTMLElement;
                    p.innerHTML = response.message;
                }

                document.querySelector('.success')?.classList.remove('active');
            }

        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    const handleBooking = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();

        fetch('http://localhost:5000/start-booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formValues),
        })
        .then(res => res.json())
        .then(response => {
            window.location.href = `/booking/create?token=${response.token}`;
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    return (
        <div className="booking-page">
            <form onSubmit={handleFormSubmit} name="search-bookings">
                <div className="item">
                    <span>Departure Time</span>
                    <input type="datetime-local" name="departureTime" value={formValues.departureTime} onChange={handleInputChange} min={new Date().toISOString().slice(0, 16)} />
                </div>
                <div className="item">
                    <span>Arrival Time</span>
                    <input type="datetime-local" name="arrivalTime" value={formValues.arrivalTime} onChange={handleInputChange} min={formValues.departureTime} disabled={!formValues.departureTime}  />
                </div>
                <input type="submit" value="Search" />
            </form>

            <div className="response">
                <div className="error">
                    <p></p>
                </div>
                <div className="success">
                    <h1>It's Available!</h1>
                    <hr />

                    <ul>
                        <li>
                            <span>Valet Available</span>
                            <p>Yes</p>
                        </li>
                        <li>
                            <span>Car Service</span>
                            <p>Optional</p>
                        </li>
                        <li>
                            <span>Walk-in Available</span>
                            <p>Yes</p>
                        </li>
                        <li>
                            <span>Estimated Cost</span>
                            <p>£151</p>
                        </li>
                    </ul>

                    <h2>Payment Types Available</h2>
                    <hr />

                    <ul className="payments">
                        <li>Cash</li>
                        <li>Card</li>
                        <li>Paypal</li>
                    </ul>

                    <a onClick={handleBooking}>Book Now</a>
                </div>
            </div>

        </div>
    )
};

export default Page;