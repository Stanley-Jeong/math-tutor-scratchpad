import { DrawingPadContainer } from './DrawingPadContainer.js';
import { InfoTabsContainer } from './InfoTabsContainer.js';

class MathTutorScratchPad extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    // Styles
    const style = document.createElement('link');
    style.setAttribute('rel', 'stylesheet');
    // PATH MUCH MATCH EXACTLY
    style.setAttribute('href', './assets/math-tutor-htmlelement-stan/math-tutor.css');
    this.shadowRoot.appendChild(style);

    // const link = document.createElement('link');
    // link.rel = 'stylesheet';
    // link.href = './assets/math-tutor-htmlelement-stan/math-tutor.css';  // Ensure correct path
    // this.shadowRoot.appendChild(link);

    // const css = new CSSStyleSheet()
    // css.replaceSync( "@import url( math-tutor.css )" )
    // this.shadowRoot.adoptedStyleSheets = [css] 

    // const stylesame = document.createElement('style');
    // stylesame.textContent = `
    //     :host(.math-main-container ) {
    //       display: flex;
    //       font-family: "DM Sans", Helvetica, serif;
    //       background-color: teal !important;
    //     }
        
    // `;
    // this.shadowRoot.appendChild(stylesame);

    const mainContainer = document.createElement('div');
    mainContainer.setAttribute('class', 'math-main-container');

    const leftContainer = new DrawingPadContainer();
    const rightContainer = new InfoTabsContainer();

    // APPEND ELEMENTS TO MAIN CONTAINER
    mainContainer.appendChild(leftContainer);
    mainContainer.appendChild(rightContainer);
    shadow.appendChild(mainContainer);

  }
};

// Define the customer element
customElements.define('math-tutor-scratch-pad', MathTutorScratchPad);

