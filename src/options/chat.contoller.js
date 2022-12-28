import {productDAO} from './index.js'

export const productsController = {
  
  getAllMessages: async (req, res) => {
    try {
      const allProducts = await productDAO.getAll()
      res.status(200).json({description:`All Products Catalog`,data:allProducts})
    } catch (error) {
      console.warn({class:`productsController`,method:`getProductList: async (req, res)`,description: error})
      res.status(500).json({description: `Internal Server Error,please contact administrator `})
    }
  },


  addNewMessage: async (req, res) => {

      try {
        const allProducts = await productDAO.getAll()
        
        const itemProduct = allProducts.find(item => item.code == req.body.code) 

        if(typeof (itemProduct) == 'undefined'){

          const getNewId = () => {
            let lastID = 0
            if (allProducts && allProducts.length) {
                lastID = allProducts[allProducts.length - 1].id
            }
            return Number(lastID) + 1
          }

          const newProduct = { 
            id:  getNewId(),
            timestamp:Date.now(),
            name: req.body.name ? req.body.name : 'No name',
            description: req.body.description ? req.body.description : 'No description',
            code: req.body.code ? req.body.code : crypto.randomUUID(),
            thumbnail: req.body.thumbnail,
            price: req.body.price ? parseInt( req.body.price ) : 0,
            stock: req.body.stock ? parseInt( req.body.stock ) : 0,
          }

          await productDAO.addItem(newProduct)
          res.status(201).json({description:`new product successfully created`,data:newProduct})
        }
        else {  
          res.status(422).json({description: `Product with code ${req.body.code} already exists, product not added.`})
        }
      } 
      catch (error) {
        console.warn({class:`productsController`,method:`addNewProduct: async (req, res)`,description:error})
        res.status(500).json({description: `Internal Server Error,please contact administrator`})        
      }

  },

}
export default productsController