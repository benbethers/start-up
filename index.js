const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const startupDatabase = client.db('startup');
const logins = startupDatabase.collection('logins');
const users = startupDatabase.collection('users');

client.connect();

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

//Return users
apiRouter.get('/logins', async (req, res, next) => {
    let loginsReturn = await logins.find({}).toArray();
    res.send(JSON.stringify(loginsReturn));
});

//Add user to login list
apiRouter.put('/logins/add/:username/:password', async (req, res) => {
    try {
        await logins.insertOne({linkedUsername: req.params.username, password: req.params.password});
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(400);
    }
});

//Delete user from list
apiRouter.delete('/logins/delete/:username', async (req, res) => {
    try {
        await logins.deleteOne({linkedUsername: req.params.username});
        res.sendStatus(200);
    } catch (error) {
        console.error('Invalid request', error);
        res.sendStatus(400);
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
apiRouter.get('/users', async (req, res, next) => {
    let usersReturn = await users.find({}).toArray();
    res.send(JSON.stringify(usersReturn));
});

//Return admin names
apiRouter.get('/users/admins', (req, res, next) => {
    let adminUsername = users.find({ adminUsername: 'benbethers' }).json().adminUsername;
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
        users.insertOne({ 'name': name, 'type': type, 'sex': sex, 'receivedReviews': [], 'login': { 'username': username, 'password': password }, 'image': assignImage(sex) });
        res.sendStatus(200); // Sending a success status
    } catch (error) {
        console.error('Failed', error);
        res.sendStatus(400); // Sending a bad request status
    }
});

//Create rating
apiRouter.put('/users/add/rating/:visitedName/:loggedInUsername/:rating/:description', async (req, res) => {
    try {
        const visitedName = req.params.visitedName;
        const loggedInUsername = req.params.loggedInUsername;
        const rating = req.params.rating;
        const description = req.params.description;

        //Find the user with the visitedName
        const person = await users.findOne({ name: visitedName });

        if (!person) {
            return res.sendStatus(404); //User not found
        }

        //Update the receivedReviews array
        await users.updateOne(
            { name: visitedName },
            { $push: { receivedReviews: { ownerUsername: loggedInUsername, rating: rating, description: description } } }
        );

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

//Reset username and log out user
apiRouter.put('/users/reset/username', (req, res) => {
    localStorage.setItem(loggedInUsername, '');
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
apiRouter.delete('/users/delete/rating/:reviewee/:loggedInUsername', async (req, res) => {
    try {
        const reviewee = req.params.reviewee;
        const loggedInUsername = req.params.loggedInUsername;

        // Update the document in MongoDB to remove the specified review
        const result = await users.updateOne(
            { name: reviewee },
            { $pull: { receivedReviews: { ownerUsername: loggedInUsername } } }
        );

        if (result.modifiedCount === 0) {
            return res.sendStatus(404); // User not found or review not present
        }

        res.sendStatus(200); // Sending a success status
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // Sending a server error status
    }
});

//Set app to listen at port
app.listen(port, () => {
    console.log(`Server is running on :${port}`);
});