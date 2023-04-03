import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import redirectIfLoggedIn from '../../components/redirects';
import qs from 'qs';

const Page = () => {
    redirectIfLoggedIn();

    const { search } = useLocation();
    const { token } = qs.parse(search, { ignoreQueryPrefix: true });

    const [formValues, setFormValues] = useState({
        password: '',
        confirmedPassword: '',
        token: token,
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

        fetch('http://localhost:5000/account/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formValues),
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    return (
        <div className="form-body">
            <div className="navigation">
                <Link to="/">Home</Link>
                <Link to="/book-space">Book</Link>
                <Link to="/contact">Contact</Link>
            </div>

            <div className="container">
                <div className="form">
                    <h1>Reset Password</h1>
                    <hr />            
                    <p className="information">Enter your new password.</p>

                    <form onSubmit={handleFormSubmit}>
                        <input type="password" name="password" placeholder="New Password" value={formValues.password} onChange={handleInputChange} required />
                        <input type="password" name="confirmedPassword" placeholder="Confirm Password" value={formValues.confirmedPassword} onChange={handleInputChange} required />
                        <input type="submit" value="Confirm Reset" />
                    </form>
                </div>
            </div>        
        </div>
    )
};

export default Page;