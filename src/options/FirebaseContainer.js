//----------* IMPORTS *----------//
import admin from 'firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
import serviceAccount from './firestore.json'assert{type:'json'}
import {normalize,schema} from 'normalizr';
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://backend-mocks.firebaseio.com'
})
const db = admin.firestore()
console.log('Firestore is connected!')
let query = db.collection('chatinfo')
let query2 = db.collection('characterinfo')
let messagebase
let characterbase
const FirebaseContainer = {

    createMessagesTable : async ()=>{
    try {  
            let doc= query.doc();
            await doc.create({id:"1",title:"chat",
            author: {
                id: "asd@gmail.com",
                name: "Ernesto",
                lastname: "Lopez",
                age: "28",
                alias: "Ernest",
                avatar: "https://cdn4.iconfinder.com/data/icons/people-avatar-filled-outline/64/adult_people_avatar_man_male_employee_tie-128.png"
            },content:[]})
            return doc 
    } catch (error) {
        throw new Error(`Error creating the database: ${error}`)
    }
    },
    getMessage: async ()=> {
        try {
            let exist
            const snapShot = await query.get()
            let docs = snapShot.docs
            
            if(snapShot.empty){
                exist=0
            }else{
                exist=1
                messagebase=docs[0].id
            }
            
            return exist
        } catch (error) {
            throw new Error(`Error getting all characters: ${error}`)
        }
        },  


    getAllMessages: async ()=> {
    try {
        const snapShot = await query.get()
        let docs = snapShot.docs
        let response=docs.map(doc=>({
            resp:doc.data(),
        }))
        response=response[0].resp
        const author = new schema.Entity('authors')
        const message=new schema.Entity('messages',{
            author:author
        })
        const chat = new schema.Entity('chat',{
            author:author,
            content:[message]
        })
 
        
        const normalizeData=normalize(response,chat)
        return normalizeData
        
    } catch (error) {
        throw new Error(`Error getting all items: ${error}`)
    }
    },

    addNewMessage :async (data)=> {
    try {
        await query
        .doc(messagebase)
        .update('content', FieldValue.arrayUnion(data), { merge: true })
    } catch (error) {
        throw new Error(`Error adding character: ${error}`)
    } 
    },  



    createCharacterTable : async ()=>{
        try {  
                let doc= query2.doc();
                await doc.create({id:"1",title:"characters",
                contentchar:[]})
                return doc 
        } catch (error) {
            throw new Error(`Error creating the database: ${error}`)
        }
        },
        getCharacter: async ()=> {
            try {
                let exist
                const snapShot = await query2.get()
                let docs = snapShot.docs
                
                if(snapShot.empty){
                    exist=0
                }else{
                    exist=1
                    characterbase=docs[0].id
                }
                
                return exist
            } catch (error) {
                throw new Error(`Error getting all items: ${error}`)
            }
            },  

    
        getAllCharacters: async ()=> {
        try {
            const snapShot = await query2.get()
            let docs = snapShot.docs
            let response=docs.map(doc=>({
                resp:doc.data(),
            }))
            response=response[0].resp
            return response
            
        } catch (error) {
            throw new Error(`Error getting all items: ${error}`)
        }
        },
    
        addNewCharacter :async (data)=> {
        try {
            await query2
            .doc(characterbase)
            .update('contentchar', FieldValue.arrayUnion(data), { merge: true })
        } catch (error) {
            throw new Error(`Error adding item: ${error}`)
        } 
        },  


}

export default FirebaseContainer
