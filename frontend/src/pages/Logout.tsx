const Page = () => {
    // remove the user token from the cookie
    document.cookie = "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // redirect the user to the login page
    window.location.href = '/login';
    
    return (
        <></>
    )
};

export default Page;