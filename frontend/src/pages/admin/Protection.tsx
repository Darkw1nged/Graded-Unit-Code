const Page = () => {

    const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const password = e.currentTarget.password.value;
        const access_token = document.cookie.split('; ').find(row => row.startsWith('access_token'))?.split('=')[1];

        fetch("http://localhost:5000/admin/protection", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password: password,
                access_token: access_token,
            }),
        })
        .then(res => {
            if (res.status === 200) {
                window.location.href = "/admin/dashboard";
            } else {
                res.json().then(response => {
                    const errorPopup = document.querySelector('.error') as HTMLDivElement;
                        errorPopup.innerHTML = response.message;
                    errorPopup.classList.add('active');

                    const successPopup = document.querySelector('.success') as HTMLDivElement;
                    successPopup.classList.remove('active');
                });
            }
        })
        .catch(error => {
            console.error("Error: " + error);
        });
    }

    return (
        <div>
            
            <div className="popup">
                <div className="error">
                    <p></p>
                </div>
                <div className="success">
                    <p></p>
                </div>
            </div>

            <form onSubmit={handlePasswordSubmit}>
                <input type="text" name="password" placeholder="Password" />
                <input type="submit" value="Submit" />
            </form>

        </div>
    )
}

export default Page 