const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// Set the port as process PORT in heroku
// In local environment PORT will be 3000
const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (error) => {
    if (error) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});

// In case of the system is on maintenance
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    content: 'Some dynamic content'
  })
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.get('/bad', (req, res) => {
  var badObj = {
    code: 501,
    name: 'Internal Server Error'
  };
  res.send(badObj);
});

app.get('/contact', (req, res) => {
  res.render('contact.hbs', {
    pageTitle: 'Contact Page',
    phone: '081276065691',
    address: 'Jakarta'
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
