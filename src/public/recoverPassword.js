// const form = document.getElementById('newPasswordForm')
// const params=new Proxy(new URLSearchParams(window.location.search),{
//     get:(searchParams,prop)=> searchParams.get(prop)
// })
// const token=params.tkn;
// form.addEventListener('submit', evt => {
//     evt.preventDefault();
//     let data=new FormData(form);
//     let user ={};
//     data.forEach((value,key)=>user[key]=value);
//     user.token=token; 
//     fetch('/restore',{
//         method:'PUT',
//         body:JSON.stringify(user),
//         headers:{
//             'Content-Type':"application/json"
//         }
//     }).then(result=>result.json()).then(json=>console.log(json))
// })

// const changelogin= document.getElementById('login')
// changelogin.addEventListener('click',evt=>{ 
//     window.location.href = "/login";
// }) 
 