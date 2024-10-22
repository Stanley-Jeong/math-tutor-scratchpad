import { DrawingPadContainer } from './DrawingPadContainer.js';
import { InfoTabsContainer } from './InfoTabsContainer.js';

class MathTutorScratchPad extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

  
    // Styles
    const style = document.createElement('link');
    style.setAttribute('rel', 'stylesheet');
    // PATH MUST MATCH EXACTLY
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

    const leftContainer = new DrawingPadContainer(this.solveDrawing, this.solveUploadedImage, this.solveLogic);
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

  async solveLogic(formData) {

    // const endPointV2 = 'https://scratch-pad-v2-0.onrender.com/solve_problem';
    const endPointV3Solve = 'https://scratch-pad-v2-0.onrender.com/get_solution';
    const endPointV3Analysis = 'https://scratch-pad-v2-0.onrender.com/get_analysis';

    // const streamEndpoint = 'https://scratch-pad-v2-0.onrender.com/solve_problem_stream/';
    // const extractProblemTextEndpoint = 'https://scratch-pad-v2-0.onrender.com/extract_problem_text/';
    // const generateSolutionEndpoint = 'https://scratch-pad-v2-0.onrender.com/generate_solution/';

    const parentElementInfoTabs = this.parentElement.querySelector('#info-tabs-container');
    const parentElementDrawingPadContainer = this.parentElement.querySelector('#drawing-pad-container');
    const topButtonsRow = parentElementDrawingPadContainer.querySelector('.top-buttons-row');
    const infoTextWindow = parentElementInfoTabs.querySelector('.infoText');

    // CLEAR PREVIOUS RESULTS
    // infoTextWindow.innerHTML = '';
    parentElementInfoTabs.querySelector('.Analysis > .infoText').innerHTML = '';

    // LOADING GIF
    const loadingGif = document.createElement('img');
    loadingGif.classList.add('loading-element');
    loadingGif.src = 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/35771931234507.564a1d2403b3a.gif';
    // loadingGif.src = 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/f1055231234507.564a1d234bfb6.gif';
    // loadingGif.src = 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/c3c4d331234507.564a1d23db8f9.gif';
    topButtonsRow.appendChild(loadingGif);


    const solutionP = document.createElement('p');
    // solutionP.innerHTML = !solutionText ? "Sorry, I cannot read the image or drawing. Please try again." : solutionText;
    infoTextWindow.appendChild(solutionP);

    try {
      loadingGif.style.display = 'block';
      const response1 = await fetch(endPointV3Solve, {
        method: "POST",
        body: formData,
      });

      // const data1 = await response1.json();
      // console.log("result data is: ", response1);
      // const problemText = data1?.problem;
      // infoTextWindow.innerText = problemText;

      // const response2 = await fetch(generateSolutionEndpoint, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ problem: problemText }),
      // }); 
    
      const reader = response1.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let content = "";
      while (true) {
        const { done, value } = await reader.read();
        // console.log("done: ", done);
        // console.log("value: ", value);
        if (done) break;
        let chunk = decoder.decode(value, { stream: true });
        // console.log("Received chunk:", chunk);

        // if (chunk["detail"]) {
        //   content += chunk["detail"];
        //   infoTextWindow.innerHTML = content;
        //   return;
        // }

        content += chunk;
        infoTextWindow.innerHTML = content;

        infoTextWindow.innerHTML = infoTextWindow.innerHTML.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        infoTextWindow.innerHTML = infoTextWindow.innerHTML.replace(/^###\s*(.*$)/gim, '<h3>$1</h3>');
        infoTextWindow.innerHTML = infoTextWindow.innerHTML.replace(/^##\s*(.*$)/gim, '<h2>$1</h2>');
        infoTextWindow.innerHTML = infoTextWindow.innerHTML.replace(/^#\s*(.*$)/gim, '<h1>$1</h1>');

        if (window.MathJax) {
          await window.MathJax.typesetPromise([infoTextWindow])
            .then(() => {
              console.log('MathJax rendering for SOLVE completed');
            })
            .catch((err) => console.error('MathJax rendering error:', err));
        }
      }

      const responseAnalysis = await fetch(endPointV3Analysis, {
        method: 'POST',
        body: formData,
      })
      
      const data = await responseAnalysis.json();
      // console.log('data from Analysis fetch: ', data);
      // Run the UpdateAnalysisWindow here
      await parentElementInfoTabs.updateAnalysisResults(data?.analysis);

      // // Run the UpdateSolveWindow here 
      // await parentElementInfoTabs.updateSolveResults(data?.solution);

    } catch (error) {
      console.error('Failed to do SOLVE function: ', error);
    } finally {
      loadingGif.style.display = 'none';
    }


      /* ORIGINAL - NO STREAMING */

      // const formData = new FormData();
      // formData.append('file', blob, 'canvasDrawing.png');

      // try {
      //   loadingGif.style.display = 'block';
      //   const response = await fetch(endPointV2, {
      //     method: 'POST',
      //     // headers: { 
      //       // 'Content-Type': 'image/png', 
      //       // 'Content-Type': 'application/json',
      //       // 'Content-Type': `multipart/form-data`,
      //       // 'Content-Transfer-Encoding': 'base64' 
      //     // },
      //     body: formData,
      //   })
        
      //   const data = await response.json();
      //   console.log('data from fetch: ', data);
        
      //   // Run the UpdateSolveWindow here
      //   await parentElementInfoTabs.updateSolveResults(data?.solution);
  
      //   // Run the UpdateAnalysisWindow here
      //   await parentElementInfoTabs.updateAnalysisResults(data?.analysis);
      // } catch (error) {
      //   console.error('Error during solve fetch request:', error);
      // } finally {
      //   loadingGif.style.display = 'none';
      // }


  };

  async solveDrawing(canvas) {
    // clear any previously uploaded image
    const parentElementInfoTabs = this.parentElement.querySelector('#info-tabs-container');
    const imageHolderDiv = parentElementInfoTabs.querySelector('.Solution > .imageHolderDiv');
    imageHolderDiv.innerHTML = '';
    
    canvas.toBlob(async (blob) => {

      const formData = new FormData();
      formData.append("file", blob);

      await this.solveLogic(formData);
    })
  };


  async solveUploadedImage(uploadedImageFile) {
    const parentElementInfoTabs = this.parentElement.querySelector('#info-tabs-container');
    // const parentElementDrawingPadContainer = this.parentElement.querySelector('#drawing-pad-container');
    // const topButtonsRow = parentElementDrawingPadContainer.querySelector('.top-buttons-row');
    const solutionInfoTextWindow = parentElementInfoTabs.querySelector('.Solution > .infoText');
    const imageHolderDiv = parentElementInfoTabs.querySelector('.Solution > .imageHolderDiv');

    // // CLEAR PREVIOUS RESULTS
    imageHolderDiv.innerHTML = '';
    solutionInfoTextWindow.innerHTML = '';

    const formData = new FormData();
    formData.append('file', uploadedImageFile);
    // console.log("file: ", uploadedImageFile);

    const imgElement = document.createElement('img');
    imgElement.width = solutionInfoTextWindow.clientWidth;

    const reader = new FileReader();
    reader.onload = (evt) => {
      imgElement.src = evt.target.result;
    }
    reader.readAsDataURL(uploadedImageFile);

    imageHolderDiv.appendChild(imgElement);


    await this.solveLogic(formData);
    
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

    const infoTextWindow = infoTabsContainer.querySelector('.Chat > .infoText');

    infoTextWindow.appendChild(userMessageContainerDiv);
    // console.log(infoTabsContainer)

    // const chatEndPoint = 'https://scratchpad-api.onrender.com/chat';
    const chatEndPoint = 'https://scratch-pad-v2-0.onrender.com/chat';
    // const chatStreamEndpoint = 'https://scratch-pad-v2-0.onrender.com/chat_stream/'
    

    const responseMessageBubble = document.createElement('p');
    responseMessageBubble.classList.add('responseChatMessage');


    const response2 = await
      fetch(chatEndPoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message: chatInput.value }),
      });
    const reader = response2.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let result = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value);
      responseMessageBubble.innerHTML = result;
      infoTextWindow.appendChild(responseMessageBubble);

      responseMessageBubble.innerHTML = responseMessageBubble.innerHTML.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      responseMessageBubble.innerHTML = responseMessageBubble.innerHTML.replace(/^###\s*(.*$)/gim, '<h3>$1</h3>');
      responseMessageBubble.innerHTML = responseMessageBubble.innerHTML.replace(/^##\s*(.*$)/gim, '<h2>$1</h2>');
      responseMessageBubble.innerHTML = responseMessageBubble.innerHTML.replace(/^#\s*(.*$)/gim, '<h1>$1</h1>');

      if (window.MathJax) {
        await window.MathJax.typesetPromise([responseMessageBubble])
          .then(() => {
            console.log('MathJax rendering for SOLVE completed');
          })
          .catch((err) => console.error('MathJax rendering error:', err));
      }
    }

    
    

    
    
    // const response = await fetch(chatEndPoint, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({message: chatInput.value}),
    // })

    // const data = await response.json();
    // console.log("chat data response: ", data);
    // await infoTabsContainer.updateChatConversation(data?.response);
    
    chatInput.value = '';
  }



};

// Define the customer element
customElements.define('math-tutor-scratch-pad', MathTutorScratchPad);

