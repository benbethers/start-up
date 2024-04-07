//Declare express variables
const express = require('express');
const cors = require('cors')
const app = express();
const PORT = 4002;

//Declare login list
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

//Use cors
app.use(cors());

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

//Set app to listen at port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});