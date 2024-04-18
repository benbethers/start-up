import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './database.css'; // Import your CSS file

export function Database() {
    const [people, setPeople] = useState([]);
    const [username, setUsername] = useState('');
    const [adminUsername, setAdminUsername] = useState('');

    useEffect(() => {
        fetchData();
        setUsername(localStorage.getItem('username'));
        fetchAdminUsername();
    }, []);

    async function fetchData() {
        try {
            const usersResponse = await fetch('/api/users', { method: 'GET' });
            const peopleData = await usersResponse.json() || [];
            setPeople(peopleData);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    async function fetchAdminUsername() {
        try {
            const adminUsernameResponse = await fetch('/api/users/admins', { method: 'GET' });
            const adminUsernameData = await adminUsernameResponse.text();
            setAdminUsername(adminUsernameData);
        } catch (error) {
            console.error('Fetch admin username error:', error);
        }
    }

    function averageRating(person) {
        if (person.receivedReviews && person.receivedReviews.length > 0) {
            let total = 0;
            person.receivedReviews.forEach(review => {
                total += parseFloat(review.rating);
            });
            return (total / person.receivedReviews.length).toFixed(1);
        } else {
            return 0;
        }
    }

    async function handleDelete(person) {
        const personIndex = people.findIndex(p => p.username === person.username);
        if (personIndex !== -1) {
            try {
                await fetch(`/api/users/delete/${person.username}`, { method: 'DELETE' });
                await fetch(`/api/login/${person.username}`);
                fetchData();
                if (person.username === username) {
                    localStorage.setItem('token', '');
                    window.location.replace('/login');
                }
            } catch (error) {
                console.error('Delete error:', error);
            }
        }
    }

    function renderDeleteButton(person) {
        if (username === adminUsername) {
            return <button className="deleteCard" onClick={() => handleDelete(person)}>Delete</button>;
        } else {
            return null;
        }
    }

    function createPersonCard(person) {
        return (
            <div className="card" key={person.username}>
                <img id="profile-picture" src={person.image} alt="Avatar" />
                <div className="container">
                    <Link to="../user"><a className="hyperlink" onClick={() => {console.log(JSON.stringify(person)); sessionStorage.setItem('visitedUsername', person.username)}}>{person.name}</a></Link>
                    <p>{person.type}<br />{averageRating(person)} Stars<br />{person.receivedReviews ? person.receivedReviews.length : 0} reviews</p>
                    {renderDeleteButton(person)}
                </div>
            </div>
        );
    }

    function mainCardDisplay() {
        return people.map(person => createPersonCard(person));
    }

    useEffect(() => {
        const databaseInput = document.getElementById('databaseSearch');
        databaseInput.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                const cardDisplay = document.getElementById('cardsDisplay');
                const searchResults = document.getElementById('searchResults');
                const databaseSearch = databaseInput.value.toLowerCase();
                let searchNumbers = 0;
                let found = false;
                const filteredPeople = people.filter(person => person.name.toLowerCase().includes(databaseSearch));

                databaseInput.value = '';
                searchResults.innerHTML = '';

                if (filteredPeople.length > 0) {
                    searchNumbers = filteredPeople.length;
                    cardDisplay.innerHTML = mainCardDisplay(filteredPeople);
                    if (searchNumbers === 1) {
                        searchResults.innerHTML = searchNumbers + ' result found';
                    } else {
                        searchResults.innerHTML = searchNumbers + ' results found';
                    }
                    found = true;
                }

                if (!found) {
                    searchResults.innerHTML = 'No results found';
                    cardDisplay.innerHTML = mainCardDisplay();
                }
            }
        });
    }, [people]);

    return (
        <div>
            <main>
                <video width="100%" height="auto" autoPlay loop muted>
                    <source src="./assets/videos/StarsFalling.mp4" type="video/mp4" />
                </video><br />
                <section>
                    <h2>Ratings Database</h2>
                    <input id="databaseSearch" type="search" placeholder="Search database" />
                    <p id="searchResults"></p>
                </section>
                <section id="cardsDisplay">
                    {mainCardDisplay()}
                </section>
            </main>
        </div>
    );
}