document.addEventListener('DOMContentLoaded', () => {
    consultarSaldoActual();
});

function consultarSaldoActual(){
    fetch('/api/v1/saldo', {method:'GET'})
    .then(response => response.json())
    .then(data => {
        $('#lblSaldo').text(data.saldo.toFixed(2));
    })
    .catch(err => {
        Swal.fire('Ha habido un error al consultar el saldo actual', err, 'error');
    });
}