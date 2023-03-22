let ordersDAO


switch ('mongodb') {    
    case 'mongodb':
        const { default: OrderDAOMongoDB } = await import('./MongoDB.js')
        ordersDAO = new OrderDAOMongoDB()
        break
}

export { ordersDAO }
