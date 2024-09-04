const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/saveData', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Ոչ բոլոր դաշտերը լրացված են');
    }

    const data = { login: username, password: password };

    fs.readFile(path.join(__dirname, 'data.json'), (err, fileData) => {
        let jsonData = [];
        if (err && err.code === 'ENOENT') {
            jsonData = [];
        } else if (err) {
            console.error('Սխալ ընթերցման ընթացքում:', err);
            return res.status(500).send('Սխալ, չհաջողվեց պահպանել տվյալները');
        } else {
            jsonData = JSON.parse(fileData);
        }

        jsonData.push(data);

        fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Սխալ գրելու ընթացքում:', err);
                return res.status(500).send('Սխալ, չհաջողվեց պահպանել տվյալները');
            }
            res.send('Տվյալները հաջողությամբ պահպանվեցին!');
        });
    });
});

app.listen(port, () => {
    console.log(`Սերվերը լսում է http://localhost:${port}`);
});
