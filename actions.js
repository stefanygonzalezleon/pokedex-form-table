const form = document.getElementById("survey-form");
const formularioTable = document.getElementById('estudiantes')
const button = document.getElementById("clear");
const promedioPlaceholder = document.getElementById('promedio');
let estudiantes = JSON.parse(localStorage.getItem('estudiantes')) ?? [];
const backgroundAudio = new Audio("../AUDIO/Pokémon Center.mp3");
const saveAudio = new Audio("../AUDIO/Pokémon Evolved.mp3");
const clearAudio = new Audio("../AUDIO/Pokémon Healing.mp3");

var selectRow = null;

let backgroundAudioPlayed = false;

window.onload = function(){
    if(estudiantes != null){   
        estudiantes.forEach(function(estudiante){
            insertRow(estudiante);
        });
        promedioPlaceholder.innerHTML= "promedio: "  + findpromedio();
    }
}

window.onclick = function(){
    if(!backgroundAudioPlayed){
        backgroundAudio.autoplay = true;
        backgroundAudio.loop = true;
        backgroundAudio.play();
        backgroundAudioPlayed = true;
    } 
}

class Estudiante {
    constructor(id= 0, nombre = '', apellido = '', matricula = 0, nota = 0) {
        this.id = id ;
        this.nombre = nombre;
        this.apellido = apellido;
        this.matricula = matricula;
        this.nota = nota;
    }
}

function findpromedio(){
    if(estudiantes.length > 0) {
        let suma = 0;
        estudiantes.forEach(function(estudiante){
            suma += estudiante.nota;
        });
        return suma / estudiantes.length;
    }
    
    return estudiantes.length;
}

form.addEventListener('submit', function (event) {
    //cancelar evento por defecto del navegador
    event.preventDefault();
    
    //contener los valores de nuestro formularios
    let formularioFormData = new FormData(form);
    
    if(selectRow == null){
        //insetar una fila a la tabla
        const estudiante = new Estudiante(
            estudiantes.length + 1,
            formularioFormData.get("nombre"),
            formularioFormData.get("apellido"),
            parseInt(formularioFormData.get("matricula")),
            parseInt(formularioFormData.get("nota"))
        );
        estudiantes.push(estudiante);
        insertRow(estudiante);
    } else {
        const estudiante = estudiantes.find(e => e.id == selectRow.id);
        estudiante.nombre = formularioFormData.get("nombre");
        estudiante.apellido = formularioFormData.get("apellido");
        estudiante.matricula = parseInt(formularioFormData.get("matricula"));
        estudiante.nota = parseInt(formularioFormData.get("nota"));
        updateRow(estudiante);
        selectRow = null;
    }

    // actualizar promedio
    promedioPlaceholder.innerHTML= "promedio: "  + findpromedio();

    //guardar en localstorage
    localStorage.setItem("estudiantes", JSON.stringify(estudiantes));

    // reproducir sonido de guardado
    backgroundAudio.pause();
    saveAudio.play();
    saveAudio.onended = function(){
        backgroundAudio.play();
    }

    //limpiar formulario
    event.target.reset();
});

button.addEventListener('click', function (event) {
    // limpiar arreglo
    estudiantes = [];
    
    // limpiar en localstorage
    localStorage.removeItem("estudiantes");
    
    // limpiar tabla
    document.getElementById('estudiantes').innerHTML = "";
    
    // actualizar promedio
    promedioPlaceholder.innerHTML= "promedio: "  + findpromedio();
    
    // reproducir sonido de limpiado
    backgroundAudio.pause();
    clearAudio.play();
    clearAudio.onended = function(){
        backgroundAudio.play();
    }
});

function Editar(id){
    selectRow = document.getElementById(id);

    //llenando las celdas con los valores a editar
    document.getElementById("nombre").value = selectRow.cells[0].innerHTML;
    document.getElementById("apellido").value = selectRow.cells[1].innerHTML;
    document.getElementById("matricula").value = selectRow.cells[2].innerHTML;
    document.getElementById("nota").value = selectRow.cells[3].innerHTML;
}

function Eliminar(id){
    estudiantes = estudiantes.filter(function(estudiante){
        return estudiante.id != id;
    });

    //borrar columna del local storage
    localStorage.setItem("estudiantes", JSON.stringify(estudiantes)); 
    const row = document.getElementById(id);
    
    //borrar columna con dicho id
    row.parentElement.removeChild(row);
    
    //actualizar promedio
    promedioPlaceholder.innerHTML= "promedio: "  + findpromedio();
}

function insertRow(estudiante) {
    let newFormRow = formularioTable.insertRow(-1);
    newFormRow.id = estudiante.id;

    let newFormCell = newFormRow.insertCell(0);
    newFormCell.textContent = estudiante.nombre;

    newFormCell = newFormRow.insertCell(1);
    newFormCell.textContent = estudiante.apellido;

    newFormCell = newFormRow.insertCell(2);
    newFormCell.textContent = estudiante.matricula;

    newFormCell = newFormRow.insertCell(3);
    newFormCell.textContent = estudiante.nota;

    newFormCell = newFormRow.insertCell(4);
    newFormCell.innerHTML = `
        <button class="icon" onclick="Editar(${estudiante.id})"><img src="img/editar.png"></button>
        <button class="icon" onclick="Eliminar(${estudiante.id})"><img src="img/eliminar.png"></button>
    `;
}

function updateRow(estudiante){
    selectRow.cells[0].textContent = estudiante.nombre;
    selectRow.cells[1].textContent = estudiante.apellido;
    selectRow.cells[2].textContent = estudiante.matricula;
    selectRow.cells[3].textContent = estudiante.nota;
}