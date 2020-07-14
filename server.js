var express = require('express');
var exphbs = require('express-handlebars');

var app = express();
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.get(['/home', '/'], function (req, res, next) {
    res.render('home',{
      oscillator: false,
    instrument: false
    });
});

app.get('/oscillators', function (req, res, next) {
  res.render('oscillator', {
    oscillator: true,
    instrument: false
  });

});
app.get('/instruments', function (req, res, next) {
    res.render('instrument',{
      instrument: true,
      oscillator: false
    });
  
});
app.get('/tools', function (req, res, next) {
  res.render('tool');

});
app.get('/about', function (req, res, next) {
  res.render('about');

});
app.get('*', function (req, res, next) {
    res.render('404');
    res.status(404);
  
  });

app.listen(port, function () {
    console.log("== Server is listening on port", port);
});
