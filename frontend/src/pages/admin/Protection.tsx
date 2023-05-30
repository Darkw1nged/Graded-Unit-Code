import qs from 'qs';
import { useLocation } from 'react-router-dom';
import { notSignedIn, disabledRoute } from '../../components/redirects';

const Page = () => {
    notSignedIn();
    disabledRoute();

    const { search } = useLocation();
    const { email } = qs.parse(search, { ignoreQueryPrefix: true });

    const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const password = e.currentTarget.password.value;

        fetch("http://localhost:5000/api/v1/admin/dashboard/protection", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ password, email }),
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