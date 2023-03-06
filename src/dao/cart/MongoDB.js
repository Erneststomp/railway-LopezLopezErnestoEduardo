import MongoDBContainer from '../../middleware/api/MongoDBContainer.js'

export class CartDAOMongoDB extends MongoDBContainer {
    constructor() {
        super('carts', {
            id: { type: Number, required: true },
            timestamp: {type: Number, required: false },
            products: { type: Array, required: false },
        })
    }
}

export default CartDAOMongoDB