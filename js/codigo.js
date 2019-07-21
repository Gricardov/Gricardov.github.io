// Los valores predeterminados
const RAZONSOCIAL = "Razón social predeterminada";
const RUC = "123456789";
const DIRECCION = "Mi dirección predeterminada";
const TELEFONO = "987654321";
const IGV = 18;

// Las acciones
const MODIFICAR = 1;
const ELIMINAR = 2;

// Los valores seleccionados
// Arreglos, textos, etc
let idSeleccionado = -1;
let accionActual = -1;
let igvSeleccionado = IGV;
let productos = [];
let fechaActual = new Date();
//let fechaActualCadena = fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + " ";

// Cargo los valores predeterminados
$('#txtRazonSocial').val(RAZONSOCIAL)
$('#txtRuc').val(RUC);
$('#txtDireccion').val(DIRECCION);
$('#txtTelefono').val(TELEFONO);
$('#txtConsiderarIGV').val(IGV);
//$('.txtFecha').val(fechaActualCadena);

// Truquito para aplicar fecha
document.getElementById("txtNAFecha").valueAsDate = new Date();
document.getElementById("txtLHFecha").valueAsDate = new Date();
document.getElementById("txtGFecha").valueAsDate = new Date();

// Cargo el deslizador de página
$("#contenedor").page();



// Manejo de botones y cambios

function cargarDatosCampos(id) {

    let producto = null;

    for (var i = 0; i < productos.length; i++) {
        if (productos[i].id == id) {
            producto = productos[i];
        }
    }
    // Muestra los campos en el formulario para poder editarlos
    if (producto) {
        $("#txtDescripcion").val(producto.descripcion);
        $("#txtMarca").val(producto.marca);
        $("#cboUnidad").val(producto.unidad);
        $("#txtCantidad").val(producto.cantidad);
        $("#txtPrecio").val(producto.precio);
        $("#txtPrecioConIGV").val(producto.precioConIGV);
        $("#txtIGVCalculado").val(producto.igvCalculado);
        $("#txtPrecioSinIGV").val(producto.precioSinIGV);

        // Y enfoco el txtDescripcion
        $("#txtDescripcion").focus();

    }

}

function limpiarCampos() {
    $("#txtDescripcion").val("");
    $("#txtMarca").val("");
    $("#cboUnidad").prop('selectedIndex', 0);
    $("#txtCantidad").val("0");
    $("#txtPrecio").val("0.00");
    $("#txtPrecioSinIGV").val("0.00");
    $("#txtIGVCalculado").val("0.00");
    $("#txtPrecioConIGV").val("0.00");

}

function actualizarTabla() {

    // Vacío la tabla
    $("#tabla").empty();

    // Reescribo el encabezado
    $("#tabla").append(`
   <div class="fila-tabla encabezado-tabla blue">
                         <div class="celda-tabla">
                           Item
                         </div>
                         <div class="celda-tabla">
                           Descripción
                         </div>
                         <div class="celda-tabla">
                           Marca/Procedencia
                         </div>
                         <div class="celda-tabla">
                           Unidad
                         </div>
                         <div class="celda-tabla">
                           Cantidad
                         </div>
                         <div class="celda-tabla">
                           Precio unidad
                         </div>
                         <div class="celda-tabla">
                           Total con IGV
                         </div>
                         <div class="celda-tabla">
                           IGV calculado
                         </div>
                         <div class="celda-tabla">
                           Total sin IGV
                         </div>
                         <div class="celda-tabla">                            
                         </div>
                         <div class="celda-tabla">                            
                         </div>
                       </div>
   `)

    for (var i = 0; i < productos.length; i++) {

        let producto = productos[i];

        $("#tabla").append(`<div class="fila-tabla">
                         <div class="celda-tabla">
                           ${producto.id}
                         </div>
                         <div class="celda-tabla">
                           ${producto.descripcion}
                         </div>
                         <div class="celda-tabla">
                           ${producto.marca}
                         </div>
                         <div class="celda-tabla">
                           ${producto.unidad}
                         </div>
                         <div class="celda-tabla">
                           ${producto.cantidad}
                         </div>
                         <div class="celda-tabla">
                           ${producto.precio}
                         </div>
                         <div class="celda-tabla">
                           ${producto.precioConIGV}
                         </div>
                         <div class="celda-tabla">
                           ${producto.igvCalculado}
                         </div>
                         <div class="celda-tabla">
                           ${producto.precioSinIGV}
                         </div>
                         <div class="celda-tabla editarRegistro" style="cursor:pointer;" data-id=${producto.id}>
                           <i class="fa fa-edit"></i> Editar
                         </div>
                         <div class="celda-tabla borrarRegistro" style="cursor:pointer;" data-id=${producto.id}>
                           <i class="fa fa-trash"></i> Borrar
                         </div>
                       </div>
`);

    }

    // Finalmente, calculo el total de todo
    calcularTodoTotal();

}

function agregarProducto(producto) {
    productos.push(producto);
    actualizarTabla();
    limpiarCampos();
    $("#txtDescripcion").focus();
}

function modificarProducto(producto) {
    for (var i = 0; i < productos.length; i++) {
        if (productos[i].id == producto.id) {
            productos[i] = producto;
        }
    }
    actualizarTabla();

}

function eliminarProducto(id) {

    for (var i = 0; i < productos.length; i++) {
        if (productos[i].id == id) {
            productos.splice(i, 1);
        }
    }

    actualizarTabla();

}

function calcularTodoTotal() {
    let acumulado = 0;

    // Recorro el arreglo y sumo los totales
    for (var i = 0; i < productos.length; i++) {
        acumulado += parseFloat(productos[i].precioConIGV);
    }
    $("#txtTotalTodo").val(acumulado.toFixed(2));

}

function calcularPrecioConIGVSinIGV(cantidad, precio) {

    let precioConIGV = parseFloat(cantidad * precio).toFixed(2);
    let precioSinIGV = parseFloat((precioConIGV * 100) / (100 + igvSeleccionado)).toFixed(2);
    $("#txtPrecioConIGV").val(precioConIGV);
    $("#txtPrecioSinIGV").val(precioSinIGV);
    $("#txtIGVCalculado").val(parseFloat(precioConIGV - precioSinIGV).toFixed(2));

}

// Hago los cálculos apenas cambie un campo
$("#txtCantidad").on('input', function () {
    let cantidad = $("#txtCantidad").val();
    let precio = $("#txtPrecio").val();
    if (!isNaN(cantidad) && !isNaN(precio)) {
        calcularPrecioConIGVSinIGV(cantidad, precio);
    }

});

$("#txtPrecio").on('input', function () {
    let cantidad = $("#txtCantidad").val();
    let precio = $("#txtPrecio").val();
    if (!isNaN(cantidad) && !isNaN(precio)) {
        calcularPrecioConIGVSinIGV(cantidad, precio);
    }

});

// Agrego los campos al hacer click en Agregar
$("#btnAgregar").click(function (e) {

    let descripcion = $("#txtDescripcion").val();
    let marca = $("#txtMarca").val();
    let unidad = $("#cboUnidad").val();
    let cantidad = parseInt($("#txtCantidad").val(), 10);
    let precio = parseFloat($("#txtPrecio").val());
    let precioSinIGV = parseFloat($("#txtPrecioSinIGV").val());
    let igvCalculado = parseFloat($("#txtIGVCalculado").val());
    let precioConIGV = parseFloat($("#txtPrecioConIGV").val());
    // Primero, verifico si hay campos vacíos 
    if (descripcion != "" && marca != "" && unidad != "" && cantidad != null && !isNaN(cantidad) && precio != null && !isNaN(precio)
        && precioSinIGV != null && !isNaN(precioSinIGV) && precioConIGV != null && !isNaN(precioConIGV)) {
        // Si todo está bien, que se agregue al arreglo
        $('#mensajeForm2').empty();

        let producto = {};
        producto.id = productos.length + 1;
        producto.descripcion = descripcion;
        producto.marca = marca;
        producto.unidad = unidad;
        producto.cantidad = cantidad;
        producto.precio = precio;
        producto.precioSinIGV = precioSinIGV;
        producto.igvCalculado = igvCalculado;
        producto.precioConIGV = precioConIGV;
        agregarProducto(producto);

    } else {
        $("#contenedor").page().shake();
        $('#mensajeForm2').empty();
        $('#mensajeForm2').append('<div class="alert alert-danger" role="alert">Verifique que todos los campos se han llenado correctamente, incluyendo números</div>');
    }

})

// Actualizo el registro seleccionado
$("#btnActualizar").click(function (e) {
    //
    let descripcion = $("#txtDescripcion").val();
    let marca = $("#txtMarca").val();
    let unidad = $("#cboUnidad").val();
    let cantidad = parseInt($("#txtCantidad").val(), 10);
    let precio = parseFloat($("#txtPrecio").val());
    let precioSinIGV = parseFloat($("#txtPrecioSinIGV").val());
    let igvCalculado = parseFloat($("#txtIGVCalculado").val());
    let precioConIGV = parseFloat($("#txtPrecioConIGV").val());

    // Primero, verifico si hay campos vacíos 
    if (descripcion != "" && marca != "" && unidad != "" && cantidad != null && !isNaN(cantidad) && precio != null && !isNaN(precio)
        && precioSinIGV != null && !isNaN(precioSinIGV) && precioConIGV != null && !isNaN(precioConIGV)) {
        // Si todo está bien, que se agregue al arreglo
        $('#mensajeForm2').empty();

        let producto = {};
        producto.id = idSeleccionado;
        producto.descripcion = descripcion;
        producto.marca = marca;
        producto.unidad = unidad;
        producto.cantidad = cantidad;
        producto.precio = precio;
        producto.precioConIGV = precioConIGV;
        producto.igvCalculado = igvCalculado;
        producto.precioSinIGV = precioSinIGV;
        modificarProducto(producto);
        limpiarCampos();
        // Deshabilito el btnActualizar, eliminar y habilito el agregar
        $('#btnActualizar').attr("disabled", true);
        $('#btnCancelar').attr("disabled", true);
        $('#btnAgregar').attr("disabled", false);

        accionActual = -1;
        idSeleccionado = -1;

    } else {
        $("#contenedor").page().shake();
        $('#mensajeForm2').empty();
        $('#mensajeForm2').append('<div class="alert alert-danger" role="alert">Verifique que todos los campos se han llenado correctamente, incluyendo números</div>');
    }

})

// Cancelo la acción actual y dejo todo como estaba
$("#btnCancelar").click(function (e) {

    accionActual = -1;
    idSeleccionado = -1;

    limpiarCampos();

    // Habilito el btnActualizar, eliminar y deshabilito el agregar
    $('#btnActualizar').attr("disabled", true);
    $('#btnCancelar').attr("disabled", true);
    $('#btnAgregar').attr("disabled", false);

})

// Los botones que se encuentran en cada registro

$("#tabla").on("click", ".editarRegistro", function (ev) {
    var id = $(ev.target).attr("data-id");
    // Luego, establezco el id y su acción actual
    accionActual = MODIFICAR;
    idSeleccionado = id;

    // Habilito el btnActualizar, eliminar y deshabilito el agregar
    $('#btnActualizar').attr("disabled", false);
    $('#btnCancelar').attr("disabled", false);
    $('#btnAgregar').attr("disabled", true);

    cargarDatosCampos(id);

});

$("#tabla").on("click", ".borrarRegistro", function (ev) {
    var id = $(ev.target).attr("data-id");
    $("#cuerpoModalOpcion").empty();
    $("#cuerpoModalOpcion").append(`<p>¿Deseas borrar el item ${id}?</p>`);

    // Luego, establezco el id y su acción actual
    accionActual = ELIMINAR;
    idSeleccionado = id;

    $("#modalOpcion").modal()

});

// Manejo de los botones del modal de opciones
$("#btnSi").on("click", function (ev) {
    if (accionActual == ELIMINAR) {
        eliminarProducto(idSeleccionado);
        accionActual = -1;
        idSeleccionado = -1;
    }
});

$("#btnNo").on("click", function (ev) {
    accionActual = -1;
    idSeleccionado = -1;
});

// Manejo de deslizador de página

// La función de validación para mostrar el registro 2
$("#btnMostrarReg2").click(function (ev) {
    var razonSocial = $('#txtRazonSocial').val();
    var ruc = $('#txtRuc').val()
    var direccion = $('#txtDireccion').val()
    var telefono = $('#txtTelefono').val()
    var igv = $('#txtConsiderarIGV').val()

    if (razonSocial == "" || ruc == "" || direccion == "" || telefono == "" || igv == "") {
        $("#contenedor").page().shake();
        $('#mensajeForm1').empty();
        $('#mensajeForm1').append('<div class="alert alert-danger" role="alert">Hay campos vacíos</div>');
        return;
    }

    // Pasa a la siguiente página
    var page = $(ev.target).attr("data-page-name");

    var trans = $(ev.target).attr("data-page-trans");

    if ($("#contenedor").page().fetch(page) === null) {

        $("#contenedor").page().shake();
    }
    else {
        $("#contenedor").page().transition(page, trans);
    }

    // Borro el mensaje de error si es que lo hay
    $('#mensajeForm1').empty();

    // Guardo el IGV según el elegido
    igvSeleccionado = parseInt($('#txtConsiderarIGV').val(), 10);

    // Muestro el IGV guardado
    $('#txtIGV').val(igvSeleccionado);

    // Cambio el título del encabezado
    $('#encabezado').empty();
    $('#encabezado').append(`
     <div class="col-md-5" style="margin-top: 10px; cursor: pointer;" data-page-name="1"
                     data-page-trans="slide-in-from-left" id="btnMostrarReg1">
     <i class="fa fa-angle-left"></i> Retroceder 
     </div>
     <div class="col-md-7">
     <h4 class="float-left">Generar cotización</h4>
     </div>`);

});

// Retrocede al registro 1
$("#encabezado").on("click", "#btnMostrarReg1", function (ev) {
    var page = $(ev.target).attr("data-page-name");

    var trans = $(ev.target).attr("data-page-trans");

    if ($("#contenedor").page().fetch(page) === null) {

        $("#contenedor").page().shake();
    }
    else {
        $("#contenedor").page().transition(page, trans);
    }

    // Cambio el título del encabezado
    $('#encabezado').empty();
    $('#encabezado').append(`<div class="col-md-offset-5 col-md-7">
         <h4 class="float-left">Generar factura</h4></div>`);

});



// Script para excel
$.support.cors = true;

var workbook = new ExcelJS.Workbook();

// Esto pone borde, valor y fondo a la celda
function establecerValorCelda(worksheet, celda, valor, colorFuente, colorFondo, esNegrita, colorBorde, fuente, tamano, esBordeGrueso) {

    // Valido si se ha pasado un valor para la fuente. Si no, que use calibri
    let fuenteAux = "Calibri";
    let tamanoAux = 11;
    if (fuente) {
        fuenteAux = fuente;
    }
    if (tamano) {
        tamanoAux = tamano;
    }

    // Si le paso un color de fondo, que lo aplique
    if (colorFondo) {
        worksheet.getCell(celda).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: colorFondo }
        };
    }

    if (colorBorde) {
        worksheet.getCell(celda).border = {
            top: { style: esBordeGrueso ? 'medium' : 'thin', color: { argb: colorBorde } },
            left: { style: esBordeGrueso ? 'medium' : 'thin', color: { argb: colorBorde } },
            bottom: { style: esBordeGrueso ? 'medium' : 'thin', color: { argb: colorBorde } },
            right: { style: esBordeGrueso ? 'medium' : 'thin', color: { argb: colorBorde } }
        };
    }

    if (valor) {
        let valorAux = valor.toString().toUpperCase();
        worksheet.getCell(celda).value = {
            "richText": [
                {
                    "font": { "bold": esNegrita, "size": tamanoAux, "color": { "argb": colorFuente }, "name": fuenteAux },
                    "text": valorAux
                }
            ]
        };
    }


}

function establecerFormulaCelda(worksheet, celda, formula, colorFondo, colorBorde) {
    worksheet.getCell(celda).value = { formula: formula };

    // Si le paso un color de fondo, que lo aplique
    if (colorFondo) {
        worksheet.getCell(celda).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: colorFondo }
        };
    }
    if (colorBorde) {
        worksheet.getCell(celda).border = {
            top: { style: 'thin', color: { argb: colorBorde } },
            left: { style: 'thin', color: { argb: colorBorde } },
            bottom: { style: 'thin', color: { argb: colorBorde } },
            right: { style: 'thin', color: { argb: colorBorde } }
        };
    }
}

function unirCeldas(worksheet, inicio, fin, valor, colorBorde, colorFuente, colorFondo, esNegrita, esBordeGrueso, fuente, tamano) {

    establecerValorCelda(worksheet, inicio, valor, colorFuente, colorFondo, esNegrita, colorBorde, fuente, tamano, esBordeGrueso);

    worksheet.getCell(inicio).alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.mergeCells(inicio + ":" + fin);

}

function agregarFinPlantillaGlassgow(worksheet, filInicio, workbook) {

    let fechaSeleccionada = new Date($('#txtGFecha').val());
    let dia = fechaSeleccionada.getDate() + 1;
    let mes = fechaSeleccionada.getMonth() + 1 < 10 ? '0' + (fechaSeleccionada.getMonth() + 1).toString() : fechaSeleccionada.getMonth() + 1 < 10;
    let anio = fechaSeleccionada.getFullYear();

    return new Promise((resolve, reject) => {

        // Cabeza del formato
        establecerValorCelda(worksheet, 'C3', $('#txtGRazonSocial').val());
        establecerValorCelda(worksheet, 'C4', $('#txtGDireccion').val());
        establecerValorCelda(worksheet, 'F3', $('#txtGRUC').val());
        establecerValorCelda(worksheet, 'F4', $('#txtGTelefono').val());
        establecerValorCelda(worksheet, 'C6', $('#txtGSenores').val());
        establecerValorCelda(worksheet, 'C7', $('#txtGRUCdestinatario').val());
        establecerValorCelda(worksheet, 'C8', $('#txtGDireccionDestinatario').val());
        establecerValorCelda(worksheet, 'F6', dia + '/' + mes + '/' + anio);
        establecerValorCelda(worksheet, 'F7', $('#txtGNumCot').val());
        establecerValorCelda(worksheet, 'F8', $('#txtGValidezOferta').val());

        // Pie del formato
        unirCeldas(worksheet, `A${filInicio + 3}`, `G${filInicio + 3}`)
        unirCeldas(worksheet, `A${filInicio + 4}`, `B${filInicio + 9}`, "CONDICIONES:", true, "ffffff", "0b5961", true)
        establecerValorCelda(worksheet, `C${filInicio + 4}`, "FORMA DE PAGO:", "ffffff", "0b5961", true, '000000')
        establecerValorCelda(worksheet, `C${filInicio + 5}`, "PRECIO:", "ffffff", "0b5961", true, '000000')
        establecerValorCelda(worksheet, `C${filInicio + 6}`, "IMPUESTOS:", "ffffff", "0b5961", true, '000000')
        establecerValorCelda(worksheet, `C${filInicio + 7}`, "CUENTA BANCARIA- CCI:", "ffffff", "0b5961", true, '000000')
        establecerValorCelda(worksheet, `C${filInicio + 8}`, "ENTREGA:", "ffffff", "0b5961", true, '000000')
        establecerValorCelda(worksheet, `C${filInicio + 9}`, "GARANTÍA", "ffffff", "0b5961", true, '000000')

        establecerValorCelda(worksheet, `D${filInicio + 4}`, $('#txtGFormaPago').val(), null, null, false, '000000')
        establecerValorCelda(worksheet, `D${filInicio + 5}`, $('#txtGPrecio').val(), null, null, false, '000000')
        establecerValorCelda(worksheet, `D${filInicio + 6}`, $('#txtGImpuestos').val(), null, null, false, '000000')
        establecerValorCelda(worksheet, `D${filInicio + 7}`, $('#txtGCB').val(), null, null, false, '000000')
        establecerValorCelda(worksheet, `D${filInicio + 8}`, $('#txtGEntrega').val(), null, null, false, '000000')
        establecerValorCelda(worksheet, `D${filInicio + 9}`, $('#txtGGarantia').val(), null, null, false, '000000')

        unirCeldas(worksheet, `E${filInicio + 4}`, `G${filInicio + 9}`, "", "000000")

        // Verifico si el usuario quiere que se muestre la imagen
        if ($('#chkGenerarFirmaGlassgow').prop('checked')) {

            leerImagen("../imagenes/firmaGlassgow.png", "png").then(data => {

                var firmaGlassgow = workbook.addImage({
                    base64: data,
                    extension: 'png',
                });

                // Aquí agrego la imagen a las celdas que necesito
                worksheet.addImage(firmaGlassgow, {
                    tl: { col: 4.9, row: filInicio + 4 },
                    ext: { width: 170, height: 80 }
                });

                resolve("Imagen leída satisfactoriamente");
            }, error => {

                var mensErr = new Error(error.message);
                throw mensErr;

            }).catch(error => {
                console.log("Error : " + error.message);
                resolve("Error al leer la imagen");
            })
        } else {
            resolve("El usuario decidió no leer la imagen");
        }

    })

}

function agregarFinPlantillaLH(ws, filaInicio, workbook) {

    // Formateo la fecha seleccionada
    let fechaSeleccionada = new Date($('#txtLHFecha').val());
    let dia = fechaSeleccionada.getDate() + 1;
    let mes = fechaSeleccionada.getMonth() + 1 < 10 ? '0' + (fechaSeleccionada.getMonth() + 1).toString() : fechaSeleccionada.getMonth() + 1 < 10;
    let anio = fechaSeleccionada.getFullYear();

    return new Promise((resolve, reject) => {
        // Cabeza del formato

        // Agrego los datos de la empresa
        ws.getCell(`B1`).alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };

        establecerValorCelda(ws, 'B1', ` \r\n${$('#txtLHRazonSocial').val()}\r\nRUC: ${$('#txtLHRUC').val()}\r\n${$('#txtLHDireccion').val()}\r\nTELÉFONO: ${$('#txtLHTelefono').val()}\r\nCORREO: ${$('#txtLHCorreo').val()}`,
            '516379', null, true, null, 'Leelawadee', 11, false)

        establecerValorCelda(ws, 'C3', $('#txtLHSenores').val(), '516379', null, true, null, 'Leelawadee', 12, false);
        establecerValorCelda(ws, 'C4', $('#txtLHResponsable').val(), '516379', null, true, null, 'Leelawadee', 12, false);
        establecerValorCelda(ws, 'C5', $('#txtLHDireccionDestinatario').val(), '516379', null, true, null, 'Leelawadee', 12, false);
        establecerValorCelda(ws, 'G3', $('#txtLHRUCDestinatario').val(), '516379', null, true, null, 'Leelawadee', 12, false);
        establecerValorCelda(ws, 'G4', dia + '/' + mes + '/' + anio, '516379', null, true, null, 'Leelawadee', 12, false);
        establecerValorCelda(ws, 'G5', $('#txtLHNumCot').val(), '516379', null, true, null, 'Leelawadee', 12, false);


        // Agrego los bordes para los cuadritos que faltan
        let colorBorde = "299b5d";
        let estiloBorde = "medium";

        ws.getCell(`F{${filaInicio + 1}}`).border = {
            top: { style: estiloBorde, color: { argb: colorBorde } },
            left: { style: estiloBorde, color: { argb: colorBorde } }
        }

        ws.getCell(`F{${filaInicio + 2}}`).border = {
            left: { style: estiloBorde, color: { argb: colorBorde } }
        }

        ws.getCell(`F{${filaInicio + 3}}`).border = {
            left: { style: estiloBorde, color: { argb: colorBorde } },
            bottom: { style: estiloBorde, color: { argb: colorBorde } }
        }

        ws.getCell(`G{${filaInicio + 1}}`).border = {
            top: { style: estiloBorde, color: { argb: colorBorde } },
            right: { style: estiloBorde, color: { argb: colorBorde } }
        }

        ws.getCell(`G{${filaInicio + 2}}`).border = {
            right: { style: estiloBorde, color: { argb: colorBorde } }
        }

        ws.getCell(`G{${filaInicio + 3}}`).border = {
            right: { style: estiloBorde, color: { argb: colorBorde } },
            bottom: { style: estiloBorde, color: { argb: colorBorde } }
        }

        ws.getCell(`B{${filaInicio + 5}}`).border = {
            top: { style: estiloBorde, color: { argb: colorBorde } },
            left: { style: estiloBorde, color: { argb: colorBorde } },
            right: { style: estiloBorde, color: { argb: colorBorde } },
            bottom: { style: estiloBorde, color: { argb: colorBorde } }
        }

        // Agrego el cuadro de observaciones

        unirCeldas(ws, `B${filaInicio + 5}`, `G${filaInicio + 14}`, `OBSERVACIONES:\r\n\r\nGARANTIA: ${$('#txtLHGarantia').val()}\r\nCONDICIONES: ${$('#txtLHCondiciones').val()}\r\nENTREGA: ${$('#txtLHEntrega').val()}`,
            colorBorde, '516379', null, true, true, 'Leelawadee', '12');
        ws.getCell(`B${filaInicio + 5}`).alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };

        // Variables que controlan la lectura de las imágenes
        let sellitoListo = false;
        let firmaLista = false;


        // Verifico si el usuario quiere que se muestre el sellito
        if ($('#chkGenerarSellitoBPALH').prop('checked')) {

            leerImagen("../imagenes/sellitoBPALH.png", "png").then(data => {

                var firmaGlassgow = workbook.addImage({
                    base64: data,
                    extension: 'png',
                });

                // Aquí agrego la imagen a las celdas que necesito
                ws.addImage(firmaGlassgow, {
                    tl: { col: 4.9, row: filaInicio + 4 },
                    ext: { width: 170, height: 80 }
                });
                sellitoListo = true;

                if (sellitoListo && firmaLista) {
                    resolve("Sellito leído satisfactoriamente");
                }
            }, error => {

                var mensErr = new Error(error.message);
                throw mensErr;

            }).catch(error => {
                console.log("Error : " + error.message);
                sellitoListo = true;
                if (sellitoListo && firmaLista) {

                    resolve("Error al leer el sellito");
                }
            })
        } else {
            sellitoListo = true;
            if (sellitoListo && firmaLista) {

                resolve("El usuario decidió no leer el sellito");
            }
        }

        if ($('#chkGenerarFirmaLH').prop('checked')) {

            leerImagen("../imagenes/firmaLH.png", "png").then(data => {

                var firmaGlassgow = workbook.addImage({
                    base64: data,
                    extension: 'png',
                });

                // Aquí agrego la imagen a las celdas que necesito
                ws.addImage(firmaGlassgow, {
                    tl: { col: 4.9, row: filaInicio + 4 },
                    ext: { width: 170, height: 80 }
                });
                firmaLista = true;
                if (sellitoListo && firmaLista) {

                    resolve("Firma leída satisfactoriamente");
                }
            }, error => {

                var mensErr = new Error(error.message);
                throw mensErr;

            }).catch(error => {
                console.log("Error : " + error.message);
                firmaLista = true;
                if (sellitoListo && firmaLista) {

                    resolve("Error al leer la firma");
                }
            })
        } else {
            firmaLista = true;
            if (sellitoListo && firmaLista) {

                resolve("El usuario decidió no leer la firma");
            }
        }

    })


}

function agregarFinPlantillaNA(ws, filInicio, workbook) {
    // Cabeza del formato

    // Datos de la proforma
    let fechaSeleccionada = new Date($('#txtNAFecha').val());

    establecerValorCelda(ws, 'I8', fechaSeleccionada.getDate() + 1, '898989');

    establecerValorCelda(ws, 'J8', fechaSeleccionada.getMonth() + 1 < 10 ? '0' + (fechaSeleccionada.getMonth() + 1).toString() : fechaSeleccionada.getMonth() + 1 < 10, '898989');
    establecerValorCelda(ws, 'K8', fechaSeleccionada.getFullYear(), '898989');

    establecerValorCelda(ws, 'I11', `${$('#txtNARUC').val()}`, '898989');

    // Filiación
    establecerValorCelda(ws, 'C12', $('#txtNASenores').val());
    establecerValorCelda(ws, 'C13', $('#txtNAAtencion').val());
    establecerValorCelda(ws, 'C14', $('#txtNADireccion').val());

}

// Esto es una promesa; y siempre te va a decir la verdad en la cara,
// te rechace o te resuelva. No como ella, que salió y se besó con alguien
// más, aun habiendo jurado que me amaba solo a mí.
function leerPlantilla(excelUrl) {

    return new Promise((resolve, reject) => {

        var req = new XMLHttpRequest();
        req.open("GET", excelUrl, true);//
        req.responseType = "arraybuffer";

        req.onload = function (e) {
            if (req.status == 200) {
                var data = req.response;

                workbook.xlsx.load(data).then(function (workbook) {
                    resolve(workbook);
                })
            } else {
                reject('El servidor ha respondido con estado ' + req.status);
            }

        }
        req.send();

    })

}

function leerImagen(imgUrl, extension) {
    return new Promise((resolve, reject) => {

        var req = new XMLHttpRequest();
        req.open("GET", imgUrl, true);
        req.responseType = "arraybuffer";

        req.onload = function (e) {
            if (req.status == 200) {
                var blob = new Uint8Array(req.response);
                //encode with base64
                var uri = "data:image/" + extension + ";base64," + Base64.encode(blob);
                resolve(uri);

            } else {
                reject('El servidor ha respondido con estado ' + req.status);
            }

        }
        req.send();

    })
}

function generarExcelGlassgow() {


    // Establece los índices de inicio de las filas y columnas
    let filInicio = 11;
    let colInicio = 1;

    // Uso promesas para esperar a que termine de leer la plantila
    leerPlantilla("../plantillas/formatoGlassgowSimple.xlsx")
        .then((workbook) => {

            const ws = workbook.getWorksheet('1');

            // Por cada uno de los productos, lleno los registros del Excel
            for (var i = 0; i < productos.length; i++) {

                let producto = productos[i];
                establecerValorCelda(ws, `A${filInicio}`, `${producto.id}`, null, null, false, '000000');
                establecerValorCelda(ws, `B${filInicio}`, `${producto.cantidad}`, null, null, false, '000000');
                establecerValorCelda(ws, `C${filInicio}`, producto.unidad, null, null, false, '000000');
                establecerValorCelda(ws, `D${filInicio}`, producto.descripcion, null, null, false, '000000');
                establecerValorCelda(ws, `E${filInicio}`, producto.marca, null, null, false, '000000');
                establecerValorCelda(ws, `F${filInicio}`, `${producto.precio}`, null, null, false, '000000');
                //establecerValorCelda(ws, `G${filInicio}`, producto.precioConIGV);

                // Establezco la fórmula para los subtotales de cada registro (=precioConIGV)
                establecerFormulaCelda(ws, `G${filInicio}`, `=TRUNC((B${(filInicio)}*F${(filInicio)}),2)`, null, '000000')

                filInicio++;
            }

            // Para los totales de todos los registros
            // Primero, el total (Suma simple)
            establecerValorCelda(ws, `F${filInicio + 2}`, "TOTAL", "ffffff", "0b5961", true, '000000');
            establecerFormulaCelda(ws, `G${filInicio + 2}`, `=TRUNC(SUM(G11:G${(filInicio - 1)}),2)`, null, '000000')

            // Luego, el subtotal (precioConIGV*100)/(100+igvSeleccionado)
            establecerValorCelda(ws, `F${filInicio}`, "SUBTOTAL", "ffffff", "0b5961", true, '000000');
            establecerFormulaCelda(ws, `G${filInicio}`, `=TRUNC(((G${filInicio + 2}*100)/(100+${igvSeleccionado})),2)`, null, '000000')

            // Luego, el IGV (total-subtotal)
            establecerValorCelda(ws, `F${filInicio + 1}`, "IGV", "ffffff", "0b5961", true), '000000';
            establecerFormulaCelda(ws, `G${filInicio + 1}`, `=TRUNC((G${filInicio + 2}-G${filInicio}),2)`, null, '000000')

            // Luego, establezco la parte final para la plantilla de Glassgow
            agregarFinPlantillaGlassgow(ws, filInicio, workbook)
                .then(mensaje => {
                    guardarExcel(workbook, 'cotizacionGlassgow');
                })

        }, error => {

            var mensErr = new Error(error.message);
            throw mensErr;

        })
        .catch((error) => {
            alert(error);
        })

}

function generarExcelLH() {

    // Establece los índices de inicio de las filas y columnas
    let filInicio = 9;
    let colInicio = 2;

    // Uso promesas para esperar a que termine de leer la plantila
    leerPlantilla("../plantillas/formatoLHSimple.xlsx")
        .then((workbook) => {

            const ws = workbook.getWorksheet('1');

            // Por cada uno de los productos, lleno los registros del Excel
            for (var i = 0; i < productos.length; i++) {

                let producto = productos[i];

                // Este formato requiere unir las celdas B y C de descripción
                unirCeldas(ws, `B${filInicio}`, `C${filInicio}`, producto.descripcion, '28a98a', null, null, false, false, 'Leelawadee', 11);
                establecerValorCelda(ws, `D${filInicio}`, producto.marca, null, null, false, '28a98a', 'Leelawadee', 11, false)
                establecerValorCelda(ws, `E${filInicio}`, `${producto.cantidad}`, null, null, false, '28a98a', 'Leelawadee', 11, false);
                establecerValorCelda(ws, `F${filInicio}`, `${producto.precio}`, null, null, false, '28a98a', 'Leelawadee', 11, false);

                // Establezco la fórmula para los subtotales de cada registro (=precioConIGV)
                establecerFormulaCelda(ws, `G${filInicio}`, `=TRUNC((E${(filInicio)}*F${(filInicio)}),2)`, null, '28a98a');

                filInicio++;
            }

            // Para los totales de todos los registros
            // Primero, el total (Suma simple)
            establecerValorCelda(ws, `F${filInicio + 3}`, "TOTAL:", '516379', null, true, '28a98a', 'Leelawadee', 13, true);
            establecerFormulaCelda(ws, `G${filInicio + 3}`, `=TRUNC(SUM(G9:G${(filInicio - 1)}),2)`, null, '28a98a');

            // Luego el subtotal (precioConIGV*100)/(100+igvSeleccionado)
            establecerValorCelda(ws, `F${filInicio + 1}`, "SUB TOTAL:", '516379', null, true, '28a98a', 'Leelawadee', 13, true);
            establecerFormulaCelda(ws, `G${filInicio + 1}`, `=TRUNC(((G${filInicio + 3}*100)/(100+${igvSeleccionado})),2)`, null, '28a98a');

            // Luego, el IGV (total-subtotal)
            establecerValorCelda(ws, `F${filInicio + 2}`, "I.G.V.:", '516379', null, true, '28a98a', 'Leelawadee', 13, true);
            establecerFormulaCelda(ws, `G${filInicio + 2}`, `=TRUNC((G${filInicio + 3}-G${filInicio + 1}),2)`, null, '28a98a');

            // Luego, establezco la parte final para la plantilla de LH
            agregarFinPlantillaLH(ws, filInicio, workbook)
                .then(mensaje => {
                    guardarExcel(workbook, 'cotizacionLH');

                })

        }, error => {

            var mensErr = new Error(error.message);
            throw mensErr;

        })
        .catch((error) => {
            alert(error);
        })

}

function generarExcelNA() {

    // Establece los índices de inicio de las filas y columnas
    let filInicio = 18;
    let colInicio = 1;

    // Uso promesas para esperar a que termine de leer la plantila
    leerPlantilla("../plantillas/formatoNASimple.xlsx")
        .then((workbook) => {

            const ws = workbook.getWorksheet('1');

            // Por cada uno de los productos, lleno los registros del Excel
            for (var i = 0; i < productos.length; i++) {

                let producto = productos[i];
                // Este formato requiere unir las celdas A y B de cantidad
                unirCeldas(ws, `A${filInicio}`, `B${filInicio}`, `${producto.cantidad}`, '000000');
                establecerValorCelda(ws, `C${filInicio}`, producto.unidad, null, null, null, '000000');

                // Este formato requiere unir las celdas D a G de descripción
                unirCeldas(ws, `D${filInicio}`, `G${filInicio}`, producto.descripcion, '000000');
                establecerValorCelda(ws, `H${filInicio}`, `${producto.precio}`, null, null, null, '000000');

                // Establezco la fórmula para los subtotales de cada registro (=precioConIGV)
                establecerFormulaCelda(ws, `I${filInicio}`, `=TRUNC((A${(filInicio)}*H${(filInicio)}),2)`, null, '000000');

                filInicio++;
            }

            // Para los totales de todos los registros
            // Primero, el total (Suma simple)
            establecerValorCelda(ws, `H${filInicio}`, "Total", "000000", "ffffff", false, '000000');
            establecerFormulaCelda(ws, `I${filInicio}`, `=TRUNC(SUM(I18:I${(filInicio - 1)}),2)`, null, '000000');

            unirCeldas(ws, `A${filInicio + 5}`, `I${filInicio + 5}`, $('#txtNAAnotacion').val(), null, null, false);
            unirCeldas(ws, `A${filInicio + 6}`, `I${filInicio + 6}`, $('#txtNAEntrega').val(), null, null, false);
            unirCeldas(ws, `A${filInicio + 7}`, `I${filInicio + 7}`, $('#txtNAVencimiento').val(), null, null, false);

            // Luego, establezco la parte final para la plantilla de NA
            agregarFinPlantillaNA(ws, filInicio, workbook);
            guardarExcel(workbook, 'cotizacionNA');

        }, error => {

            var mensErr = new Error(error.message);
            throw mensErr;

        })
        .catch((error) => {
            alert(error);
        })

}

function guardarExcel(workbook, nombreArchivo) {
    /*const options = {
          base64: true,
        };
        */
    if (nombreArchivo.substr(-5, 5) !== '.xlsx') {
        nombreArchivo += '.xlsx';
    }
    workbook.xlsx
        .writeBuffer(/*options*/)
        .then(buffer => {
            saveAs(new Blob([buffer], { type: "" }), nombreArchivo)
        })
        .catch(error => {
            alert(JSON.stringify(error))
            throw error;
        });
}

$('#btnExportarGlassgow').click(function () {
    generarExcelGlassgow();
})

$('#btnExportarLH').click(function () {
    generarExcelLH();
})

$('#btnExportarNA').click(function () {
    generarExcelNA();
})

// Clase utilitaria
var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        //input = Base64._utf8_encode(input); //comment out to encode binary file(like image)

        while (i < input.length) {

            chr1 = input[i++];
            chr2 = input[i++];
            chr3 = input[i++];

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
                Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);
        }
        return output;
    }
}

/*https://aymkdn.github.io/ExcelPlus/*
/*https://www.grapecity.com/blogs/how-to-importexport-excel-files-using-javascript-and-spread-sheets*/