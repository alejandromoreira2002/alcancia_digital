from db.db import db

class AlcanciaModelo:
    def __init__(self):
        self.db = db()

    def getSaldoActual(self):
        sql = "SELECT Saldo FROM Alcancia ORDER BY ID DESC LIMIT 1"
        dato = self.db.consultarDato(sql)

        if dato:
            return dato
        else:
            return None

    def setIngreso(self, monto, razon, limite, fecha, saldo):
        sql = f"INSERT INTO Alcancia(Ingreso, Retiro, Limite, Razon, Saldo, Fecha) VALUES (%s, %s, %s, %s, %s, %s)"
        parametros = (monto, 0.00, limite, razon, saldo, fecha)
        res = self.db.insertarDatos(sql, parametros)
        return res
    
    def setRetiro(self, monto, razon, fecha, saldo):
        sql = f"INSERT INTO Alcancia(Ingreso, Retiro, Limite, Razon, Saldo, Fecha) VALUES (%s, %s, %s, %s, %s, %s)"
        parametros = (0.00, monto, 0, razon, saldo, fecha)
        res = self.db.insertarDatos(sql, parametros)
        return res