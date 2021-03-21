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
app.delete('/Users/:Favoritemovies', (req, res) => {
  Users.findOneAndRemove({Favoritemovies: req.params.Name })
    .then((favoritemovies) => {
      if (!favortiemovies) {
        res.status(400).send(req.params.Favoritemovies + ' was not found.');
      } else {
        res.status(200).send(req.params.Favoritemovies + ' was deleted.');
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error " + error);
   });
});

//allow a user to update their username.
app.put('/users/:Username', (req,res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set:
        {
          Username: req.body.Username,
          Password: req.body.Paswword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,

        }
       },
     {new: true }, // this line makes sure that the updated documetn is returned
     (error, updtatedUser) => {
       if(error) {
         console.error(error)
         res.status(500).send('Error: ' + error);
       } else {
         res.json(updatedUser);
       }
     });
  });

//allows a new user to register
app.post('/users', (req, res) =>{
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists')
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Paswword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: '+ error);
         });
       }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: '+ error);
    });
});    


//allow a user to deregister.
app.delete('/users/:username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then ((user) => {
      if(!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted');
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: '+ error);
    });
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
