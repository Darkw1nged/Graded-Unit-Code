import '../style/form-main.css';

const Page = () => {
    return (
        <div className="form-body">
            <div className="container">
                <div className="form">
                    <h1>Reset Password</h1>
                    <hr />            
                    <p>Enter your new password.</p>

                    <form action="login.php" method="POST">
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