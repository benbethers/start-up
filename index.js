//Declare express variables
const express = require('express');
const app = express();

//Declare port
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing
app.use(express.json());

// Serve up the front-end
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

//Declare rating and user variables
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
logins = [
    {
        linkedUsername: 'benbethers',
        password: 'programmingishard',
    },
    {
        linkedUsername: 'jeffsommers',
        password: 'programmingishard'
    }
]

//Return users
app.get('/logins', (req, res, next) => {
    res.send(JSON.stringify(logins));
});

//Add user to login list
app.put('/logins/add/:username/:password', (req, res) => {
    logins.push({linkedUsername: req.params.username, password: req.params.password});
});

//Delete user from list
app.delete('/logins/delete/:username', (req, res) => {
    let deletedUsername = req.params.username;
    let index = logins.findIndex(login => login.linkedUsername === deletedUsername);
    try {
        logins.splice(index, 1);
        res.sendStatus(200);
    } catch {
        console.log('Invalid request');
        res.sendStatus(400);
    }
});

//Assign image to person
function assignImage(sex) {
    if (sex === 'Female') {
        return '../assets/images/FemaleAvatar.png'
    } else {
        return '../assets/images/MaleAvatar.png'
    }
}

// Redirect function as middleware
app.get('/users', (req, res, next) => {
    res.send(JSON.stringify(users));
});

//Return admin names
app.get('/users/admins', (req, res, next) => {
    res.send(adminUsername);
});

//Return logged in username
app.get('/users/loggedInUsername', (req, res, next) => {
    res.send(loggedInUsername);
});

//Return visited name
app.get('/users/visitedName', (req, res, next) => {
    res.send(visitedName);
});

//Set visited name
app.put('/users/setVisited/:visited', (req, res) => {
    visitedName = req.params.visited;
});

//Create user
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

//Create rating
app.put('/users/add/rating/:rating/:description', (req, res) => {
    let rating = req.params.rating;
    let description = req.params.description;
    users.forEach((user) => {
        if (user.name == visitedName) {
            user.receivedReviews.push({'ownerUsername': loggedInUsername, 'rating': rating, 'description': description});
        }
    });
});

//Reset username and log out user
app.put('/users/reset/username', (req, res) => {
    loggedInUsername = '';
});

//Set username
app.put('/users/set/:username', (req, res) => {
    loggedInUsername = req.params.username;
    res.sendStatus(200);
});

//Delete user
app.delete('/users/delete/:index', (req, res) => {
    let index = parseInt(req.params.index);
    try {
        console.log(users[index].name + ' successfully deleted');
        let deletedUser = users[index];
        users.forEach((user) => {
            user.receivedReviews = user.receivedReviews.filter(review => review.ownerUsername !== deletedUser.login.username);
        });
        fetch(`https://localhost:4000/logins/delete/${deletedUser.login.username}`, { method: 'DELETE' });
        users.splice(index, 1);
        res.sendStatus(200);
    } catch {
        console.log('Invalid request');
        res.sendStatus(400);
    }
});

//Delete rating
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

//Deliver public html files
app.use(express.static('public'));

//Set app to listen at port
app.listen(port, () => {
    console.log(`Server is running on https://startup.benbethers.click:${PORT}`);
});