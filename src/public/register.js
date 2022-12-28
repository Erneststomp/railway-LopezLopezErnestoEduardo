const form = document.getElementById('register')

form.addEventListener('sumbit',evt=>{
    evt.preventDefault();
    let data=new FormData(form);
    let user ={};
    data.forEach((value,key)=>user[key]=value);
    fetch('/register',{
        method:'POST',
        body:JSON.stringify(user),
        headers:{
            'Content-Type':"application/json"
        }
    }).then(result=>result.json()).then(json=>console.log(json))
})


const changelogin= document.getElementById('login')
changelogin.addEventListener('click',evt=>{ 
    window.location.href = "/login";

}) 
