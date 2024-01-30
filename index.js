const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const connectionString = process.env.DATABASE_URL;

const app = express();
const port = 3000;


const pool = new pg.Pool({
    connectionString: connectionString,
});
app.use(bodyParser.json());
app.use(express.static('public'));
app.get('/', function(req, res, next) {
    res.send('hello world');
});

app.post('/submit', function(req, res, next) {
    pool.connect(function (err, conn, done){
        // watch for any connect issues
        if (err) console.log(err);
        conn.query('INSERT INTO salesforce.Drink_Order__c (Flavor__c, Size__c, Price__c) VALUES ($1, $2, $3)',
            [req.body.flavor.trim(), req.body.size.trim(), req.body.price.trim()],
            function(err, result) {
                done();
                if (err) {
                    res.status(400).json({error: err.message});
                } else {
                    // this will still cause jquery to display 'Record updated!'
                    // eventhough it was inserted
                    res.json(result);
                }
            }
        );
    })
});

app.set('port', process.env.PORT || port);
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
