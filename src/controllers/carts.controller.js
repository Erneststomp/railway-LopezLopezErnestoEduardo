import {cartDAO} from '../dao/cart/index.js'
import {productDAO} from '../dao/product/index.js'
import { personalCartDAO } from '../dao/cartpersonal/index.js'

export const cartsController = {

  getcartList: async (req, res) => {
    try {
      const allCarts = await cartDAO.getAll()
      res.json(allCarts)
    } catch (error) {
      console.warn({class:`cartsController`,method:`getcartList: async (req, res)`,description: error})
    }
  },

  getCartById: async (req, res) => {
    try {
      const cartId = parseInt(req.params.cid)
      if(isNaN(cartId) ){
        return res.send({description:'Invalid Cart ID, it must be numerical'})
      }
      const cartFound = await cartDAO.getById(cartId)

      if (!cartFound) {
        res.send({ description: 'Cart not found.' })
      } else {
        res.json(cartFound)
      }
    } catch (error) {
      console.warn({class:`cartsController`,method:`getCartById: async (req, res)`,description: error})
    }
  },

  getAllProductListByCartId: async (req, res) => {
    try {
      const cartId = parseInt(req.params.cid)
      let cartFound = await cartDAO.getById(cartId)
      const productFound  = await productDAO.getAll()
      if (!cartFound) {
        return { data: 'error', message:'Cart not found'};
      } else if (!cartFound.products ) {
        return { data: 'error',description:`Cart found, content 0 products.`,data:[]}
      }
      {
        let productTotalPayment = 0;
        let totalProductQuantity = 0; 
        cartFound.products = cartFound.products.map((item) => {
          let productItem = productFound.find((product) => product.id === item.id);
          const editproductItem = {
            _id:productItem._id,
            id: productItem.id,
            timestamp: productItem.timestamp,
            name: productItem.name ? productItem.name : 'No name',
            description: productItem.description ? productItem.description : 'No description',
            code: productItem.code ? productItem.code : 'No code',
            thumbnail: productItem.thumbnail ? productItem.thumbnail : 'no Image',
            price: productItem.price ? parseInt(productItem.price) : 0,
            stock: productItem.stock ? parseInt(productItem.stock) : 0,
          };
  
          productTotalPayment = parseInt(productItem.price) * parseInt(item.quantity);
          totalProductQuantity += item.quantity;
          return productItem ? { ...editproductItem, quantity: item.quantity, productTotalPayment: productTotalPayment } : item;
        });
        const totalProductPayment = cartFound.products.reduce((total, item) => total + (item.productTotalPayment || 0), 0);
        return { data: cartFound.products, totalPayment: totalProductPayment, totalQuantity: totalProductQuantity };
      }
    } catch (error) {
        console.warn({class:`cartsController`,method:`getAllProductListToByCartId: async (req, res)`,description: error})
        res.status(500).json({description: `Internal Server Error,please contact administrator `})
    }
  },
  addNewCart: async (req, res) => {
    try {
      
      const allCarts = await cartDAO.getAll()
      const getNewId = () => {
        let lastID = 0
        if (allCarts && allCarts.length) {
          lastID = allCarts[allCarts.length - 1].id
        }
        return Number(lastID) + 1
      }

      const newCart = {
        id: getNewId(),
        timestamp:Date.now(),
        products: [],
      }
      await cartDAO.addItem(newCart)
      res.status(200).json({description:`new cart successfully created with id=${newCart.id}`,data:newCart})

    } catch (error) {
      console.warn({class:`cartsController`,method:`addNewCart: async (req, res)`,description: error})
      res.status(500).json({description: `Internal Server Error,please contact administrator `})
    }
  },
  

  addProductToCart: async (req, res) => {
    try {
      const cId = parseInt(req.params.cid)
      let pId = parseInt(req.body.pid)
      if(!req.body.pid){
        return res.send({description:'You must send a product id (numerical)'})
      } 
      const pquantity =  req.body.quantity ? parseInt(req.body.quantity) : 1
      if(isNaN(pId) || isNaN(pquantity)||isNaN(cId)){
        return res.send({description:'Invalid parameters, pid, cid and quantity must be numerical (if quantity is not send, or invalid, 1 will be set by default)'})
      }

      const cartFound = await cartDAO.getById(cId)
      if(!cartFound){
        return res.status(422).json({ description: `Cart ${cId} not found.` })
      }
      pId=req.body.pid
      const productFound = await productDAO.getById(pId)
      if(!productFound){
        return res.status(422).json({ description: `Product ${pId} not found.` })
      }
      else if(pquantity<1){
        return res.status(422).json({ description: 'Quantity must be greater than 0.' })
      }
      else if (productFound.stock == 0 ){
        return res.status(422).json({ description: `Product stock not found.` })
      }
      else if(productFound.stock < pquantity){
        return res.status(422).json({ description: 'insufficient stock.' })
      } 
      const productsInCartsFound = cartFound.products
      let ProductItemInCarts = productsInCartsFound.find(item=> item.id === productFound.id)

      if(!ProductItemInCarts){
        const newProduct = {
          id: productFound.id,
          quantity: pquantity,
        }
        if(ProductItemInCarts){
          if(productFound.stock < pquantity+cartFound.products[0].quantity){
            return res.status(422).json({ description: 'insufficient stock.' })
          } 
        }
        cartFound.products.push(newProduct)
        await cartDAO.editById(cartFound,cId)
        return res.status(200).json({description:`Product ${pId} added to cart ${cId} successfully.`,data:cartFound})
        
      }

      else {

        let { stock, ...itemRest } = productFound;
        stock = stock - pquantity
        itemRest.timestamp = Date.now()
        await productDAO.editById({...itemRest,stock},cId)
        cartFound.timestamp = Date.now()
        cartFound.products = cartFound.products.map( item => item.id !== productFound.id ? item : {...item, quantity: item.quantity + pquantity} )
        await cartDAO.editById(cartFound,cId)

        return res.status(200).json({description: `(${pquantity}) unid(s) of (${productFound.id}) - ${productFound.name} added successfully in Cart.`,data:cartFound})
      }

    }catch (error) {
      console.warn({class:`cartsController`,method:`addProductToCart: async (req, res)`,description: error})
      res.status(500).json({description: `Internal Server Error,please contact administrator `})
    }
  },
  
  deleteProductToCartById: async (req, res) => {
    try {
      const cId = parseInt( req.params.cid )
      let pId = parseInt( req.params.pid )
      if(isNaN(pId) || isNaN(cId)){
        return res.send({description:'Invalid parameters, cid y pid must be numerical'})
      }
      pId =  req.params.pid;
      const cartFound = await cartDAO.getById(cId)
      if(!cartFound){
        return res.status(422).json({ description: `Cart ${cId} not found.` })
      }

      const productFound = await productDAO.getById(pId)
      if(!productFound){
        return res.status(422).json({ description: `Product ${pId} not found.` })
      }
      else{
        cartFound.timestamp = Date.now()
        cartFound.products = cartFound.products.filter( item => item.id != pId )
        cartFound.products = cartFound.products.filter( item => item.id != productFound.id )
        await cartDAO.editById(cartFound,cId)
        return res.status(200).json({description: `Producto : (${productFound.id}) - ${productFound.name} was removed from your cart.`,data:cartFound})
      }
 
    } catch (error) {
      console.warn({class:`cartsController`,method:`deleteProductToCartById: async (req, res)`,description: error})
      res.status(500).json({description: `Internal Server Error,please contact administrator `})
    }
  },
  deleteProductToCartByIdAfterpurchase: async (req, res,productId,cid) => {
    try {
      let cartFound={}
      const cId = cid
      cartFound = await cartDAO.getById(cId)

      for (const pId of productId) {
        cartFound.products = await cartFound.products.filter( item => item.id !== pId )
        await cartDAO.editById(cartFound,cId)
      }

    } catch (error) {
      console.warn({class:`cartsController`,method:`deleteProductToCartById: async (req, res)`,description: error})
      res.status(500).json({description: `Internal Server Error,please contact administrator `})
    }
  },


  deleteCartById: async (req, res) => {
    try {
      const cartId = parseInt(req.params.cid)
      const cartFound = await cartDAO.getById(cartId)
      if(isNaN(cartId)){
        return res.send({description:'Invalid Cart ID, it must be numerical'})
      }
      if (!cartFound) {
        res.status(422).json({ description: 'Cart not found.' })
      } else {
        await cartDAO.deleteById(cartId)
        res.status(200).json({ description : `The cart with id=${cartId} has been removed.`})
      }
    } catch (error) {
      console.warn({class:`cartsController`,method:`deleteCartById: async (req, res)`,description: error})
      res.status(500).json({description: `Internal Server Error,please contact administrator `})
    }
  },
  //Estas dos fucniones son automaticas, al crear al usuario y se identificarn por el id, en este caso el correo, no regresan nada.
  addNewCartPersonal: async (req, id) => {
    try {
      const newCart = {
        id: id,
        timestamp:Date.now(),
        products: [],
      }
      await personalCartDAO.addItem(newCart)
     
    } catch (error) {
      console.warn({class:`cartsController`,method:`addNewCart: async (req, res)`,description: error})
       }
  },
  deletePersonalCartById: async (id) => {
    try {
      let result=await personalCartDAO.deletePersonalById(id)
    } catch (error) {
      console.warn({class:`cartsController`,method:`deleteCartById: async (req, res)`,description: error})
    }
  },
  //Estas funciones si se llaman a partir del router, de igual modo estan ligadas al id que seria el correo de cada usuario
  getPersonalCartById: async (req, res) => {
    try {
      const cartId = req.params.cid
      const cartFound = await personalCartDAO.getPersonalById(cartId)
      if (!cartFound) {
        res.send({ description: `Cart not found. There is not user registered as: ${cartId} `})
      } else {
        res.json(cartFound)
      }
    } catch (error) {
      console.warn({class:`cartsController`,method:`getCartById: async (req, res)`,description: error})
    }
  },
  addProductToPersonalCart: async (req, res) => {
    try {
      const cId = req.params.cid
      let pId = parseInt(req.body.pid)
      const pquantity =  req.body.quantity ? parseInt(req.body.quantity) : 1
      if(!req.body.pid){
        return res.send({description:'You must send a numerical product id (pid)'})
      }
      if(isNaN(pId) || isNaN(pquantity)){
        return res.send({description:'Invalid parameters, pid and quantity must be numerical (if quantity is not send, it will be set 1 by default)'})
      }
      const cartFound = await personalCartDAO.getPersonalById(cId)
      if(!cartFound){
        return res.status(422).json({ description: `Cart ${cId} not found.` })
      }
      pId=req.body.pid
      const productFound = await productDAO.getById(pId)
      if(!productFound){
        return res.status(422).json({ description: `Product ${pId} not found.` })
      }
      else if(pquantity<1){
        return res.status(422).json({ description: 'Quantity must be greater than 0.' })
      }
      else if (productFound.stock == 0 ){
        return res.status(422).json({ description: `Product stock not found.` })
      }
      else if(productFound.stock < pquantity){
        return res.status(422).json({ description: 'insufficient stock.' })
      } 
      const productsInCartsFound = cartFound.products
      const ProductItemInCarts = productsInCartsFound.find(item=> item.id === productFound.id)
     
      if(!ProductItemInCarts){
        const newProduct = {
          id: productFound.id,
          quantity: pquantity,
        }
        if(ProductItemInCarts){
          if(productFound.stock < pquantity+cartFound.products[0].quantity){
            return res.status(422).json({ description: 'insufficient stock.' })
          } 
        }
        cartFound.products.push(newProduct)
        await personalCartDAO.editById(cartFound,cId)
        return res.status(200).json({description:`Product ${pId} added to cart ${cId} successfully.`,data:cartFound})
        
      }

      else {

        let { stock, ...itemRest } = productFound;
        stock = stock - pquantity
        itemRest.timestamp = Date.now()
        await productDAO.editById({...itemRest,stock},cId)
        cartFound.timestamp = Date.now()
        cartFound.products = cartFound.products.map( item => item.id !== productFound.id? item : {...item, quantity: item.quantity + pquantity} )
        await personalCartDAO.editById(cartFound,cId)

        return res.status(200).json({description: `(${pquantity}) unid(s) of (${productFound.id}) - ${productFound.name} added successfully in Cart.`,data:cartFound})
      }

    }catch (error) {
      console.warn({class:`cartsController`,method:`addProductToCart: async (req, res)`,description: error})
      res.status(500).json({description: `Internal Server Error,please contact administrator `})
    }
  },
  
  deleteProductToPersonalCartById: async (req, res) => {
    try {
      const cId = req.params.cid 
      let pId = parseInt( req.params.pid )
      if(!req.body.pid){
        return res.send({description:'You must send a product id (numerical)'})
      }
      if(isNaN(pId)){
        return res.send({description:'Invalid Product ID, it must be numerical'})
      }
      const cartFound = await personalCartDAO.getPersonalById(cId)
      if(!cartFound){
        return res.status(422).json({ description: `Cart ${cId} not found.` })
      }
      pId =  req.params.pid;
      const productFound = await productDAO.getById(pId)
      if(!productFound){
        return res.status(422).json({ description: `Product ${pId} not found.` })
      }
      else{
        cartFound.timestamp = Date.now()
        cartFound.products = cartFound.products.filter( item => item.id !== pId )
        cartFound.products = cartFound.products.filter( item => item.id != productFound.id )
        await personalCartDAO.editById(cartFound,cId)
        return res.status(200).json({description: `Producto : (${productFound.id}) - ${productFound.name} was removed from your cart.`,data:cartFound})
      }

    } catch (error) {
      console.warn({class:`cartsController`,method:`deleteProductToCartById: async (req, res)`,description: error})
      res.status(500).json({description: `Internal Server Error,please contact administrator `})
    }
  }, 
  getAllProductListByPersonalCartId: async (req, res) => {
    try {
      const cartId = req.params.cid;
      let cartFound = await personalCartDAO.getPersonalById(cartId);
      const productFound = await productDAO.getAll();
  
      if (!cartFound) {
        return res.status(422).json({ description: 'Cart not found.' });
      } else if (!cartFound.products) {
        return res.status(200).json({ description: `Cart found, content 0 products.`, data: [] });
      } else {
        let productTotalPayment = 0;
        let totalProductQuantity = 0; 
        cartFound.products = cartFound.products.map((item) => {
          let productItem = productFound.find((product) => product.id === item.id);
          const editproductItem = {
            _id: productItem._id,
            id: productItem.id,
            timestamp: productItem.timestamp,
            name: productItem.name ? productItem.name : 'No name',
            description: productItem.description ? productItem.description : 'No description',
            code: productItem.code ? productItem.code : 'No code',
            thumbnail: productItem.thumbnail ? productItem.thumbnail : 'no Image',
            price: productItem.price ? parseInt(productItem.price) : 0,
            stock: productItem.stock ? parseInt(productItem.stock) : 0,
          };
  
          productTotalPayment = parseInt(productItem.price) * parseInt(item.quantity);
          totalProductQuantity += item.quantity;
          return productItem ? { ...editproductItem, quantity: item.quantity, productTotalPayment: productTotalPayment } : item;
        });
        const totalProductPayment = cartFound.products.reduce((total, item) => total + (item.productTotalPayment || 0), 0);
        return { data: cartFound.products, totalPayment: totalProductPayment, totalQuantity: totalProductQuantity };
      }
    } catch (error) {
      console.warn({ class: `cartsController`, method: `getAllProductListToByCartId: async (req, res)`, description: error });
      res.status(500).json({ description: `Internal Server Error,please contact administrator ` });
    }
  },
  deleteProductToCartAfterpurchase: async (req, res,productId,cId) => {
    try {
          const cartFound = await personalCartDAO.getPersonalById(cId)
          for (const pId of productId) {
            cartFound.products = await cartFound.products.filter( item => item.id !== pId )
            await personalCartDAO.editById(cartFound,cId)
          }

    } catch (error) {
      console.warn({class:`cartsController`,method:`deleteProductToCartById: async (req, res)`,description: error})
      res.status(500).json({description: `Internal Server Error,please contact administrator `})
    }
  }, 

}

export default cartsController
