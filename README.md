# Proyecto E-commerce Backend

Puedes acceder al proyecto desplegado en Railway a través de este enlace: https://railway-lopezlopezernestoeduardo-production.up.railway.app/
 
## Rutas con Socket.io

### Página de chat, mostrando plantillas
Ruta: /chat 

### Página para visualizar mensajes del chat para un usuario específico, donde id es el correo electrónico del usuario.
Ruta: /chat/:id 

El proyecto cuenta con una verificación de inicio de sesión en la ruta base /. 
Si el usuario no ha iniciado sesión, será redirigido a la página de inicio de sesión. De lo contrario, será redirigido a la ruta /api/products.
(es la misma verificacion para borrar a un usuario o entrar al chat, pero se implementa diferente, ya que para estos casos, enviara la advertencia de que debe loguearse en lugar de redirigir al login, se implmenta asi, para diferenciar que al tratar de acceder a una ruta restringida, debe iniciar sesion y no se confunda con una redireccion erronea)

## API de sesion
### Inicio de sesion
Ruta: /login - Método: POST

Descripcion: Inicia sesión en la aplicación.
(si ya se inicio sesion envia a /api/products)
Ejemplo de formato de body JSON en Postman:

	{
		"id": "ernesto.lopez.lbm@outlook.com",
		"password": "1234Ab"
	}

### Registro
Ruta: /register - Método: POST

Descripcion: Registra un nuevo usuario en la aplicación y lo inicia sesión automáticamente.
Ejemplo de formato de body JSON en Postman:

	{
		"names":"Ernesto",
		"lastname":"Lopez",
		"id":"ernesto.lopez.lbm@outlook.com",
		"password":"1234Ab",
		"passwordconf":"1234Ab",
		"age":21,
		"avatar":"http://asd.asd.asd",
		"CountryCode":"+32",
		"phone":"234234234",
		"adress":"asd asdasd asd ",
		"alias":"ErnestStomp"
	}

### Recuperacion de contraseña
Ruta: /recover - Método: POST

Descripcion: Solicita un correo para restablecer la contraseña.
Ejemplo de formato de body JSON en Postman:

	{
		"id":"ernesto.lopez.lbm@outlook.com"
	}

### Seteo de nueva contraseña
Ruta: /restore - Método: PUT

Descripcion:  Establece una nueva contraseña para el usuario solicitado en recover.
Ejemplo de formato de body JSON en Postman:

	{
		"password": "asd",
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVybmVzdG8ubG9wZXoubGJtQG91dGxvb2suY29tIiwiaWF0IjoxNjc3ODI1MjA0LCJleHAiOjE2Nzc4MjU4MDR9.nwP4nswPlWgXKpDXMJN-9vzPh3J5SFmob2oDfgcj-4Y"
	}

### Eliminacion de cuenta
Ruta: /deleteaccount - Método: PUT

Descripcion: Elimina una cuenta y su carrito personal.
Ejemplo de formato de body JSON en Postman:

	{
		"id": "ernesto.lopez.lbm@outlook.com",
		"password": "1234Ab"
	}


## API de carritos autogenerados (se refiere a los que no son los carritos generados con la creacion del usuario)

Las siguientes rutas refieren a los carritos con id autogenerado, así como para los productos para ellos:

	-cid: id del carro, el cual es un valor numérico.
	-pid: id del producto que se desea agregar al carrito, también es un valor numérico, es el autogenerado a partir de la carga del pokemon.
	-quantity: cantidad de productos.

### Obtener todos los carritos 
Ruta: /api/carts/ - Método: GET

Descripción: devuelve una lista de todos los carritos autogenerados.


### Crear un carrito
Ruta: /api/carts/ - Método: POST

Descripción: crea un nuevo carrito con un id autogenerado.
Notas: Si se elimina el carrito, no se recuperará su ID, salvo que este sea el último generado anteriormente.

### Obtener información de un carrito especifico
Ruta: /api/carts/:id - Método: GET

Descripción: devuelve la información de un carrito, incluyendo su id, timestamp (sin formato) y los productos que contiene.

### Obtener los productos de un carrito
Ruta: /api/carts/:cid/products - Método: GET

Descripción: muestra todos los elementos que contiene un carrito con detalle.


### Agregar un producto a un carrito
Ruta: /api/carts/:cid/products - Método: PUT 

Descripción: agrega un producto con su respectiva cantidad al carrito seleccionado. Si no se especifica, se agrega 1 por defecto.

Ejemplo de formato de body JSON en Postman:

	{
		"pid": 1,
		"quantity": 3
	}


### Eliminar un producto de un carrito
Ruta: /api/carts/:cid/products/:pid - Método: DELETE

Descripción: elimina los productos correspondientes con id del prodcuto (pid) en el carrito con un id (cid).

### Eliminar un carrito
Ruta: /api/carts/:cid - Método: DELETE

Descripción: elimina el carrito correspondiente al id.



## API de productos (Pokemons)

En src/public/pokemons.js hay datos de pokemones con el formato adecuado para hacer las pruebas de carga (subir 1 pokemon a la vez por postman) 

### Agregar un nuevo producto
Ruta: /api/products - Método: POST

Descripción: agrega un nuevo producto con id autogenerado. El id de cada pokemon se autogenera numéricamente, también se genera el de MongoDB. Técnicamente no es necesario ningún dato, con excepción de un nombre, puesto que en caso de faltar, se auto complementará con 0 en el caso de precio y stock, y los demás indicarán que no existe el respectivo campo. Si los campos de price y stock no son enviados como números se enviara una advertencia y no se generaran, en su defecto puede no enviarse el campo para que se auto seteen con 0, lo que impedira su compra pero permitira tener el producto cargado para su psoterior edicion. Si el código no es enviado, se generará uno automáticamente, pero en caso de que exista otro producto similar, los considerará distintos.
Ejemplo de formato de body JSON en Postman:

	{
		"name": "Venasaur N.º002",
		"description": "Este Pokémon nace con una semilla en el lomo, que brota con el paso del tiempo.",
		"code": "15fa3asd3-7c95-4e7f-a90f-ba3a32e3473d",
		"thumbnail": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png",
		"price": 180,
		"stock": 9,
		"type":"grass"
	}

### Ver todos los pokemones o uno específico
Ruta: /api/products/:pid? - Método: GET

Descripcion: Obtiene todos los pokemones si no se especifica el ID de un pokemon. Si se especifica el ID, devuelve toda la infomracion del pokemon específicado.
Notas: pid puede ser el ID de objeto "_id" o el "id" que se genera al cargar el producto.

### Editar un pokemon
Ruta: /api/products/:pid - Método: PUT

Descripcion: Edita los datos del pokemon con el ID especificado. Se puede editar cualquier parámetro específico, no es necesario que se ingresen todos los datos.
Notas: pid puede ser el ID de objeto "_id" o el "id" que se genera al cargar el producto.

Ejemplo de formato de body JSON en Postman:

	{
		"name": "Ivysaur N.º002",
		"description": "Cuando le crece bastante el bulbo del lomo, pierde la capacidad de erguirse sobre las patas traseras.",
		"thumbnail": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/002.png",
		"price": 125,
		"stock": 100,
		"type":"grass"
	}

### Eliminar un producto de la tienda
Ruta: /api/products/:pid - Método: DELETE

Descripcion: Elimina de la base de datos el pokemon con el ID especificado. 
Notas: pid puede ser el ID de objeto "_id" o el "id" que se genera al cargar el producto.

### Eliminar todos los productos de la tienda
Ruta: /api/products/deleteall - Método: DELETE

Descripcion: Elimina de la base de datos todos los pokemons.

### Comprar productos en el carrito
Ruta: /api/carts/:cid/products - Método: POST

Descripcion: Realizara un proceso de compra (donde se enviara al correo definido en la variable de entorno el mensaje de la compra y se eliminan los productos del carrito y se resta el stock, ademas de que se guardara la orden de compra en una nueva coleccion).


## API de carritos personales 

Las siguientes rutas refieren a los carritos personales (de cada usuario), así como para los productos para ellos:

	-cid: id del carro, el cual es el correo del usuario.
	-pid: id del producto que se desea agregar al carrito, también es un valor numérico, es el autogenerado a partir de la carga del pokemon.
	-quantity: cantidad de productos.


### Obtener información de un carrito personal especifico
Ruta: /carts/cid - Método: GET

Descripción: devuelve la información de un carrito personal, incluyendo su id, timestamp (sin formato) y los productos que contiene.
Notas: Es la misma logica que los carritos autogenerados pero se separan debido a que aqui se utiliza el email como id de usuario, lo mismo ocurre con el resto de las rutas.

### Obtener los productos de un carrito personal
Ruta: /carts/:cid/products - Método: GET

Descripción: muestra todos los elementos que contiene el carrito con detalle de cada producto.


### Agregar un producto a un carrito
Ruta: /carts/:cid/products - Método: PUT 

Descripción: agrega un producto con su respectiva cantidad al carrito seleccionado. Si no se envia el dato quantity, se agrega 1 por defecto.

Ejemplo de formato de body JSON en Postman:

	{
		"pid": 1,
		"quantity": 3
	}


### Eliminar un producto de un carrito
Ruta: /carts/:cid/products/:pid - Método: DELETE

Descripción: elimina los productos correspondientes con id del prodcuto (pid) en el carrito con un id (cid).

## Comprar productos en el carrito personal
Ruta: /carts/:cid/products - Método: POST

Descripcion: Realizara un proceso de compra (donde se enviara al correo del usuario el mensaje de la compra y se eliminan los productos del carrito y se resta el stock, ademas de que se guardara la orden de compra en una nueva coleccion).

