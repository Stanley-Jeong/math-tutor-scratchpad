import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  title = 'Math Tutor Scratchpad';


  // Math tutor
  openInNewWindow() {
    const defaultSize = 'height=901, width=1200';
    const iPadMini = 'height=768, width=1024';
    const testSize = 'height=700, width=1000';
    // const newWindow = window.open('', '', defaultSize);
    const newWindow = window.open('', '', iPadMini);
    // const newWindow = window.open('', '', testSize);

    /* Open in new window - NOT USED. MODAL IS USED */
    if (newWindow) {
      newWindow.document.write(`
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Math Tutor Scratchpad</title>
          </head>
          <body>
            <math-tutor-scratch-pad></math-tutor-scratch-pad>
            <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
            <script src="./assets/math-tutor-htmlelement-stan/components/math-tutor-scratch-pad.js" type="module"></script>
          </body>
        </html>
      `);

      const script = newWindow.document.createElement('script');
      script.type = 'module';
      script.src = './assets/math-tutor-htmlelement-stan/components/math-tutor-scratch-pad.js';
      // script.defer = true;
      newWindow.document.head.appendChild(script);

      /* MATHJAX CDN SCRIPT */
      const mathJaxScript = newWindow.document.createElement('script');
      mathJaxScript.id = 'MathJax-script';
      mathJaxScript.async = true;

      const v2 = `https://cdn.jsdelivr.net/npm/mathjax@2/MathJax.js?config=TeX-AMS_CHTML`;

      mathJaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      // mathJaxScript.defer = true;
      newWindow.document.head.appendChild(mathJaxScript);

      /* MARKDOWN CDN SCRIPT */
      const mdScript = newWindow.document.createElement('script');
      mdScript.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
      newWindow.document.head.appendChild(mdScript);
      
      const link = newWindow.document.createElement('link');
      link.rel = 'stylesheet'
      link.href = './assets/math-tutor-htmlelement-stan/math-tutor.css'
      newWindow.document.head.appendChild(link);

      newWindow.document.close();
    }
  } 

  showMathModal: boolean = false;
  openMathModal() {
    this.showMathModal = true;
  }
  closeMathModal() {
    this.showMathModal = false;
  }

}
