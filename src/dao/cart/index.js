let cartDAO


switch ('mongodb') {    
    case 'mongodb':
        const { default: CartDAOMongoDB } = await import('./MongoDB.js')
        cartDAO = new CartDAOMongoDB()
        break
}

export { cartDAO }
