const socket=io(
    {autoConnect:false}
);

socket.connect();
socket.emit('test')



socket.on('logtest',logtest=>{
    console.log(logtest)
    let char=document.getElementById('log_character')
    let Characterss=''
    for(let i=0;i<logtest.length;i++){
        Characterss=Characterss+`<div> ${logtest[i].title} </p> <p> ${logtest[i].price} </p> <img src="${logtest[i].thumbnail}"></img></div><br>`
    }
    char.innerHTML=Characterss;}
    
)


