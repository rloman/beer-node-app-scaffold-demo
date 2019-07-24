// bodyparser is een node module die de body van een request kan parsen
// dus die een JSON object kan maken van een String
let bodyParser = require('body-parser');


let service = require('./modules/beer.service');

// de module van node die een http request af kan vangen (dus een server)
let express = require('express');

// de controller is hier een instance van een express();
// je gesprek over het internet (met Postman)
let controller = express();

// nu gaan we de controller 'africhten'

// he controller, jij moet de bodyParser hierboven gebruiken
// want je moet straks json kunnen parsen
controller.use(bodyParser.json());



// he controller, je moet luisteren naar iedeereen,
// en iedereen mag alle methods (POST, GET, PUT en DELETE)
controller.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

// Als er een request binnen komt GET http://localhost:8080/api/beers
controller.get('/api/beers', async function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	let beers = await service.findAll();
	res.end(JSON.stringify(beers));
});

// Als er een request binnen komt POST http://localhost:8080/api/beers
// kennelijk wil ik dan een nieuwe beer creeeren ... 
controller.post('/api/beers', async function (req, res) {
	let beer = req.body;
	let savedBeer = await service.save(beer);

	res.setHeader('Content-Type', 'application/json')
	if (savedBeer) {
		// response end with a string of the created and found beer
		res.status(201).end(JSON.stringify(savedBeer));
	} else {
		// so render the common 404 (Not found)
		res.status(404).end();
	}
});

// Als er een request binnen komt GET http://localhost:8080/api/beers/3
// of een andere nummer aan het einde!!!
controller.get('/api/beers/:id', async function (req, res) {
	let id = +req.params.id
	let beer = await service.findById(id);
	// OK we found one
	if (beer) {
		 res.setHeader('Content-Type', 'application/json')
		//response successful end with a string of the found row
		res.end(JSON.stringify(beer));
	} else {
		// error, we did NOT find one
		res.setHeader('Content-Type', 'application/json')
		// so render the common 404 (Not found)
		res.status(404).end();
	}
});

// Als er een request binnen komt PUT http://localhost:8080/api/beers/3
// of een andere nummber!!!
controller.put('/api/beers/:id', async function (req, res) {
	// First read id from params
	let id = +req.params.id
	let inputBeer = req.body;
	let updatedBeer = await service.updateById(id, inputBeer);
	if (updatedBeer) {
		res.setHeader('Content-Type', 'application/json')
		res.end(JSON.stringify(updatedBeer));
	} else {
		res.setHeader('Content-Type', 'application/json')
		console.log('Not found!!!');
		res.status(404).end();
	}
});

// Als er een request binnen komt DELETE http://localhost:8080/api/beers/3
// of een ander nummer!!!
controller.delete('/api/beers/:id', async function (req, res) {
	let id = +req.params.id;
	let result = await service.deleteById(id);
	if (result) {
		res.status(204).end();// true hence the deletion succeeded
	}
	else {
		res.status(404).end();// false hence the deletion succeeded (204 or 404???)
	}
});

// set correct time zone
process.env.TZ='Europe/Amsterdam';

// and finally ... run the server :-)
let server = controller.listen(8080, function () {
	console.log('Beers app listening at http://%s:%s', server.address().address, server.address().port)
});

