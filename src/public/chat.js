
const {denormalize , schema}=window.normalizr

const author = new schema.Entity('authors')
const message = new schema.Entity('messages',{author:author})
const chat = new schema.Entity('chat',{author:author,content:[message]})
const socket=io(
    {autoConnect:false}
);  

    let userName;
    let userLastname;
    let userAge;
    let userAlias;
    let userAvatar
    let userEmail


(function(){
    let me = document.querySelector('script[data-id][data-name="MyUniqueName"]');
    userName = me.getAttribute('name');
    userLastname=me.getAttribute('lastname');
    userAge=me.getAttribute('age');
    userAlias=me.getAttribute('alias');
    userAvatar=me.getAttribute('avatar')
    userEmail=me.getAttribute('id')
})();
   if(userEmail!=''){
    socket.connect();
    socket.emit('messagereq')
    socket.emit('Charreq')}

const ChatBox = document.getElementById('mymessage')
ChatBox.addEventListener('keyup',evt=>{ 
    if(evt.key==="Enter"){
        if(ChatBox.value.trim().length>0){
            const currentDate =new Date().toLocaleString()
            socket.emit('message',{author:{id:userEmail,name:userName ,lastname:userLastname ,age:userAge ,alias:userAlias,avatar:userAvatar},message:ChatBox.value, date:currentDate})
            ChatBox.value=''
        }
    }
})

socket.on('log',data=>{
    let log=document.getElementById('log_chat')
    let data1=denormalize(data.result,chat,data.entities)
    let messages=`<div ><p style="width:35px">no normalizado:${ (new TextEncoder().encode(JSON.stringify(data))).length}</p>
    <p style="color:brown"> normalizado: ${ (new TextEncoder().encode(JSON.stringify(data1))).length} </p> </div>`
    
    for(let i=0;i<data1.content.length;i++){
        messages=messages+`<div style="display:inline-flex"><img style="width:35px" src="${data1.content[i].author.avatar}">  </img><p style="color:brown"> ${data1.content[i].date} </p> <p style="color:blue; font-weight:bold"> ${data1.content[i].author.alias} </p> <p style="font-style: italic;color:green"> ${data1.content[i].message}</p></div><br>`
    }
    log.innerHTML=messages;
    
})

const CharBox = document.getElementById('sendNewChar')

CharBox.addEventListener('click',evt=>{ 
    evt.preventDefault()
    let titles= document.getElementById('title').value
    let prices= document.getElementById('price').value
    let thumbnails= document.getElementById('thumbnail').value
    if(titles!==''&&prices!==''&&thumbnails!==''){
    socket.emit('characters',{title:titles,price:prices,thumbnail:thumbnails})
    document.getElementById('title').value=''
    document.getElementById('price').value=''
    document.getElementById('thumbnail').value=''}
    else{
        alert('Ingrese todos los datos')
    }
}) 

socket.on('logchar',datachar=>{
    let char=document.getElementById('log_character')
    let Characterss=''
    for(let i=0;i<datachar.contentchar.length;i++){
        Characterss=Characterss+`<div>Character: ${datachar.contentchar[i].title} </p> <p> Reward: $ ${datachar.contentchar[i].price} </p> <img style="width:150px" src="${datachar.contentchar[i].thumbnail}"></img></div><br>`
    }

    char.innerHTML=Characterss;

}
)


