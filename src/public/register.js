// const form = document.getElementById('register')
// const Name = document.getElementById('names');
// const LastName = document.getElementById('lastname');
// const Email = document.getElementById('id');
// const Age = document.getElementById('age');
// const Avatar = document.getElementById('avatar');
// const Phone = document.getElementById('phone');
// const Adress = document.getElementById('adress');
// const Alias = document.getElementById('alias');
// const Password = document.getElementById('password');
// const Passwordconf = document.getElementById('passwordconf');
// const submitButton = document.getElementById('submitButton');
// const countryCodeSelect = document.getElementById('countrycode');
// const countryCodeInp = document.getElementById('countryCode');
// function validateForm() {
//   if(Name.value && LastName.value && Email.value && Age.value && Avatar.value && Phone.value && Adress.value && Alias.value && Password.value && Passwordconf.value&&Password.value===Passwordconf.value){
//     submitButton.disabled = false;
//   } else {
//     submitButton.disabled = true;
//   }
// }

// Name.addEventListener('input', validateForm);
// LastName.addEventListener('input', validateForm);
// Email.addEventListener('input', validateForm);
// Age.addEventListener('input', validateForm);
// Avatar.addEventListener('input', validateForm);
// Phone.addEventListener('input', validateForm);
// Adress.addEventListener('input', validateForm);
// Alias.addEventListener('input', validateForm);
// Password.addEventListener('input', validateForm);
// Passwordconf.addEventListener('input', validateForm);
// countryCodeSelect.addEventListener('change',validateForm)

// form.addEventListener('submit', evt => {
//     evt.preventDefault();
//     let data = new FormData(form);
//     let user = {};
//     data.forEach((value, key) => user[key] = value);
//     fetch('/register', {
//         method: 'POST',
//         body: JSON.stringify(user),
//         headers: {
//             'Content-Type': "application/json"
//         }
//     }).then(result => result.json())
//     .then(json => console.log(json))
//     .catch(error => console.log(error))
// })

// const changelogin = document.getElementById('login')
// changelogin.addEventListener('click', evt => {
//     window.location.href = "/login";
// })
