const express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const mongoose = require('mongoose');
const Models = require('./models.js');
const morgan = require('morgan');
const app = express();

const Movies = Models.movies;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlparser: true,
useUnifiedToplogy: true});

app.use(morgan('common'));

//request list of all movies
app.get('/movies', (req, res) => {
  Movies.find().then((movies) => {
    res.status(201).json(movies);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send("Error " + error)
  });
});
//request sending back message
app.get('/information', (req, res) => {
  res.send('You have chosen an excellent selection of movies!')
});

//request displaying the documentation
app.use(express.static('public/documentation.html'));

//request data about a genre
app.get('/Genre/:Name', (req, res) => {
  Genres.findOne({ Name: req.params.Name })
    .then((genre) => {
      res.json(genre);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error " + error)
    });
});

//request displaying information about the director
app.get('/Director/:Name', (req, res) => {
  Director.findOne({ Name: req.params.Name })
    .then((director) => {
      res.json(director);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error " + error)
    });
});

//request data about a specific movie by title
app.get('/movies/:Title', (req, res) => {
  movies.findOne({ Title: req.params.Title })
    .then((movies) => {
      res.json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error " + error);
    });
});

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
