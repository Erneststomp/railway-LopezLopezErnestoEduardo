import { gql } from "apollo-server-express";


const typeDefs = gql`
    type Products{
        id: Int
        name: String
        stock: Int
        price: Int
        description: String
        thumbnail: String
        timestamp: String
        code: String
        type: String
    }
    type Users{
        names:String
        lastname:String
        age:Int
        avatar:String
        alias:String
        phone:String
        adress:String
    }

    type Query{
        getAllPokemons:[Products]
        hola: String
    }
    type Mutation{
        addPokemon(id: Int,name: String,stock: Int,price: Int,description: String,thumbnail: String,timestamp: String,code: String,type:String):Products
        createUser(names:String,lastname:String,age:Int,avatar:String,alias:String,phone:String,adress:String):Users
    }

`

export default typeDefs

