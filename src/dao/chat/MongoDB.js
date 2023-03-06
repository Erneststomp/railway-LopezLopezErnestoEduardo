import MongoDBContainer from '../../middleware/api/MongoDBContainer.js'

export class chatDAOMongoDB extends MongoDBContainer {
    constructor() {
        super('chat', {
            user: { type: String, required: true },
            message: { type: String, required: true },
            date: { type: String, required: true },
        })
    }
}

export default chatDAOMongoDB
