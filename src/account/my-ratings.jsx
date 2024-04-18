import React, { useEffect, useState } from 'react';
import './my-ratings.css'; // Import your CSS file

export function MyRatings() {
    const [people, setPeople] = useState([]);
    const [username, setUsername] = useState('');
    const [searchResults, setSearchResults] = useState('');
    const [filteredReviews, setFilteredReviews] = useState([]);

    useEffect(() => {
        main();
    }, []);

    async function fetchData() {
        try {
            const response = await fetch('/api/users');
            const data = await response.json();
            setPeople(data);
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
            window.location.replace('/login');
        }
    }

    function signOut() {
        localStorage.removeItem('token');
        window.location.replace('/login');
    }

    function filterReviews(query) {
        const filtered = people.reduce((acc, person) => {
            const reviews = person.receivedReviews.filter(review =>
                review.ownerUsername === username && person.name.toLowerCase().includes(query.toLowerCase())
            );
            return [...acc, ...reviews];
        }, []);
        setFilteredReviews(filtered);
        setSearchResults(`${filtered.length} result${filtered.length !== 1 ? 's' : ''} found`);
    }

    function handleSearchChange(event) {
        const query = event.target.value;
        if (!query) {
            setSearchResults('');
            setFilteredReviews([]);
            return;
        }
        filterReviews(query);
    }

    async function main() {
        await fetchData();
        checkLogin();
    }

    return (
        <>
            <main>
                <video width="100%" height="auto" autoPlay loop muted>
                    <source src="./assets/videos/StarsFalling.mp4" type="video/mp4" />
                </video>
                <section>
                    <h2>My Ratings</h2>
                    <input
                        id="reviewSearch"
                        type="text"
                        placeholder="Search my ratings"
                        onChange={handleSearchChange}
                    />
                    <p id="searchResults">{searchResults}</p>
                </section>
                <section id="reviewsDisplay">
                    {filteredReviews.map(review => (
                        <div key={review._id} className="card">
                            <div className="name" style={{ color: 'black', fontWeight: 'bold' }}>{review.ownerUsername}</div>
                            {review.rating} Stars<br />
                            "{review.description}"<br />
                            <button className="deleteReview" style={{ color: 'blue', margin: '5px' }}>Delete</button>
                        </div>
                    ))}
                </section>
            </main>
            <footer>
                <p id="loggedInUser">Logged In User: {username}</p>
                Benjamin Bethers<br />
                <a href="http://github.com/benbethers/start-up">GitHub</a>
                <button id="signOut" onClick={signOut}>Sign Out</button>
            </footer>
        </>
    );
}