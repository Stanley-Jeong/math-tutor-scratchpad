import { Button } from './Button.js'

export class DrawingPadContainer extends HTMLElement {
  constructor(solveDrawing, solveUploadedImage, solveLogic) {
    super();
    this.id = 'drawing-pad-container';
    this.solveDrawing = solveDrawing;
    this.solveUploadedImage = solveUploadedImage;
    this.solveLogic = solveLogic;
    
    // Left-side Drawing Window
    const leftContainer = document.createElement('div');
    leftContainer.classList.add('left-container');
    
    // this means the class instance itself. RENDER the DOM node to the custom HTML element itself
    this.appendChild(leftContainer);

    /* LEFT WINDOW BUTTONS */

    /* TOP BUTTONS */
    const topButtonsRow = document.createElement('div');
    topButtonsRow.classList.add('space-between', 'buttons-row', 'top-buttons-row');

    const topLeftButtonsContainer = document.createElement('div');
    topLeftButtonsContainer.classList.add('d-flex-gap');

    const placeholder1 = document.createElement('span');
    placeholder1.textContent = ' ';

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
  /* ================================= DRAWING CANVAS =================================== */
  /* ==================================================================================== */

  createDrawArea() {
    const drawArea = document.createElement('div');
    drawArea.classList.add('draw-area');

    const canvas = document.createElement('canvas');


    let widthMult = 0.48;
    let heightMult = 0.78;

    // console.log(window.innerHeight);

    if (window.innerHeight < 767) {
      // widthMult = 0.46;
      heightMult = 0.74;
    }
    
    canvas.width = window.innerWidth * widthMult;
    canvas.height = window.innerHeight * heightMult;
    
    // https://stackoverflow.com/questions/5517783/preventing-canvas-clear-when-resizing-window
    let W = canvas.width, H = canvas.height

    let isDrawing = false;
    const ctx = canvas.getContext('2d');


    window.onresize = function() {
      let temp = ctx.getImageData(0,0,W,H)
      canvas.width = window.innerWidth * widthMult;
      canvas.height = window.innerHeight * heightMult;

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

    // this.toolButton.onclick = toggleTool;
    this.toolButton.onmouseup = toggleTool;
  

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
        // console.log(this.strokes)
        redrawCanvas();
      }
    };
    
    // better response
    this.undoButton.onmouseup = undo;
    this.redoButton.onmouseup = redo;


    const clearCanvas = async () => {
      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clearRect 
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.strokes = [];
      this.redoStack = [];


      // const endPoint = 'https://scratchpad-api.onrender.com/reset_chat';
      const endPoint = 'https://scratch-pad-v2-0.onrender.com/reset_chat';
    
      const response = await fetch(endPoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json();

      console.log("reset_chat data response: ", data);
      alert(data?.message);
      // await infoTabsContainer.updateChatConversation(data?.message);
    }

    // clear canvas button function
    // this.clearButton.onclick = clearCanvas;
    // this.clearButton.ontouchstart = clearCanvas;
    this.clearButton.onmouseup = clearCanvas;


  
    this.solveButton.onmouseup = () => this.solveDrawing(canvas);




    // // Downscaling img on canvas attempt. still bad quality
    // function downscaleImage(image, scaleFactor) {
    //   const tempCanvas = document.createElement('canvas');
    //   const tempCtx = tempCanvas.getContext('2d');
    
    //   let width = image.width;
    //   let height = image.height;
    
    //   // Set the initial canvas dimensions to the image's dimensions
    //   tempCanvas.width = width;
    //   tempCanvas.height = height;
    //   tempCtx.drawImage(image, 0, 0, width, height);
    

    //   const ratioX = canvas.width / image.naturalWidth;
    //   const ratioY = canvas.height / image.naturalHeight;
    //   const ratio = Math.min(ratioX / ratioY) * 0.2;
    //   const scaledWidth = image.naturalWidth * ratio;
    //   const scaledHeight = image.naturalHeight * ratio;

    //   console.log(scaledWidth, 'scaledWiftbh')
    //   console.log(scaledHeight, 'scaledHeight')

    //   // Perform stepwise downscaling to avoid quality loss
    //   while (width * scaleFactor > scaledWidth && height * scaleFactor > scaledHeight) {
    //     width = Math.floor(width * scaleFactor);
    //     height = Math.floor(height * scaleFactor);
    
    //     // Resize canvas
    //     tempCanvas.width = width;
    //     tempCanvas.height = height;
    //     console.log(width, 'width!')
    
    //     // Draw the image onto the canvas
    //     tempCtx.drawImage(image, 0, 0, width, height);
    //   }
    
    //   // Now that the image is downscaled, draw it to the main canvas
    //   canvas.width = width;
    //   canvas.height = height;
    
    //   // Set high-quality interpolation settings
    //   ctx.imageSmoothingEnabled = true;
    //   ctx.imageSmoothingQuality = 'high';
    
    //   // Draw the downscaled image
    //   ctx.drawImage(tempCanvas, 0, 0, width, height);
    // }

    this.uploadInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      this.solveUploadedImage(file);

      // const reader = new FileReader()
      // reader.onload = (evt) => {
      //   const img = new Image();
      //   // img.classList.add('uploaded-image');
      //   img.onload = () => {

      //     // const scaleFactor = 0.5;
      //     // downscaleImage(img, scaleFactor);

      //     // const ratioX = canvas.width / img.naturalWidth;
      //     // const ratioY = canvas.height / img.naturalHeight;
      //     // const ratio = Math.min(ratioX / ratioY) * 0.4;
      //     // const scaledWidth = img.naturalWidth * ratio;
      //     // const scaledHeight = img.naturalHeight * ratio;
      //     // const offsetX = (canvas.width - scaledWidth) / 2;
      //     // const offsetY = (canvas.height - scaledHeight) / 2;

      //     // ctx.imageSmoothingEnabled = true;
      //     // ctx.imageSmoothingQuality = 'high';

      //     // ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

          

      //     // img.style.width = '100%'
      //     // img.style.width = '49vw'
      //     // drawArea.appendChild(img);

      //     // CALL solveUploadedImage here
      //     // this.solveUploadedImage(img);
      //   }
      //   img.src = evt.target.result;
      // }
      // reader.readAsDataURL(file)
    }

    drawArea.appendChild(canvas);
    return drawArea;
  }

}

customElements.define('drawing-pad-container', DrawingPadContainer);
