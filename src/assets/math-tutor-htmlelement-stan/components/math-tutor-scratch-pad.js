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

    const leftContainer = new DrawingPadContainer(this.solve);
    const rightContainer = new InfoTabsContainer(this.sendMessage);

    // APPEND ELEMENTS TO MAIN CONTAINER
    mainContainer.appendChild(leftContainer);
    mainContainer.appendChild(rightContainer);
    shadow.appendChild(mainContainer);


    
  }

  connectedCallback() {
    /* MATHJAX CDN SCRIPT */

    if (!window.MathJax) {
      const mathJaxScript = document.createElement('script');
      mathJaxScript.id = 'MathJax-script';
      mathJaxScript.type = "text/javascript";
      mathJaxScript.async = true;
      mathJaxScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.0/es5/tex-mml-chtml.js';
      // mathJaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      mathJaxScript.defer = true;
      
      // this.parentElement.appendChild(mathJaxScript);
      mathJaxScript.onload = () => {
        console.log(`mathjax loaded!`, window.MathJax)
        this.renderMathJax();
      }

      document.head.appendChild(mathJaxScript);
      // this.shadowRoot.appendChild(mathJaxScript);
      // shadow.appendChild(mathJaxScript)
      // console.log(this.shadowRoot)



      // const moreMJScript = document.createElement('script');
      // moreMJScript.textContent = `
      //   window.MathJax = {
      //     tex: {
      //       inlineMath: [['$', '$'], ['\\(', '\\)']],
      //       displayMath: [['$$', '$$'], ['\\[', '\\]']]
      //     },
      //     options: {
      //       skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
      //     }
      //   };
      // `;
      // this.shadowRoot.appendChild(moreMJScript);
    } else {
      console.log('already mathjax?');
      this.renderMathJax();
    }
  }

  renderMathJax() {
    // Ensure MathJax processes the content in the shadow DOM

    const mathElements = this.shadowRoot.querySelectorAll('p, div');

    if (window.MathJax) {
      // window.MathJax.typesetPromise(mathElements).then(() => {
      //   console.log('MathJax rendering complete');
      // }).catch((err) => console.error('MathJax rendering error:', err));
      mathElements.forEach((element) => {
        window.MathJax.typesetPromise([element])
          .then(() => {
            console.log('MathJax rendering completed');
          })
          .catch((err) => console.error('MathJax rendering error:', err));
      });
    }
  }


  solve(canvas, drawArea) {
    const endPoint = 'https://scratchpad-api.onrender.com/solve_problem';
    /* 
    Solve problem endpoint:
    POST /solve_problem
    */

    /* fetch.then or async await, try catch stuff here */

    // get the drawing ctx of the canvas, pass that into the fetch request
    // const imageSnapshot = ctx.getImageData(0,0,canvas.width, canvas.height)
    // console.log(imageSnapshot)

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('file', blob, 'canvasDrawing.png');

      const response = await fetch(endPoint, {
        method: 'POST',
        // headers: { 
          // 'Content-Type': 'image/png', 
          // 'Content-Type': 'application/json',
          // 'Content-Type': `multipart/form-data`,
          // 'Content-Transfer-Encoding': 'base64' 
        // },
        body: formData,
      })
      
/* 

SAMPLE RESPONSE:

{problem: '\\( 7+12 \\)', solution: "Certainly! Let's solve the problem step by step:\n\n…hese steps for clarity and careful understanding.", analysis: "Certainly! Let's analyze the problem \\(7 + 12\\):\n\n…h to solving an addition problem like \\(7 + 12\\)."}

analysis: "Certainly! Let's analyze the problem \\(7 + 12\\):\n\n1. **Type of Problem:**\n   - This is a basic arithmetic problem involving the addition of two integers.\n\n2. **Key Formulas or Theorems Needed:**\n   - For the problem of basic addition, the only requirement is understanding the concept of addition in arithmetic:\n     - Addition is the process of bringing two or more numbers (or things) together to make a new total.\n\n3. **Brief Outline of the Solution Approach:**\n   - Identify the numbers to be added: In this case, the numbers are \\(7\\) and \\(12\\).\n   - Use the addition operation to sum these two numbers.\n   - Compute \\(7 + 12\\).\n   - When you add these numbers together, you get the result:\n     $$ 7 + 12 = 19 $$\n   - Therefore, the solution to the problem is \\(19\\). \n\nThis outline provides a straightforward approach to solving an addition problem like \\(7 + 12\\)."
problem: "\\( 7+12 \\)"
solution: "Certainly! Let's solve the problem step by step:\n\nThe given problem is to add the numbers \\( 7 \\) and \\( 12 \\). Addition is one of the four basic arithmetic operations, and it involves finding the total or sum when combining two or more numbers.\n\nHere's how you solve this:\n\n1. **Identify the numbers to be added:** \n   - The numbers are \\( 7 \\) and \\( 12 \\).\n\n2. **Add the numbers:**\n   - We arrange the numbers vertically to make the addition easier (though this might seem trivial for two numbers):\n   \\[\n   \\begin{array}{c}\n     \\phantom{1}7 \\\\\n   +12 \\\\\n   \\hline\n   \\end{array}\n   \\]\n\n3. **Perform the addition:**\n\n   First, add the ones place:\n   - The ones place in \\( 7 \\) is \\( 7 \\).\n   - The ones place in \\( 12 \\) is \\( 2 \\).\n   - Adding \\( 7 + 2 = 9 \\).\n\n   Since there is nothing to carry over, we simply write \\( 9 \\) in the ones place of the result.\n\n4. **Write down the final result:**\n   - Now, write any numbers in the tens place as they are since there's nothing to carry and just a direct sum:\n   - The tens place in \\( 12 \\) is \\( 1 \\). Placing the \\( 9 \\) from the ones place next to \\( 1 \\), we get \\( 19 \\).\n\nThus, the sum of \\( 7 \\) and \\( 12 \\) is \\(\\boxed{19}\\).\n\nThis process illustrates simple addition, which is often straightforward but can be broken down into these steps for clarity and careful understanding."

*/

      const data = await response.json();
      console.log('data from fetch: ', data);

      // Set the data as something to be passed into the InfoTabsContainer
      const parentElementInfoTabs = this.parentElement.querySelector('#info-tabs-container');
      
      // Run the UpdateSolveWindow here
      await parentElementInfoTabs.updateSolveResults(data?.solution);

      // Run the UpdateAnalysisWindow here
      await parentElementInfoTabs.updateAnalysisResults(data?.analysis);

      // temp display image in DOM
      const imgSrc = URL.createObjectURL(blob);
      // console.log(imgSrc);
      const tempImg = document.createElement('img')
      tempImg.src = imgSrc;
      drawArea.appendChild(tempImg)
    })
  }

  // CHAT FUNCTIONALITY HERE
  sendMessage = async (infoTabsContainer, chatInput) => {
    if (!chatInput.value) return;

    const userMessageBubble = document.createElement('p');
    userMessageBubble.classList.add('userChatMessage');
    userMessageBubble.innerHTML = chatInput.value;

    infoTabsContainer.querySelector('.Chat > .infoText').appendChild(userMessageBubble);
    console.log(infoTabsContainer)

    const endPoint = 'https://scratchpad-api.onrender.com/chat';
    
    const response = await fetch(endPoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({message: chatInput.value}),
    })

    /* 
    Chat endpoint:
    POST /chat


    message goes, then:
    {response: 'Hello! How can I assist you with your math questions today?'}


    {response: "Mathematics as a field wasn't invented by a single…uilding upon one another’s ideas and discoveries."}

    */

    const data = await response.json();

    console.log("chat data response: ", data);
    
    await infoTabsContainer.updateChatConversation(data?.response);
    
    chatInput.value = '';
  }



};

// Define the customer element
customElements.define('math-tutor-scratch-pad', MathTutorScratchPad);

