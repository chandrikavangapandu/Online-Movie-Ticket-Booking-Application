const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 

mongoose.connect('mongodb://127.0.0.1:27017/cinema', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connection to MongoDB successful');
  })
  .catch((err) => {
    console.error('Connection to MongoDB failed:', err);
  });

const movieSchema = new mongoose.Schema({
  moviename: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  oneticketcost: {
    type: Number,
    required: true,
  },
  tickets: {
    type: Number,
    required: true,
  },
  theater:{
    type:String,
    required: true,
  },
  starring: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});

const Movie = mongoose.model('cinemas', movieSchema);

const movies = [
  {
    moviename: 'RRR',
    starring: 'Ramcharan, NTR, Alia Bhatt, Olivia Morris',
    director: 'S.S.Rajamouli',
    language: 'Telugu,Tamil,Hindi',
    rating: 8.5,
  },
  {
    moviename: 'ORANGE',
    starring: "Ram Charan, Genelia D'Souza",
    director: 'Bhaskar',
    language: 'Telugu',
    rating: 6.6,
  },
  {
    moviename: 'ROBO',
    starring: 'Rajinikanth, Aishwarya Rai',
    director: 'S.Shankar',
    language: 'Telugu,Tamil',
    rating: 7.1,
  },
  {
    moviename: 'KGF',
    starring: 'Yash, Sanjay Dutt',
    director: 'Prashanth Neel',
    language: 'Kannada,Telugu',
    rating: 8.2,
  },
  {
    moviename: 'BAAHUBALI',
    starring: 'Prabhas, Rana Daggubati, Anushka Shetty, Tamanna',
    director: 'S.S.Rajamouli',
    language: 'Telugu,Tamil,Hindi',
    rating: 8.0,
  },
  {
    moviename: '96',
    starring: 'vijay sethupathi,trisha',
    director: ' Prem Kumar.',
    language: 'Telugu,Tamil',
    rating: 5.0,
  }
];
 
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/movie.html');
});

app.post('/login', (req, res) => {
  var movieName = req.body.Name;
  console.log(req.body.Name);
  console.log(req.body.Time);
  console.log(req.body.Cost);
  console.log(req.body.Ticket);
  console.log(req.body.theater);
  
  const movie = movies.find((movie) => movie.moviename === movieName);

  if (movie) {
    const movieData = {
      starring: movie.starring,
      director: movie.director,
      language: movie.language,
      rating: movie.rating,
    };
    var data = {
      moviename: req.body.Name,
      time: req.body.Time,
      oneticketcost: req.body.Cost,
      tickets: req.body.Ticket,
      theater:req.body.theater,
      starring: movieData.starring,
      director: movieData.director,
      language: movieData.language,
      rating: movieData.rating,
    };

    const m = new Movie(data);
    m.save()
      .then((info) => {
        const htmlResponse = `
          <html>
            <head>
            <style>
            .main {
               margin-top:200px;
               height: 350px;
               width: 450px;
               border: black;
               background-color:pink;
               text-align: left;
               color: #08438E;
               font-size: 20;
               padding: 15px;
               margin: 20px;
              }
            </style>
            <script>
              var Totalamount = ${req.body.Ticket * req.body.Cost};
            </script>
            </head>
            <body>
              <center>
              <div class="main">
              <table cellpadding="3" margin="auto">
              <tr>
              <td>Moviename:</td>
              <td>${req.body.Name}</td>
              <tr>
              <td>Time:</td>
              <td>${req.body.Time}</td>
              </tr>
              <tr>
              <td>One Ticket Cost:</td>
              <td>${req.body.Cost}</td>
              </tr>
              <tr>
              <td>No.Tickets:</td>
              <td>${req.body.Ticket} </td>
              </tr>
              <tr>
              <td>theater:</td>
              <td>${req.body.theater} </td>
              </tr>
              <tr>
              <td>Total Amount:</td>
              <td><script>document.write(Totalamount);</script></td>
              </tr>
              <tr>
                <td>Starring:</td>
                <td>${movieData.starring}</td>
              </tr>
              <tr>
                <td>Director:</td>
                <td>${movieData.director}</td>
              </tr>
              <tr>
                <td>Language:</td>
                <td>${movieData.language}</td>
              </tr>
              <tr>
                <td>Rating:</td>
                <td>${movieData.rating}</td>
              </tr>
              </table>
            </body>
          </html>
        `;
        res.send(htmlResponse);
      })
      .catch((err) => {
        console.error('Failed to save movie data:', err);
        res.send('<html><body><p>Failed to save movie data</p></body></html>');
      });
  } else {
    res.send('<html><body><p>No movie found with the given name</p></body></html>');
  }
});
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
