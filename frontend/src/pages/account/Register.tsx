import { useState } from 'react';
import { Link } from 'react-router-dom';

const Page = () => {
    const [registrationType, setRegistrationType] = useState('');

    const handleRegistrationType = (type: string) => {
        setRegistrationType(type);
    };

    const handleFormSubmit = (values: any) => {
        console.log(values);
    };

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
                    <p className="information">Please choose what account you wish to set up.</p>

                    <ul>
                        <li className="personal-account">
                            <Link to="/account/register/personal">Personal</Link>
                        </li>
                        <li className="corporate-account">
                            <Link to="/account/register/corporate">Business</Link>
                        </li>
                    </ul>
                    <p className="form-link">Remember the password? <Link to="/account/login">Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Page;
