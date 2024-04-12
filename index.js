const { MongoClient } = require('mongodb');
const express = require('express');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

const url = `mongodb+srv://${config.username}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);

const apiRouter = express.Router();
app.use(`/api`, apiRouter);
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());


const startupDatabase = client.db('startup');
const logins = startupDatabase.collection('logins');
const users = startupDatabase.collection('users');
let adminUsername = 'benbethers';

(async function testConnection() {
    await client.connect();
    await startupDatabase.command({ ping: 1 });
})().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
});

async function runServer() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        //Logins routes
        apiRouter.post('/login', async (req, res) => {
            console.log(req.json());
            try {
                let login = await logins.findOne({ linkedUsername: req.body.username });
                if (login) {
                    if (req.body.username === login.username) {//await bcrypt.compare(req.body.password, login.password)) {
                        res.cookie('token', login.token, {
                            secure: true,
                            httpOnly: true,
                            sameSite: 'strict',
                        });
                        res.status(200).send({ username: login.linkedUsername });
                        return;
                    }
                }
                res.status(401).send({msg: 'Unauthorized'});
            } catch (error) {
                console.error('Error during login:', error);
                res.status(500).send({msg: 'Internal Server Error'});
            }
        });


        apiRouter.delete('/logins/delete', async (req, res) => {
            try {
                await logins.deleteOne({linkedUsername: req.body.username});
                res.sendStatus(200);
            } catch (error) {
                console.error('Error during login deletion:', error);
                res.sendStatus(500);
            }
        });

        function assignImage(sex) {
            return sex === 'Female' ? '../assets/images/FemaleAvatar.png' : '../assets/images/MaleAvatar.png';
        }

        // Users routes
        apiRouter.get('/users', async (req, res) => {
            try {
                const usersReturn = await users.find({}).toArray();
                res.send(usersReturn);
            } catch (error) {
                console.error('Error fetching users:', error);
                res.sendStatus(500);
            }
        });

        apiRouter.get('/users/admins', (req, res) => {
            res.send(adminUsername);
        });

        apiRouter.post('/users/add', async (req, res) => {
            try {
                let user = await users.findOne({username: req.body.username});
                if (user) {
                    res.sendStatus(409);
                    return;
                } else {
                    await logins.insertOne({linkedUsername: req.body.username, password: await bcrypt.hash(req.body.password, 10), token: uuid.v4()});
                    let login = await logins.findOne({linkedUsername: req.body.username});
                    await users.insertOne({
                        name: req.body.name,
                        type: req.body.type,
                        sex: req.body.sex,
                        receivedReviews: [],
                        username: req.body.username,
                        image: assignImage(sex)
                    });
                    res.cookie('token', login.token, {
                        secure: true,
                        httpOnly: true,
                        sameSite: 'strict',
                    });
                    res.sendStatus(200);
                }
            } catch (error) {
                res.status(500).send({msg: 'Failed to create new user'});
            }
        });

        apiRouter.put('/users/add/rating', async (req, res) => {
            try {
                let visitedUsername = req.body.visitedUsername;
                let loggedInUsername = req.body.username;
                let rating = req.body.rating;
                let description = req.body.description;
                await users.updateOne(
                    { username: visitedUsername },
                    { $push: { receivedReviews: { ownerUsername: loggedInUsername, rating: rating, description: description } } }
                );
                res.sendStatus(200);
            } catch (error) {
                console.error('Error adding rating:', error);
                res.sendStatus(500);
            }
        });

        apiRouter.delete('/users/delete/rating', async (req, res) => {
            try {
                let deletedUsername = req.body.deletedUsername;
                let username = req.body.username;
                await users.updateOne(
                    { username: deletedUsername },
                    { $pull: { receivedReviews: { ownerUsername: username } } }
                );
                return res.sendStatus(200);
            } catch (error) {
                console.error('Error deleting rating:', error);
                return res.sendStatus(500);
            }
        });

        apiRouter.delete('/users/delete', async (req, res) => {
            try {
                let deletedUsername = req.body.username;
                let deletedUser = await users.findOne({username: deletedUsername});
                console.log(deletedUser.name + ' successfully deleted');
                await users.updateOne(
                    {},
                    { $pull: { receivedReviews: { ownerUsername: deletedUsername } } }
                );
                await logins.deleteOne({ linkedUsername: deletedUsername });
                await users.deleteOne({ username: deletedUsername });
                res.sendStatus(200);
            } catch (error) {
                console.error('Error deleting user:', error);
                res.sendStatus(500);
            }
        });

        app.use(function (err, req, res, next) {
            res.status(500).send({ type: err.name, message: err.message });
        });

        app.use((_req, res) => {
            res.sendFile('index.html', { root: 'public' });
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