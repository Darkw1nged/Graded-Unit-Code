import { Link } from 'react-router-dom';

const Page = () => {
    if (document.cookie.includes("userToken")) {
        window.location.href = "/";
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
                    <h1>Forgot Password</h1>
                    <hr />
                    <p className="information">Enter your email address to receive a link to reset your password.</p>
            
                    <form action="login.php" method="POST">
                        <input type="email" name="email" placeholder="Email" required />
                        <input type="submit" value="Send Link" />
                    </form>
                    <p className="register-account">Don't have an account? <Link to="/register">Sign up</Link></p>
                    <p className="has-account">Remember the password? <Link to="/login">Login</Link></p>
                </div>
            </div>        
        </div>
    )
};

export default Page;