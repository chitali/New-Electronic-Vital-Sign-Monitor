var express = require('express');
var exphbs = require('express-handlebars');

var app = express();
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.get(['/home', '/'], function (req, res, next) {
    res.render('home');
});

app.get('/oscillator', function (req, res, next) {
  res.render('oscillator');

});
app.get('/instrument', function (req, res, next) {
    res.render('instrument',{
      instrument: true
    });
  
});
app.get('*', function (req, res, next) {
    res.render('404');
    res.status(404);
  
  });

app.listen(port, function () {
    console.log("== Server is listening on port", port);
});
