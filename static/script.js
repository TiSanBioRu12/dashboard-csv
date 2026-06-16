let datosGlobales = {};
let chartActual = null;

async function cargarCSV() {
  const archivo = document.getElementById('archivo').files[0];
  if (!archivo) return alert('Selecciona un archivo CSV');

  const form = new FormData();
  form.append('file', archivo);

  const res = await fetch('/upload', { method: 'POST', body: form });
  const data = await res.json();
  datosGlobales = data;

  // Llenar selects
  const ejeX = document.getElementById('ejeX');
  const ejeY = document.getElementById('ejeY');
  ejeX.innerHTML = ejeY.innerHTML = '';
  data.columnas.forEach(col => {
    ejeX.innerHTML += `<option>${col}</option>`;
    ejeY.innerHTML += `<option>${col}</option>`;
  });

  // Estadísticas
  let html =
    '<h3>Estadísticas</h3><table><tr><th>Columna</th><th>Media</th><th>Mediana</th><th>Min</th><th>Max</th></tr>';
  for (const [col, s] of Object.entries(data.estadisticas)) {
    html += `<tr><td>${col}</td><td>${s.media}</td><td>${s.mediana}</td><td>${s.min}</td><td>${s.max}</td></tr>`;
  }
  html += '</table>';
  document.getElementById('estadisticas').innerHTML = html;
  document.getElementById('controles').style.display = 'block';
}

function generarGrafico() {
  const tipo = document.getElementById('tipoGrafico').value;
  const x = document.getElementById('ejeX').value;
  const y = document.getElementById('ejeY').value;
  const datos = datosGlobales.datos;

  if (chartActual) chartActual.destroy();

  const ctx = document.getElementById('grafico').getContext('2d');
  chartActual = new Chart(ctx, {
    type: tipo,
    data: {
      labels: datos[x],
      datasets: [
        {
          label: y,
          data: tipo === 'scatter' ? datos[x].map((v, i) => ({ x: v, y: datos[y][i] })) : datos[y],
          backgroundColor: 'rgba(54,162,235,0.5)',
          borderColor: 'rgba(54,162,235,1)',
          borderWidth: 1,
        },
      ],
    },
  });
}

function exportar() {
  const canvas = document.getElementById('grafico');
  const link = document.createElement('a');
  link.download = 'grafico.png';
  link.href = canvas.toDataURL();
  link.click();
}
