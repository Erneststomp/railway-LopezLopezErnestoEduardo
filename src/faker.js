import { faker } from '@faker-js/faker';
faker.locale='es';

const testProducts = {
  getTest: async()=>{
    try{
    let test=[]
      for(let i=0; i<5; i++){
        test.push({
          title: faker.name.firstName()+' '+faker.name.lastName(),
          price: '$'+faker.finance.amount(),
          thumbnail: faker.image.imageUrl(),
        })
      }
    return test
  } catch (error){
    console.log(error)
  }
}
}

  export default testProducts