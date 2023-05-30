export function alreadySignedIn(): void {
    if (document.cookie.includes("access_token")) {
        window.location.href = "/";
    }
}
export function notSignedIn(): void {
    if (!document.cookie.includes("access_token")) {
        window.location.href = "/account/login";
    }
}

export function protectRoute(): void {
    const email = document.cookie.split("=")[2]

    fetch("http://localhost:5000/api/v1/users/admins", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => {
            if (res.status === 200) {
                res.json().then((response) => {
                    if (response.admins === undefined || response.admins.length === 0) {
                        window.location.href = "/admin/dashboard/protection?email=" + email;
                    } else {
                        const admins = response.admins;
                        let isAdmin = false;
                        for (let i = 0; i < admins.length; i++) {
                            if (admins[i].email === email) {
                                isAdmin = true;
                                break;
                            }
                        }
                        if (!isAdmin) {
                            window.location.href = "/";
                        }
                    }
                });
            }
        })
        .catch((err) => {
            console.log(err);
        })
}
export function disabledRoute(): void {
    fetch("http://localhost:5000/api/v1/users/admins", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => {
            if (res.status === 200) {
                res.json().then((response) => {
                    if (response.admins !== undefined && response.admins.length > 0) {
                        window.location.href = "/";
                    }
                });
            }
        })
        .catch((err) => {
            console.log(err);
        })
}

export function managerArea(): void {
    const email = document.cookie.split("=")[2]

    fetch("http://localhost:5000/api/v1/users/staff", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((res) => {
        if (res.status === 200) {
            res.json().then((response) => {
                const staff = response.staff;
                for (let i = 0; i < staff.length; i++) {
                    if (staff[i].email === email && staff[i].role === "manager" || staff[i].role === "admin") {
                        return;
                    }
                }
                window.location.href = "/admin/dashboard";
            });
        }
    })
    .catch((err) => {
        console.log(err);
    })
}