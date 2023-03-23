import '../style/forgot-password.css';
import '../style/form-main.css';

const Page = () => {
    return (
        <div className="form-body">
            <div className="container">
                <div className="form">
                    <h1>Forgot Password</h1>
                    <hr />
                    <p>Enter your email address to receive a link to reset your password.</p>
            
                    <form action="login.php" method="POST">
                        <input type="email" name="email" placeholder="Email" required />
                        <input type="submit" value="Send Link" />
                    </form>
                    <p className="register-account">Don't have an account? <a href="register.php">Sign up</a></p>
                </div>
            </div>        
        </div>
    )
};

export default Page;