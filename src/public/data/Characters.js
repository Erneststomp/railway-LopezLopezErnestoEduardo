import KnexContainer from '../../options/myknex/My_knex.js';
import config from '../../options/mariaDB.js';
let database = new KnexContainer(config, 'characters')

const Characters = {
  createProductsTable: async() => {
    try {
        database = new KnexContainer(config, 'characters')
        await database.createTable()
    } catch (error) {
      console.log({Server: error})
    }
  }, 

  getAllProduct: async () => {
    try {
      database = new KnexContainer(config, 'characters')      
      const allProducts = await database.getAll()
      if(typeof allProducts !== 'undefined')
        return allProducts.sort((a, b) => (a.id > b.id ? -1 : 1)) 
      else 
        return []
    } catch (error) {
      console.log({Server: error})
    }
  },

  addNewProduct: async (product) => {
    try {
      database = new KnexContainer(config, 'characters')            
      const prevProducts = await database.getAll()
      const newProduct = {
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
      }
      console.log('newProduct')
      console.log(newProduct)
      database = new KnexContainer(config, 'characters')         
      await database.save(newProduct)
    } catch (error) {
      console.log({Server: error})
    }
  },
} 

export default Characters;

