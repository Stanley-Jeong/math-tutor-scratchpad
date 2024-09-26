export class Button extends HTMLElement {
  constructor(labelName) {
    super();
    this.labelName = labelName;
    const button = document.createElement('button');
    button.classList.add('blue-button', `${this.labelName?.toLowerCase()}-button`);

    this.iconNames = ['Undo', 'Redo', 'Pen', 'Eraser'];

    // icon image button
    if (this.iconNames.includes(this.labelName)) {
      const icon = document.createElement('img');
      icon.src = `./assets/math-tutor-htmlelement-stan/icons/${this.labelName}.png`;
      button.appendChild(icon);
      button.classList.add('blue-icon-square-button');
    } else {
      button.textContent = this.labelName;
    }

    // this means the class instance itself. RENDER the DOM node to the custom HTML element itself
    this.appendChild(button);

    // Add event listener for button click
    this.button = button;
  }
  
  // // Accept an external onclick handler
  // set onClickHandler(handler) {
  //   this.button.addEventListener('click', handler);
  // }

  set label(newLabel) {
    if (this.iconNames.includes(newLabel)) {
      const icon = document.createElement('img');
      icon.src = `./assets/math-tutor-htmlelement-stan/icons/${newLabel}.png`;
      if (this.button.hasChildNodes()) {
        this.button.removeChild(this.button.childNodes[0])
      }
      this.button.appendChild(icon);
      this.button.classList.add('blue-icon-square-button');
    } else {
      this.labelName = newLabel;
      this.button.textContent = this.labelName;
    }
  }

}

// Register the custom element
customElements.define('math-tutor-button', Button);

