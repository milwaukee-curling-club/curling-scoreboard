// npm install express --save
// npm install body-parser --save
// npm install node-storage --save

var storage = require('node-storage');
var store = new storage('./mcc.db');
var express = require("express");
var app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

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
  response.writeHead(200, {"Content-Type": "text/html"});
  if (request.query.reset == 'yes') {
	resetmatch();
  }

  if (request.query.showform != 'no') {
	writeHeader(response);
	writeScore(response);
	writeForm(response);
  }  else {
    writeCanvas(response);
  }
  response.write('</body></html>');
  response.end();
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
    end: store.get('end') == 'FF' ? 'Final' : 'End ' + store.get('end')
  })
})

app.get('/scoreboard', function (request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  writeCanvas(response);
  response.write("<script> \
    setInterval(function() { \
      var request = new XMLHttpRequest(); \
      request.open('GET', '/scoreboard.json', true); \
      request.onload = function() { \
      if (request.status >= 200 && request.status < 400) { \
        console.log(request.responseText); \
        scoreboard = JSON.parse(request.responseText); \
        var c = document.getElementById('myCanvas'); \
        var ctx=c.getContext('2d'); \
        ctx.clearRect(0, 0, 540, 320); \
        ctx.font='bold 37px Verdana'; \
        ctx.fillStyle='black'; \
        ctx.textAlign = 'left'; \
        ctx.fillText(scoreboard.red_team.score + ' ' + scoreboard.red_team.skip_name, 170, 180); \
        ctx.fillText(scoreboard.yellow_team.score + ' ' + scoreboard.yellow_team.skip_name, 170, 250); \
        ctx.font='bold 34px Verdana'; \
        ctx.fillStyle='white'; \
        ctx.fillText(scoreboard.end, 280, 305); \
        ctx.font='bold 30px Verdana'; \
        ctx.textAlign = 'center'; \
        ctx.fillText(scoreboard.match_name, 250, 50); \
        ctx.fillText(scoreboard.draw_name, 250, 90); \
      console.log(request.responseText); \
        var resp = request.responseText; \
        } else { \
        console.log('An error occurred!'); \
       }; \
       }; \
    request.onerror = function() { \
      console.log('An error occurred...'); \
    }; \
    request.send(); \
    }, 5 * 1000); \
    </script> \
    ")
})

app.post('/', function (request, response) {
	store.put('matchname',request.body.matchname);
	store.put('drawname',request.body.drawname);
	store.put('redscore',request.body.redscore);
	store.put('yelscore',request.body.yelscore);
	store.put('redname',request.body.redname);
	store.put('yelname',request.body.yelname);
	store.put('end',request.body.end);
  response.writeHead(200, {"Content-Type": "text/html"});
  writeHeader(response);
  writeScore(response);
  writeForm(response);
  response.write('</body></html>');
  response.end();
});

app.listen(8080, '0.0.0.0', function () {
 console.log('Listening on 8080');
});

function writeHeader(response) {
response.write('<html>' +
'<head>' +
'<meta name="viewport" content="width=device-width, initial-scale=1">' +
'<link rel="stylesheet" href="https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css">' +
'<script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>' +
'<script src="https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>' +
'<style>body {font-family: Verdana, Arial;}</style>' +
'</head><body>'
);
}

function writeCanvas(response) {
if (store.get('end')=='FF') {
  strEnd = 'Final' } 
  else 
  {strEnd = 'End ' + store.get('end') }


response.write('<html><head>></head>' +
'<body><canvas id="myCanvas" width="540" height="320" ' +
'style="border:0px solid #d3d3d3; background-color">' +
'\nYour browser does not support the HTML5 canvas tag.</canvas>' +
'\n<script>' +
'\nvar c=document.getElementById("myCanvas");' +
'\nvar ctx=c.getContext("2d");' +
'\nctx.font="bold 37px Verdana";' +
'\nctx.fillStyle="black";' +
'\nctx.fillText("' + store.get('redscore') + ' ' + store.get('redname') + '",170,180);' +
'\nctx.fillText("' + store.get('yelscore') + ' ' + store.get('yelname') + '",170,250);' +
'\nctx.font="bold 34px Verdana";' +
'\nctx.fillStyle="white";' +
'\nctx.fillText("' + strEnd + '",280,305);' +
'\nctx.font="bold 30px Verdana";' +
'\nctx.textAlign="center";' +
'\nctx.fillText("' + store.get('matchname') + '",250,50);' +
'\nctx.textAlign="center";' +
'\nctx.fillText("' + store.get('drawname') + '",250,90);' +
'\n</script>'
);
}

function writeScore(response) {
response.write('<table id="myTable" width="90%" ' +
'style="border:0px solid #d3d3d3;padding: 0px; margin: 0px; font-size: 24px;">' +
'<tr><td colspan="2"><b>' + store.get('matchname') + '</b></td></tr>' +
'<tr><td colspan="2"><b>' + store.get('drawname') + '</b></td></tr>' +
'<tr style="background-color:#e10101; color: white;"><td>' + store.get('redscore') + '</td><td>' + store.get('redname') + '</td></tr>' +
'<tr style="background-color:#dfdf01; color: white;"><td>' + store.get('yelscore') + '</td><td>' + store.get('yelname') + '</td></tr>' +
'<tr><td colspan="2">' + store.get('end') + ' End</td></tr>' +

'</table>'
);
}

function writeForm(response) {
response.write('<div style="margin: 10px;"><form action="./" method="post" data-ajax="false">' +
'\n  <input type="submit" value="Submit"><br />' +
'\n  ' + store.get('redname') + ' Score:' + 
'   <select name="redscore" id="redscore">' +
    '  <option value="0">0</option>' +
	'  <option value="1">1</option>' +
	'  <option value="2">2</option>' +
	'  <option value="3">3</option>' +
	'  <option value="4">4</option>' +
	'  <option value="5">5</option>' +
	'  <option value="6">6</option>' +
	'  <option value="7">7</option>' +
	'  <option value="8">8</option>' +
	'  <option value="9">9</option>' +
	'  <option value="10">10</option>' +
	'  <option value="11">11</option>' +
	'  <option value="12">12</option>' +
	'  <option value="13">13</option>' +
	'  <option value="14">14</option>' +
	'  <option value="15">15</option>' +
   '</select>' +
'\n  ' + store.get('yelname') + ' Score: ' + 
'   <select name="yelscore" id="yelscore">' +
    '  <option value="0">0</option>' +
	'  <option value="1">1</option>' +
	'  <option value="2">2</option>' +
	'  <option value="3">3</option>' +
	'  <option value="4">4</option>' +
	'  <option value="5">5</option>' +
	'  <option value="6">6</option>' +
	'  <option value="7">7</option>' +
	'  <option value="8">8</option>' +
	'  <option value="9">9</option>' +
	'  <option value="10">10</option>' +
	'  <option value="11">11</option>' +
	'  <option value="12">12</option>' +
	'  <option value="13">13</option>' +
	'  <option value="14">14</option>' +
	'  <option value="15">15</option>' +
   '</select>' +
'\n  End: ' +
'   <select name="end" id="end">' +
    '  <option value="0">0</option>' +
	'  <option value="1">1</option>' +
	'  <option value="2">2</option>' +
	'  <option value="3">3</option>' +
	'  <option value="4">4</option>' +
	'  <option value="5">5</option>' +
	'  <option value="6">6</option>' +
	'  <option value="7">7</option>' +
	'  <option value="8">8</option>' +
	'  <option value="9">9</option>' +
	'  <option value="10">10</option>' +
	'  <option value="FF">Final</option>' +
   '</select><br />' +
'<input type="text" name="redname"  value="' + store.get('redname') + '"><br>' +
'<input type="text" name="yelname"  value="' + store.get('yelname') + '"><br>' +
'\n  Match name: <input type="text" name="matchname" value="' + store.get('matchname') + '"><br>' +
'\n  Draw name: <input type="text" name="drawname" value="' + store.get('drawname') + '"><br>' +
'\n  <input type="submit" value="Submit"><br />' +
'\n  </form></div>' +
'\n <a href="/?reset=yes">Reset Match</a><br />' +
'\n <p>To show only the score: querystring    /?showform=no</p>' +
'\n<script>' +
'\n$("#redscore").val(\'' + store.get('redscore') + '\');' +
'\n$("#yelscore").val(\'' + store.get('yelscore') + '\');' +
'\n$("#end").val(\'' + store.get('end') + '\');' +
'\n</script>'
);
}

function resetmatch() {
	store.put('matchname','Enter Match Name');
	store.put('drawname','Enter Draw Name');
	store.put('redscore','0');
	store.put('yelscore','0');
	store.put('redname','Enter Red Name');
	store.put('yelname','Enter Yellow Name');
	store.put('end','0');

}
