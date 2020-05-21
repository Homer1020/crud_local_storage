// Variables
const formularioAgregar = document.getElementById('agregar-producto')
const btnAñadir = document.getElementById('btn-añadir')
const nombre = document.getElementById('nombre')
const precio = document.getElementById('precio')
const pais = document.getElementById('pais')
const outputProductos = document.querySelector('#tabla-productos tbody')

// Eventos
nombre.addEventListener('blur', comprovarLongitud)
precio.addEventListener('blur', comprovarLongitud)
pais.addEventListener('blur', comprovarLongitud)

outputProductos.addEventListener('click', eliminar)
outputProductos.addEventListener('click', actualizar)

for(let i = 0; i < formularioAgregar.elements.length; i++){
    formularioAgregar.elements[i].addEventListener('input', comprovarTodos)
}

formularioAgregar.addEventListener('submit', agregarProducto)

añadirAlCargar()

// Funciones
function añadirAlCargar(){
    const datosLS = obtenerDatosLS()
    if(datosLS.length > 0){
        let html = ''
        datosLS.forEach(dato => {
            html += `
                <tr>
                    <td>${dato.nombre}</td>
                    <td>${dato.precio}</td>
                    <td>${dato.pais}</td>
                    <td><a href="#" class="eliminar" data-id=${dato.id}>Eliminar</a></td>
                    <td><a href="#" class="actualizar" data-id=${dato.id}>Actualizar</a></td>
                </tr>
            `
        })
        outputProductos.innerHTML += html
    }
}


function comprovarLongitud(){
    const longitud = this.value.length
    if(longitud != 0){
        this.style.borderColor = 'lightgreen'
    }else{
        this.style.borderColor = 'tomato'
    }
}

function comprovarTodos(){
    if(nombre.value != '' && precio.value != '' && pais.value != ''){
        btnAñadir.removeAttribute('disabled')
    }else{
        btnAñadir.setAttribute('disabled', true)
    }
}

function obtenerID(){
    const datosLS = obtenerDatosLS()
    if(datosLS.length !== 0){
        let ids = []
        datosLS.forEach(dato =>{
            ids.push(dato.id)
        })
        ids = ids.sort((a, b) => a - b);
        lastId = ids[ids.length - 1]
        return lastId + 1
    }else{
        return 1
    }
}

let id = obtenerID()

function agregarProducto(e){
    e.preventDefault()
    const datos = {
        nombre: nombre.value,
        precio: precio.value,
        pais: pais.value,
        id: id
    }
    añadirHTML(datos)
    añadirLS(datos)
    id++
    nombre.style.borderColor = ''
    precio.style.borderColor = ''
    pais.style.borderColor = ''
    formularioAgregar.reset()
    btnAñadir.setAttribute('disabled', true)
}

function añadirHTML(datos){
    let html = `
        <tr>
            <td>${datos.nombre}</td>
            <td>${datos.precio}</td>
            <td>${datos.pais}</td>
            <td><a href="#" class="eliminar" data-id=${datos.id}>Eliminar</a></td>
            <td><a href="#" class="actualizar" data-id=${datos.id}>Actualizar</a></td>
        </tr>
    `
    outputProductos.innerHTML += html
}

function añadirLS(datos){
    const datosLS = obtenerDatosLS()
    datosLS.push(datos)
    localStorage.setItem('productos', JSON.stringify(datosLS))
}

function obtenerDatosLS(){
    const datosLS = localStorage.getItem('productos')
    if(datosLS !== null){
        return JSON.parse(datosLS)
    }else{
        return []
    }
}

function eliminar(e){
    e.preventDefault()
    if(e.target.className === 'eliminar'){
        e.target.parentElement.parentElement.remove()
        eliminarLS(parseInt(e.target.getAttribute('data-id')))
    }
}

function eliminarLS(dato){
    const datosLS = obtenerDatosLS()
    datosLS.forEach((datos, index) => {
        if(datos.id === dato) {
            datosLS.splice(index, 1);
        }
    });
    localStorage.setItem('productos', JSON.stringify(datosLS));
}

let click = 0

function actualizar(e){
    if(e.target.className === 'actualizar'){
        e.preventDefault()

        let allTds = Array.from(e.target.parentElement.parentElement.querySelectorAll('td')),
        tds = []

        allTds.forEach(td => {
            if(td.querySelector('a') === null || td.querySelector('a') === null){
                tds.push(td)
            }
        })

        if(click % 2 === 0){
            e.target.textContent = 'listo'
            tds.forEach(td => {
                td.setAttribute('contenteditable', true)
                td.style.backgroundColor = '#f1f1f1'
            })
        }else{
            e.target.textContent = 'Actualizar'
            tds.forEach(td => {
                td.removeAttribute('contenteditable')
                td.style.backgroundColor = ''
            })

            actualizarLS(e.target.getAttribute('data-id'), tds[0].textContent, tds[1].textContent, tds[2].textContent)
        }
        click++
    }
}

function actualizarLS(id, nombre, precio, pais){
    const datosLS = obtenerDatosLS()
    datosLS.forEach((dato, index) => {
        if(dato.id === parseInt(id)) {
            dato.nombre = nombre,
            dato.precio = precio,
            dato.pais = pais
        }       
    })

    localStorage.setItem('productos', JSON.stringify(datosLS))
}