const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

app.use(express.static('build'));
app.use(bodyParser.json({ type: 'text/plain'}));

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

app.get('/api/films', async function (req, res) {
	let cursor = await db.collection('films').find({});

	let data = [];
	while(await cursor.hasNext()) {
		cursor.hasNext(async () => {
			data.push(await cursor.next());
		});
	}
	res.json(data);
});

MongoClient.connect(
  'mongodb://munderwoods:' + process.env.MONGO_PASS + '@ds155086.mlab.com:55086/duangchan',
   {
     reconnectTries: Number.MAX_VALUE,
     reconnectInterval: 1000
   },
  (err, client) => {
    if (err) return console.log(err);
    db = client.db('duangchan');
    console.log("Connected to database: " + db.s.databaseName);
});

app.listen(port, () => console.log(`Listening on port ${port}`));

