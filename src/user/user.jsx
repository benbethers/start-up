import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './user.css';

export function User() {
  const [visitedUsername, setVisitedUsername] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    type: '',
    sex: '',
    image: '',
    receivedReviews: [],
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchDataFromAPI();
  }, []);

  async function fetchDataFromAPI() {
    try {
      const response = await fetch('/api/users');
      const usersData = await response.json();

      const visitedUsername = sessionStorage.getItem('visitedUsername');
      if (visitedUsername) {
        setVisitedUsername(visitedUsername);
        const person = usersData.find(person => person.username === visitedUsername);
        if (person) {
          setProfileData(person);
        } else {
          window.location.replace('database.html');
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  function constructReview(review) {
    return (
      <div key={review._id} className="card">
        <div style={{ color: 'white', fontWeight: 'bold' }}>{review.ownerUsername}<br /></div>
        {review.rating} Stars<br />
        "{review.description}"
      </div>
    );
  }

  return (
    <div>
      <main>
        <video width="100%" height="auto" autoPlay loop muted>
          <source src="./assets/videos/StarsFalling.mp4" type="video/mp4" />
        </video>
        <div className="main-card">
          <section id="identification">
            <p><b>{profileData.name}</b></p>
            <img src={profileData.image} alt="Avatar" id="profile-picture" />
            <p>{profileData.type}</p>
            <p>{profileData.sex}</p>
            <p>{profileData.receivedReviews.length > 0 ?
              `${(profileData.receivedReviews.reduce((acc, review) => acc + parseFloat(review.rating), 0) / profileData.receivedReviews.length).toFixed(1)} Stars` : '0 Stars'}
            </p>
            <p>({profileData.receivedReviews.length} {profileData.receivedReviews.length === 1 ? 'review' : 'reviews'})</p>
          </section>
          <section id="reviews">
            {/* Map through receivedReviews and constructReview */}
            {profileData.receivedReviews.map(review => constructReview(review))}
          </section>
          <Link to="../rate"><button id="add rating" style={{ color: 'white', marginTop: '0px' }}>Add Rating</button></Link>
          <p id="failure" style={{ color: 'red', fontStyle: 'italic', margin: '2px', display: errorMessage ? 'block' : 'none', fontSize: '10px', marginBottom: '5px' }}>{errorMessage}</p>
        </div>
      </main>
    </div>
  );
}