import { Button } from "./Button.js";

export class InfoTabsContainer extends HTMLElement {
  constructor() {
    super();
    
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

    const infoText = document.createElement('p');
    infoText.textContent = `${sectionName} Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam auctor sodales sed, non taciti non. Sollicitudin nunc per malesuada efficitur, vel pellentesque. Ad viverra sed dolor augue suscipit class. Elit nascetur sagittis orci egestas ridiculus. Turpis dignissim magna per senectus eleifend pulvinar donec velit. Facilisi lobortis primis; turpis volutpat curae amet.

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
  

      const sendMessage = () => {
        chatInput.value = '';

        // CHAT FUNCTIONALITY HERE
        
      }

      // Clicking on the Send Button
      const sendButton = new Button('Send');
      sendButton.onmouseup = sendMessage;
      
      // on Enter key, clear input and run function
      chatInput.addEventListener('keyup', (evt) => {
        if (evt.key === 'Enter') {
          evt.preventDefault();
          sendMessage();
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
