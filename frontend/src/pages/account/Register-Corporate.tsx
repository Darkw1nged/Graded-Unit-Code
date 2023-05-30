import { Link } from 'react-router-dom';
import { useState } from 'react';
import { alreadySignedIn } from '../../components/redirects'

const Page = () => {
    alreadySignedIn();

    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        telephone: ''
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    }

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        fetch('http://localhost:5000/api/v1/users/add/business', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formValues)
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

                window.location.href = '/account/login';
            }

            return res.json();
        })
        .catch(err => {
            console.log('There was a problem with the fetch operation:', err);
        });
    }
    
    return (
        <div className="form-body">
            <div className="navigation">
                <Link to="/">Home</Link>
                <Link to="/booking/search">Book</Link>
                <Link to="/contact">Contact</Link>
            </div>

            <div className="popup">
                <div className="error"></div>
                <div className="success"></div>
            </div>
            
            <div className="container">
                <div className="form">
                    <h1>Register</h1>
                    <hr />
                    
                    <form onSubmit={handleFormSubmit} name="register-form">
                        <input type="text" name="name" placeholder="Buisness Name" value={formValues.name} onChange={handleInputChange} required />
                        <input type="email" name="email" placeholder="Email" value={formValues.email} onChange={handleInputChange} required />
                        <input type="tel" name="telephone" placeholder="Telephone" value={formValues.telephone} onChange={handleInputChange} required />
                        <input type="password" name="password" placeholder="Password" value={formValues.password} onChange={handleInputChange} required />
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formValues.confirmPassword} onChange={handleInputChange} required />
                        <input type="submit" value="Submit" />
                    </form>
                    <p className="form-link">Need a personal account? <Link to="/account/register/personal">Click here</Link></p>
                    <p className="form-link">Already have an account? <Link to="/account/login">Login</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Page;
