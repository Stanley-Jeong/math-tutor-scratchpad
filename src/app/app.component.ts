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

    /* Open in new window */
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

            <p>$$ 7 + 12 = 19 $$</p>
            <p>Certainly! Let's solve the problem step by step:\n\nThe given problem is to add the numbers \\( 7 \\) and \\( 12 \\). Addition is one of the four basic arithmetic operations, and it involves finding the total or sum when combining two or more numbers.\n\nHere's how you solve this:\n\n1. **Identify the numbers to be added:** \n   - The numbers are \\( 7 \\) and \\( 12 \\).\n\n2. **Add the numbers:**\n   - We arrange the numbers vertically to make the addition easier (though this might seem trivial for two numbers):\n   \\[\n   \\begin{array}{c}\n     \\phantom{1}7 \\\\\n   +12 \\\\\n   \\hline\n   \\end{array}\n   \\]\n\n3. **Perform the addition:**\n\n   First, add the ones place:\n   - The ones place in \\( 7 \\) is \\( 7 \\).\n   - The ones place in \\( 12 \\) is \\( 2 \\).\n   - Adding \\( 7 + 2 = 9 \\).\n\n   Since there is nothing to carry over, we simply write \\( 9 \\) in the ones place of the result.\n\n4. **Write down the final result:**\n   - Now, write any numbers in the tens place as they are since there's nothing to carry and just a direct sum:\n   - The tens place in \\( 12 \\) is \\( 1 \\). Placing the \\( 9 \\) from the ones place next to \\( 1 \\), we get \\( 19 \\).\n\nThus, the sum of \\( 7 \\) and \\( 12 \\) is \\(\\boxed{19}\\).\n\nThis process illustrates simple addition, which is often straightforward but can be broken down into these steps for clarity and careful understanding.</p>

           

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
