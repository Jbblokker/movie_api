const express = require('express');
morgan = require('morgan');
uuid = require('uuid');

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

//request list of all movies
app.get('/movies', (req, res) => {
  res.json(topMovies);
});
//request sending back message
app.get('/information', (req, res) => {
  res.send('You have chosen an excellent selection of movies!')
});

//request displaying the documentation
app.use(express.static('public/documentation.html'));

//request data about a genre
app.get('/title', (req, res) => {
  res.send('Successfully received data on a genre. ');
});

//request displaying infromation about the director
app.get('/movies/:director', (req, res) => {
  res.send('SUccessfully retreived information about a specific director.');
});

//request data about a specific movie by title
app.get('/movies/:name', (req, res) => {
  res.send('successfully retreived movie by title.');
});
//   res.json(movie.find((movie) =>
//     { return movies.name === req.params.name}));
// });

//allow useer to remove a movie from their favorites list
app.delete('/movies/:favorites', (req, res) => {
  res.send('Successfully deleted request on removing movie from favorites list.');
});

//allow a user to update their username.
app.put('/update/:users', (req,res) => {
  res.send('Users information has successfully been updated.');
});
//   let users = users.find((user)=> {return user.username
//   === req.parmas,name});
//
// if (users) {
//   users.name[req.params.username] = parseInt(req.params.name);
//   res.status(201).send('users name has been updated form ' + req.params.name+ 'with new name of '
// + req.params.name);
// } else {
//   res.status(404).send('username ' + req.params.username + 'was not found')
// }
// });

//allows a new user to register
app.post('/users', (req, res) =>{
  res.send('user has successfully been added!');
});
//   let newUsers = req.body;
//
//   if(!newUser.username) {
//     const message = 'missing name in request body';
//     res.status(400).send (message);
//   }else{
//     newUser.username = uuid.v4();
//     users.push(newUser);
//     res.status(201).send(newUser);
//   }
// });

//allow a user to deregister.
app.delete('/users/:username', (req, res) => {
  res.send('User has successfully been deleted.')
});

//allow user to add movie to their favorites list
app.post('/movies/:favorites',(req, res) => {
  res.send('You have successfully added a movie to your favorites list.')
});


//error message
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Well, that esclated quickly.');
});


//Listen for requests
app.listen(8080, () => {
  console.log('This app is is on port 8080.');
});
