import {Router} from 'express'
const router = new Router()
import {productsController} from '../controllers/products.contoller.js'


// Delete Product List, elimina todos los productos registrados

router.delete('/deleteall', productsController.deleteProductList)

// Get Product List & Get Product by ID, en caso de proprocionarse un ID numerico para acceder a un producto, lo regresa, si no se entrega un id, enviara todos los productos y si se entrega un id no numerico se enviara un mensaje de error
router.get('/:pid?', async (req,res)=>{
        if(req.params.pid != undefined) {
            productsController.getProductById(req,res)
        }else{
            productsController.getAllProductList(req,res)
        }
})

// Agrega un nuevo producto
router.post('/',productsController.addNewProduct)
// Modifica los datos de el producto especificado (id numerico)
router.put('/:pid' ,productsController.updatetProductById)
// Delete Product by ID, id numerico
router.delete('/:pid',productsController.deleteProductById)
//Filter products by type
router.get('/type/:type', async (req,res)=>{productsController.getProductByType(req,res)})


export default router; 