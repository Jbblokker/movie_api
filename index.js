const express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const mongoose = require('mongoose');
const Models = require('./models.js');
const morgan = require('morgan');
const app = express();
const passport = require('passport');
require('./passport');
const cors  = require('cors');
const Movies = Models.Movie;
const Users = Models.User;
const { check, validationResult } = require('express-validator');


mongoose.connect('mongodb://localhost:27017/test', {useNewUrlparser: true,
useUnifiedToplogy: true });

app.use(morgan('common'));
app.use(bodyParser.json());
//CORS
app.use(cors());
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  orgin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){//if a specific origin isn't found on the list
    // of a allowed origins
      let message = 'The CORS policy for this application does not allow access form this origin ' + origin;
         return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

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
app.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send('You have chosen an excellent selection of movies!')
});

//request displaying the documentation
app.use(express.static('public/documentation.html'));

//request data about a genre
app.get('/movies/Genres/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/movies/Director/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movies) => {
      res.json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error " + error);
    });
});

//allow user to remove a movie from their favorites listapp.delete(
app.delete('/users/:username/movies/:movieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.username },
        { $pull: { FavoreiteMovies: req.params.movieID } },
        { new: true },
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });

//allow a user to update their username.
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req,res) => {
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
app.post('/user',
  [
    check('Username', 'Username is required').isLength({min:5}),
    check('Username', 'Username condtains non alphanumeric characters - not allowed.')
  .isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ],
  (req, res) =>{

    //check the validation ovject for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

  let hashedPassword = hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })//search to see if a user with the requested username already exists
    .then((user) => {
      if (user) {
        //if the user is found, send a response that it already exists
        return res.status(400).send(req.body.Username + 'already exists')
      } else {
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
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
app.get('/user/:Username', passport.authenticate('jwt', { session: false }),  (req, res) => {
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
app.delete('/user/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.post('/users/:Username/movies/:movieID',  passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoreiteMovies: req.params.movieID }
  },
  { new: true },// this line makes sure that the updated document is returned
  (error, updatedUser) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error '+ error);
    } else {
      res.json(updatedUser);
    }
  });
});


//error message
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Well, that esclated quickly.');
});


//Listen for requests on specific ports
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
  console.log('Listening on Port ' + port);
});
