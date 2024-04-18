import React, { useState } from 'react';
import './login.css';

export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [failureMessage, setFailureMessage] = useState('');
    const [quote, setQuote] = useState('');

    function signInFunctionality() {
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 401) {
                setFailureMessage('Could not find username or password');
            }
        }).then(data => {
            localStorage.setItem('token', data.token);
            window.location.replace('database.html');
        }).catch(error => {
            console.error(error);
            setFailureMessage('Could not find username or password');
        });
    }

    function quoteOfTheDay() {
        fetch('https://api.quotable.io/random')
            .then(response => response.json())
            .then(set => {
                setQuote(set.content + '\n' + set.author);
            });
    }

    function handleLoginClick() {
        signInFunctionality();
    }

    function handleSignUpClick() {
        window.location.replace('new-person.html');
    }

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            window.location.replace('database.html');
        } else {
            quoteOfTheDay();
        }
    }, []);

    return (
        <div>
            <header>
                <image src="./assets/images/StarCluster.png" height="54px" width="54px" alt="StarCluster"></image>
                <h1>Ratings</h1>
            </header>
            <main>
                <video width="100%" height="auto" autoPlay loop muted>
                    <source src="./assets/videos/StarsFalling.mp4" type="video/mp4"/>
                </video><br />
                <h2>Login</h2>
                <input
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    pattern="[A-Za-z0-9]+"
                    maxLength="30"
                /><br />
                <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    minLength="10"
                    maxLength="40"
                /><br />
                <button id="login" onClick={handleLoginClick}>Login</button>
                <button id="sign up" onClick={handleSignUpClick}>Sign Up</button>
                <p id="failure">{failureMessage}</p>
                <br />
                <h4>Quote of the Day</h4>
                <p>{quote}</p>
            </main>
            <footer>
                Benjamin Bethers<br />
                <a href="http://github.com/benbethers/start-up">GitHub</a>
            </footer>
        </div>
    );
}