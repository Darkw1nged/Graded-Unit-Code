import { useState, useEffect } from 'react';

const Page = () => {

    const [values , setValues] = useState({
        forename: '',
        surname: '',
        email: '',
        telephone: '',
        address_line_one: '',
        address_line_two: '',
        city: '',
        zip:'',
        country: '',
        departure: '',
        arrival: '',
        vehicle_registration: '',
        vehicle_make: '',
        vehicle_model: '',
        vehicle_colour: '',
        mini_valet: '',
        full_valet: '',
        signiture_valet: '',
        card_number: '',
        cardholder_name: '',
        expiry_date: '',
        cvv: ''
    });

    const [price, setPrice] = useState<number>(0);
    const [miniValet, setMiniValet] = useState<number>(64);
    const [fullValet, setFullValet] = useState<number>(90);
    const [signatureValet, setSignatureValet] = useState<number>(120);
    useEffect(() => {
        fetch('http://localhost:5000/api/v1/prices', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(response => {
                    setPrice(response.price_per_day);
                    setMiniValet(response.mini_valet);
                    setFullValet(response.full_valet);
                    setSignatureValet(response.signature_valet);
                });
            }
        })
        .catch(err => {
            console.error(`Error fetching discounts: ${err}`);
        });
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setValues(prevValue => ({
            ...prevValue,
            [name]: value,
        }));
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const stringDepartureTime = values.departure as string;
        const stringArrivalTime = values.arrival as string;

        const diff = Math.abs(new Date(stringDepartureTime).getTime() - new Date(stringArrivalTime).getTime());
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        fetch("http://localhost:5000/api/v1/admin/bookings/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                bookins: values,
                email: document.cookie.split("=")[2]
            }),
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(response => {
                    const successMessage = document.querySelector('.success') as HTMLElement;
                    successMessage.innerHTML = response.message;
                    successMessage.classList.add('active');
                    document.querySelector('.error')?.classList.remove('active');

                    window.location.href = "/admin/bookings";
                });
            } else {
                res.json().then(response => {
                    const errorMessage = document.querySelector('.error') as HTMLElement;
                    errorMessage.innerHTML = response.message;
                    errorMessage.classList.add('active');
                    document.querySelector('.success')?.classList.remove('active');
                    console.error(`Error adding booking: ${response.error}`);
                })
            }
        })
        .catch(err => {
            console.error(`Error adding booking: ${err}`);
        });
    }

    return (
        <main>
            <h1>Booking Add</h1>

            <div className="popup">
                <div className="error"></div>
                <div className="success"></div>
            </div>

            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="First Name" name="forename" value={values.forename} onChange={handleInputChange} />
                <input type="text" placeholder="Last Name" name="surname" value={values.surname} onChange={handleInputChange} />
                <input type="text" placeholder="Email" name="email" value={values.email} onChange={handleInputChange} />
                <input type="text" placeholder="Phone" name="telephone" value={values.telephone} onChange={handleInputChange} />

                <input type="text" placeholder="Address Line One" name="address_line_one" value={values.address_line_one} onChange={handleInputChange} />
                <input type="text" placeholder="Address Line Two (Optional)" name="address_line_two" value={values.address_line_two} onChange={handleInputChange} />
                <input type="text" placeholder="City" name="city" value={values.city} onChange={handleInputChange} />
                <input type="text" placeholder="Postal Code" name="zip" value={values.zip} onChange={handleInputChange} />
                <input type="text" placeholder="Country" name="country" value={values.country} onChange={handleInputChange} />

                <input type="datetime-local" name="departure"  value={values.departure} onChange={handleInputChange} />
                <input type="datetime-local" name="arrival" value={values.arrival} onChange={handleInputChange} />

                <input type="text" placeholder="Vehicle Registration" name="vehicle_registration" value={values.vehicle_registration} onChange={handleInputChange} />
                <input type="text" placeholder="Vehicle Make" name="vehicle_make" value={values.vehicle_make} onChange={handleInputChange} />
                <input type="text" placeholder="Vehicle Model" name="vehicle_model" value={values.vehicle_model} onChange={handleInputChange} />
                <input type="text" placeholder="Vehicle Colour" name="vehicle_colour" value={values.vehicle_colour} onChange={handleInputChange} />

                <input type="checkbox" name="mini_valet" value={values.mini_valet} onChange={handleInputChange} />
                <input type="checkbox" name="full_valet" value={values.full_valet} onChange={handleInputChange} />
                <input type="checkbox" name="signiture_valet" value={values.signiture_valet} onChange={handleInputChange} />

                <input type="text" placeholder="Card Number" name="card_number" value={values.card_number} onChange={handleInputChange} />
                <input type="text" placeholder="Cardholder Name" name="cardholder_name" value={values.cardholder_name} onChange={handleInputChange} />
                <input type="text" placeholder="Expiry Date" name="expiry_date" value={values.expiry_date} onChange={handleInputChange} />
                <input type="text" placeholder="CVV/CVC" name="cvv" value={values.cvv} onChange={handleInputChange} />

                <button type="submit">Submit</button>
            </form>

        </main>
    );

}

export default Page;