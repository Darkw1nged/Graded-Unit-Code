import { notSignedIn } from "../../components/redirects";

const Page = () => {
    notSignedIn();

    // end the user session
    fetch('http://localhost:5000/api/v1/users/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: document.cookie.split("=")[2],
        })
    })
    .then(res => {
        if (res.status === 200) {
            res.json().then(response => {
                document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.href = '/account/login';
            });
        }
    })
    .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
    });

    return (
        <></>
    )
};

export default Page;