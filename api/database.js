const express = require('express');
const cors = require('cors')
const app = express();
const PORT = 4001;

let adminUsername = 'benbethers';
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
    res.send(adminUsername);
});

app.put('/users/delete/:index', (req, res) => {
    let index = parseInt(req.params.index);

    try {
        console.log(users[index].name + ' successfully deleted');
        let deletedUser = users[index];
        users.forEach((user) => {
            user.receivedReviews = user.receivedReviews.filter(review => review.ownerUsername !== deletedUser.login.username);
        });
        users.splice(index, 1);
        res.sendStatus(200);
    } catch {
        console.log('Invalid request');
        res.sendStatus(400);
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});