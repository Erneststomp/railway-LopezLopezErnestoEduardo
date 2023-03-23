import MongoDBContainer from '../../middleware/api/MongoDBContainer.js'
import { Schema } from 'mongoose'

export class ProductDAOMongoDB extends MongoDBContainer {
    constructor() {
        super('products', {
            id: { type: Schema.Types.Mixed, required: true },
            timestamp: {type: Number, required: true },
            name: { type: String, required: true },
            description: { type: String, required: true },
            code: { type: String, required: true },
            thumbnail: { type: String, required: false },
            price: { type: Number, required: true },
            stock: { type: Number, required: true },
            type: { type: String, required: true },
        })
    }
}
// timestamp: {type: Timestamp, required: true },

export default ProductDAOMongoDB
