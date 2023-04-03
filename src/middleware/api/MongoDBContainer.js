import mongoose from 'mongoose'
const dbConnection = mongoose.connection
dbConnection.on('error', (error) => console.log(`Connection error: ${error}`))
dbConnection.once('open', () => console.log('Connected to DB!'))

//Control de MongoDB
export class MongoDBContainer {
    constructor(collectionName, schema) {
    this.collection = mongoose.model(collectionName, schema)
    }
    //busqueda de elemento dentro de la respectiva coleccion por ID numerico
    getById = async (id) => {
        try {
            let itemFound = await this.collection.findOne({ id: Number(id) },{_id:0})
            if(!itemFound){
                itemFound = await this.collection.findOne({ _id: id })
            }
            return itemFound
        } catch (error) {
            console.warn({class:`class MongoDBContainer`, method:`getById= async(id)`,description:error})
            throw new Error(error);
        }
    }
    //busqueda de elemento dentro de la respectiva coleccion por tipo
    getByType = async (type) => {
        try {
            const itemsFound = await this.collection.find({ type: type });
            return itemsFound
        } catch (error) {
            console.warn({class:`class MongoDBContainer`, method:`getById= async(id)`,description:error})
            throw new Error(error);
        }
    }

    //busqueda de todos los elementos dentro de la coneccion
    getAll = async () =>{
        try {
            const allItems = await this.collection.find({})
            return allItems
        } catch (error) {
            console.warn({class:`class MongoDBContainer`, method:`getAll= async()`,description:error})
            throw new Error(error);
        }
    }

    //se agrega un item a la coleccion
    addItem = async (object)=> {
        try {
            await this.collection.create(object)
        } catch (error) {
            console.warn({class:`class MongoDBContainer`, method:`addItem= async(object)`,description:error})
            throw new Error(error);
        }
    }
    //se edita un objeto dentro de la respectiva coleccion con un id
    editById = async ({id ,...object}) => {
        try {
            let response=await this.collection.updateOne(
            {
                id: id,
            },
            { $set: object }
            )
            console.log(response)
        } catch (error) {
            console.warn({class:`class MongoDBContainer`, method:`editById= async(object) `,description:error})
            throw new Error(error);
        }
    }
    //eliminacioin de elemento dentro de la coleccion con un ID numerico
    deleteById = async (id) => {
    try {
        let itemFound = await this.collection.findOne({ id: Number(id) },{_id:0})
        if(!itemFound){
            itemFound = await this.collection.findOne({ _id: id })
        }

        if (itemFound && itemFound.length) {
        await this.collection.deleteOne({
            id: id,
        })
        return true
        } else {
            return false
        }
    } catch (error) {
        console.warn({class:`class MongoDBContainer`, method:`deleteById= async(idNumber)`,description:error})
        throw new Error(error);
    }
    }
    //Los siguientes dos tienen el mismo funcionamiento que sus omologos sin el personal, ya que se mantienen sus logicas separadas para, los objetos (carts y productos) con id numerico, como los que tienen id en base a un string (e mail en este caso)
    deletePersonalById = async (id) => {
        try {
            const itemFound = await this.collection.find({id: id })
    
            if (itemFound && itemFound.length) {
            await this.collection.deleteOne({
                id: id,
            })
            return true
            } else {
                return false
            }
        } catch (error) {
            console.warn({class:`class MongoDBContainer`, method:`deleteById= async(idNumber)`,description:error})
            throw new Error(error);
        }
        }
    
    getPersonalById = async (id) => {
            try {
                const itemFound = await this.collection.findOne({ id: id })
                return itemFound
            } catch (error) {
                console.warn({class:`class MongoDBContainer`, method:`getById= async(id)`,description:error})
                throw new Error(error);
            }
        }
//Se eliminan todos los datos dentro de la coleccion
    deleteAll = async () => {
    try {
        await this.collection.deleteMany({})
    } catch (error) {
        console.warn({class:`class MongoDBContainer`, method:`deleteAll= async()`,description:error})
        throw new Error(error);
    }
    }

    
}

//----------* EXPORTS CLASS *----------//
export default MongoDBContainer
