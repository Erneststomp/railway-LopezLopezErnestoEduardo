let productDAO

switch ('mongodb') {    
    case 'mongodb':
        const { default: ProductDAOMongoDB } = await import('./MongoDB.js')
        productDAO = new ProductDAOMongoDB()
    break
}

export { productDAO }
