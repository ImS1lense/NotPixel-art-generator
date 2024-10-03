const imageInput = document.getElementById('imageInput');
const imageCanvas = document.getElementById('imageCanvas');
const pixelGrid = document.getElementById('pixelGrid');
const colorHex = document.getElementById('colorHex');
const coordinatesDisplay = document.getElementById('coordinatesDisplay'); 
const eyedropperButton = document.getElementById('eyedropperButton');
const gridSizeSelector = document.getElementById('gridSize');
const canvasContext = imageCanvas.getContext('2d');

let loadedImage = null;

let currentGridSize = 128;

let isEyedropperActive = false;

gridSizeSelector.addEventListener('change', (event) => {
    currentGridSize = Number(event.target.value); 
    if (loadedImage) {
        drawImageOnGrid(currentGridSize, loadedImage); 
    }
});

imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;
            img.onload = () => {
                loadedImage = img; 
                drawImageOnGrid(currentGridSize, loadedImage);
            };
        };

        reader.readAsDataURL(file);
    }
});


function drawImageOnGrid(size, img = null) {
    imageCanvas.width = size;
    imageCanvas.height = size;
    canvasContext.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

    if (img) {
        canvasContext.drawImage(img, 0, 0, size, size);
        const imageData = canvasContext.getImageData(0, 0, size, size);
        const pixels = imageData.data;

        pixelGrid.style.gridTemplateColumns = `repeat(${size}, 10px)`;
        pixelGrid.innerHTML = '';


        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const i = (row * size + col) * 4;
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];

                const color = `rgb(${r},${g},${b})`;

                const pixelDiv = document.createElement('div');
                pixelDiv.classList.add('pixel');
                pixelDiv.style.backgroundColor = color;
                pixelGrid.appendChild(pixelDiv);

                pixelDiv.addEventListener('mouseenter', () => {
                    if (isEyedropperActive) {
                        const hexColor = rgbToHex(r, g, b);
                        colorHex.textContent = `Цвет: ${hexColor}`;
                        coordinatesDisplay.textContent = `Координаты: x: ${col + 1}, y: ${row + 1}`;
                    }
                });

                pixelDiv.addEventListener('click', () => {
                    if (isEyedropperActive) {
                        const hexColor = rgbToHex(r, g, b);
                        alert(`Вы выбрали цвет: ${hexColor}. Координаты: x: ${col + 1}, y: ${row + 1}`);
                    }
                });
            }
        }
    }
}


function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

document.addEventListener('keydown', (event) => {
    if (event.key === 's' || event.key === 'S') {
        event.preventDefault();
        toggleEyedropper();
    }
});

eyedropperButton.addEventListener('click', () => {
    toggleEyedropper();
});

function toggleEyedropper() {
    isEyedropperActive = !isEyedropperActive;
    eyedropperButton.textContent = isEyedropperActive ? 'Выключить пипетку' : 'Включить пипетку';
}
