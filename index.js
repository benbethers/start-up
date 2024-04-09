const { MongoClient } = require('mongodb');
const express = require('express');
const config = require('./dbConfig.json');
const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(express.static('public'));

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);

async function runServer() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const startupDatabase = client.db('startup');
        const logins = startupDatabase.collection('logins');
        const users = startupDatabase.collection('users');
        let adminUsername = 'benbethers';
        let loggedInUsername = '';

        const apiRouter = express.Router();
        app.use(`/api`, apiRouter);

        // Logins routes
        apiRouter.get('/logins', async (req, res) => {
            try {
                const loginsReturn = await logins.find({}).toArray();
                res.send(loginsReturn);
            } catch (error) {
                console.error('Error fetching logins:', error);
                res.sendStatus(500);
            }
        });

        apiRouter.delete('/logins/delete', async (req, res) => {
            try {
                await logins.deleteOne({ linkedUsername: req.body.username });
                res.sendStatus(200);
            } catch (error) {
                console.error('Invalid request', error);
                res.sendStatus(400);
            }
        });

        // Function to assign image based on sex
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

        apiRouter.put('/users/add/:username/:name/:password/:sex/:type', async (req, res) => {
            let username = req.params.username;
            let name = req.params.name;
            let password = req.params.password;
            let sex = req.params.sex;
            let type = req.params.type;
            try {
                await logins.insertOne({ linkedUsername: username, password: password });
                await users.insertOne({
                    name: name,
                    type: type,
                    sex: sex,
                    receivedReviews: [],
                    username: username,
                    image: assignImage(sex)
                });
                res.sendStatus(200);
            } catch (error) {
                console.error('Failed', error);
                res.sendStatus(400);
            }
        });

        apiRouter.put('/users/add/rating', async (req, res) => {
            let visitedUsername = req.body.visitedUsername;
            let loggedInUsername = req.body.username;
            let rating = req.body.rating;
            let description = req.body.description;
            try {
                await users.updateOne(
                    { username: visitedUsername },
                    { $push: { receivedReviews: { ownerUsername: loggedInUsername, rating: rating, description: description } } }
                );
                res.sendStatus(200);
            } catch (error) {
                console.error(error);
                res.sendStatus(500);
            }
        });

        apiRouter.delete('/users/delete/rating', async (req, res) => {
            let deletedUsername = req.body.deletedUsername;
            let username = req.body.username;
            try {
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
            let deletedUsername = req.body.username;
            try {
                let deletedUser = users.findOne({username: deletedUsername});
                console.log(deletedUser.name + ' successfully deleted');
                await users.updateOne(
                    {},
                    { $pull: { receivedReviews: { ownerUsername: deletedUsername } } }
                );
                await logins.deleteOne({ linkedUsername: deletedUsername });
                await users.deleteOne({ username: deletedUsername });
                res.sendStatus(200);
            } catch (error) {
                console.error('Invalid request', error);
                res.sendStatus(400);
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