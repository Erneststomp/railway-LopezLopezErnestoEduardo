import {Router} from 'express'
const router = Router()
import {cartsController} from '../controllers/carts.controller.js'
import config from '../models/config/config.js'
import MailingService from "../service/mailing.js";
import userService from '../public/users.js';
import Handlebars from 'handlebars';
import fs from 'fs';
import __dirname from '../utils.js';
import path from 'path';
import isAutenticated from '../middleware/isautenticated.js'
import {productsController} from '../controllers/products.contoller.js'
import validator from 'validator';

// Get Cart by ID, regresa el contenido del carrito generado con la creacion de la cuenta
router.get('/:cid', isAutenticated, async (req, res) => {
  const id = req.params.cid;
  if (!validator.isEmail(id)) {
    return res.status(400).json({ status: 'error', message: 'Invalid email' });
  }
  let user = await userService.findOne({ id: id });
  if (!user) {
    return res.send({ status: 'error', error: 'There is no user with this email, please verify or register' });
  }
  cartsController.getPersonalCartById(req, res);
});

// Get Cart Product List, regresa todos los elementos del carrito, pero en este caso con todos los datos detalaldos.
router.get('/:cid/products/', isAutenticated, async (req, res) => {
  const id = req.params.cid;
  if (!validator.isEmail(id)) {
    return res.status(400).json({ status: 'error', message: 'Invalid email' });
  }
  let user = await userService.findOne({ id: id });
  if (!user) {
    return res.send({ status: 'error', error: 'There is no user with this email, please verify or register' });
  }
  const DetailedCart = await cartsController.getAllProductListByPersonalCartId(req, res);
  return res.status(200).json({ description: `Cart Found`, DetailedCart });
});

// Add Product to Cart, se agregan los productos al carrito especifico, en este caso, cid corresponde al email de la cuenta, pues el carrito se genera con el id del email
router.put('/:cid/products', isAutenticated, async (req, res) => {
  const id = req.params.cid;
  if (!validator.isEmail(id)) {
    return res.status(400).json({ status: 'error', message: 'Invalid email' });
  }
  let user = await userService.findOne({ id: id });
  if (!user) {
    return res.send({ status: 'error', error: 'There is no user with this email, please verify or register' });
  }
  cartsController.addProductToPersonalCart(req, res);
});

// Delete Product from Cart, se elimina un producto especifico del carrito personal.
router.delete('/:cid/products/:pid', isAutenticated, async (req, res) => {
  const id = req.params.cid;
  if (!validator.isEmail(id)) {
    return res.status(400).json({ status: 'error', message: 'Invalid email' });
  }
  let user = await userService.findOne({ id: id });
  if (!user) {
    return res.send({ status: 'error', error: 'There is no user with this email, please verify or register' });
  }
  cartsController.deleteProductToPersonalCartById(req, res);
});
//Buy the content of the cart, en este caso se simula la compra de los productos del carrito.
router.post('/:cid/products/',isAutenticated, async(req,res)=>{
    try {
      //se obtienen los elementos del carrito
        const id=req.params.cid;
        if (!validator.isEmail(id)) {
          return res.status(400).json({ status: 'error', message: 'Invalid email' });
        }
        //se  busca que efectivamente el carrito exista, otro caso, alerta que no existe
        let user=await userService.findOne({id:id})
        if(!user) return res.send({status:"error",error:"There is no user with this email, please verify or register"})
        const DetailedCart = await cartsController.getAllProductListByPersonalCartId(req,res)
        const restoreURL=config.url.mainurl
        //se llama a nodemailer
        const mailer = new MailingService();
        //se crea un template para que el contenido del email que se enviara, contenga los detalles de los productos que se compraran
        const cartTemplate = Handlebars.compile(fs.readFileSync(path.resolve(__dirname, 'views', 'cart-template.handlebars'), 'utf8'));
        const html = cartTemplate({
            cartItems: DetailedCart.data,
            totalQuantity: DetailedCart.data.reduce((total, item) => total + item.quantity, 0),
            totalPayment: DetailedCart.totalPayment
          });
        //se envia el email al dueño del carrrito
        let result = await mailer.sendSimpleMAil({
            from: process.env.EMAIL_ADDRESS,
            to: id, 
            subject:'Purchase confirmation',
            html: html
          }); 

          //se realiza una llamada a modificar el stock de cada producto una vez que se genere la compra.
          DetailedCart.data.forEach(async (product) => {
            try {
              let productId=product.id;
              let soldStock=product.quantity;
              await productsController.updateSoldProductById(productId, soldStock, req, res)
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