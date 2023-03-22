link al proyecto desplegado en railway (solo /login y /chat muestran plantillas (tambien incluye la ruta /chat/:id) siendo id el email a visualizar en el chat): https://railway-lopezlopezernestoeduardo-production.up.railway.app/

Diagrama base Body JSON Postman, para la ruta: /login con el metodo post para iniciar sesion
{
    	"id":"ernesto.lopez.lbm@outlook.com",
    	"password":"1234Ab",
}

Diagrama base Body JSON Postman, para la ruta: /register con el metodo post para registrar un nuevo usuario
{
		"names":"Ernesto",
    	"lastname":"Lopez",
    	"id":"ernesto.lopez.lbm@outlook.com",
    	"password":"1234Ab",
		"passwordconf":"1234Ab",
    	"age":21,
    	"avatar":"asd",
		"CountryCode":"+32",
    	"phone":"234234234",
    	"adress":"asd asdasd asd ",
    	"alias":"ErnestStomp"
}


Diagrama base Body JSON Postman para la ruta: /recover con el metodo post para solicitar un correo para reestableser contraseña
{
	"id":"ernesto.lopez.lbm@outlook.com"
	}
diagrama base Body JSON Postman para la ruta: /restore con el metodo PUT para establecer la nueva contraseña
{
	"password":"asd"
	"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVybmVzdG8ubG9wZXoubGJtQG91dGxvb2suY29tIiwiaWF0IjoxNjc3ODI1MjA0LCJleHAiOjE2Nzc4MjU4MDR9.nwP4nswPlWgXKpDXMJN-9vzPh3J5SFmob2oDfgcj-4Y"
	}

diagrama base Body JSON Postman para la ruta: /deleteaccount el metodo PUT para eliminar la cuenta y su carrito personal
{
	"id":"ernesto.lopez.lbm@outlook.com",
    	"password":"1234Ab",
	}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//las siguientes rutas refieren a los carritos con id autogenerado, asi como para los productos para ellos: 
	cid= id del carro, el cual es un valor numerico
	pid: id del producto que se desea agregar al carrito, tambien es un valor numerico, es el autogenerado a partid de la carga del pokemon
	quantity: cantidad de productos

la ruta /api/carts/ con el metodo GET arroja todos los carritos (unicamente los autogenerados)


la ruta /api/carts/ con el metodo POST generara un carrito con un id automatico, 
si se elimina el carrito, no se recuperara su ID, salvo que este sea el ultimo generado anteriormente

la ruta api/carts/:id con el metodo GET nos muestra la info del carrito que es: 
el id, el timestamp (sin formato) y los productos que tenemos, sin detalles, unicamente, muestra ids y cantidades

la ruta /api/carts/:cid/products con el metodo GET nos mostrara todos los elementos que tenemos en ese carrito con detalle.


Para la ruta /api/carts/:cid/products  con el metodo PUT para agregar un producto con su respectiva cantidad, al carrito seleccionado si no se especifica se agrega 1 por defecto
{
	"pid": 1,
    "quantity":3 (opcional)
}

Para la ruta /:cid/products/:pid con el metodo DELETE nos elimina el producto correspondiente al id del carrito (elimina todos los productos)

Para la ruta /:cid con el metodo DELETE elimina el carrito correspondiente al id



////////////////////////////////////////////////////////////////////////////////////
Diagrama base Body JSON Postman, para la ruta: /api/products con el metodo POST para agregar un nuevo pokemon
el id de cada pokemon se autogenera numericamente (no se implementa el _id de mongo para facilitar su busqueda por ruta)
tecnicamente no es necesario ningun dato, puesto que en caso de faltar, se autoocomplementara con 0 en el caso de precio o stock, y los demas, indicaran que no existe el respectivo campo.
si los campos de price y stock no son enviados como numero, entonces se procedera a definirlos como 0.
si el codigo no es enviado se generara uno automaticamente, pero en caso de que exista otro producto similar los considerara distintos.
{
	"name": "Venasaur N.º002",
	"description": "Este Pokémon nace con una semilla en el lomo, que brota con el paso del tiempo.",
	"code": "15fa3asd3-7c95-4e7f-a90f-ba3a32e3473d",
	"thumbnail": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png",
	"price": 180,
	"stock": 9,
	"type":"grass"
}

para la ruta /api/products/:pid? con el metodo GET nos regresa todos los pokemones si no se especifica el pid
si se especifica, nos regresa el producto especifico

la ruta /api/products/:pid con el metodo PUT edita los datos del producto con el respectivo id
se puede editar cualquier parametetro especifico, no es necesario que se ingresen todos los datos
{
		"name": "Ivysaur N.º002",
		"description": "Cuando le crece bastante el bulbo del lomo, pierde la capacidad de erguirse sobre las patas traseras.",
		"thumbnail": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/002.png",
		"price": 125,
		"stock": 100,
		"type":"grass"
}

la ruta /api/products/:pid con el metodo DELETE elimina el producto con el id especifico

la ruta /api/products/ con el metodo DELETE elimina todos los productos del registro

la ruta /api/carts/:cid/products con el metodo POST realizara un proceso de compra (donde se enviara al correo definido en la variable de entorno el mensaje de la compra)


/////////////////////////////////////////////////////////////////////////////////////////////////////
La ruta /carts/cid con el metodo  GET nos deja ver el carrito del usuario cId, pero en este caso, 
se separa su logica debido a que aqui se utiliza el email como id de usuario, lo mismo ocurre con el resto de las rutas 

/carts/:cid/products con el metodo GET Nos deja ver la lista detallada de los elementos en el carrito
/carts/:cid/products con el metodo PUT agrega un objeto al carrito de acuerdo a la siguiente configuracion, pero si no se envia el quantity
se colcoara 1 en automatico
{
        "pid": 1,
    	"quantity":3 (opcional)
}

       
// Delete Product from Cart
la ruta /:cid/products/:pid' con el metodo delete, elimina un objeto del carrito 

la ruta /carts/:cid/products y la ruta /api/carts/:cid/products con el metodo POST realizaran un proceso de compra, eliminando la cantidad solicitada al stock restante
(donde se enviara al correo del usuario en la variable de entorno el mensaje de la compra)
