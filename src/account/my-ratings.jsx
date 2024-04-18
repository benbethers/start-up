import React, { useState, useEffect } from 'react';
import './my-ratings.css'; // Import your CSS file

export function MyRatings() {
  const [people, setPeople] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetchData();
    setUsername(localStorage.getItem('username') || ''); // Adjust the key based on your implementation
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

  function mainReviewDisplay() {
    return (
      <div id="reviewsDisplay">
        {people.map(person => (
          person.receivedReviews.map(review => (
            (review.ownerUsername === username) &&
            <div className="card" key={person.name}>
              <div className="name" style={{ color: 'black', fontWeight: 'bold' }}>{person.name}</div>
              {review.rating} Stars<br/>
              "{review.description}"<br/>
              <button className="deleteReview" style={{ color: 'blue', margin: '5px' }}>Delete</button>
            </div>
          ))
        ))}
      </div>
    );
  }

  function loadDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.deleteReview');
    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const person = people.find(person => person.name === button.parentNode.getAttribute('id'));
        if (person) {
          fetch(`/api/users/delete/rating/${button.parentNode.getAttribute('id')}`, { method: 'DELETE' })
            .then(() => {
              fetchData();
              button.parentNode.remove();
            })
            .catch(error => console.error('Delete error:', error));
        }
      });
    });
  }

  useEffect(() => {
    loadDeleteButtons();
  }, [people]);

  return (
    <div className="main-content">
      <h2>My Ratings</h2>
      <input id="reviewSearch" type="text" placeholder="Search my ratings"/>
      <p id="searchResults"></p>
      {mainReviewDisplay()}
    </div>
  );
}