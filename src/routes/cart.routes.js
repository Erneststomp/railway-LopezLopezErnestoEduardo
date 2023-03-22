import {Router} from 'express'
const router = Router()
import {cartsController} from '../controllers/carts.controller.js'
import MailingService from "../service/mailing.js";
import Handlebars from 'handlebars';
import fs from 'fs';
import __dirname from '../utils.js';
import path from 'path';
import productsController from '../controllers/products.contoller.js';
// Get Cart List, muestra todos los carritos que hay, en este caso son carritos generados por ruta, no son los carritos personales, estos no estan protegidos pro inicio de sesion
//todos los cId son numericos aqui, pues son generados con un iD numerico
router.get('/', cartsController.getcartList)
// Create New Cart
router.post('/', cartsController.addNewCart)
// Get Cart by ID
router.get('/:cid', cartsController.getCartById)
// Add Product to Cart
router.put('/:cid/products', cartsController.addProductToCart)          
// Delete Product from Cart
router.delete('/:cid/products/:pid', cartsController.deleteProductToCartById)
// Delete Card by ID
router.delete('/:cid', cartsController.deleteCartById)
// Get Cart Product List
router.get('/:cid/products/', async(req,res)=>{
  const cid = req.params.cid;
  if (isNaN(cid)) {
    return res.status(400).json({ status: 'error', message: 'The cid parameter must be a number' });
  }
      const DetailedCart = await cartsController.getAllProductListByCartId(req,res)
      if(DetailedCart.data=='error'){
        return res.status(422).json({description:`error`,DetailedCart})
      }else{
        return res.status(200).json({description:`Cart Found`,DetailedCart})
      }
  })
//Buy the content of the cart, al igual que el carrito personal, enviara un correo con la lista de lso productos comprados, inluyendo la cantidad total de articulos y el precio total, en este caso ya que no es a traves de un id, se envian al email del adminsitrados
//que se encuentra en las variables de enotrno
router.post('/:cid/products/', async(req,res)=>{
    try {
        const cid = req.params.cid;
        if (isNaN(cid)) {
          return res.status(400).json({ status: 'error', message: 'The cid parameter must be a number' });
        }
        const DetailedCart = await cartsController.getAllProductListByCartId(req,res)
        if(DetailedCart.data=='error'){
          return res.status(422).json({description:`error`,DetailedCart})
        }
        const id=process.env.EMAIL_ADDRESS;
        const mailer = new MailingService();
        const cartTemplate = Handlebars.compile(fs.readFileSync(path.resolve(__dirname, 'views', 'cart-template.handlebars'), 'utf8'));
        const html = cartTemplate({
            cartItems: DetailedCart.data,
            totalQuantity: DetailedCart.data.reduce((total, item) => total + item.quantity, 0),
            totalPayment: DetailedCart.totalPayment
          });
        let result = await mailer.sendSimpleMAil({
            from: process.env.EMAIL_ADDRESS,
            to: id, 
            subject:'Purchase confirmation',
            html: html
          });
          let fecha=new Date();
          const neworder={
            useremail:'email@fake.com',
            username:'Test Name',
            userphone:'Testh Phone',
            adress:'Test Adress',
            date:fecha.toUTCString(),
            items:DetailedCart
          }
          productsController.addNewOrder(req,res,neworder)
          DetailedCart.data.forEach(async (product) => {
            try {
              let productId=product.id;
              let soldStock=product.quantity;
              await productsController.updateSoldProductById(productId, soldStock, req, res)
              await cartsController.deleteProductToCartByIdAfterpurchase(req,res,productId,cid)
            } catch (error) {
              console.warn({class:`productsController`,method:`updatetProduct: async (req, res)`,description:error})
              res.status(500).json({description: `Internal Server Error,please contact administrator`})
            }
          }) 

        res.send({status:'success',message:"Your pourchase has been processed, verify your email"})
    } catch (error) {
      console.warn({class:`cartsController`,method:`getAllProductListToByCartId: async (req, res)`,description: error})
      res.status(500).json({description: `Internal Server Error,please contact administrator `,error:error})
    }
  })


export default router;   