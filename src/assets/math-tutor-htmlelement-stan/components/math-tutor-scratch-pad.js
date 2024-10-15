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

    const leftContainer = new DrawingPadContainer(this.solve, this.solveUploadedImage);
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



    /* MARKDOWN CDN SCRIPT */
    const mdScript = document.createElement('script');
    mdScript.id = 'mdScript-script';
    mdScript.type = "text/javascript";
    mdScript.async = true;
    mdScript.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
    mdScript.defer = true;
    
    mdScript.onload = () => {
      console.log(`mdScript loaded!`, window.marked);
      // this.renderMathJax();
    }

    document.head.appendChild(mdScript);
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

    const parentElementInfoTabs = this.parentElement.querySelector('#info-tabs-container');
    const parentElementDrawingPadContainer = this.parentElement.querySelector('#drawing-pad-container');
    const topButtonsRow = parentElementDrawingPadContainer.querySelector('.top-buttons-row');
    const infoTextWindow = parentElementInfoTabs.querySelector('.infoText');

    // CLEAR PREVIOUS RESULTS
    infoTextWindow.innerHTML = '';

    // LOADING GIF
    const loadingGif = document.createElement('img');
    loadingGif.classList.add('loading-element');
    loadingGif.src = 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/35771931234507.564a1d2403b3a.gif';
    // loadingGif.src = 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/f1055231234507.564a1d234bfb6.gif';
    // loadingGif.src = 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/c3c4d331234507.564a1d23db8f9.gif';
    topButtonsRow.appendChild(loadingGif);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('file', blob, 'canvasDrawing.png');

      try {
        loadingGif.style.display = 'block';
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
        
        const data = await response.json();
        console.log('data from fetch: ', data);
        
        // Run the UpdateSolveWindow here
        await parentElementInfoTabs.updateSolveResults(data?.solution);
  
        // Run the UpdateAnalysisWindow here
        await parentElementInfoTabs.updateAnalysisResults(data?.analysis);
      } catch (error) {
        console.error('Error during solve fetch request:', error);
      } finally {
        loadingGif.style.display = 'none';
      }

    })
  }


  async solveUploadedImage(uploadedImageFile) {
    const endPoint = 'https://scratchpad-api.onrender.com/solve_problem';

    const formData = new FormData();
    formData.append('file', uploadedImageFile);

    console.log("file: ", uploadedImageFile);

    const parentElementInfoTabs = this.parentElement.querySelector('#info-tabs-container');
    const parentElementDrawingPadContainer = this.parentElement.querySelector('#drawing-pad-container');
    const topButtonsRow = parentElementDrawingPadContainer.querySelector('.top-buttons-row');
    const infoTextWindow = parentElementInfoTabs.querySelector('.infoText');

    // CLEAR PREVIOUS RESULTS
    infoTextWindow.innerHTML = '';

    const imgElement = document.createElement('img');
    imgElement.width = infoTextWindow.clientWidth;

    const reader = new FileReader();
    reader.onload = (evt) => {
      imgElement.src = evt.target.result;
    }
    reader.readAsDataURL(uploadedImageFile);

    infoTextWindow.appendChild(imgElement);

    // LOADING GIF
    const loadingGif = document.createElement('img');
    loadingGif.classList.add('loading-element');
    loadingGif.src = 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/35771931234507.564a1d2403b3a.gif';
    // loadingGif.src = 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/f1055231234507.564a1d234bfb6.gif';
    // loadingGif.src = 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/c3c4d331234507.564a1d23db8f9.gif';
    topButtonsRow.appendChild(loadingGif);

    try {
      loadingGif.style.display = 'block';
      const response = await fetch(endPoint, {
        method: 'POST',
        body: formData,
      })
  
      const data = await response.json();
      console.log('data from uploaded image fetch: ', data);
  
      // Run the UpdateSolveWindow here
      await parentElementInfoTabs.updateSolveResults(data?.solution);
  
      // Run the UpdateAnalysisWindow here
      await parentElementInfoTabs.updateAnalysisResults(data?.analysis);
    } catch (error) {
      console.error('Error during solveUploadedImage fetch request:', error);
    } finally {
      // Hide the loading element when the request is done (either success or failure)
      loadingGif.style.display = 'none';
    }


    
    // // temp display image in DOM - REMOVE
    // const imgSrc = URL.createObjectURL(blob);
    // // console.log(imgSrc);
    // const tempImg = document.createElement('img')
    // tempImg.src = imgSrc;
    // drawArea.appendChild(tempImg)

  }

  // CHAT FUNCTIONALITY HERE
  sendMessage = async (infoTabsContainer, chatInput) => {
    if (!chatInput.value) return;

    const userMessageContainerDiv = document.createElement('div');
    const userMessageBubble = document.createElement('p');
    userMessageBubble.classList.add('userChatMessage');
    userMessageBubble.innerHTML = chatInput.value;

    userMessageContainerDiv.appendChild(userMessageBubble);
    userMessageContainerDiv.classList.add('userMessageContainerDiv');

    infoTabsContainer.querySelector('.Chat > .infoText').appendChild(userMessageContainerDiv);
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

