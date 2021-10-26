fecha_menor = 1980
fecha_mayor = (new Date).getFullYear() //Devolverá el año actual

//Al pulsar la flecha izquierda disminuye las fechas, a menos que la mas baja sea 1980 (por poner una)
$("#fIzq").click(d=>{
    for (i=0; i<document.getElementsByClassName("anio").length;i++) {
        if (document.getElementsByClassName("anio")[0].textContent<=fecha_menor){
        } else {document.getElementsByClassName("anio")[i].textContent--}
        
    }
})

//Al pulsar la flecha derecha aumenta las fechas, a menos que la mas alta sea el año actual
$("#fDcha").click(d=>{
    for (i=0; i<document.getElementsByClassName("anio").length;i++) {
        if (document.getElementsByClassName("anio")[4].textContent==fecha_mayor){
        } else {document.getElementsByClassName("anio")[i].textContent++}
        
    }
})