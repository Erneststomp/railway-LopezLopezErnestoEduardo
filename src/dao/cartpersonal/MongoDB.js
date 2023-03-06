import MongoDBContainer from '../../middleware/api/MongoDBContainer.js'

export class PCartDAOMongoDB extends MongoDBContainer {
    constructor() {
        super('cartsPersonal', {
            id: { type: String, required: true },
            timestamp: {type: Number, required: false },
            products: { type: Array, required: false },
        })
    }
}

export default PCartDAOMongoDB