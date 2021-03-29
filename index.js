const express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const mongoose = require('mongoose');
const Models = require('./models.js');
const morgan = require('morgan');
const app = express();
const passport = require('passport');
require('./passport');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlparser: true,
useUnifiedToplogy: true });

app.use(morgan('common'));
app.use(bodyParser.json());

let auth = require('./auth')(app);
//request list of all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/movies/Genres/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      if (movie) {
      res.json(movie.Genre);
    } else {
      return res
         .status(400)
         .send('No such genre')
    }
  })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error " + error)
    });
});

//request displaying information about the director
app.get('/movies/Director/:Name', (req, res) => {
  Movies.findOne({ "Director.Name": req.params.Name })
    .then((movie) => {
      if (movie) {
      res.json(movie.Director);
    } else {
      return res
         .status(400)
         .send('No movie Director');
    }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error " + error)
    });
});
//request data about a specific movie by title
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movies) => {
      res.json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error " + error);
    });
});

//allow user to remove a movie from their favorites list
app.delete('/users/:Username/Movies/:movieID', (req, res) => {
  Users.findOne({ _id: req.params.Username }, function (err, user) {
      if (user) {
        if (!list.includes(req.params.MovieID)) {
          return res
            .status(400)
            .send('No movie matching that ID in the Favourites list');
        } else {
          //add to favorites
          Users.findOneAndUpdate(
            { _id: req.params.Username },
            {
              $pull: { FavoreiteMovies: req.params.MovieID },
            },
            {new: true }
          )
           .then(function (updateUser) {
             res
               .status(200)
               .json(
                 'movie with id' + req.params.MovieID +
                  ' was successfully deleted. Updated Favorites list [' +
                  updatedUser.FavoreiteMovies +
                  ']'
               );
           })
           .catch(function(err) {
             console.error(err);
             res.status(500).send('Error: ' + error);
           });
      }
    } else {
      consle.error(error);
      res.satus(500).send ('Error: ' + error);
    }
});

//allow a user to update their username.
app.put('/users/:Username', (req,res) => {
  User.findOneAndUpdate({ Username: req.params.Username }, {
    $set:
        {
          Username: req.body.Username,
          Password: req.body.Passwword,
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
})
//allows a new user to register
app.post('/user', (req, res) =>{
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists')
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
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

//pull one user
app.get('/user/:Username', (req, res) => {
Users.findOne({ Username: req.params.Username })
.then ((user) =>{
  res.json(user);
})
.catch((error) => {
  console.error(error);
  res.status(500).send('Error: '+ error);
});
});

//allow a user to deregister.
app.delete('/user/:Username', (req, res) => {
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
app.post('/users/:Username/Movies/:MovieID',(req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoreiteMovies: req.params.MovieID }
  },
  { new: true },// this line makes sure that the updated document is returned
  (error, updatedUser) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error '+ error);
    } else {
      res.json(updateUser);
    }
  });
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
