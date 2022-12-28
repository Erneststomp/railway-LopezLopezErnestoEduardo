const template = Handlebars.compile(`<ul>
    <li>{{id}}</li>
    <li>{{title}}</li>
    <li>{{especie}}</li>
    <li>{{thumbnail}}</li>

</ul>`)
const htmlFinal= template({
    id:1,
    title:'Ernestoooo',
    especie: 'Human',
    thumbnail:'no hay',

})

document.getElementById('Data').innerHTML=htmlFinal