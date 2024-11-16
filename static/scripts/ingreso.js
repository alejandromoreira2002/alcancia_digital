var valorIngreso = "";
document.addEventListener('DOMContentLoaded', () => {
    setearFechaActual();
    consultarSaldoActual();
    document.getElementById('valIngreso').addEventListener('keydown', (event) => {
        const LONGMAX = 3;
        event.preventDefault();
        let tecla = event.key;
        console.log(tecla=="Backspace");
        let nuevoTexto = "";
        if(tecla == "Backspace" || tecla == "Delete"){
            nuevoTexto = valorIngreso.slice(0,-1);
        }else{
            nuevoTexto = valorIngreso + tecla;
        }
        if(isNaN(parseInt(tecla)) && !(tecla == "Backspace" || tecla == "Delete")) return;
        nuevoTexto = nuevoTexto.replace(".","");
        console.log(nuevoTexto);
        let cant_repetido = LONGMAX - parseInt(nuevoTexto).toString().length;
        nuevoTexto = "0".repeat(cant_repetido >= 0 ? cant_repetido : 0) + parseInt(nuevoTexto);
        let penultimoIndice = nuevoTexto.length - 2;
        $('#valIngreso').val('');
        $('#valIngreso').val(nuevoTexto.slice(0, penultimoIndice)+"."+nuevoTexto.slice(penultimoIndice));
        valorIngreso = $('#valIngreso').val();
    });
});

function consultarSaldoActual(){
    fetch('/api/v1/saldo', {method:'GET'})
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        $('#lblSaldo').text(data.saldo.toFixed(2));
    })
    .catch(err => {
        Swal.fire('Ha habido un error al hacer la peticion', err, 'error');
    });
}

function setearFechaActual(){
    const fechaActual = new Date();
    const año = fechaActual.getFullYear(); // Obtiene el año
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Obtiene el mes (agrega cero si es necesario)
    const dia = String(fechaActual.getDate()).padStart(2, '0'); // Obtiene el día (agrega cero si es necesario)

    const fechaFormateada = `${año}-${mes}-${dia}`;
    $('#fechaIngreso').val(fechaFormateada);
}

function toggleBloqueLimite(){
    let chequeado = $('#cbLimite').prop('checked');

    if(chequeado){
        $('#limite_gas_ing').show();
    }else{
        $('#valLimite').val('0%');
        $('#limite_gas_ing').hide();
    }
}

function formatearValor(elemento){
    if(isNaN(parseInt(elemento.value))){
        elemento.value = "0.00";
        return;
    }
    elemento.value = parseInt(elemento.value).toFixed(2);
}

function formatearPorc(){
    let limite = $('#valLimite').val();
    if(isNaN(parseInt(limite))){
        $('#valLimite').val('0%');
        return;
    }
    $('#valLimite').val(parseInt(limite) + '%');
}

function clickValIngreso(elemento){
    valorIngreso = elemento.value;
}

function acreditar(){
    let valIngreso = parseFloat($('#valIngreso').val());
    let fechaIng = $('#fechaIngreso').val();
    let txtMotivo = $('#txtMotivo').val();
    let cbLimite = $('#cbLimite').prop('checked');
    let valLimite = cbLimite ? parseFloat($('#valLimite').val()) : 0.00;

    let msgError = "";
    if(valIngreso <= 0){
        msgError = "Digite un monto valido a ingresar.";
    }else if(fechaIng == ""){
        msgError = "Ingrese una fecha valida.";
    }else if(txtMotivo.trim() == ""){
        msgError = "Ingrese un motivo por el que va a acreditar.";
    }else if(cbLimite && valLimite <= 0){
        msgError = "Poner un limite valido (mayor a 0)";
    }

    if(msgError != ""){
        Swal.fire(msgError, '', 'warning');
        return;
    }

    let formData = new FormData();
    formData.append('valIngreso', valIngreso);
    formData.append('fechaIng', fechaIng);
    formData.append('txtMotivo', txtMotivo);
    formData.append('valLimite', valLimite);

    fetch('/api/v1/ingresos/add', {method: 'POST', body: formData})
    .then(response => response.json())
    .then(res => {
        if(res == 1){
            Swal.fire('Se ha acreditado el valor correctamente', '', 'success')
            .then(r => {
                location.href = '/';
            })
        }else{
            Swal.fire('Ha habido un error al acreditar', '', 'error');
        }
    })
    .catch(err => {
        Swal.fire('Ha habido un error al hacer la peticion', err, 'error');
    });
}