import { Link } from 'react-router-dom';
import { useState } from 'react';
import redirectIfLoggedIn from '../../../components/redirects';

const Page = () => {
    redirectIfLoggedIn();

    const [formValues, setFormValues] = useState({
        buisnessName: '',
        email: '',
        telephone: '',
        password: '',
        confirmPassword: ''
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
                    <h1>Register</h1>
                    <hr />
                    
                    <form onSubmit={handleFormSubmit} name="register-form">
                        <input type="text" name="buisnessName" placeholder="Buisness Name" value={formValues.buisnessName} onChange={handleInputChange} required />
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
