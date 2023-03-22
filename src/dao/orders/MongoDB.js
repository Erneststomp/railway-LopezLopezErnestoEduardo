import MongoDBContainer from '../../middleware/api/MongoDBContainer.js'

export class OrderDAOMongoDB extends MongoDBContainer {
    constructor() {
        super('orders', {
            useremail: { type: String, required: true },
            username: {type: String, required: true},
            userphone: { type: String, required: true },
            adress: {type: String, required: true },
            date: {type: String, required: true },
            items: { type: Object, required: true },
        })
    }
}

export default OrderDAOMongoDB