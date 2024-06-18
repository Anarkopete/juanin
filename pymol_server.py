from flask import Flask, request, jsonify, send_file
import pymol
import tempfile
import os
import time

pymol.pymol_argv = ['pymol', '-qc']  # Iniciar PyMOL en modo sin GUI
pymol.finish_launching()

app = Flask(__name__)

@app.route('/')
def index():
    return "Servidor Flask en funcionamiento"

@app.route('/view', methods=['POST'])
def get_view():
    try:
        pdb_code = request.json['pdb_code']
        pymol.cmd.reinitialize()  # Limpiar la sesión de PyMOL
        pymol.cmd.fetch(pdb_code)
        pymol.cmd.orient()
        # ... otros comandos PyMOL (rotación, zoom, etc.) ...
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_file:
            pymol.cmd.png(temp_file.name, width=800, height=600, ray=1)
            image_path = temp_file.name

        # Devolver la imagen como archivo
            response = send_file(image_path, mimetype='image/png')
        
        return response

    except Exception as e:
        print(f"Error al procesar la solicitud: {e}")
        return jsonify({"error": "Error al generar la imagen"}), 500

if __name__ == '__main__':
    app.run(debug=True)
