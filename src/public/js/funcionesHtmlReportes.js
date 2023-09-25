document.addEventListener("DOMContentLoaded", function() {
    
    // URL para la solicitud AJAX
    const url = '/reportes/tareas';

    // Realizar una petición GET a la ruta '/reportes/tareas' en tu servidor Express
    $.ajax({
        url: url,
        method: 'GET',
        success: function (data) {
            // Los datos de tareas se encuentran en la variable "data"
            console.log(data);

            // Procesa tus datos aquí
            const tareasProduccion = data.filter(tarea => tarea.produccion === 1);
            const tareasProyectado = data.filter(tarea => tarea.produccion === 0);
            const tareasEntregado = data.filter(tarea => tarea.entregado === 1);

            const sumaProduccion = tareasProduccion.reduce((total, tarea) => total + tarea.cantidad, 0);
            const sumaProyectado = tareasProyectado.reduce((total, tarea) => total + tarea.cantidad, 0);
            const sumaEntregado = tareasEntregado.reduce((total, tarea) => total + tarea.cantidad, 0);

            // Filtra los datos para el drilldown por producto
            const tareasPorProducto = {};

            data.forEach(tarea => {
                if (!tareasPorProducto[tarea.producto]) {
                    tareasPorProducto[tarea.producto] = {
                        produccion: 0,
                        proyectado: 0
                    };
                }
                if (tarea.produccion === 1) {
                    tareasPorProducto[tarea.producto].produccion += tarea.cantidad;
                } else {
                    tareasPorProducto[tarea.producto].proyectado += tarea.cantidad;
                }
            });

            // Cargar la biblioteca Google Charts
            google.charts.load('current', { 'packages': ['bar'] });

            // Callback cuando la biblioteca Google Charts se cargue
            google.charts.setOnLoadCallback(function() {
                // Dibuja el gráfico principal
                drawChart();

                // Dibuja el gráfico de producto inicialmente
                drawProductChart(tareasPorProducto, 'Produccion');
            });

            function drawChart() {
                // Calcula la suma de tareas para cada categoría
                const sumaProduccion = tareasProduccion.reduce((total, tarea) => total + tarea.cantidad, 0);
                const sumaProyectado = tareasProyectado.reduce((total, tarea) => total + tarea.cantidad, 0);
            
                
                var data = google.visualization.arrayToDataTable([
                    ['Estado', 'Total'],
                    ['Produccion', sumaProduccion],
                    ['Proyectado', sumaProyectado],
                    ['Entregado', sumaEntregado] // Nueva categoría
                ]);
            
                var options = {
                    chart: {
                        title: 'Productos en Producción vs. Productos Proyectados vs. Productos Entregados',
                        subtitle: 'Cantidad de Producción, Proyectadas y Entregadas',
                    },
                    bars: 'horizontal', // Barras horizontales
                    hAxis: { title: 'Total' },
                    colors: ['#3366CC', '#DC3912', '#FF9900'] // Asigna colores a las barras
                };
            
                var chart = new google.charts.Bar(document.getElementById('chart_div'));
            
                chart.draw(data, google.charts.Bar.convertOptions(options));
            
                // Agregar drilldown
                google.visualization.events.addListener(chart, 'select', function () {
                    const selection = chart.getSelection();
                    if (selection.length === 1) {
                        const selectedItem = data.getValue(selection[0].row, 0);
                        if (selectedItem === 'Produccion') {
                            drawProductChart(tareasPorProducto, 'Produccion');
                        } else if (selectedItem === 'Proyectado') {
                            drawProductChart(tareasPorProducto, 'Proyectado');
                        } else if (selectedItem === 'Entregado') {
                            // Lógica para mostrar detalles de "Entregado" (si es necesario)
                        }
                    }
                });
            }
            

            // Función para dibujar el gráfico de producto
            function drawProductChart(tareasPorProducto, estado) {
                var productData = [['Producto', 'Total']];
                for (const producto in tareasPorProducto) {
                    if (tareasPorProducto.hasOwnProperty(producto)) {
                        const cantidad = estado === 'Produccion' ?
                            tareasPorProducto[producto].produccion :
                            tareasPorProducto[producto].proyectado;

                        // Agregar productos solo si la cantidad es mayor que 0
                        if (cantidad > 0) {
                            productData.push([producto, cantidad]);
                        }
                    }
                }

                var productDataTable = google.visualization.arrayToDataTable(productData);
                var productOptions = {
                    chart: {
                        title: 'Total de Productos  ' + estado,
                        subtitle: 'Cantidad de Productos en ' + estado,
                    },
                    bars: 'vertical', // Barras verticales
                    hAxis: { title: 'Total' }
                };

                var productChart = new google.charts.Bar(document.getElementById('product_chart_div'));

                productChart.draw(productDataTable, google.charts.Bar.convertOptions(productOptions));

                // Llama a la función para dibujar el gráfico de clientes
                drawClientChart(productData);
            }

            // Función para dibujar el gráfico de clientes
            function drawClientChart(productData) {
                // Utiliza los datos de productos para dibujar el gráfico de clientes aquí
                // Puedes acceder a los datos del producto seleccionado desde productData
                // Crea un gráfico de clientes en el elemento con el ID 'client_chart_div'
                // Ajusta la estructura y el contenido del gráfico según tus necesidades
                // Puedes utilizar la biblioteca Google Charts u otra biblioteca de visualización de datos
            }

        },
        error: function (error) {
            console.log('Error al obtener datos de tareas:', error);
        }
    });

});
