const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// MongoDB-ի կապման տողը
const mongoUri = 'Քո-MongoDB-Atlas-կապման-տողը';

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Կապը MongoDB-ի հետ հաջողվեց'))
    .catch(err => console.error('Կապը MongoDB-ի հետ ձախողվեց:', err));

const UserSchema = new mongoose.Schema({
    login: String,
    password: String,
});

const User = mongoose.model('User', UserSchema);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/saveData', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Ոչ բոլոր դաշտերը լրացված են');
    }

    const newUser = new User({ login: username, password: password });

    newUser.save()
        .then(() => res.send('Տվյալները հաջողությամբ պահպանվեցին!'))
        .catch(err => {
            console.error('Սխալ տվյալների պահպանման ընթացքում:', err);
            res.status(500).send('Սխալ, չհաջողվեց պահպանել տվյալները');
        });
});

module.exports = app;
