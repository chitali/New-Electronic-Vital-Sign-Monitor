var express = require('express');
var exphbs = require('express-handlebars');

var app = express();
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.get(['/home', '/'], function (req, res) {
    res.render('home',{
      oscillator: false,
    instrument: false
    });
});

app.get('/oscillators', function (req, res) {
  res.render('oscillator', {
    oscillator: true,
    instrument: false
  });

});
app.get('/instruments', function (req, res) {
    res.render('instrument',{
      instrument: true,
      oscillator: false
    });
  
});
app.get('/about', function (req, res) {
  res.render('about');

});
app.get('*', function (req, res) {
    res.render('404');
    res.status(404);
  
  });

app.listen(port, function () {
    console.log("== Server is listening on port", port);
});
