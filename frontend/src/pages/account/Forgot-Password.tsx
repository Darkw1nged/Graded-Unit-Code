import { Link } from 'react-router-dom';
import { useState } from 'react';
import { alreadySignedIn } from '../../components/redirects'

const Page = () => {
    alreadySignedIn();

    const [formValues, setFormValues] = useState({
        email: '',
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

        fetch('http://localhost:5000/api/v1/users/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formValues),
        })
        .then(res => {
            if (res.status === 400 || res.status === 409 || res.status === 500) {
                const errorPopup = document.querySelector('.error') as HTMLDivElement;
                res.json().then(response => {
                    errorPopup.innerHTML = response.message;
                });
                errorPopup.classList.add('active');

                const successPopup = document.querySelector('.success') as HTMLDivElement;
                successPopup.classList.remove('active');
            } else {
                const successPopup = document.querySelector('.success') as HTMLDivElement;
                res.json().then(response => {
                    successPopup.innerHTML = response.message;
                });
                successPopup.classList.add('active');

                const errorPopup = document.querySelector('.error') as HTMLDivElement;
                errorPopup.classList.remove('active');
            }

            return res.json();
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
            
            <div className="popup">
                <div className="error">
                    <p>s</p>
                </div>
                <div className="success">
                    <p></p>
                </div>
            </div>

            <div className="container">
                <div className="form">
                    <h1>Forgot Password</h1>
                    <hr />
                    <p className="information">Enter your email address to receive a link to reset your password.</p>
            
                    <form onSubmit={handleFormSubmit}>
                        <input type="email" name="email" placeholder="Email" value={formValues.email} onChange={handleInputChange} required />
                        <input type="submit" value="Send Link" />
                    </form>
                    <p className="form-link">Don't have an account? <Link to="/account/register">Sign up</Link></p>
                    <p className="form-link">Remember the password? <Link to="/account/login">Login</Link></p>
                </div>
            </div>        
        </div>
    )
};

export default Page;