// import undoIcon from '../icons/undo-icon.png'

export class Button extends HTMLElement {
  constructor(labelName) {
    super();
    this.labelName = labelName;
    const button = document.createElement('button');
    button.classList.add('blue-button', `${this.labelName?.toLowerCase()}-button`);


    if (labelName === 'Undo') {
      const icon = document.createElement('img');
      icon.src = './assets/math-tutor-htmlelement-stan/icons/undo-icon.png';
      icon.width = 32;
      button.appendChild(icon);
      button.classList.add('blue-icon-square-button');
    } else if (labelName === 'Redo') {
      const icon = document.createElement('img');
      icon.src = './assets/math-tutor-htmlelement-stan/icons/redo-icon.png';
      icon.width = 32;
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
    this.labelName = newLabel;
    this.button.textContent = this.labelName;
  }

}

// Register the custom element
customElements.define('math-tutor-button', Button);

