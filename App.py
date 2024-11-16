from flask import Flask, render_template, url_for, redirect, request, session, jsonify, send_from_directory
from controllers.alcancia import AlcanciaControlador

api = "/api/v1"
app = Flask(__name__)

with app.test_request_context():
    url_for('static', filename='/css/style.css')

@app.get('/')
def Index():
    return render_template('index.html')

@app.get('/ingresos')
def IngresosPage():
    return render_template('ingreso.html')

@app.get('/retiros')
def RetirosPage():
    return render_template('retiro.html')

# API

@app.get(f'{api}/saldo')
def SaldoActualAPI():
    controlador = AlcanciaControlador()
    return jsonify(controlador.getSaldoActual())

@app.post(f'{api}/ingresos/add')
def IngresosAPI():
    ingreso = float(request.form['valIngreso'])
    fecha = request.form['fechaIng']
    motivo = request.form['txtMotivo']
    limite = float(request.form['valLimite'])
    controlador = AlcanciaControlador()
    return jsonify(controlador.setIngreso(ingreso, motivo, limite, fecha))

@app.post(f'{api}/retiros/add')
def RetirosAPI():
    retiro = float(request.form['valRetiro'])
    fecha = request.form['fechaRetiro']
    motivo = request.form['txtMotivo']
    controlador = AlcanciaControlador()
    return jsonify(controlador.setRetiro(retiro, motivo, fecha))


if __name__ == '__main__':
    app.run(port=3000, debug=True)