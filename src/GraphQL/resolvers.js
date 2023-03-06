import { productDAO } from "../dao/product/index.js"
import userService from "../public/users.js"
const resolvers={
    Query:{
        hola: () => "Si lo Ve, Funciona",
        getAllPokemons: async()=>{
            let result = await productDAO.getAll()
            let newResult=[]
            for(let i=0;i<result.length;i++){
                newResult.push(result[i])
            }
            return newResult
        }
    },
    Mutation:{
        addPokemon: async(_,args)=>{
            let result = await productDAO.addItem(args)
            return result
            
        },
        createUser: async(_,args)=>{
            let result=await userService.create(args)
            return result
        }
    }

}
export default resolvers