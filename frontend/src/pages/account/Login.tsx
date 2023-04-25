import { Link } from 'react-router-dom';
import { useState } from 'react';
import redirectIfLoggedIn from '../../components/redirects';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

const Page = () => {
    redirectIfLoggedIn();

    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues({
            ...formValues,
            [name]: value,
            [name]: event.target.type === 'checkbox' ? event.target.checked : value
        });
    }

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        fetch('http://localhost:5000/account/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formValues),
        })
        .then(response => response.json())
        .then(response => {
            document.cookie = `userToken=${response.data.token}; expires=${new Date(Date.now() + response.data.expiresIn * 1000)}; path=/`;
            window.location.href = "/";
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
                    <h1>Login</h1>
                    <hr />

                    {/* <div className="external-logins">
                        <FacebookLogin
                            appId="547707977446517"
                            render={renderProps => (
                                <a onClick={renderProps.onClick} className="facebook" href="https://www.facebook.com/v10.0/dialog/oauth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URL&scope=email">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                                    </svg>
                                    Facebook
                                </a>
                            )}
                            autoLoad={true}
                            fields="name,email,picture"
                            callback={responseFacebook} 
                        />
                    </div>

                    <div className="break">
                        <span>Or</span>
                    </div> */}

                    <form onSubmit={handleFormSubmit}>
                        <input type="text" name="email" placeholder="Email" value={formValues.email} onChange={handleInputChange} required />
                        <input type="password" name="password" placeholder="Password" value={formValues.password} onChange={handleInputChange} required />
                        <div className="remember-details">
                            <input type="checkbox" name="rememberMe" checked={formValues.rememberMe} onChange={handleInputChange} />
                            <label htmlFor="rememberMe">Remember me</label>
                        </div>
                        <input type="submit" value="Login" />
                    </form>
                    <p className="form-link">Forgot your password? <Link to="/account/forgot-password">Click here</Link></p>
                    <p className="form-link">Don't have an account? <Link to="/account/register">Sign up</Link></p>
                </div>
            </div>
        </div>
    )
};

export default Page;