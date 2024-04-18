import React, { useState, useEffect } from 'react';
import './my-ratings.css';

export function MyRatings() {
  const [people, setPeople] = useState([]);
  const [username, setUsername] = useState('');
  const [searchResults, setSearchResults] = useState('');

  useEffect(() => {
    fetchData();
    checkLogin();
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
    localStorage.removeItem('token');
    window.location.replace('/login');
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

  function mainReviewDisplay() {
    const reviewDisplay = document.getElementById('reviewsDisplay');
    reviewDisplay.innerHTML = '';
    people.forEach((person) => {
      person.receivedReviews.forEach((review) => {
        if (review.ownerUsername === username) {
          reviewDisplay.innerHTML += `
            <div class="card" key=${review.id}> <!-- Added key prop -->
              <div class="name" style="color: white; font-weight: bold;">${person.name}<br></div>
              ${review.rating} Stars<br>
              "${review.description}"<br>
              <button class="deleteReview" style="color: blue; margin: 5px">Delete</button>
            </div>
          `;
        }
      });
    });
    loadDeleteButtons();
  }

  function loadDeleteButtons() {
    const reviewDisplay = document.getElementById('reviewsDisplay');
    const deleteButtons = reviewDisplay.querySelectorAll('.deleteReview');

    deleteButtons.forEach((button) => {
      button.addEventListener('click', function() {
        const reviewCard = button.closest('.card');
        const requestBody = {
          deletedUsername: reviewCard.getAttribute('id'),
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
            if (reviewDisplay.innerHTML === '') {
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
        let reviewSearch = reviewInput.value;
        let searchNumbers = 0;
        reviewInput.value = '';
        setSearchResults('');
        const reviewDisplay = document.getElementById('reviewsDisplay');
        reviewDisplay.innerHTML = '';
        people.forEach((person) => {
          person.receivedReviews.forEach((review) => {
            if (person.name.toLowerCase().includes(reviewSearch.toLowerCase()) && review.ownerUsername === username) {
              searchNumbers++;
              reviewDisplay.innerHTML += `
                <div class="card" key=${review.id}> <!-- Added key prop -->
                  <div style="color: black; font-weight: bold;">${person.name}<br></div>
                  ${review.rating} Stars<br>
                  "${review.description}"<br>
                  <button class="deleteReview" style="color: blue; margin: 5px">Delete</button>
                </div>
              `;
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

  useEffect(() => {
    searchFunctionality();
  }, [people, username]);

  useEffect(() => {
    mainReviewDisplay();
  }, [people]);

  return (
    <main>
      <video width="100%" height="auto" autoPlay loop muted>
        <source src="./assets/videos/StarsFalling.mp4" type="video/mp4"/>
      </video>
      <section>  
        <h2>My Ratings</h2>
        <input id="reviewSearch" type="text" placeholder="Search my ratings"/>
        <p id="searchResults">{searchResults}</p> {/* Display search results */}
      </section>
      <section id="reviewsDisplay"></section>
    </main>
  );
}