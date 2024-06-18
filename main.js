const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
async function fetchData(pdbCode) {
  const fetch = (await import('node-fetch')).default; // Importar dinámicamente
  // ... resto de tu código fetch ...
}


function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Habilitar nodeIntegration (no recomendado en producción)
      contextIsolation: false,
    }
  });

  win.loadFile('index.html'); // Carga tu archivo HTML principal

  // Manejar la solicitud 'fetch-pdb' desde el renderer
  ipcMain.on('fetch-pdb', async (event, pdbCode) => {
    try {
      const response = await fetch('http://localhost:5000/view', { // Asegúrate de que tu servidor Flask esté corriendo en este puerto
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pdb_code: pdbCode })
      });

      const imageBlob = await response.blob();
      
      // Convertir el imageBlob a un Buffer y luego a Data URL
      const arrayBuffer = await imageBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const imageDataURL = `data:image/png;base64,${buffer.toString('base64')}`;
      event.reply('pdb-fetched', imageDataURL); // Enviar la imagen al renderer

    } catch (error) {
      console.error('Error fetching PDB data:', error);
      event.reply('pdb-fetched', null); // Enviar un error al renderer
    }
  });
}

app.whenReady().then(createWindow);

// Cerrar la aplicación cuando todas las ventanas estén cerradas (excepto en macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});