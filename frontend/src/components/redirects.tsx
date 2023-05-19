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

export function redirectIfNoAdmins(): void {
    fetch("http://localhost:5000/admin/get/admins", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((res) => {
        if (res.status === 200) {
            res.json().then((response) => {
                if (response.admins === undefined || response.admins.length === 0) {
                    window.location.href = "/admin/protection";
                }
            });
        }
    })
    .catch((err) => {
        console.log(err);
    })
}