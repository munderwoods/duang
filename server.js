const dotenv = require('dotenv').config();
const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;
const host = process.env.PORT || 'localhost';
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

app.use(express.static('build'));
app.use(bodyParser.json({ type: 'text/plain'}));

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/api/user-rating', (req, res) => {
  db.collection('films').findOneAndUpdate(
    {_id: ObjectId(req.body.id)},
    { $push: {userRating: {rating: req.body.userRating, review: req.body.userReview}}},
		{returnNewDocument: true},
		(err, doc) => {
			if(err) {
				console.log('Error: ');
				console.log(err);
				res.send(err);
			} else {
				console.log('Success: ');
				console.log(doc);
				res.send(doc);
			}
		}
  )
});

app.get('/api/trailer', (req, res) => {
  youtubeUrl = `https://www.googleapis.com/youtube/v3/search?maxResults=1&q=${req.query.name+'trailer Jackie Chan'}&type=video&key=${process.env.YOUTUBE_API_KEY}`
  promise = new Promise((resolve, reject) => {
    request(youtubeUrl, function (error, response, body) {
      if(response.statusCode === 403) {
        res.send('fail');
      }
      json = JSON.parse(body);
      if(json.items) {
        resolve({trailerId: json.items[0].id.videoId});
      }
    })
  });

  promise
    .then(x => {
      res.send(x);
    })
    .catch(err => {
      res.send(err);
    })
});

app.get('/api/films', async function (req, res) {
	let cursor = await db.collection('films').find({}).sort({ year: 1});

	let movieData = [];
	while(await cursor.hasNext()) {
		cursor.hasNext(async () => {
			movieData.push(await cursor.next());
		});
	}

  let promises = [];
  movieData.forEach(async (movie, i) => {
    url = `https://api.themoviedb.org/3/movie/${movie.movieDbId}?api_key=${process.env.MOVIE_DB_API_KEY}`
    promises.push(new Promise((resolve, reject) => {
      request(url, function (error, response, body) {
        if(error) reject(error);
        json = JSON.parse(body);
        if(json != undefined) {
          movieData[i].image = `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${json.poster_path}`;
          if(json.backdrop_path) {
            movieData[i].backdrop = `https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces${json.backdrop_path}`;
          } else {
            movieData[i].backdrop = '/half.jpg';
          }
          movieData[i].movieDbScore = json.vote_average;
        } else {
          movieData[i].image = '';
        }
        resolve();
      });
    }));
  })
  Promise.all(promises)
    .then(() => {
      res.json(movieData);
    })
    .catch(err => {
      console.log(err);
    })
});

MongoClient.connect(
  'mongodb+srv://jc:' + process.env.MONGO_PASS + '@duangchan.0tr9z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
   {
     reconnectTries: Number.MAX_VALUE,
     reconnectInterval: 1000
   },
  (err, client) => {
    if (err) return console.log(err);
    db = client.db('duangchan');
    console.log("Connected to database: " + db.s.databaseName);
});

app.listen(port, host, () => console.log(`Listening on port ${port}, host: ${host}`));

