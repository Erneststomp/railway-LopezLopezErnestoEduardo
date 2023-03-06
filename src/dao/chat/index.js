let chatDAO

switch ('mongodb') {    
    case 'mongodb':
        const { default: chatDAOMongoDB } = await import('./MongoDB.js')
        chatDAO = new chatDAOMongoDB()
    break
}

export { chatDAO }
