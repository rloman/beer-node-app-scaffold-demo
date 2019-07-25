let mysql = require('mysql');
const util = require('util');

class Repository {

	constructor() {
		// create a MySQL connection
		this.connection = mysql.createConnection({
			host: 'localhost', 
			database: 'pub', 
			user: 'rloman', 
			password: 'poedel'
		});
		this.connection.connect(function (err) {
			if (err) {
				throw err;
			} else {
				console.log('Connected!');
			}
		});
		this.connection.query = util.promisify(this.connection.query); // Magic happens here.
	}

	// used private!!!
	async query(sql, args) {
		// dit is niet altijd rows, loman, soms ook een object met affectedRows of zo
		// en loman, zie je ook dat deze private method nergens wordt gebruikt???
		// dus ik zeg. weg ermee. in ieder ggeval in de scafoolder.
		let resultPacket = await this.connection.query(sql, args);

		return resultPacket;
	}


	async findAll() {
		let beers = await this.connection.query('select * from beers');

		return beers;
	}

	async create(beer) {
		let rowResult = await this.connection.query("insert into beers set ?", [beer]);
		let id = rowResult.insertId;
		beer.id=id;

		return beer;
	}


	async findById(id) { // be aware: returns a Promise
		// this SHOULD be one row(s) but we have to handle it like there might be more ... 
		let rows = await this.connection.query("select * from beers where id='?'", [id]);
		let beer = rows[0];
		if (beer) {
			return beer;
		}
		else {
			return false;
		}
	}

	async updateById(id, data) {
		let resultPacket = await this.connection.query('update beers set name=?, alcoholPercentage=? where id=?', [data.name, data.alcoholPercentage, id]);
		if (resultPacket.affectedRows) {
			console.log(resultPacket.affectedRows);
			// fetch the new trip after updating!!!
			console.log("in repository:: found")
			let updatedBeer = await this.findById(id);
			return updatedBeer;

		}
		else {
			return null; // ugly
		}
	}

	async deleteById(id) {
		let result = await this.connection.query("delete from beers where id='?'", id);

		return result.affectedRows === 1;
	}

}
module.exports = new Repository();
