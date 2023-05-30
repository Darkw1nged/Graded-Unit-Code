import { useLocation, Link } from 'react-router-dom';
import qs from 'qs';
import { useEffect } from 'react';

const Page = () => {
    const { search } = useLocation();
    const { email, booking_id } = qs.parse(search, { ignoreQueryPrefix: true });

    useEffect(() => {
        fetch('http://localhost:5000/api/v1/bookings/paid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, booking_id })
        }).then(res => res.json())
            .catch(err => console.log(err));
    }, [email, booking_id]);

    return (
        <>
            <br /><br /><br />
            <h1>Your booking has been confirmed!</h1>
            <Link to="/">Home</Link>
            <Link to={'/account?email=' + email}>View Account</Link>
        </>
    )
}

export default Page;