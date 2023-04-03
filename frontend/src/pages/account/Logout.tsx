const Page = () => {

    // check if the user is logged in
    if (!document.cookie.includes("userToken")) {
        // if the user is not logged in, redirect them to the login page
        window.location.href = "/login";
    }

    // end the user session
    fetch('http://localhost:5000/account/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userToken: document.cookie.split("=")[1],
        })
    })
    .then(response => response.json())
    .then(response => {
        console.log('logout response: ', response.message);

        // remove the user token from the cookie
        document.cookie = "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // redirect the user to the login page
        window.location.href = '/login';
    })
    .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
    });

    return (
        <></>
    )
};

export default Page;