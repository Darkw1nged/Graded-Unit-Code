export default function redirectIfLoggedIn(): void {
    if (document.cookie.includes("access_token")) {
        window.location.href = "/";
    }
}

export function redirectIfNotLoggedIn(): void {
    if (!document.cookie.includes("access_token")) {
        window.location.href = "/account/login";
    }
}