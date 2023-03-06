import Supertest from "supertest"; 
import Chai from "chai";
import config from "./models/config/config.js";

const expect = Chai.expect;
const requester=Supertest(config.url.mainurl)

describe('cart',()=>{
    describe('GETS',()=>{
        it('The request has been recived successfully',async()=>{
            let response=await requester.get('/api/carts/')
            expect(response.status).to.be.equal(200)
        })

        it('Te carts has been accessed successfully',async()=>{
            const response=await requester.get('/api/carts/')
            const {_body}=response;
            if (_body.length!=0){
                expect(_body[_body.length-1].products).to.be.an('array') 
            }
        })

    })
    describe('POSTS',()=>{
        it('It should create a new Cart',async()=>{
            let response=await requester.post('/api/carts/')
            expect(response.status).to.be.equal(200)
        })
        it('It should publish a new pokemon',async()=>{
            let pokemon={
                "id": 12,
                "timestamp": 1659739618951,
                "name": "Butterfree N.º012",
                "description": "Aletea a gran velocidad para lanzar al aire sus escamas extremadamente tóxicas",
                "code": "12fa3dd3-7c95-4e7f-a90f-ba3a32e3473d",
                "thumbnail": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/012.png",
                "price": 180,
                "stock": 93,
                "type":"bug"
            }
            const response=await requester.post('/api/products/').send(pokemon)
            const{_body}=response
            expect(_body.data).to.include.keys('id','timestamp','name','description','code','thumbnail','price','stock','type')
            expect(response.status).to.be.equal(201)
        })
    })

    describe('DELETES',()=>{
        
        it('It should delete the last created Cart',async()=>{
            const response1=await requester.get('/api/carts/')
            const {_body}=response1;
            let cartlength=_body.length
            let response2=await requester.delete('/api/carts/'+cartlength)
            expect(response2.status).to.be.equal(200)
        })

        it('It should delete the last added Pokemon',async()=>{
            const response1=await requester.get('/api/products/')
            const {_body}=response1;
            let productLength=_body.data.length
            let response2=await requester.delete('/api/products/'+productLength)
            expect(response2.status).to.be.equal(200)
        })
        
    })



})