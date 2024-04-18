import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './new-rating.css';

export function NewRating() {
    const [rating, setRating] = useState('');
    const [description, setDescription] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                await checkLogin();
            } catch (error) {
                console.error('Fetch error:', error);
            }
        }
        fetchData();
    }, []);

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

            if (response.ok) {
                const data = await response.json();
                setUsername(data.username);
            } else {
                localStorage.removeItem('token');
                window.location.replace('/login');
            }
        } catch (error) {
            console.error('Error checking login:', error);
        }
    }

    async function submitRating() {
        try {
            if (rating !== '' && description !== '' && parseFloat(rating) >= 1 && parseFloat(rating) <= 5) {
                const requestBody = {
                    visitedUsername: sessionStorage.getItem('visitedUsername'),
                    username: username,
                    rating: rating,
                    description: description
                };

                const response = await fetch(`/api/users/add/rating`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                if (response.ok) {
                    window.location.replace('/user');
                } else {
                    throw new Error('Network response was not ok');
                }
            } else {
                console.log('Invalid rating value or description');
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    }

    return (
        <>
            <main>
                <video width="100%" height="auto" autoPlay loop muted>
                    <source src="assets/videos/StarsFalling.mp4" type="video/mp4" />
                </video>
                <h2>New Rating</h2>
                <input
                    id="rating"
                    type="number"
                    placeholder="Rating value"
                    min="1"
                    step=".5"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                /><br />
                <input
                    id="description"
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                /><br />
                <Link to="../user"><button id="submit" onClick={submitRating}>Submit</button></Link>
            </main>
        </>
    );
}