import React, { useState, useEffect } from 'react';
import './user.css'; // Import your CSS file

export function User() {
  const [people, setPeople] = useState([]);
  const [username, setUsername] = useState('');
  const [visitedUsername, setVisitedUsername] = useState('');

  useEffect(() => {
    fetchData();
    checkLogin();
    makeTitleName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchData() {
    try {
      const usersResponse = await fetch('/api/users');
      const userData = await usersResponse.json() || [];
      setPeople(userData);

      const usernameResponse = await fetch('/api/users/loggedInUsername');
      const loggedInUsername = await usernameResponse.text();
      setUsername(loggedInUsername);

      const visitedUser = sessionStorage.getItem('visitedUser');
      if (!visitedUser || visitedUser === '') {
        window.location.replace('database.html');
      } else {
        setVisitedUsername(visitedUser);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  function checkLogin() {
    if (username === '') {
      window.location.replace('index.html');
    }
  }

  function makeTitleName() {
    document.title = visitedUsername;
  }

  function constructReview(review) {
    return (
      <div className="card">
        <div style={{ color: 'black', fontWeight: 'bold' }}>{review.ownerUsername}<br /></div>
        {review.rating} Stars<br />
        "{review.description}"
      </div>
    );
  }

  function submitButtonListener() {
    const submitButton = document.getElementById('add rating');
    submitButton.addEventListener('click', () => {
      people.forEach((person) => {
        if (person.name === visitedUsername) {
          if (person.username === username) {
            const failure = document.getElementById('failure');
            submitButton.style.marginBottom = '2px';
            failure.innerHTML = 'You cannot rate yourself.';
            failure.style.display = 'block';
          } else {
            if (person.receivedReviews.length === 0) {
              window.location.replace('new-rating.html');
            }
            person.receivedReviews.forEach((review) => {
              if (review.ownerUsername === username) {
                const failure = document.getElementById('failure');
                submitButton.style.marginBottom = '2px';
                failure.innerHTML = 'You have already rated this person, you must delete or edit your current review.';
                failure.style.display = 'block';
              } else {
                window.location.replace('new-rating.html');
              }
            });
          }
        }
      });
    });
  }

  function setUpPage(person) {
    const name = document.getElementById('name');
    const type = document.getElementById('type');
    const sex = document.getElementById('sex');
    const averageRating = document.getElementById('average rating');
    const receivedReviews = document.getElementById('reviews received');
    const reviewSection = document.getElementById('reviews');
    reviewSection.innerHTML = '';
    people.forEach((person) => {
      if (person.name === visitedUsername) {
        person.receivedReviews.forEach((review) => {
          reviewSection.innerHTML += constructReview(review);
        });
        document.getElementById('profile-picture').setAttribute('src', person.image);
        name.innerHTML = person.name;
        type.innerHTML = person.type;
        sex.innerHTML = person.sex;
        if (person.receivedReviews.length > 0) {
          let total = 0;
          person.receivedReviews.forEach((review) => {
            total += parseFloat(review.rating);
          });
          averageRating.innerHTML = (total / person.receivedReviews.length).toFixed(1) + ' Stars';
        } else {
          averageRating.innerHTML = '0 Stars';
        }
        if (person.receivedReviews.length === 1) {
          receivedReviews.innerHTML = '(' + person.receivedReviews.length + ' review)';
        } else {
          receivedReviews.innerHTML = '(' + person.receivedReviews.length + ' reviews)';
        }
        submitButtonListener();
      }
    });
  }

  return (
    <div>
      <header>
        <image src="./assets/images/StarCluster.png" height="54px" width="54px"></image>
        <h1>Ratings</h1>
      </header>
      <main>
        <video width="100%" height="auto" autoPlay loop muted>
          <source src="./assets/videos/StarsFalling.mp4" type="video/mp4" />
        </video>
        <div className="main-card">
          <section id="identification">
            <p><b id="name" style={{ color: 'white' }}></b></p>
            <img id="profile-picture" src="./assets/images/FemaleAvatar.png" alt="Avatar" />
            <p id="type" style={{ color: 'white' }}></p>
            <p id="sex"></p>
            <p id="average rating"></p>
            <p id="reviews received"></p>
          </section>
          <section id="reviews"></section>
          <button id="add rating" style={{ color: 'white', marginTop: '0px' }}>Add Rating</button>
          <p id="failure"></p>
        </div>
      </main>
      <footer>
        <p id="loggedInUser" style={{ margin: '0px', fontSize: '13px' }}></p>
        Benjamin Bethers<br />
        <a href="http://github.com/benbethers/start-up">GitHub</a>
      </footer>
    </div>
  );
}