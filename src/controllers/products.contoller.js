import {productDAO} from '../dao/product/index.js'
import { ordersDAO } from '../dao/orders/index.js';

//----------* PRODUCT CONTROLLER *----------//
export const productsController = {
  
  getProductById: async (req, res) => {
    try {
      const pId = parseInt(req.params.pid);
      if(isNaN(pId) ){
        return res.send({description:'Invalid product ID, it must be numerical'})
      }
      const productFound = await productDAO.getById(pId)
      if (!productFound) { 
        res.status(200).send({description: `Product not found.`})
      } else {
        res.status(200).json({description:`Product found`,data:productFound})
      }
    } catch (error) {
      console.warn({class:`productsController`,method:`getProductById: async (req, res)`,description: error})
      res.status(500).json({description: `Internal Server Error,please contact administrator `})
    }
  },
  getProductByType: async (req, res) => {
    try {
      const pId = req.params.type;
      const productsFound = await productDAO.getByType(pId)
      if (!productsFound) { 
        res.status(200).send({description: `Product not found.`})
      } else {
        res.status(200).json({description:`Product found`,data:productsFound})
      }
    } catch (error) {
      console.warn({class:`productsController`,method:`getProductById: async (req, res)`,description: error})
      res.status(500).json({description: `Internal Server Error,please contact administrator `})
    }
  },

  getAllProductList: async (req, res) => {
    try {
      const allProducts = await productDAO.getAll()
      res.status(200).json({description:`All Products Catalog`,data:allProducts})
    } catch (error) {
      console.warn({class:`productsController`,method:`getProductList: async (req, res)`,description: error})
      res.status(500).json({description: `Internal Server Error,please contact administrator `})
    }
  },

  addNewProduct: async (req, res) => {
      try {
        const allProducts = await productDAO.getAll()
        
        const itemProduct = allProducts.find(item => item.code == req.body.code) 
        if(req.body.price){if( isNaN(parseInt(req.body.price)) ||parseInt(req.body.price) < 0){
        req.body.price=0
      }}
      if(req.body.stock){if(isNaN(parseInt(req.body.stock)) ||parseInt(req.body.stock) < 0){
        req.body.stock=1
      }}

        if(typeof (itemProduct) == 'undefined'){

          const getNewId = () => {
            let lastID=0
            if (allProducts && allProducts.length) {
              allProducts.forEach(element => {
                if(element.id>lastID){
                  lastID=element.id
                }
              });
            }
            return Number(lastID) + 1
          }

          const newProduct = { 
            id:  getNewId(),
            timestamp:Date.now(),
            name: req.body.name ? req.body.name : 'No name',
            description: req.body.description ? req.body.description : 'No description',
            code: req.body.code ? req.body.code : crypto.randomUUID(),
            thumbnail: req.body.thumbnail ? req.body.thumbnail : 'No image',
            price: req.body.price ? parseInt( req.body.price ) : 0,
            stock: req.body.stock ? parseInt( req.body.stock ) : 1,
            type: req.body.type ? req.body.type : 'unknown',
          } 
          if(newProduct.name!=='No name'){
          await productDAO.addItem(newProduct)
          res.status(201).json({description:`new product successfully created`,data:newProduct})}
          else{
            res.status(422).json({description:`Name is obligatory, all other fields could be ommited, and edited after, but at leats you should set a valid name for the product`})
          }
        }
        else {  
          res.status(422).json({description: `Product with code ${req.body.code} already exists, product not added, if you weant to modify the stock, price or another field, please use the correct method to update`})
        }
      } 
      catch (error) {
        console.warn({class:`productsController`,method:`addNewProduct: async (req, res)`,description:error})
        res.status(500).json({description: `Internal Server Error,please contact administrator`})        
      }

  },

  updatetProductById: async (req, res) => {

      try {
        const pId = parseInt(req.params.pid)
        if(isNaN(pId) ){
          return res.send({description:'Invalid product ID, it must be numerical'})
        }
        if(req.body.price){if(isNaN(parseInt(req.body.price))||parseInt(req.body.price) < 0){ return res.send({description:'Invalid price, it must be numerical and positive, the product will not be updated'})}}
        if(req.body.stock){if(isNaN(parseInt(req.body.stock))||parseInt(req.body.stock) < 0){ return res.send({description:'Invalid stock, it must be numerical and positive, the product will not be updated'})}}
        const productFound = await productDAO.getById(pId)
        if (!productFound || productFound ==[]) {
          res.status(422).json({ description: 'Product not found.' })
        } else {

          const editedProduct = {
            id:  pId,
            timestamp:Date.now(),
            name: req.body.name ? req.body.name : productFound.name,
            description: req.body.description ? req.body.description : productFound.description,
            code: req.body.code ? req.body.code : productFound.code,
            thumbnail: req.body.thumbnail ? req.body.thumbnail : productFound.thumbnail,
            price: isNaN(parseInt(req.body.price)) ? productFound.price : parseInt(req.body.price),
            stock: isNaN(parseInt(req.body.stock)) ? productFound.stock : parseInt(req.body.stock),
            type: req.body.type ? req.body.type : productFound.type,
          }

          await productDAO.editById(editedProduct,pId)
          res.status(200).json({description:`Product with id=${pId} updated`,editedProduct})
        }
      } catch (error) {
        console.warn({class:`productsController`,method:`updatetProduct: async (req, res)`,description:error})
        res.status(500).json({description: `Internal Server Error,please contact administrator`})        
      }
  },

  updateSoldProductById: async (productId, soldStock, req, res) => {
    try {
      const pId = productId
      if (isNaN(pId)) {
        return res.send({description: 'Invalid product ID, it must be numerical'})
      }
      const productFound = await productDAO.getById(pId)
      if (!productFound || productFound == []) {
        res.status(422).json({description: 'Product not found.'})
      } else {
        const editedProduct = {
          id: pId,
          timestamp: Date.now(),
          name: req.body.name ? req.body.name : productFound.name,
          description: req.body.description ? req.body.description : productFound.description,
          code: req.body.code ? req.body.code : productFound.code,
          thumbnail: req.body.thumbnail ? req.body.thumbnail : productFound.thumbnail,
          price: req.body.price ? parseInt(req.body.price) : productFound.price,
          stock: req.body.stock ? parseInt(req.body.stock) - soldStock : productFound.stock - soldStock,
          type: req.body.type ? parseInt(req.body.type) : productFound.type,
        }
        await productDAO.editById(editedProduct, pId)
      }
    } catch (error) {
      console.warn({class: `productsController`, method: `updatetProduct: async (req, res)`, description: error})
      res.status(500).json({description: `Internal Server Error,please contact administrator`})
    }
  },

  deleteProductById: async (req, res) => {

      try {
        const pId = parseInt(req.params.pid)
        if(isNaN(pId) ){
          return res.send({description:'Invalid product ID, it must be numerical'})
        }
        const productFound = await productDAO.getById(pId)
        
        if (!productFound) {
          res.status(422).json({ description: 'Product not found.' })
        } else {
          await productDAO.deleteById(pId)
          res.status(200).json({ description : `The product with id=${pId} has been removed.`})
        }
      } catch (error) {
        console.warn({class:`productsController`,method:`deleteProduct: async (req, res)`,description:error})
        res.status(500).json({description: `Internal Server Error,please contact administrator`})   
      }
  },

  deleteProductList: async (req, res) => {
    try {
      await productDAO.deleteAll()
      res.status(200).json({ description :`All products have been removed.`})
    } catch (error) {
      console.warn({class:`productsController`,method:`deleteProductList: async (req, res)`,description:error})
      res.status(500).json({description: `Internal Server Error,please contact administrator`})   
    }
  },
  addNewOrder: async (req, res,neworder) => {
    try {
        await ordersDAO.addItem(neworder)
    } 
    catch (error) {
      console.warn({class:`productsController`,method:`addNewProduct: async (req, res)`,description:error})
      res.status(500).json({description: `Internal Server Error,please contact administrator`})        
    }

}

}
export default productsController