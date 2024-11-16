var valorRetiro = "";
document.addEventListener('DOMContentLoaded', () => {
    setearFechaActual();
    consultarSaldoActual();
    document.getElementById('valRetiro').addEventListener('keydown', (event) => {
        const LONGMAX = 3;
        event.preventDefault();
        let tecla = event.key;
        console.log(tecla=="Backspace");
        let nuevoTexto = "";
        if(tecla == "Backspace" || tecla == "Delete"){
            nuevoTexto = valorRetiro.slice(0,-1);
        }else{
            nuevoTexto = valorRetiro + tecla;
        }
        if(isNaN(parseInt(tecla)) && !(tecla == "Backspace" || tecla == "Delete")) return;
        nuevoTexto = nuevoTexto.replace(".","");
        console.log(nuevoTexto);
        let cant_repetido = LONGMAX - parseInt(nuevoTexto).toString().length;
        nuevoTexto = "0".repeat(cant_repetido >= 0 ? cant_repetido : 0) + parseInt(nuevoTexto);
        let penultimoIndice = nuevoTexto.length - 2;
        $('#valRetiro').val('');
        $('#valRetiro').val(nuevoTexto.slice(0, penultimoIndice)+"."+nuevoTexto.slice(penultimoIndice));
        valorRetiro = $('#valRetiro').val();
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
    $('#fechaRetiro').val(fechaFormateada);
}

function clickValIngreso(elemento){
    valorRetiro = elemento.value;
}

function debitar(){
    let lblSaldo = parseFloat($('#lblSaldo').text());
    let valRetiro = parseFloat($('#valRetiro').val());
    let fechaRetiro = $('#fechaRetiro').val();
    let txtMotivo = $('#txtMotivo').val();

    let msgError = "";
    if(valRetiro <= 0){
        msgError = "Digite un monto valido a retirar.";
    }else if(valRetiro > lblSaldo){
        msgError = "El monto a retirar no debe sobrepasar el valor del saldo.";
    }else if(fechaRetiro == ""){
        msgError = "Ingrese una fecha valida.";
    }else if(txtMotivo.trim() == ""){
        msgError = "Ingrese un motivo de retiro.";
    } 

    if(msgError != ""){
        Swal.fire(msgError, '', 'warning');
        return;
    }

    let formData = new FormData();
    formData.append('valRetiro', valRetiro);
    formData.append('fechaRetiro', fechaRetiro);
    formData.append('txtMotivo', txtMotivo);

    fetch('/api/v1/retiros/add', {method: 'POST', body: formData})
    .then(response => response.json())
    .then(res => {
        if(res == 1){
            Swal.fire('Se ha debitado el valor correctamente', '', 'success')
            .then(r => {
                location.href = '/';
            })
        }else{
            Swal.fire('Ha habido un error al debitar', '', 'error');
        }
    })
    .catch(err => {
        Swal.fire('Ha habido un error al hacer la peticion', err, 'error');
    });
}