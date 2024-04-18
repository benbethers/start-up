import React, { useEffect, useState } from 'react';
import './my-ratings.css'; // Import your CSS file

export function MyRatings() {
    const [people, setPeople] = useState([]);
    const [username, setUsername] = useState('');
    const [searchResults, setSearchResults] = useState('');
    const [reviewDisplay, setReviewDisplay] = useState('');

    useEffect(() => {
        main();
    }, []);

    async function fetchData() {
        try {
            const usersResponse = await fetch('/api/users');
            const peopleData = await usersResponse.json() || [];
            setPeople(peopleData);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    function signOut() {
        const signOutButton = document.getElementById('sign out');
        signOutButton.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.replace('index.html');
        });
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

    function setLoggedInUser() {
        const usernameNotification = document.getElementById('loggedInUser');
        usernameNotification.innerHTML = 'Logged In User: ' + username;
    }

    function mainReviewDisplay() {
        let display = '';
        people.forEach((person) => {
            person.receivedReviews.forEach((review) => {
                if (review.ownerUsername === username) {
                    display += '<div class="card"><div class="name" style="color: black; font-weight: bold;">' + person.name + '<br></div>' + review.rating + ' Stars<br>"' + review.description + '"<br><button class="deleteReview" style="color: blue; margin: 5px">Delete</button></div>';
                }
            });
        });
        setReviewDisplay(display);
    }

    function loadDeleteButtons() {
        const deleteButtons = document.querySelectorAll('.deleteReview');

        deleteButtons.forEach((button) => {
            button.addEventListener('click', function() {
                const reviewCard = button.closest('.card');
                const requestBody = {
                    deletedUsername: button.closest('.card').getAttribute('id'),
                    username: username,
                };
                fetch(`/api/users/delete/rating`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    } else {
                        reviewCard.remove();
                        if (reviewDisplay === '') {
                            setSearchResults('You have no ratings');
                        }
                    }
                }).catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
            });
        });
    }

    function searchFunctionality() {
        const reviewInput = document.getElementById('reviewSearch');

        reviewInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                let found = false;
                let searchNumbers = 0;
                const reviewSearch = reviewInput.value;
                reviewInput.value = '';
                setSearchResults('');
                setReviewDisplay('');
                people.forEach(function(person) {
                    person.receivedReviews.forEach((review) => {
                        if (person.name.toLowerCase().includes(reviewSearch.toLowerCase()) && review.ownerUsername === username) {
                            searchNumbers++;
                            setReviewDisplay(reviewDisplay => reviewDisplay + '<div class="card"><div style="color: black; font-weight: bold;">' + person.name + '<br></div>' + review.rating + ' Stars<br>"' + review.description + '"<br><button class="deleteReview" style="color: blue; margin: 5px">Delete</button></div>');
                            if (searchNumbers === 1) {
                                setSearchResults(searchNumbers + ' result found');
                            } else {
                                setSearchResults(searchNumbers + ' results found');
                            }
                            found = true;
                        }
                    });
                });

                if (!found) {
                    setSearchResults('No results found');
                    mainReviewDisplay();
                }
            }
        });
    }

    async function main() {
        await fetchData();
        signOut();
        checkLogin();
        setLoggedInUser();
        mainReviewDisplay();
        if (reviewDisplay === '') {
            setSearchResults('You have no ratings');
        }
    }

    useEffect(() => {
        searchFunctionality();
    }, [people, username]);

    return (
        <>
            <main>
                <video width="100%" height="auto" autoPlay loop muted>
                    <source src="./assets/videos/StarsFalling.mp4" type="video/mp4" />
                </video>
                <section>  
                    <h2>My Ratings</h2>
                    <input id="reviewSearch" type="text" placeholder="Search my ratings"/>
                    <p id="searchResults">{searchResults}</p>
                </section>
                <section id="reviewsDisplay" dangerouslySetInnerHTML={{__html: reviewDisplay}}></section>
            </main>
            <footer>
                <p id="loggedInUser" style={{ margin: '0px', fontSize: '13px' }}></p>
                Benjamin Bethers<br />
                <a href="http://github.com/benbethers/start-up">GitHub</a>
            </footer>
        </>
    );
}