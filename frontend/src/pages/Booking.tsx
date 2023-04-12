import { useState } from 'react';

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
            console.log(response);
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    return (
        <>
            <h1>Booking</h1>
            <form onSubmit={handleFormSubmit} name="search-bookings">
                <span>Departure Time</span>
                <input type="datetime-local" name="departureTime" value={formValues.departureTime} onChange={handleInputChange} />
                <span>Arrival Time</span>
                <input type="datetime-local" name="arrivalTime" value={formValues.arrivalTime} onChange={handleInputChange} />
                <input type="submit" value="Search" />
            </form>
        </>
    )
};

export default Page;