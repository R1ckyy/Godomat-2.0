const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');

const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('game'));

const urlencodedParser = bodyParser.urlencoded({extended: false});

app.post('/save', urlencodedParser, (req, res) => {
    console.log(req.body)
    let player = req.body.player;
    let smallwins = req.body.smallwins;
    let bigwins = req.body.bigwins;
    let tries = req.body.tries;
    let date = new Date();
    let str = `${player},${tries},${smallwins},${bigwins},${date.toLocaleDateString()},${date.toLocaleTimeString()}\n`;
    fs.appendFile('./data/result.csv', str, function(err) {
        if (err) {
            console.error(err);
            return res.status(400).json({
               success: false,
               message: 'Byla zjištěna chyba při zápisu do souboru' 
            });
        }
    });
    res.redirect(301, '/results');
});

app.get('/results', (req, res) => {
    csv().fromFile('./data/result.csv')
    .then(data => {
        console.log(data);
        res.render('results.pug', {'players':data});
    })
    .catch(err => {
        console.log(err);
    })
});

app.listen(port, () => {
    console.log(`Server funguje na portu ${port}`);
});