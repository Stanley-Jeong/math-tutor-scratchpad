import { Button } from "./Button.js";

export class InfoTabsContainer extends HTMLElement {
  constructor(sendMessage) {
    super();
    this.id = 'info-tabs-container';
    this.sendMessage = sendMessage;

    // this.placeholderText = `<p>$$ 7 + 12 = 19 $$</p>`;
    // this.longerPlaceholderText = `<p>Certainly! Let's solve the problem step by step:\n\nThe given problem is to add the numbers \\( 7 \\) and \\( 12 \\). Addition is one of the four basic arithmetic operations, and it involves finding the total or sum when combining two or more numbers.\n\nHere's how you solve this:\n\n1. **Identify the numbers to be added:** \n   - The numbers are \\( 7 \\) and \\( 12 \\).\n\n2. **Add the numbers:**\n   - We arrange the numbers vertically to make the addition easier (though this might seem trivial for two numbers):\n   \\[\n   \\begin{array}{c}\n     \\phantom{1}7 \\\\\n   +12 \\\\\n   \\hline\n   \\end{array}\n   \\]\n\n3. **Perform the addition:**\n\n   First, add the ones place:\n   - The ones place in \\( 7 \\) is \\( 7 \\).\n   - The ones place in \\( 12 \\) is \\( 2 \\).\n   - Adding \\( 7 + 2 = 9 \\).\n\n   Since there is nothing to carry over, we simply write \\( 9 \\) in the ones place of the result.\n\n4. **Write down the final result:**\n   - Now, write any numbers in the tens place as they are since there's nothing to carry and just a direct sum:\n   - The tens place in \\( 12 \\) is \\( 1 \\). Placing the \\( 9 \\) from the ones place next to \\( 1 \\), we get \\( 19 \\).\n\nThus, the sum of \\( 7 \\) and \\( 12 \\) is \\(\\boxed{19}\\).\n\nThis process illustrates simple addition, which is often straightforward but can be broken down into these steps for clarity and careful understanding.</p>`;
//     this.longerPlaceholderText = `<p>It looks like there's been a misunderstanding or typo in your expression: \( \frac{7x - 12}{y \quad x=2} \).

// This expression seems to be missing some parts or contains an error. Let's try to interpret what you might mean. Here's a step-by-step process assuming you mean:

// 1. Evaluate the expression \( \frac{7x - 12}{y} \) for \( x = 2 \).

// If this is the intended expression, we first evaluate the expression's numerator by substituting \( x = 2 \).

// 1. **Substitute \( x = 2 \):** 
//    Start with replacing \( x \) in the numerator:

//    \[
//    7x - 12 = 7(2) - 12 = 14 - 12 = 2
//    \]

// 2. **Simplified Numerator:**
//    Therefore, the numerator simplifies to 2.

// 3. **Expression Given:**
//    Now substitute the simplified result into the original expression:

//    \[
//    \frac{2}{y}
//    \]

// Without a specific value or expression for \( y \), we cannot simplify further. The result will depend on the value of \( y \). 

// If the expression or values were supposed to be different, please provide more context or correct the expression, and I can help further!</p>`;
    
    this.longerPlaceholderText = `
      <p>This is an inline equation: \\( a^2 + b^2 = c^2 \\).</p>
      <p>This is a display equation: $$ E = mc^2 $$</p>
    `
    

    // Right Container
    const rightContainer = document.createElement('div');
    rightContainer.classList.add('right-container');

    // this means the class instance itself. RENDER the DOM node to the custom HTML element itself
    this.appendChild(rightContainer);

    // Create tab buttons
    this.tabs = ['Solution', 'Analysis', 'Chat'];
    
    // Right-side Tab Window
    const tabContainer = document.createElement('div');
    tabContainer.setAttribute('class', 'tabs-container');

    this.tabs.forEach((tab) => {
      const tabDiv = document.createElement('div');
      tabDiv.classList.add('tab')
      tabDiv.textContent = tab;
      tabDiv.onclick = () => this.showTab(tab);
      // ontouchstart smoother, quicker on mobile
      tabDiv.ontouchstart = () => this.showTab(tab);
      tabContainer.appendChild(tabDiv)
    })

    // Create right content areas
    // Solutions window
    this.solutionWindow = this.createInfoArea('Solution');
    // Analysis window
    this.analysisWindow = this.createInfoArea('Analysis');
    // Chat window
    this.chatWindow = this.createInfoArea('Chat');

    this.currentTab = 'Solution';
    this.showTab(this.currentTab);

    rightContainer.appendChild(tabContainer);
    rightContainer.appendChild(this.solutionWindow);
    rightContainer.appendChild(this.analysisWindow);
    rightContainer.appendChild(this.chatWindow);
  }

  updateSolveResults(solutionText) {
    // console.log("updateSolveResults math jax status: ", window.MathJax)
    // this.querySelector('.Solution > .infoText').innerHTML = `<p>${solutionText}</p>`;

    const infoTextWindow = this.querySelector('.Solution > .infoText');

    const solutionP = document.createElement('p');
    solutionP.innerHTML = !solutionText ? "Sorry, I cannot read the image or drawing. Please try again." : solutionText;
    infoTextWindow.appendChild(solutionP);

    const mathElements = infoTextWindow.querySelectorAll('p, div');


    mathElements.forEach((element) => {
      element.innerHTML = element.innerHTML.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      element.innerHTML = element.innerHTML.replace(/^###\s*(.*$)/gim, '<h3>$1</h3>');
      element.innerHTML = element.innerHTML.replace(/^##\s*(.*$)/gim, '<h2>$1</h2>');
      element.innerHTML = element.innerHTML.replace(/^#\s*(.*$)/gim, '<h1>$1</h1>');
    })

    // if (window.marked) {
    //   mathElements.forEach((element) => {
    //     const markdownText = element.textContent;

    //     // const renderedHTML = window.marked.parse(markdownText);
    //     // element.innerHTML = renderedHTML;

    //     Promise.resolve(window.marked.parse(markdownText))
    //       .then((renderedHTML) => {
    //         element.innerHTML = renderedHTML;
    //         console.log('mdScript rendering for updateSolveResults completed');
    //       })
    //       .catch((err) => console.error('mdScript rendering error:', err));
    //   });
    // }

    if (window.MathJax) {
      mathElements.forEach((element) => {
        window.MathJax.typesetPromise([element])
          .then(() => {
            console.log('MathJax rendering for updateSolveResults completed');
          })
          .catch((err) => console.error('MathJax rendering error:', err));
      });
    }

  }

  updateAnalysisResults(analysisText) {
    const infoTextWindow = this.querySelector('.Analysis > .infoText');

    infoTextWindow.innerHTML = '';

    const analysisP = document.createElement('p');
    analysisP.innerHTML = !analysisText ? "Sorry, I cannot read the image or drawing. Please try again." : analysisText;
    infoTextWindow.appendChild(analysisP);

    const mathElements = infoTextWindow.querySelectorAll('p, div');

    mathElements.forEach((element) => {
      element.innerHTML = element.innerHTML.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      element.innerHTML = element.innerHTML.replace(/^###\s*(.*$)/gim, '<h3>$1</h3>');
      element.innerHTML = element.innerHTML.replace(/^##\s*(.*$)/gim, '<h2>$1</h2>');
      element.innerHTML = element.innerHTML.replace(/^#\s*(.*$)/gim, '<h1>$1</h1>');
    })

    if (window.MathJax) {
      mathElements.forEach((element) => {
        window.MathJax.typesetPromise([element])
          .then(() => {
            console.log('MathJax rendering for updateAnalysisResults completed');
          })
          .catch((err) => console.error('MathJax rendering error:', err));
      });
    }
  }

  updateChatConversation(lastResponse) {
    const responseMessageBubble = document.createElement('p');
    responseMessageBubble.classList.add('responseChatMessage');
    responseMessageBubble.innerHTML = lastResponse;

    this.querySelector('.Chat > .infoText').appendChild(responseMessageBubble);

    const mathElements = this.querySelector('.Chat > .infoText').querySelectorAll('p, div');

    if (window.MathJax) {
      mathElements.forEach((element) => {
        window.MathJax.typesetPromise([element])
          .then(() => {
            console.log('MathJax rendering completed');
          })
          .catch((err) => console.error('MathJax rendering error:', err));
      });
    }
    
    // console.log("updateChatConversation", lastResponse);
  }


  createInfoArea(sectionName) {
    const infoArea = document.createElement('div');
    infoArea.setAttribute('class', 'tab-content');
    infoArea.classList.add(sectionName);

    const infoTitle = document.createElement('h3');
    infoTitle.textContent = sectionName;
    infoTitle.style.textAlign = 'center';
    infoArea.appendChild(infoTitle);

    const horizontalLine = document.createElement('hr');
    infoArea.appendChild(horizontalLine);

    const imageHolderDiv = document.createElement('div');
    imageHolderDiv.classList.add('imageHolderDiv');

    const infoText = document.createElement('p');
    infoText.classList.add('infoText');

    const exampleText = `${sectionName} Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam auctor sodales sed, non taciti non. Sollicitudin nunc per malesuada efficitur, vel pellentesque. Ad viverra sed dolor augue suscipit class. Elit nascetur sagittis orci egestas ridiculus. Turpis dignissim magna per senectus eleifend pulvinar donec velit. Facilisi lobortis primis; turpis volutpat curae amet.

Scelerisque lacinia turpis praeseent orci facilisis. Gravida ex litora dictum feugiat netus, sagittis aptent. Suscipit lorem malesuada pretium litora potenti ornare. Aliquam iaculis orci vivamus lacinia non tempus fermentum imperdiet. Nullam suspendisse eleifend augue donec molestie nascetur. Libero placerat per hendrerit potenti enim non ante. Mauris tempor dignissim sed vivamus; ut scelerisque.

Quisque augue tristique porttitor, inceptos cursus maximus consectetur. Adipiscing class pulvinar massa; torquent parturient eget augue. Cras non adipiscing phasellus taciti at hendrerit maximus. Dictumst dapibus ut sagittis orci vehicula. Tortor dapibus habitant neque rhoncus himenaeos ornare varius. Orci lacus inceptos eros tempor condimentum consectetur enim iaculis. Pulvinar volutpat fames malesuada velit rutrum. Id finibus eu quis, eu felis gravida maecenas nascetur consequat.

Ultrices a mus fringilla gravida morbi litora. Ullamcorper tincidunt magnis felis fames, posuere at diam senectus ut. Ullamcorper sollicitudin eu congue tortor amet tristique elit. Curae neque nostra parturient vivamus aptent duis aliquet euismod. Sagittis consectetur maecenas feugiat; ultricies quisque finibus. Nec justo quam tincidunt cursus dignissim consequat non. Venenatis id metus odio hendrerit, eros scelerisque urna. Parturient malesuada aptent nec hac lacinia urna lobortis tellus.

Donec non nunc tempus, et efficitur nibh adipiscing. Sodales hac netus potenti ultricies pulvinar. Ac integer sollicitudin tincidunt nulla nascetur. Porttitor himenaeos mollis tempus cursus mi pharetra? Vel vehicula proin cras dolor viverra ultrices eu. Scelerisque libero finibus suspendisse amet augue phasellus nulla nisl commodo. Morbi litora metus viverra viverra viverra iaculis leo posuere interdum. Quam suscipit tincidunt at est enim.

Convallis semper vestibulum mattis porta mollis tortor efficitur. Proin natoque rutrum ac; lorem aliquet finibus. Curabitur praesent adipiscing quam lorem mus convallis tortor imperdiet aptent. Natoque ridiculus massa leo commodo conubia facilisi facilisi sociosqu. Dictum adipiscing taciti mattis mus eu arcu posuere. Habitant auctor lorem, augue facilisis cursus blandit nostra ligula. Nulla velit curabitur rhoncus dictum gravida metus nisi. Eros at potenti eleifend ex, volutpat vestibulum justo. Diam ullamcorper velit lobortis ipsum sem tempus id.

Ac urna inceptos massa potenti neque. Curae efficitur felis congue magnis duis euismod sodales dolor magna. Accumsan inceptos nam sollicitudin dui faucibus. Elementum arcu proin tempus pulvinar sapien viverra. Aliquam tincidunt malesuada montes fames cubilia efficitur faucibus. Mi habitant blandit fames mauris etiam litora. Viverra taciti praesent accumsan lacinia viverra praesent tortor ipsum. Dignissim eros condimentum cras tincidunt luctus potenti. Aliquam imperdiet magnis commodo phasellus suscipit viverra.

Euismod ligula vel habitasse nisl eu placerat porttitor libro praesent. Nascetur primis metus primis; nascetur penatibus enim lobortis. Nam rhoncus nec quis mattis malesuada. Sociosqu lacus interdum quam dapibus pretium mauris. Himenaeos hendrerit etiam metus commodo luctus? Faucibus metus eros libero sociosqu aliquet at est nostra. Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam auctor sodales sed, non taciti non. Sollicitudin nunc per malesuada efficitur, vel pellentesque. Ad viverra sed dolor augue suscipit class. Elit nascetur sagittis orci egestas ridiculus. Turpis dignissim magna per senectus eleifend pulvinar donec velit. Facilisi lobortis primis; turpis volutpat curae amet.

Scelerisque lacinia turpis praeseent orci facilisis. Gravida ex litora dictum feugiat netus, sagittis aptent. Suscipit lorem malesuada pretium litora potenti ornare. Aliquam iaculis orci vivamus lacinia non tempus fermentum imperdiet. Nullam suspendisse eleifend augue donec molestie nascetur. Libero placerat per hendrerit potenti enim non ante. Mauris tempor dignissim sed vivamus; ut scelerisque.

Quisque augue tristique porttitor, inceptos cursus maximus consectetur. Adipiscing class pulvinar massa; torquent parturient eget augue. Cras non adipiscing phasellus taciti at hendrerit maximus. Dictumst dapibus ut sagittis orci vehicula. Tortor dapibus habitant neque rhoncus himenaeos ornare varius. Orci lacus inceptos eros tempor condimentum consectetur enim iaculis. Pulvinar volutpat fames malesuada velit rutrum. Id finibus eu quis, eu felis gravida maecenas nascetur consequat.

Ultrices a mus fringilla gravida morbi litora. Ullamcorper tincidunt magnis felis fames, posuere at diam senectus ut. Ullamcorper sollicitudin eu congue tortor amet tristique elit. Curae neque nostra parturient vivamus aptent duis aliquet euismod. Sagittis consectetur maecenas feugiat; ultricies quisque finibus. Nec justo quam tincidunt cursus dignissim consequat non. Venenatis id metus odio hendrerit, eros scelerisque urna. Parturient malesuada aptent nec hac lacinia urna lobortis tellus.

Donec non nunc tempus, et efficitur nibh adipiscing. Sodales hac netus potenti ultricies pulvinar. Ac integer sollicitudin tincidunt nulla nascetur. Porttitor himenaeos mollis tempus cursus mi pharetra? Vel vehicula proin cras dolor viverra ultrices eu. Scelerisque libero finibus suspendisse amet augue phasellus nulla nisl commodo. Morbi litora metus viverra viverra viverra iaculis leo posuere interdum. Quam suscipit tincidunt at est enim.

Convallis semper vestibulum mattis porta mollis tortor efficitur. Proin natoque rutrum ac; lorem aliquet finibus. Curabitur praesent adipiscing quam lorem mus convallis tortor imperdiet aptent. Natoque ridiculus massa leo commodo conubia facilisi facilisi sociosqu. Dictum adipiscing taciti mattis mus eu arcu posuere. Habitant auctor lorem, augue facilisis cursus blandit nostra ligula. Nulla velit curabitur rhoncus dictum gravida metus nisi. Eros at potenti eleifend ex, volutpat vestibulum justo. Diam ullamcorper velit lobortis ipsum sem tempus id.

Ac urna inceptos massa potenti neque. Curae efficitur felis congue magnis duis euismod sodales dolor magna. Accumsan inceptos nam sollicitudin dui faucibus. Elementum arcu proin tempus pulvinar sapien viverra. Aliquam tincidunt malesuada montes fames cubilia efficitur faucibus. Mi habitant blandit fames mauris etiam litora. Viverra taciti praesent accumsan lacinia viverra praesent tortor ipsum. Dignissim eros condimentum cras tincidunt luctus potenti. Aliquam imperdiet magnis commodo phasellus suscipit viverra.

Euismod ligula vel habitasse nisl eu placerat porttitor libro praesent. Nascetur primis metus primis; nascetur penatibus enim lobortis. Nam rhoncus nec quis mattis malesuada. Sociosqu lacus interdum quam dapibus pretium mauris. Himenaeos hendrerit etiam metus commodo luctus? Faucibus metus eros libero sociosqu aliquet at est nostra.`;


    // infoText.innerHTML = this.placeholderText;
    // infoText.innerHTML = this.longerPlaceholderText;


    infoArea.appendChild(imageHolderDiv);
    infoArea.appendChild(infoText);

    // Chat Window differentiators
    if (sectionName === 'Chat') {
      this.chatInputContainer = document.createElement('div');
      this.chatInputContainer.classList.add('chat-input-container');
      const chatInputFlexbox = document.createElement('div');
      chatInputFlexbox.classList.add('chat-input-flexbox');
      
      const chatInput = document.createElement('input');
      chatInput.type = 'text';
      chatInput.classList.add('chat-input');

      // bottom spacer for chat box
      const chatboxOffsetDiv = document.createElement('div');
      chatboxOffsetDiv.classList.add('chatbox-offset-div');
      infoArea.appendChild(chatboxOffsetDiv);
  

      // Clicking on the Send Button
      const sendButton = new Button('Send');
      sendButton.onmouseup = () => this.sendMessage(this, chatInput);
      
      // on Enter key, clear input and run function
      chatInput.addEventListener('keyup', (evt) => {
        if (evt.key === 'Enter') {
          evt.preventDefault();
          this.sendMessage(this, chatInput);
        }
      })

      chatInputFlexbox.append(chatInput, sendButton);
      // infoArea.appendChild(this.chatInputContainer)
      this.chatInputContainer.append(chatInputFlexbox)
      this.appendChild(this.chatInputContainer);
    }

    return infoArea;
  }

  showTab(tab) {
    this.chatInputContainer.classList.remove('active');
    this.querySelectorAll('.tab-content').forEach((content) => {
      content.classList.remove('active');
    });
    this.querySelectorAll('.tab').forEach((tabElement) => {
      if (tabElement.textContent === tab) {
        tabElement.classList.add('active')
      } else {
        tabElement.classList.remove('active')
      }
    })
    if (tab === 'Solution') {
      this.solutionWindow.classList.add('active');
    } else if (tab === 'Analysis') {
      this.analysisWindow.classList.add('active');
    } else if (tab === 'Chat') {
      this.chatWindow.classList.add('active');
      this.chatInputContainer.classList.add('active');
    }
  }

}


customElements.define('info-tabs-container', InfoTabsContainer);
