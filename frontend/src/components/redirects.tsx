export default function redirectIfLoggedIn(): void {
    if (document.cookie.includes("userToken")) {
        window.location.href = "/";
    }
}
