import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import redirectIfLoggedIn from '../../../components/redirects';
// import GoogleLogin from 'react-google-login';
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

const Page = () => {
    redirectIfLoggedIn();
    
    const [formValues, setFormValues] = useState({
        forename: '',
        surname: '',
        email: '',
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

        fetch('http://localhost:5000/account/register/personal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formValues)
        })
        .then(res => res.json())
        .then(response => {
            if (response.status === 'error') {
                const errorPopup = document.querySelector('.error') as HTMLDivElement;
                errorPopup.innerHTML = response.message;
                errorPopup.classList.add('active');

                document.querySelector('.success')?.classList.remove('active');
                return;
            } else {
                const successPopup = document.querySelector('.success') as HTMLDivElement;
                successPopup.innerHTML = response.message;
                successPopup.classList.add('active');

                document.querySelector('.error')?.classList.remove('active');
            }

            document.cookie = `access_token=${response.access_token}; path=/`;
            window.location.href = '/';
        })
        .catch(err => {
            console.log('There was a problem with the fetch operation:', err);
        });
    }

    // const handleSocialLogin = (response: any, provider: string) => {        
    //     const userData = {
    //         email: response.email,
    //         firstName: response.givenName || response.first_name || '',
    //         lastName: response.familyName || response.last_name || '',
    //         provider: provider,
    //         socialId: response.googleId || response.userID || ''
    //     };

    //     fetch('http://localhost:5000/account/register/social', {
    //         method: 'POST',
    //         headers: {
    //         'Content-Type': 'application/json'
    //     },
    //         body: JSON.stringify(userData)
    //     })
    //     .then(res => res.json())
    //     .then(response => {
    //         document.cookie = `access_token=${response.access_token}; HttpOnly`;
    //         window.location.href = response.redirectUrl;
    //     })
    //     .catch(err => {
    //         console.log('There was a problem with the fetch operation:', err);
    //     });
    // };

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
                    <h1>Register</h1>
                    <hr />

                    {/* <div className="external-logins">
                        <GoogleLogin
                            clientId="337821532998-elseofffc6n9kuqbn2dnmud35tstkcs1.apps.googleusercontent.com"
                            render={renderProps => (
                                <a onClick={renderProps.onClick} className="google" href="https://accounts.google.com/o/oauth2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URL&scope=email&response_type=code">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                                        <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
                                    </svg>    
                                    Google
                                </a>
                            )}
                            onSuccess={res => handleSocialLogin(res, 'google')}
                            onFailure={res => handleSocialLogin(res, 'google')}
                            autoLoad={false}
                            cookiePolicy={'single_host_origin'}
                        />
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
                            autoLoad={false}
                            fields="name,email,picture"
                            callback={res => handleSocialLogin(res, 'facebook')} 
                        />
                    </div>

                    <div className="break">
                        <span>Or</span>
                    </div> */}

                    <form onSubmit={handleFormSubmit} name="register-form">
                        <div className="name">
                            <input type="text" name="forename" placeholder="Forename" value={formValues.forename} onChange={handleInputChange} required />
                            <input type="text" name="surname" placeholder="Surname" value={formValues.surname} onChange={handleInputChange} required />
                        </div>
                        <input type="email" name="email" placeholder="Email" value={formValues.email} onChange={handleInputChange} required />
                        <input type="password" name="password" placeholder="Password" value={formValues.password} onChange={handleInputChange} required />
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formValues.confirmPassword} onChange={handleInputChange} required />
                        <input type="submit" value="Submit" />
                    </form>
                    <p className="form-link">Need a corporate account? <Link to="/account/register/corporate">Click here</Link></p>
                    <p className="form-link">Already have an account? <Link to="/account/login">Login</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Page;