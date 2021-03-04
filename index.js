const express = require('express');
morgan = require('morgan');

const app = express();

app.use(morgan('common'));

const topMovies = [
  {
    title: 'The Green Book',
    director: 'Peter Farrelly'
  },
  {
    title:'Rouge One: A Star Wars Story',
    director:'Gareth Edwards'
  },
  {
    title:'The Book of Eli',
    director:'Albert Hughes, Allen Hughes'
  },
  {
    title:'Saving Private Ryan',
    director:'Steven Spielberg'
  },
  {
    title:'Defience',
    director:'Edward Zwick'
  },
  {
    title:'Tron:Legacy',
    director:'Joseph Kosinski'
  },
  {
    title:'Bridge of Spies',
    director:'Steven Spielberg'
  },
  {
    title:'Darkest Hour',
    director:'Joe Wright'
  },
  {
    title:'Moonrise Kingdom',
    director:'Wes Anderson'
  },
  {
    title:'War Horse',
    director:'Steven Spielberg'
  }
];

//get Requests
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/', (req, res) => {
  res.send('You have chosen an excellent selection of movies!')
});

app.use(exrpress.static('public/documentation.html'));

app.use((err, req, res, next) => {
  consol.error(err.stack);
  res.status(500).send('Well, that esclated quickly.')
});

//Listen for requests
app.listen(8080, () => {
  console.log('This app is is on port 8080.');
});
