import '../../style/admin-dash.css'

const Dashboard = () => {

    // check if user is logged in and can access this page, sessionID is stored in cookies userToken
    const userToken = document.cookie.split('; ').find(row => row.startsWith('userToken='))?.split('=')[1]
    console.log(userToken)
    
    if (!userToken) {
        window.location.href = '/login'
    }

    return (
        <main>
            <div className="stats">
                <div className="item">
                    <div className="header">
                        <div className="values">
                            <p>Sales</p>
                            <h2>£1,000</h2>
                        </div>
                        <div className="bubble">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-credit-card" viewBox="0 0 16 16"> 
                                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H2zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7z"/> 
                                <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z"/> 
                            </svg>
                        </div>
                    </div>

                    <div className="compare up">
                        <span> 🠉 13%</span>
                        <p>Since last month</p>
                    </div>
                </div>
                <div className="item">
                    <div className="header">
                        <div className="values">
                            <p>Members</p>
                            <h2>100</h2>
                        </div>
                        <div className="bubble">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
                                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                            </svg>
                        </div>
                    </div>

                    <div className="compare up">
                        <span> 🠉 30%</span>
                        <p>Since last month</p>
                    </div>
                </div>

                <div className="item">
                    <div className="header">
                        <div className="values">
                            <p>Bookings</p>
                            <h2>100</h2>
                        </div>
                        <div className="bubble">
                            <svg width="16" height="16" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <rect x="9" y="8" width="30" height="36" rx="2" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
                                <path d="M18 4V10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M30 4V10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M16 19L32 19" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M16 27L28 27" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M16 35H24" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>

                    <div className="compare down">
                        <span> 🠋 5%</span>
                        <p>Since last month</p>
                    </div>
                </div>

                <div className="item">
                    <div className="header">
                        <div className="values">
                            <p>Spaces Available </p>
                            <h2>344</h2>
                        </div>
                        <div className="bubble">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,6H9A1,1,0,0,0,8,7V17a1,1,0,0,0,2,0V14h2a4,4,0,0,0,0-8Zm0,6H10V8h2a2,2,0,0,1,0,4ZM19,2H5A3,3,0,0,0,2,5V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V5A3,3,0,0,0,19,2Zm1,17a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V5A1,1,0,0,1,5,4H19a1,1,0,0,1,1,1Z"/>
                            </svg>
                        </div>
                    </div>

                    <div className="compare even">
                        <span> - 0%</span>
                        <p>Since last month</p>
                    </div>
                </div>
            </div>

            <div className="users">
                <h1>New Users</h1>
                <table className="test-users"></table>
            </div>
        </main>
    );
};

export default Dashboard;

function createTestUsers() {
    const users = [];

    users.push(`
    <tr class="heading">
        <th>Name</th>
        <th>Registered</th>
        <th>Email</th>
        <th>Phone</th>
        <th></th>
    </tr>`)

    for (let i = 0; i < 11; i++) {
        const user = `
        <tr class="user">
            <td>User ${i}</td>
            <td>${new Date().toLocaleDateString()}</td>
            <td>user${i}@example.com</td>
            <td>555-555-${i.toString().padStart(4, '0')}</td>
            <td>
                <a href="">View</a>
                <a href="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"> 
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> 
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> 
                    </svg>
                </a>
            </td>
        </tr>
        `;
        users.push(user);
    }
    return users.join('');
}

const usersTable = document.querySelector('.test-users');
if (usersTable) {
    usersTable.innerHTML = createTestUsers();
}