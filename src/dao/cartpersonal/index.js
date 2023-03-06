let personalCartDAO


switch ('mongodb') {    
    case 'mongodb':
        const { default: PCartDAOMongoDB } = await import('./MongoDB.js')
        personalCartDAO = new PCartDAOMongoDB()
        break
}

export { personalCartDAO }
