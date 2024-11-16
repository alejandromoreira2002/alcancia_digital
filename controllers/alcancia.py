from models.alcancia import AlcanciaModelo

class AlcanciaControlador:
    def __init__(self):
        self.modelo = AlcanciaModelo()

    def getSaldoActual(self):
        dato = self.modelo.getSaldoActual()
        if dato:
            return {'res': 1, 'saldo': float(dato['Saldo'])}
        else:
            return {'res': 0, 'saldo': 0.00}

    def setIngreso(self, monto, razon, limite, fecha):
        datosSaldo = self.getSaldoActual()
        saldo = datosSaldo['saldo'] + monto
        res = self.modelo.setIngreso(monto, razon, limite, fecha, saldo)
        return res
    
    def setRetiro(self, monto, razon, fecha):
        datosSaldo = self.getSaldoActual()
        saldo = datosSaldo['saldo'] - monto
        if saldo >= 0:
            res = self.modelo.setRetiro(monto, razon, fecha, saldo)
            return res
        else:
            return 0