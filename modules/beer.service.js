class Service {

	constructor() {
		this.repository=require('./beer.repository');
	}

	async findAll() {
		return await this.repository.findAll();
	}

	 async save(beer) {

		return await this.repository.create(beer);
	}

	async findById(id) { // be aware: returns a Promise

		 return await this.repository.findById(id);
	}

	async updateById(id, data) {
		return await this.repository.updateById(id, data);
	}

	async deleteById(id) {

		return await this.repository.deleteById(id);
	}

}

module.exports = new Service();
