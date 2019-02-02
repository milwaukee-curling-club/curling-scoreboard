const PORT = process.env.PORT || 80 

var fontColor = '#eeeeee';
var fs = require('fs');
var storage = require('node-storage');
var store = new storage('./mcc.db');
var express = require("express");
var app = express()
app.set('view engine', 'ejs');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('assets'))

// if the store is empty, reset the database
function isEmpty(map) {
    for (var key in map) {
        return !map.hasOwnProperty(key);
    }
    return true;
}

if (isEmpty(store.store)) {
    resetmatch();
}

app.listen(PORT, '0.0.0.0', function () {
 console.log("Listening on port " + PORT);
});

// Display IP address
var os = require('os');

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}
console.log('Connect your web browser to ' + addresses);
// End Get IP

app.get('/', function (request, response) {
    if (request.query.reset == 'yes') {
        resetmatch();
    }

    response.render(
        'form',
        {
            games: store.get('games'),
            matchName: store.get('matchName'),
            drawName: store.get('drawName')
        }
    );
});

app.get('/scoreboard.json', function (request, response) {
    sheetIndex = request.query.sheetNumber - 1

    response.json(
        Object.assign(
            store.get('games')[sheetIndex],
            {
                matchName: store.get('matchName'),
                drawName: store.get('drawName')
            }
        )
    )
})

app.get('/scoreboard', function (request, response) {
  response.render('scoreboard');
  response.end();
})

app.post('/', function (request, response) {
    store.put('games', request.body.games)
    store.put('matchName', request.body.matchName)
    store.put('drawName', request.body.drawName);

  response.render('form',
      { 
          games: store.get('games'),
          matchName:store.get('matchName') ,
          drawName: store.get('drawName'), 
	}
  );

  response.end();
});


function resetmatch() {
    store.put('matchName', 'Match Name')
    store.put('drawName', 'Draw Name')

    const defaultGame = {
        primary: false,
        red: {
            name: 'Red Team',
            score: 0
        },
        yellow: {
            score: 0,
            name: 'Yellow Team'
        },
        end: 0,
        hammer: 'red'
    }

    let defaultGames = []

    for(let i = 0; i < 5; i++) {
        defaultGames[i] = defaultGame;
    }

    store.put(
        'games',
        defaultGames
    )
}
