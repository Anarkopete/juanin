const { ipcRenderer } = require('electron');
const fetchButton = document.getElementById('fetchButton');
const pdbCodeInput = document.getElementById('pdbCodeInput');
const proteinContainer = document.getElementById('proteinContainer');

fetchButton.addEventListener('click', async () => {
    const pdbCode = pdbCodeInput.value;

    ipcRenderer.send('fetch-pdb', pdbCode); 

    ipcRenderer.on('pdb-fetched', (event, imageDataURL) => {
        if (imageDataURL) {
            const imgElement = document.createElement('img');
            imgElement.src = imageDataURL;
            proteinContainer.innerHTML = ''; // Limpiar el contenedor
            proteinContainer.appendChild(imgElement);
        } else {
            console.error('Error fetching PDB data');
            // ... (manejo de errores) ...
        }
    });
});
