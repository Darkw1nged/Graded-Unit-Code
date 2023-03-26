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
                    <h1>Reset Password</h1>
                    <hr />            
                    <p className="information">Enter your new password.</p>

                    <form action="login" method="POST">
                        <input type="password" name="password" placeholder="New Password" required />
                        <input type="password" name="confirm-password" placeholder="Confirm Password" required />
                        <input type="submit" value="Confirm Reset" />
                    </form>
                </div>
            </div>        
        </div>
    )
};

export default Page;