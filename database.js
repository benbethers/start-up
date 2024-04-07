const express = require('express');
const cors = require('cors')
const app = express();
const PORT = 4001;

let adminUsername = 'benbethers';
let loggedInUsername = '';
let visitedName = '';
let users = [
    {
        'name': 'Ben Bethers',
        'sex': 'Male',
        'type': 'Student',
        'receivedReviews': [],
        'image': assignImage(this.sex),
        'login': {
            'username': 'benbethers',
            'password': 'programmingishard'
        }
    },
    {
        'name': 'Jeff Sommers',
        'sex': 'Male',
        'type': 'Professor',
        'receivedReviews': [],
        'image': assignImage(this.sex),
        'login': {
            'username': 'jeffsommers',
            'password': 'programmingishard'
        }
    }
];

//Assign image to person
function assignImage(sex) {
    if (sex === 'Female') {
        return './assets/images/FemaleAvatar.png'
    } else {
        return './assets/images/MaleAvatar.png'
    }
}

app.use(cors());

// Redirect function as middleware
app.get('/users', (req, res, next) => {
    res.send(JSON.stringify(users));
});

app.get('/users/admins', (req, res, next) => {
    res.send(adminUsername);
});

app.get('/users/loggedInUsername', (req, res, next) => {
    res.send(loggedInUsername);
});

app.get('/users/visitedName', (req, res, next) => {
    res.send(visitedName);
});

app.put('/users/setVisited/:visited', (req, res) => {
    visitedName = req.params.visited;
});

app.delete('/users/delete/:index', (req, res) => {
    let index = parseInt(req.params.index);
    try {
        console.log(users[index].name + ' successfully deleted');
        let deletedUser = users[index];
        users.forEach((user) => {
            user.receivedReviews = user.receivedReviews.filter(review => review.ownerUsername !== deletedUser.login.username);
        });
        fetch(`http://localhost:4002/delete/${deletedUser.login.username}`, { method: 'DELETE' });
        users.splice(index, 1);
        res.sendStatus(200);
    } catch {
        console.log('Invalid request');
        res.sendStatus(400);
    }
});

app.put('/users/add/:username/:name/:password/:sex/:type', (req, res) => {
    let username = req.params.username;
    let name = req.params.name;
    let password = req.params.password;
    let sex = req.params.sex;
    let type = req.params.type;
    try {
        users.push({'name': name, 'type': type, 'sex': sex, 'receivedReviews': [], 'login': {'username': username, 'password': password}, 'image': assignImage(sex)});
    } catch {
        console.log('Failed')
    }
});

app.put('/users/add/rating/:rating/:description', (req, res) => {
    let rating = req.params.rating;
    let description = req.params.description;
    users.forEach((user) => {
        if (user.name == visitedName) {
            user.receivedReviews.push({'ownerUsername': loggedInUsername, 'rating': rating, 'description': description});
        }
    });
});

app.put('/users/reset/username', (req, res) => {
    loggedInUsername = '';
});

app.put('/users/set/:username', (req, res) => {
    loggedInUsername = req.params.username;
    res.sendStatus(200);
});

app.delete('/users/delete/rating/:reviewee', (req, res) => {
    let person;
    let reviewee = req.params.reviewee;
    users.forEach((user) => {
        if (user.name === reviewee) {
            person = user;
        }
    });
    person.receivedReviews = person.receivedReviews.filter(review => review.ownerUsername !== loggedInUsername);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});