const express = require('express');
const cors = require('cors')
const app = express();
const PORT = 4002;

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

app.use(cors());

//Return users
app.get('/logins', (req, res, next) => {
    res.send(JSON.stringify(logins));
});

app.put('/logins/delete/:index', (req, res) => {
    let index = parseInt(req.params.index);
    try {
        logins.splice(index, 1);
        res.sendStatus(200);
    } catch {
        console.log('Invalid request');
        res.sendStatus(400);
    }
});

app.put('/logins/add/:username/:password', (req, res) => {
    logins.push({linkedUsername: req.params.username, password: req.params.password});
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});