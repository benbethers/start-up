import React, { useEffect } from 'react';
import './login.css'; // Import your CSS file

export function Login() {
  useEffect(() => {
    fetchData();
    signInFunctionality();
    quoteOfTheDay();
  }, []);

  async function fetchData() {
    try {
      const loginsResponse = await fetch('/api/logins', { method: 'GET' });
      const loginsData = await loginsResponse.json() || [];
      localStorage.setItem('username', '');
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  function signInFunctionality() {
    const loginButton = document.getElementById('login');
    const signUpButton = document.getElementById('signUp');
    const failure = document.getElementById('failure');

    loginButton.addEventListener('click', () => {
      const usernameInput = document.getElementById('username').value;
      const passwordInput = document.getElementById('password').value;

      const found = logins.some(login => login.linkedUsername === usernameInput && login.password === passwordInput);

      if (found) {
        localStorage.setItem('username', usernameInput);
        window.location.replace('database.html');
      } else {
        failure.innerHTML = 'Could not find username or password, please try again or make a new account.';
      }
    });

    signUpButton.addEventListener('click', () => {
      window.location.replace('new-person.html');
    });
  }

  function quoteOfTheDay() {
    fetch('https://api.quotable.io/random')
      .then(response => response.json())
      .then(set => {
        const quote = document.getElementById('quote');
        quote.innerHTML = `${set.content}<br>${set.author}`;
      });
  }

  return (
    <div>
      <main>
        <video width="100%" height="auto" autoPlay loop muted>
          <source src="./assets/videos/StarsFalling.mp4" type="video/mp4" />
        </video><br />
        <h2>Login</h2>
        <input id="username" type="text" placeholder="Username" pattern="[A-Za-z0-9]+" maxLength="30" /><br />
        <input id="password" type="password" placeholder="Password" minLength="10" maxLength="40" /><br />
        <button id="login">Login</button>
        <button id="signUp">Sign Up</button>
        <p id="failure"></p>
        <br />
        <h4>Quote of the Day</h4>
        <p id="quote"></p>
      </main>
    </div>
  );
}