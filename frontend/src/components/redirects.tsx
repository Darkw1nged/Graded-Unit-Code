export default function redirectIfLoggedIn(): void {
    if (document.cookie.includes("access_token")) {
        window.location.href = "/";
    }
}
