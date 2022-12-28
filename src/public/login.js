const form = document.getElementById('login')

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

const changeregister= document.getElementById('singup')
changeregister.addEventListener('click',evt=>{ 
    window.location.href = "/register";
}) 

const logingithub= document.getElementById('github')
logingithub.addEventListener('click',evt=>{ 
    window.location.href = "/github";
}) 