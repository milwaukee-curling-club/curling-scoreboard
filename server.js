// npm install express --save
// npm install body-parser --save
// npm install node-storage --save

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

  response.render('form',
    { 
	  matchname:store.get('matchname') ,
	  drawname: store.get('drawname'), 
	  redscore: store.get('redscore'), 
	  yelscore: store.get('yelscore'), 
	  redname: store.get('redname'), 
	  yelname: store.get('yelname'), 
	  end: store.get('end'),
      hammer: store.get('hammer')
	});
  });

app.get('/scoreboard.json', function (request, response) {
  response.json({
    match_name: store.get('matchname'),
    draw_name: store.get('drawname'),
    red_team: {
      skip_name: store.get('redname'),
      score: store.get('redscore')
    },
    yellow_team: {
      skip_name: store.get('yelname'),
      score: store.get('yelscore')
    },
      end: store.get('end') == 'FF' ? 'Final' : 'End ' + store.get('end'),
      hammer: store.get('hammer')
  })
})

app.get('/scoreboard', function (request, response) {
  response.render('scoreboard');
  response.end();
})

app.post('/', function (request, response) {
	store.put('matchname',request.body.matchname);
	store.put('drawname',request.body.drawname);
	store.put('redscore',request.body.redscore);
	store.put('yelscore',request.body.yelscore);
	store.put('redname',request.body.redname);
	store.put('yelname',request.body.yelname);
    store.put('end',request.body.end);
    store.put('hammer', request.body.hammerChoice);
  response.render('form',
    { 
        matchname:store.get('matchname') ,
        drawname: store.get('drawname'), 
        redscore: store.get('redscore'), 
        yelscore: store.get('yelscore'), 
        redname: store.get('redname'), 
        yelname: store.get('yelname'), 
        end: store.get('end'),
        hammer: store.get('hammer')
	}
  );

  response.end();
});

app.listen(80, '0.0.0.0', function () {
 console.log('Listening on 80');
});

function resetmatch() {
	store.put('matchname','Enter Match Name');
	store.put('drawname','Enter Draw Name');
	store.put('redscore','0');
	store.put('yelscore','0');
	store.put('redname','Enter Red Name');
	store.put('yelname','Enter Yellow Name');
	store.put('end','0');
}
