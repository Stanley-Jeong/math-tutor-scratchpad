import { Button } from './Button.js'

export class DrawingPadContainer extends HTMLElement {
  constructor() {
    super();
    
    // Left-side Drawing Window
    const leftContainer = document.createElement('div');
    leftContainer.classList.add('left-container');
    
    // this means the class instance itself. RENDER the DOM node to the custom HTML element itself
    this.appendChild(leftContainer);

    /* LEFT WINDOW BUTTONS */

    /* TOP BUTTONS */
    const topButtonsRow = document.createElement('div');
    topButtonsRow.classList.add('space-between', 'buttons-row');

    const topLeftButtonsContainer = document.createElement('div');
    topLeftButtonsContainer.classList.add('d-flex-gap');

    const placeholder1 = document.createElement('span');
    placeholder1.textContent = '.';

    topLeftButtonsContainer.append(placeholder1);

    const topRightButtonsContainer = document.createElement('div');
    topRightButtonsContainer.classList.add('d-flex-gap');

    // TOOL toggle to be pen vs eraser
    this.toolButton = new Button();
    topRightButtonsContainer.append(this.toolButton);
    
    this.colorPicker = document.createElement('input');
    this.colorPicker.type = 'color';
    topRightButtonsContainer.append(this.colorPicker);
  

    /* BOTTOM BUTTONS */
    const bottomButtonsRow = document.createElement('div');
    bottomButtonsRow.classList.add('space-between', 'buttons-row');

    const bottomLeftButtonsContainer = document.createElement('div');
    bottomLeftButtonsContainer.classList.add('d-flex-gap');

    this.undoButton = new Button('Undo');
    this.redoButton = new Button('Redo');

    bottomLeftButtonsContainer.append(this.undoButton, this.redoButton);

    const bottomRightButtonsContainer = document.createElement('div');
    bottomRightButtonsContainer.classList.add('d-flex-gap');

    this.clearButton = new Button('Clear');

    this.uploadInput = document.createElement('input');
    this.uploadInput.type = 'file';
    this.uploadInput.id = 'upload-button'

    this.uploadButtonLabel = document.createElement('label');
    this.uploadButtonLabel.setAttribute('for', 'upload-button');
    this.uploadButtonLabel.classList.add('blue-button');
    this.uploadButtonLabel.textContent = 'Upload';

    this.solveButton = new Button('Solve');

    bottomRightButtonsContainer.append(this.clearButton, this.uploadInput, this.uploadButtonLabel, this.solveButton);

    // Draw pad area
    this.drawArea = this.createDrawArea();

    topButtonsRow.append(topLeftButtonsContainer, topRightButtonsContainer);
    leftContainer.appendChild(topButtonsRow);
    leftContainer.appendChild(this.drawArea);
    bottomButtonsRow.append(bottomLeftButtonsContainer, bottomRightButtonsContainer)
    leftContainer.appendChild(bottomButtonsRow);
  }


  /* ==================================================================================== */
  /* ==================================================================================== */
  /* ================================= DRAWING CANVAS =================================== */
  /* ==================================================================================== */
  /* ==================================================================================== */

  createDrawArea() {
    const drawArea = document.createElement('div');
    drawArea.classList.add('draw-area');

    const canvas = document.createElement('canvas');
    
    canvas.width = window.innerWidth * 0.49;
    canvas.height = window.innerHeight * 0.84;
    
    // https://stackoverflow.com/questions/5517783/preventing-canvas-clear-when-resizing-window
    let W = canvas.width, H = canvas.height

    let isDrawing = false;
    const ctx = canvas.getContext('2d');


    window.onresize = function() {
      let temp = ctx.getImageData(0,0,W,H)
      canvas.width = window.innerWidth * 0.49;
      canvas.height = window.innerHeight * 0.84;

      // canvas.width = window.innerWidth / 2 ;
      // canvas.height = window.innerHeight * 0.85;
      
      ctx.putImageData(temp,0,0)
    }

    this.isEraserActive = false;
    this.currentTool = 'Pen';
    // let penColor = 'black';
    this.penColor = this.colorPicker.value;
    let penSize = 2;
    let eraserColor = '#f6f6f6';
    let eraserSize = 20;
    

    const colorChanged = (evt) => {
      this.penColor = evt.target.value;
    }

    this.colorPicker.onchange = (evt) => colorChanged(evt);

    // First time to detect the name
    this.toolButton.label = this.isEraserActive ? 'Pen' : 'Eraser';
    const toggleTool = () => {
      this.isEraserActive = !this.isEraserActive;
      this.currentTool = this.currentTool === 'Pen' ? 'Eraser' : 'Pen';
      this.toolButton.label = this.isEraserActive ? 'Pen' : 'Eraser';
    }

    this.toolButton.onclick = toggleTool;
    this.toolButton.ontouchstart = toggleTool;
    

    let currentStrokes = [];  // Store points for the current stroke
    this.strokes = [];        // Store all completed strokes
    this.redoStack = [];      // Store redo strokes

    // Utility function to get touch coordinates
    const getTouchPos = (evt) => {
      const rect = canvas.getBoundingClientRect();
      const touch = evt.touches[0]; // Get the first touch
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    };

    const startDrawing = (evt) => {
      isDrawing = true;
      currentStrokes = [];

      if (this.currentTool === 'Eraser') {
        ctx.strokeStyle = eraserColor;
        ctx.lineWidth = eraserSize;
      } else {
        ctx.strokeStyle = this.penColor;
        ctx.lineWidth = penSize;
      }

      let coords;
      if (evt.type === 'mousedown') {
        coords = { x: evt.offsetX, y: evt.offsetY };
      } else if (evt.type === 'touchstart') {
        evt.preventDefault(); // Prevent scrolling during touch events
        coords = getTouchPos(evt);
      }

      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    };

    const draw = (evt) => {
      if (!isDrawing) return;

      let coords;
      if (evt.type === 'mousemove') {
        coords = { x: evt.offsetX, y: evt.offsetY };
      } else if (evt.type === 'touchmove') {
        evt.preventDefault();
        coords = getTouchPos(evt);
      }

      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();

      // Store current stroke points
      currentStrokes.push({
        x: coords.x,
        y: coords.y,
        tool: this.currentTool,
        color: this.penColor,
      });
    };

    // Stop drawing on mouseup or touchend and store the completed stroke
    const stopDrawing = () => {
      isDrawing = false;
      // ctx.beginPath();
      if (currentStrokes.length) {
        this.strokes.push([...currentStrokes]);   // Save the strokes
        this.redoStack = [];  // Clear the redo stack after a new stroke
      }
    };

    // Redraw canvas based on stored strokes
    const redrawCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.strokes.forEach((stroke) => {
        ctx.beginPath();
        stroke.forEach((point, index) => {
          if (point.tool === 'Eraser') {
            ctx.strokeStyle = eraserColor;
            ctx.lineWidth = eraserSize;
          } else {
            ctx.strokeStyle = point.color;
            ctx.lineWidth = penSize;
          }

          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      });
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    // canvas.addEventListener('mouseout', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);
    
    const undo = () => {
      if (this.strokes.length) {
        const lastStroke = this.strokes.pop();
        this.redoStack.push(lastStroke);
        redrawCanvas();
      }
    };

    const redo = () => {
      if (this.redoStack.length) {
        const restoredStroke = this.redoStack.pop();
        this.strokes.push(restoredStroke);
        console.log(this.strokes)
        redrawCanvas();
      }
    };

    this.undoButton.onclick = undo;
    this.redoButton.onclick = redo;
    this.undoButton.ontouchstart = undo;
    this.redoButton.ontouchstart = redo;



    const clearCanvas = () => {
      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clearRect 
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.strokes = [];
      this.redoStack = [];
    }
    // clear canvas button function
    this.clearButton.onclick = clearCanvas;
    this.clearButton.ontouchstart = clearCanvas;

    // SOLVE FUNCTION
    const solve = () => {
      const endPoint = 'SOME_URL_TO_PYTHON_API'
      // get the drawing ctx of the canvas, pass that into the fetch request
      const imageSnapshot = ctx.getImageData(0,0,canvas.width, canvas.height)
      console.log(imageSnapshot)
      canvas.toBlob(async (blob) => {
        console.log(blob);
        await fetch(endPoint, {
          method: "POST",
          headers: { 'Content-Type': 'image/png' },
          body: blob,
        })

        const imgSrc = URL.createObjectURL(blob);
        const tempImg = document.createElement('img')
        tempImg.src = imgSrc;
        drawArea.appendChild(tempImg)
      })
    }

    this.solveButton.onclick = solve;
    this.solveButton.ontouchstart = solve;

    this.uploadInput.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader()
      reader.onload = (evt) => {
        const img = new Image();
        img.onload = () => {
          const ratioX = canvas.width / img.naturalWidth;
          const ratioY = canvas.height / img.naturalHeight;
          const ratio = Math.min(ratioX / ratioY) * 0.5;
          const scaledWidth = img.naturalWidth * ratio;
          const scaledHeight = img.naturalHeight * ratio;
          const offsetX = (canvas.width - scaledWidth) / 2;
          const offsetY = (canvas.height - scaledHeight) / 2;

          ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
        }
        img.src = evt.target.result;
      }
      reader.readAsDataURL(file)
    }

    drawArea.appendChild(canvas);
    return drawArea;
  }

}

customElements.define('drawing-pad-container', DrawingPadContainer);
