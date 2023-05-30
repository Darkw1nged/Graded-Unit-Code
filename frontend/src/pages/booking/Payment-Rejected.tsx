import { useLocation, Link } from 'react-router-dom';
import qs from 'qs';
import { useEffect } from 'react';

const Page = () => {

    const { search } = useLocation();
    const { email } = qs.parse(search, { ignoreQueryPrefix: true });

    useEffect(() => {
        fetch('http://localhost:5000/api/v1/users/contact/payment/failure', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        }).then(res => res.json())
            .catch(err => console.log(err));
    }, [email]);

    return (
        <>
            <br /><br /><br />
            <h1>Sorry, the payment did not go through!</h1>
            <Link to="/">Home</Link>
            <Link to="/booking/search">Book</Link>
        </>
    )
}

export default Page;