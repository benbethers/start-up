import React, { useEffect, useState } from 'react';
import './user.css';

export function User() {
    const [people, setPeople] = useState([]);
    const [username, setUsername] = useState('');
    const [visitedUsername, setVisitedUsername] = useState('');
    const [adminUsername, setAdminUsername] = useState('');
    const [failureMessage, setFailureMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            await checkLogin();

            const usersResponse = await fetch('/api/users');
            const peopleData = await usersResponse.json() || [];
            setPeople(peopleData);

            const adminUsernameResponse = await fetch('/api/users/admins');
            const adminUsernameData = await adminUsernameResponse.text();
            setAdminUsername(adminUsernameData);

            const visitedUser = sessionStorage.getItem('visitedUsername');
            if (visitedUser && visitedUser !== '') {
                setVisitedUsername(visitedUser);
            } else {
                window.location.replace('database.html');
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    async function checkLogin() {
        try {
            const response = await fetch('/api/login/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: localStorage.getItem('token')
                })
            });

            const data = await response.json();
            setUsername(data.username);
        } catch (error) {
            localStorage.removeItem('token');
            window.location.replace('index.html');
        }
    }

    function submitButtonListener() {
        const submitButton = document.getElementById('add rating');
        submitButton.addEventListener('click', () => {
            // Your logic for the submit button listener
        });
    }

    function setUpPage(person) {
        // Your logic for setting up the page
    }

    function makeTitleName() {
        document.title = visitedUsername;
    }

    useEffect(() => {
        makeTitleName();
    }, [visitedUsername]);

    return (
        <main>
            <video width="100%" height="auto" autoPlay loop muted>
                <source src="./assets/videos/StarsFalling.mp4" type="video/mp4" />
            </video>
            <div className="main-card">
                <section id="identification">
                    {/* Your JSX for user identification */}
                </section>
                <section id="reviews">
                    {/* Your JSX for displaying reviews */}
                </section>
                <button id="add rating" style={{ color: 'white', marginTop: '0px' }}>Add Rating</button>
                <p id="failure">{failureMessage}</p>
            </div>
        </main>
    );
}