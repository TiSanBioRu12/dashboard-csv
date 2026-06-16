from flask import Flask, render_template, request, jsonify
import pandas as pd

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    df = pd.read_csv(file)

    columnas = df.columns.tolist()
    tipos = df.dtypes.astype(str).to_dict()

    stats = {}
    for col in df.select_dtypes(include='number').columns:
        stats[col] = {
            'media': round(float(df[col].mean()), 2),
            'mediana': round(float(df[col].median()), 2),
            'min': round(float(df[col].min()), 2),
            'max': round(float(df[col].max()), 2),
        }

    datos = df.head(500).to_dict(orient='list')

    return jsonify({
        'columnas': columnas,
        'tipos': tipos,
        'estadisticas': stats,
        'datos': datos
    })

if __name__ == '__main__':
    app.run(debug=True)
