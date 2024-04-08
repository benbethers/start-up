const { MongoClient } = require('mongodb');
const express = require('express');
const config = require('./dbConfig.json');
const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
let logins;
let users;

async function runServer() {
    try {
        await client.connect();
        const startupDatabase = client.db('startup');
        logins = startupDatabase.collection('logins');
        users = startupDatabase.collection('users');

        app.use(express.json());
        app.use(express.static('public'));

        const apiRouter = express.Router();
        app.use(`/api`, apiRouter);

        let loggedInUsername = '';

        apiRouter.get('/logins', async (req, res) => {
            try {
                const loginsReturn = await logins.find({}).toArray();
                if (loginsReturn !== undefined) {
                    res.send(JSON.stringify(loginsReturn));
                } else {
                    res.send([]);
                }
            } catch (error) {
                console.error('Error fetching logins:', error);
                res.sendStatus(500); // Internal server error
            }
        });

        apiRouter.put('/logins/add/:username/:password', async (req, res) => {
            try {
                await logins.insertOne({ linkedUsername: req.params.username, password: req.params.password });
                res.sendStatus(200);
            } catch (error) {
                console.error(error);
                res.sendStatus(400);
            }
        });

        apiRouter.delete('/logins/delete/:username', async (req, res) => {
            try {
                await logins.deleteOne({ linkedUsername: req.params.username });
                res.sendStatus(200);
            } catch (error) {
                console.error('Invalid request', error);
                res.sendStatus(400);
            }
        });

        function assignImage(sex) {
            if (sex === 'Female') {
                return '../assets/images/FemaleAvatar.png'
            } else {
                return '../assets/images/MaleAvatar.png';
            }
        }

        apiRouter.get('/users', async (req, res) => {
            try {
                const usersReturn = await users.find({}).toArray();
                if (usersReturn !== undefined) {
                    res.send(JSON.stringify(usersReturn));
                } else {
                    res.send([]);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                res.sendStatus(500); // Internal server error
            }
        });

        apiRouter.get('/users/admins', (req, res) => {
            const adminUsername = users.findOne({ adminUsername: 'benbethers' }).then(result => {
                if (result) {
                    res.send(result.adminUsername);
                } else {
                    res.sendStatus(404);
                }
            }).catch(error => {
                console.error(error);
                res.sendStatus(500);
            });
        });

        apiRouter.get('/users/loggedInUsername', (req, res) => {
            res.send(loggedInUsername);
        });

        let visitedName = '';

        apiRouter.get('/users/visitedName', (req, res) => {
            res.send(visitedName);
        });

        apiRouter.put('/users/setVisited/:visited', (req, res) => {
            visitedName = req.params.visited;
            res.sendStatus(200);
        });

        apiRouter.put('/users/add/:username/:name/:password/:sex/:type', (req, res) => {
            const { username, name, password, sex, type } = req.params;
            try {
                users.insertOne({
                    name,
                    type,
                    sex,
                    receivedReviews: [],
                    login: { username, password },
                    image: assignImage(sex)
                });
                res.sendStatus(200);
            } catch (error) {
                console.error('Failed', error);
                res.sendStatus(400);
            }
        });

        apiRouter.put('/users/add/rating/:visitedName/:loggedInUsername/:rating/:description', async (req, res) => {
            const { visitedName, loggedInUsername, rating, description } = req.params;
            try {
                const person = await users.findOne({ name: visitedName });
                if (!person) {
                    return res.sendStatus(404);
                }
                await users.updateOne(
                    { name: visitedName },
                    { $push: { receivedReviews: { ownerUsername: loggedInUsername, rating, description } } }
                );
                res.sendStatus(200);
            } catch (error) {
                console.error(error);
                res.sendStatus(500);
            }
        });

        apiRouter.put('/users/reset/username', (req, res) => {
            loggedInUsername = '';
            res.sendStatus(200);
        });

        apiRouter.put('/users/set/:username', (req, res) => {
            loggedInUsername = req.params.username;
            res.sendStatus(200);
        });

        apiRouter.delete('/users/delete/:index', async (req, res) => {
            const index = parseInt(req.params.index);
            try {
                console.log(users[index].name + ' successfully deleted');
                const deletedUser = users[index];
                await users.updateMany(
                    {},
                    { $pull: { receivedReviews: { ownerUsername: deletedUser.login.username } } }
                );
                await logins.deleteOne({ linkedUsername: deletedUser.login.username });
                res.sendStatus(200);
            } catch (error) {
                console.error('Invalid request', error);
                res.sendStatus(400);
            }
        });

        apiRouter.delete('/users/delete/rating/:reviewee/:loggedInUsername', async (req, res) => {
            const { reviewee, loggedInUsername } = req.params;
            try {
                const result = await users.updateOne(
                    { name: reviewee },
                    { $pull: { receivedReviews: { ownerUsername: loggedInUsername } } }
                );
                if (result.modifiedCount === 0) {
                    return res.sendStatus(404);
                }
                res.sendStatus(200);
            } catch (error) {
                console.error(error);
                res.sendStatus(500);
            }
        });

        app.listen(port, () => {
            console.log(`Server is running on :${port}`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

runServer();