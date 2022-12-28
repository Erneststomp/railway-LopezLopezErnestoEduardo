import KnexContainer from '../../options/myknex/My_knex.js';
import config from '../../options/sqlLite3.js'
let database=new KnexContainer(config,'messages')

const Messages ={

    createMessagesTable: async () => {
        try {
          database = new KnexContainer(config, 'messages') 
          await database.createTable()
        } catch (error) {
          console.log({Server: error})
        }
      }

      ,  
  getAllMessages: async () => {
    try {
      database = new KnexContainer(config, 'messages') 
      const allMessages = await database.getAll()
      return allMessages
    } catch (error) {
      console.log({Server: error})
    }
  },

  addNewMessage: async (message) => {
    try {
      database = new KnexContainer(config, 'messages') 
      const prevMessages = await database.getAll()
      const currentDate = new Date().toLocaleString()

      const newMessage = {
        author: {
            id: message.user,
            name: message.name,
            lastname: message.lastname,
            age: message.age,
            alias: message.alias,
            avatar: message.avatar,
        },
        message : message.message,
        date : message.date,
    }

      database = new KnexContainer(config, 'messages')     
      await database.save(newMessage)
    } catch (error) {
      console.log({Server: error})
    }
  },


}
export default Messages

