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
    const defaultSize = 'height=900, width=1200';
    const iPadMini = 'height=768, width=1024';
    const testSize = 'height=700, width=1000';
    // const newWindow = window.open('', '', defaultSize);
    // const newWindow = window.open('', '', iPadMini);
    const newWindow = window.open('', '', testSize);

    /* Open in new window */
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>Math Tutor Scratchpad</title></head>
          <body>
            <math-tutor-scratch-pad></math-tutor-scratch-pad>
          </body>
        </html>
      `);

      const script = newWindow.document.createElement('script');
      script.type = 'module';
      script.src = './assets/math-tutor-htmlelement-stan/components/math-tutor-scratch-pad.js';
      // script.defer = true;
      newWindow.document.head.appendChild(script);
      
      const link = newWindow.document.createElement('link');
      link.rel = 'stylesheet'
      link.href = './assets/math-tutor-htmlelement-stan/math-tutor.css'
      newWindow.document.head.appendChild(link);
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
