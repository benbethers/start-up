import React, { useState } from 'react';
import './new-person.css';

export function NewPerson() {
    const [name, setName] = useState('');
    const [type, setType] = useState('Student');
    const [sex, setSex] = useState('Male');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [failure, setFailure] = useState('');

    async function formSubmit() {
        try {
            if (!name.includes(' ')) {
                setFailure('You must have your first and last name in the name field');
                return;
            } else if (password.length < 10) {
                setFailure('Your password must be at least ten characters long');
                return;
            } else if (username.length < 7) {
                setFailure('Your username must be at least seven characters long');
                return;
            }

            const response = await fetch(`/api/users/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username.toLowerCase(),
                    name: name,
                    password: password,
                    sex: sex,
                    type: type
                })
            });

            if (response.status === 200) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                window.location.replace('database.html');
            } else if (response.status === 409) {
                setFailure(`The username ${username} is already in use`);
            } else {
                throw new Error('Failed to add new person');
            }
        } catch (error) {
            setFailure(`The username ${username} is already in use`);
        }
    }

    return (
        <>
            <main>
                <video width="100%" height="auto" autoPlay loop muted>
                    <source src="./assets/videos/StarsFalling.mp4" type="video/mp4" />
                </video>
                <h2>New Person</h2>
                <input
                    type="text"
                    placeholder="Name"
                    pattern="[A-Za-z ]+"
                    maxLength="30"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                /><br />
                <select
                    id="type-selector"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option>Student</option>
                    <option>Professor</option>
                    <option>Business</option>
                </select><br />
                <select
                    id="sex-selector"
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                >
                    <option>Male</option>
                    <option>Female</option>
                </select><br />
                <input
                    type="text"
                    placeholder="Username"
                    pattern="[A-Za-z0-9]+"
                    maxLength="30"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                /><br />
                <input
                    type="password"
                    placeholder="Password"
                    minLength="10"
                    maxLength="40"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                /><br />
                <button onClick={formSubmit}>Submit</button>
                <p id="failure">{failure}</p>
            </main>
            <footer>
                Benjamin Bethers<br />
                <a href="http://github.com/benbethers/start-up">GitHub</a>
            </footer>
        </>
    );
}