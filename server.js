const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

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
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/saveData', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Ոչ բոլոր դաշտերը լրացված են');
    }

    const newUser = new User({ login: username, password: password });

    newUser.save()
        .then(() => {
            res.send('Տվյալները հաջողությամբ պահպանվեցին MongoDB-ում և ֆայլում!');
            saveDataToFile(username, password);
        })
        .catch(err => {
            console.error('Սխալ տվյալների պահպանման ընթացքում MongoDB-ում:', err);
            res.status(500).send('Սխալ, չհաջողվեց պահպանել տվյալները MongoDB-ում');
        });
});

function saveDataToFile(username, password) {
    const data = { login: username, password: password };

    fs.readFile(path.join(__dirname, 'data.json'), (err, fileData) => {
        let jsonData = [];
        if (err && err.code === 'ENOENT') {
            jsonData = [];
        } else if (err) {
            console.error('Սխալ ընթերցման ընթացքում:', err);
            return;
        } else {
            jsonData = JSON.parse(fileData);
        }

        jsonData.push(data);

        fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Սխալ գրելու ընթացքում:', err);
            } else {
                console.log('Տվյալները հաջողությամբ պահպանվեցին ֆայլում!');
            }
        });
    });
}

app.listen(port, () => {
    console.log(`Սերվերը լսում է http://localhost:${port}`);
});
