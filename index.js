//Declare express variables
const express = require('express');
const app = express();
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
apiRouter.get('/logins', (req, res, next) => {
    res.send(JSON.stringify(logins));
});

//Add user to login list
apiRouter.put('/logins/add/:username/:password', (req, res) => {
    try {
        logins.push({ linkedUsername: req.params.username, password: req.params.password });
        res.sendStatus(200); // Sending a success status
    } catch (error) {
        console.error(error);
        res.sendStatus(400); // Sending a bad request status
    }
});

//Delete user from list
apiRouter.delete('/logins/delete/:username', (req, res) => {
    let deletedUsername = req.params.username;
    let index = logins.findIndex(login => login.linkedUsername === deletedUsername);
    try {
        logins.splice(index, 1);
        res.sendStatus(200); // Sending a success status
    } catch (error) {
        console.error('Invalid request', error);
        res.sendStatus(400); // Sending a bad request status
    }
});

//Assign image to person
function assignImage(sex) {
    if (sex === 'Female') {
        return '../assets/images/FemaleAvatar.png';
    } else {
        return '../assets/images/MaleAvatar.png';
    }
}

// Redirect function as middleware
apiRouter.get('/users', (req, res, next) => {
    res.send(JSON.stringify(users));
});

//Return admin names
apiRouter.get('/users/admins', (req, res, next) => {
    res.send(adminUsername);
});

//Return logged in username
apiRouter.get('/users/loggedInUsername', (req, res, next) => {
    res.send(loggedInUsername);
});

//Return visited name
apiRouter.get('/users/visitedName', (req, res, next) => {
    res.send(visitedName);
});

//Set visited name
apiRouter.put('/users/setVisited/:visited', (req, res) => {
    visitedName = req.params.visited;
    res.sendStatus(200); // Sending a success status
});

//Create user
apiRouter.put('/users/add/:username/:name/:password/:sex/:type', (req, res) => {
    let username = req.params.username;
    let name = req.params.name;
    let password = req.params.password;
    let sex = req.params.sex;
    let type = req.params.type;
    try {
        users.push({ 'name': name, 'type': type, 'sex': sex, 'receivedReviews': [], 'login': { 'username': username, 'password': password }, 'image': assignImage(sex) });
        res.sendStatus(200); // Sending a success status
    } catch (error) {
        console.error('Failed', error);
        res.sendStatus(400); // Sending a bad request status
    }
});

//Create rating
apiRouter.put('/users/add/rating/:rating/:description', (req, res) => {
    let rating = req.params.rating;
    let description = req.params.description;
    try {
        users.forEach((user) => {
            if (user.name == visitedName) {
                user.receivedReviews.push({ 'ownerUsername': loggedInUsername, 'rating': rating, 'description': description });
            }
        });
        res.sendStatus(200); // Sending a success status
    } catch (error) {
        console.error(error);
        res.sendStatus(400); // Sending a bad request status
    }
});

//Reset username and log out user
apiRouter.put('/users/reset/username', (req, res) => {
    loggedInUsername = '';
    res.sendStatus(200); // Sending a success status
});

//Set username
apiRouter.put('/users/set/:username', (req, res) => {
    loggedInUsername = req.params.username;
    res.sendStatus(200); // Sending a success status
});

//Delete user
apiRouter.delete('/users/delete/:index', (req, res) => {
    let index = parseInt(req.params.index);
    try {
        console.log(users[index].name + ' successfully deleted');
        let deletedUser = users[index];
        users.forEach((user) => {
            user.receivedReviews = user.receivedReviews.filter(review => review.ownerUsername !== deletedUser.login.username);
        });
        fetch(`https://localhost:4000/logins/delete/${deletedUser.login.username}`, { method: 'DELETE' });
        users.splice(index, 1);
        res.sendStatus(200); // Sending a success status
    } catch (error) {
        console.error('Invalid request', error);
        res.sendStatus(400); // Sending a bad request status
    }
});

//Delete rating
apiRouter.delete('/users/delete/rating/:reviewee', (req, res) => {
    let person;
    let reviewee = req.params.reviewee;
    try {
        users.forEach((user) => {
            if (user.name === reviewee) {
                person = user;
            }
        });
        person.receivedReviews = person.receivedReviews.filter(review => review.ownerUsername !== loggedInUsername);
        res.sendStatus(200); // Sending a success status
    } catch (error) {
        console.error(error);
        res.sendStatus(400); // Sending a bad request status
    }
});

//Set app to listen at port
app.listen(port, () => {
    console.log(`Server is running on :${port}`);
});