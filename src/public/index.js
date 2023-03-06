const template = Handlebars.compile(`<ul>
    <li>{{id}}</li>
    <li>{{title}}</li>


</ul>`)
const htmlFinal= template({
    id:1,
    title:'Ernesto Lopez API',
})

document.getElementById('Data').innerHTML=htmlFinal