document.addEventListener("DOMContentLoaded", function() {
    
    // Cargar la biblioteca Google Charts de manera asincrónica
    google.charts.load('current', { 'packages': ['corechart', 'table'] });
    // Callback cuando la biblioteca Google Charts se cargue
    google.charts.setOnLoadCallback(function () {
        // URL para la solicitud AJAX
        const urlStock = '/reportes/stock';

        // Realizar una petición GET a la ruta '/reportes/stock' en tu servidor Express
        $.ajax({
            url: urlStock,
            method: 'GET',
            success: function (stockData) {
                // Los datos de stock se encuentran en la variable "stockData"
                console.log(stockData);

                // Procesa tus datos de stock aquí
                // Dibuja el primer gráfico (acumuladores por producto)
                drawStockByProductChart(stockData);

                // Dibujar la tabla de stock utilizando la nueva función con DataTables
                drawTableStock(stockData, 'table_div_stock_product');
            },
            error: function (error) {
                console.log('Error al obtener datos de stock:', error);
            }
        });

        // Función para dibujar el primer gráfico (acumuladores por producto)
        function drawStockByProductChart(stockData) {
            const productData = [['Producto', 'Cantidad acumulada']];
            const productMap = new Map();

            stockData.forEach(item => {
                const { nombre, cantidad } = item;

                if (!productMap.has(nombre)) {
                    productMap.set(nombre, []);
                }

                productMap.get(nombre).push({ nombre, cantidad });
            });

            for (const [producto, movimientos] of productMap) {
                let totalCantidad = 0;
                for (const movimiento of movimientos) {
                    totalCantidad += movimiento.cantidad;
                }
                productData.push([producto, totalCantidad]);
            }

            // Crear los datos del gráfico
            const chartData = google.visualization.arrayToDataTable(productData);

            // Opciones del gráfico
            const options = {
                title: 'Cantidad de Productos',
                hAxis: { title: 'Producto' },
                vAxis: { title: 'Cantidad acumulada' },
                seriesType: 'bars',
                series: { 0: { type: 'bars' } },
            };

            // Crear el gráfico
            const chart = new google.visualization.BarChart(document.getElementById('chart_div_stock_product'));
            chart.draw(chartData, options);
        }

        // Función para dibujar la tabla de stock con DataTables
        function drawTableStock(data, containerId) {
            const tableDiv = document.getElementById(containerId);
            tableDiv.innerHTML = ''; // Limpia el contenido anterior de la tabla

            // Crear la tabla con DataTables
            
            const table = $('<table id="tabla_tareas_stock" class="display table table-bordered" style="width:100%"></table>');
            $(tableDiv).append(table);

            $('#tabla_tareas_stock').DataTable({
                language: {
                    "url": "../assets/vendor/libs/datatables/datatables.es.json"
                },
                data: data,
                columns: [
                    { data: 'nombre', title: 'Producto' },
                    { data: 'cantidad', title: 'Cantidad' },
                    { data : 'idtarea', title: 'Tarea' },
                    { data: 'fecha', title: 'Fecha' },
                    { data: 'descripcion', title: 'Movimiento' },
                ]
            });
        }
    });

    
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
            const tareasProduccion = data.filter(tarea => tarea.terminado === 1);
            const tareasEntregado = data.filter(tarea => tarea.entregado === 1);
            const tareasProyectado = data.filter(tarea => tarea.produccion === 0);

            const sumaProduccion = tareasProduccion.reduce((total, tarea) => total + tarea.cantidad, 0);
            const sumaProyectado = tareasProyectado.reduce((total, tarea) => total + tarea.cantidad, 0);
            const sumaEntregado = tareasEntregado.reduce((total, tarea) => total + tarea.cantidad, 0);

            // Filtra los datos para el drilldown por producto
            const tareasPorProducto = {};

            data.forEach(tarea => {
                if (!tareasPorProducto[tarea.producto]) {
                    tareasPorProducto[tarea.producto] = {
                        produccion: 0,
                        proyectado: 0,
                        entregado: 0
                    };
                }
                if (tarea.produccion === 1) {
                    tareasPorProducto[tarea.producto].produccion += tarea.cantidad;
                } else {
                    tareasPorProducto[tarea.producto].proyectado += tarea.cantidad;
                }
                if (tarea.entregado === 1) {
                    tareasPorProducto[tarea.producto].entregado += tarea.cantidad;
                }

            });

            // Cargar la biblioteca Google Charts
            google.charts.load('current', { 'packages': ['bar'] });

            // Callback cuando la biblioteca Google Charts se cargue
            google.charts.setOnLoadCallback(function() {
                // Dibuja el gráfico principal
                drawChart();

                // Dibuja la tabla DataTable por defecto en "Proyectado"
                drawDataTable(tareasProyectado);

                // Dibuja el gráfico de producto inicialmente
                drawProductChart(tareasPorProducto, 'Proyectado');
                
                // Calcular las sumas de kilogramoscumplidos e idoperario por tipo de operario
                const sumasTareas = calcularSumaPorTipoOperario(data);

                // Dibujar el gráfico de sumas
                drawSumaTareasChart(sumasTareas);

                // Dibujar la tabla de sumas
                drawSumaTareasTable(sumasTareas);
            });

            function drawChart() {
                // Calcula la suma de tareas para cada categoría
                const sumaProduccion = tareasProduccion.reduce((total, tarea) => total + tarea.cantidad, 0);
                const sumaProyectado = tareasProyectado.reduce((total, tarea) => total + tarea.cantidad, 0);
                const sumaEntregado = tareasEntregado.reduce((total, tarea) => total + tarea.cantidad, 0);
            
                
                var data = google.visualization.arrayToDataTable([
                    ['Estado', 'Total'],
                    ['Proyectado', sumaProyectado],
                    ['Fabricado', sumaProduccion],
                    ['Entregado', sumaEntregado]
                ]);
            
                var options = {
                    chart: {
                        title: 'Productos en Producción vs. Productos Proyectados ',
                        subtitle: 'Cantidad de Producción, Proyectadas ',
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
                        if (selectedItem === 'Fabricado') {
                            drawProductChart(tareasPorProducto, 'Fabricado');
                            drawDataTable(tareasProduccion);
                        } else if (selectedItem === 'Proyectado') {
                            drawProductChart(tareasPorProducto, 'Proyectado');
                            drawDataTable(tareasProyectado);
                        } else if (selectedItem === 'Entregado') {
                            drawProductChart(tareasPorProducto, 'Entregado');
                            drawDataTable(tareasEntregado);
                        }
                    }
                });
            }
            
            // Función para dibujar el gráfico de producto
            function drawProductChart(tareasPorProducto, estado) {
                var productData = [['Producto', 'Total']];
                for (const producto in tareasPorProducto) {
                    if (tareasPorProducto.hasOwnProperty(producto)) {
                        const cantidad = estado === 'Fabricado' ? tareasPorProducto[producto].produccion :
                            estado === 'Proyectado' ? tareasPorProducto[producto].proyectado :
                            estado === 'Entregado' ? tareasPorProducto[producto].entregado : 0;
                            

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
            }

            // Función para dibujar la tabla DataTable
            function drawDataTable(data) {
                const tableDiv = document.getElementById('table_div');
                tableDiv.innerHTML = ''; // Limpia el contenido anterior de la tabla

                $(tableDiv).append('<table id="tabla_tareas" class="display table table-bordered" style="width:100%"></table>');

                $('#tabla_tareas').DataTable({
                    language: {
                        "url": "../assets/vendor/libs/datatables/datatables.es.json"
                    },
                    data: data,
                    columns: [
                        { data: 'idtarea', title: 'Id' },
                        { data: 'razonsocial', title: 'Cliente' },
                        { data: 'producto', title: 'Producto' },
                        { data: 'cantidad', title: 'Cantidad' },
                    ]
                });
            }

            // Función para calcular la suma de kilogramoscumpliso e idoperario por tipo de operario
            function calcularSumaPorTipoOperario(data) {
                const sumas = {
                    extrusora: { kilogramosCumplidos: 0, idOperario: 0 },
                    rebobinadora: { kilogramosCumplidos: 0, idOperario: 0 }
                };

                data.forEach(tarea => {
                    console.log(tarea);
                    if (tarea.idoperario === 1) {
                        sumas.extrusora.kilogramosCumplidos += tarea.kilogramoscumplidos;
                        sumas.extrusora.idOperario += tarea.idoperario;
                    } else {
                        sumas.rebobinadora.kilogramosCumplidos += tarea.kilogramoscumplidos;
                        sumas.rebobinadora.idOperario += tarea.idoperario;
                    }
                });

                return sumas;
            }

        // Función para dibujar el gráfico de sumas por tipo de operario
        function drawSumaTareasChart(sumasTareas) {
            var sumaData = google.visualization.arrayToDataTable([
                ['Maquina', 'Kilogramos Cumplidos'],
                ['Extrusora', sumasTareas.extrusora.kilogramosCumplidos],
                ['Rebobinadora', sumasTareas.rebobinadora.kilogramosCumplidos]
            ]);

            var sumaOptions = {
                title: 'Suma de Kilogramos Cumplidos por Maquina',
                bars: 'horizontal', // Barras horizontales
                hAxis: { title: 'Total' },
                colors: ['#3366CC'] // Asigna colores a las barras
            };

            var sumaChart = new google.charts.Bar(document.getElementById('chart_div_kg'));

            sumaChart.draw(sumaData, google.charts.Bar.convertOptions(sumaOptions));
        }


            // Función para dibujar la tabla de sumas por tipo de operario
            function drawSumaTareasTable(sumasTareas) {
                const tableDiv = document.getElementById('table_div_kg');
                tableDiv.innerHTML = ''; // Limpia el contenido anterior de la tabla

                $(tableDiv).append('<table id="tabla_suma" class="display table table-bordered" style="width:100%"></table>');

                const sumaTableData = [
                    ['Tipo de Operario', 'Kilogramos Cumplidos', 'ID Operario'],
                    ['Extrusora', sumasTareas.extrusora.kilogramosCumplidos, sumasTareas.extrusora.idOperario],
                    ['Rebobinadora', sumasTareas.rebobinadora.kilogramosCumplidos, sumasTareas.rebobinadora.idOperario]
                ];

                $('#tabla_suma').DataTable({
                    language: {
                        "url": "../assets/vendor/libs/datatables/datatables.es.json"
                    },
                    data: sumaTableData,
                    columns: [
                        { title: 'Maquina' },
                        { title: 'Kilogramos Cumplidos' },
                    ]
                });
            }
        },
        error: function (error) {
            console.log('Error al obtener datos de tareas:', error);
        }
    });

});
