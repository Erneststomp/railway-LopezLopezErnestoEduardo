import { schema, denormalize } from "normalizr";


const author = new schema.Entity('authors',{},{id: 'email'})
const message = new schema.Entity('messages',{author:author},{})
const chat = new schema.Entity('chat',{author:author,messages:[message]})


export function denormalizeData (data) {
	const denormalizedData = denormalize(data.result, chat, data.entities);
	return denormalizedData;
}