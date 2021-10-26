
//La API KEY caducará en tres meses (se puede pedir otra)
var API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ3YWxsYWNlNTgxQGhvdG1haWwuY29tIiwianRpIjoiODEyOWMwZGEtY2U4MS00NGI3LWE0N2QtNWZkZGVlOWYyZTBiIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE1NTYyNjMxMDcsInVzZXJJZCI6IjgxMjljMGRhLWNlODEtNDRiNy1hNDdkLTVmZGRlZTlmMmUwYiIsInJvbGUiOiIifQ.ZkBpqjtKbfPgv3SdtZe0-QV1xHgV0LYPkipWR5qVZEA"


var annio = $(".anio").mouseover(d=>{
    console.log(d.target.textContent);
    
    var annio = d.target.textContent //Obtengo el año del boton al pasar el puntero y hago una peticion con ese año
    
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://opendata.aemet.es/opendata/api/valores/climatologicos/mensualesanuales/datos/anioini/"+annio+"/aniofin/"+annio+"/estacion/3195/?api_key="+API_KEY,
        "method": "GET",
        "headers": {
            "cache-control": "no-cache"
        }
    }

    $.ajax(settings).done(function (response) {
        console.log(response.datos);
        var datos = response.datos

    
//Gráfica
        
        var width = document.getElementById('anios').clientWidth;
        var height = document.getElementById('anios').clientHeight*0.9;
            margin = {top:70,                      
                      right:30,
                      left:30,
                      bottom:20}
 
        d3.json(datos).then(d=>{
            //El dato -13 es el total anual, así que lo filtro, y con el map cargo solo lo que necesito, con los datos convertidos ya en float
            datos = d
                .filter(d=>d.fecha != annio+'-13')
                .map(d=>{
                    return {fecha:d.fecha,p_mes:parseFloat(d.p_mes),tm_mes:parseFloat(d.tm_mes)}
                })
            
            console.log(datos) //Ahora solo devuelve los 12 meses
            window.datos = datos
            
//Escala X
            
            var escalaX = d3.scaleBand()
                .domain(datos.map(d=>d.fecha))
                .range([margin.left, width -margin.right])
            
//Escala Y izq (Precipitaciones)
            
            var escalaY_Precip = d3.scaleLinear()
                .domain([0,d3.max(datos,d=>d.p_mes)])
                .range([height-margin.bottom,margin.top])
            
//Escala Y dcha (Temperaturas)
            
            var escalaY_Temp = d3.scaleLinear()
                .domain([0,d3.max(datos,d=>d.tm_mes)])
                .range([height-margin.bottom,margin.top])
            
//Contenedor grafica
            
            //Primero tengo que eliminar el svg en caso de que exista para que no me cree duplicados
            d3.select('.svgGraph')
                .remove() 
                    
            var svg =d3.select("#zona_grafica")
                .append("svg")
                .attr('class','svgGraph')
                .attr('width',width)
                .attr('height',height)
//Titulo             
            svg
                .append('text')
                .attr('class','titulo textos')
                .attr('transform','translate('+(width-183)*0.5+',30)') //183 es el ancho del título, así lo llevo al medio
                .text("Climograma del a\u00f1o "+ annio)
            
//Titulos ejes
            
        //Precipitaciones (izq)
            svg
                .append('text')
                .attr('class','tituloEje textos')
                .attr('transform','translate(0,45)') //183 es el ancho del título, así lo llevo al medio
                .attr('fill','var(--bar-color)')
                .text("P (mm)")
            
        //Temperaturas (dcho)
            svg
                .append('text')
                .attr('class','tituloEje textos')
                .attr('transform','translate('+(width-33)+',45)') //33 es el ancho del título, así lo llevo a la derecha
                .attr('fill','var(--line-color)')
                .text("T (\u00B0C)")
            
//Tooltips
            
        //Barras
            
            var barTooltip = d3.select('body')
                  .append("div")
                  .attr("class", "Tooltip barTooltip textos")
                  .style("opacity",'var(--op-leyendas)')
            
            var barMouseover = function(d) {
                    barTooltip
                        .style("opacity",'var(--op-hover-leyendas)')
                    }
            var barMousemove = function(d) {
                    
                    barTooltip
                        .html(d.p_mes)
                        .style('left', (d3.mouse(this)[0] + width*0.25) + 'px')
                        .style('top', (d3.mouse(this)[1]+height*0.10) + 'px') 
                    } 
            var barMouseout = function(d) {
                    barTooltip
                        .style("opacity",'var(--op-leyendas)')  
                    }
            
        //Linea
            
            var lineMouseover = function(d) {
                d3.select('.svgGraph')
                    .append('g')
                    .selectAll('text')
                    .data(datos).enter()
                    .append('text')
                    .attr('class','Tooltip lineTooltip textos')
                    .text(d=>d.tm_mes)
                    .attr('x',d=> escalaX(d.fecha) + width*0.03)
                    .attr('y',d=> escalaY_Temp(d.tm_mes) - height*0.03) 
                 }
            
            var lineMouseout = function(d) {
                d3.selectAll('.lineTooltip')
                    .remove()
            }
            
//Barras
            
            svg
                .append("g")
                .selectAll(".bar")
                .data(datos).enter()
                .append("rect")
                .attr('class','bar')
                .attr('x', d=>escalaX(d.fecha)+4)
                .attr('y', d=>escalaY_Precip(d.p_mes))
                .attr('height', d=> (height - margin.bottom - escalaY_Precip(d.p_mes)))
                .attr('width', escalaX.bandwidth()-8)
                .on('mouseover', barMouseover)
                .on('mousemove', barMousemove)
                .on('mouseout', barMouseout)
            
//Ejes X e Y
            fechas = {1:'ENE',2:'FEB',3:'MAR',4:'ABR',5:'MAY',6:'JUN',7:'JUL',8:'AGO',9:'SEP',10:'OCT',11:'NOV',12:'DIC'}
            
            var ejeX = d3.axisBottom(escalaX)
                .tickFormat(d=> fechas[d.substr(5)])
            var ejeY_P = d3.axisLeft(escalaY_Precip)
            var ejeY_T = d3.axisRight(escalaY_Temp)
            
            svg
                .append("g")
                .attr('class','ejeX textos')
                .attr("transform","translate(0,"+(height-margin.bottom)+")")
                .call(ejeX)
            
            svg //eje izq (Precipitaciones)
                .append("g")
                .attr('class','ejeY textos')
                .attr("transform","translate("+margin.left+",0)")
                .call(ejeY_P)  
            
            svg //eje dcho (Temperaturas)
                .append("g")
                .attr('class','ejeY textos')
                .attr("transform","translate("+(width-margin.right)+",0)")
                .call(ejeY_T)
            
//Línea de temperatura
            
            var linea = d3.line()
                .x(d => escalaX(d.fecha))
                .y(d => escalaY_Temp(d.tm_mes))
                .curve(d3.curveMonotoneX)

            svg 
                .append('path')
                .attr('class','linea-T')
                .attr('d',d=>linea(datos))
                .attr('transform','translate('+ escalaX.bandwidth()/2+',0)') //Lo desplazo media barra
                .style('stroke', 'var(--line-color)')
                .on('mouseover', lineMouseover)
                .on('mouseout', lineMouseout)
            
        })      
    });
}); 