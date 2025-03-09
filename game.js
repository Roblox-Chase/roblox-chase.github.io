// Global Business Quest - Three.js Implementation
// This file sets up the core game environment and mechanics

// Import Three.js and necessary modules
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Main Game Class
class GlobalBusinessQuest {
  constructor() {
    console.log("Starting GlobalBusinessQuest...");
    console.log("THREE.js version:", THREE.REVISION);
    
    // Game state
    this.currentCountry = null;
    this.currentScenario = null;
    this.playerScore = 0;
    this.culturalCompetence = {};
    this.unlockedCountries = ['japan', 'france']; // Starting countries
    
    // Game configuration
    this.countries = {
      japan: {
        name: 'Japan',
        description: 'Navigate formal business meetings in Tokyo',
        scenarios: [
          {
            id: 'tokyo_meeting',
            title: 'Tokyo Office Meeting',
            description: 'You\'re attending your first business meeting in Tokyo',
            scene: 'tokyo_office',
            interactions: [
              {
                id: 'greeting',
                prompt: 'How do you greet your Japanese business partners?',
                options: [
                  { 
                    text: 'Bow slightly', 
                    correct: true,
                    feedback: 'Correct! A respectful bow is the appropriate greeting in Japanese business culture.' 
                  },
                  { 
                    text: 'Offer a firm handshake', 
                    correct: false,
                    feedback: 'While handshakes are becoming more common in international business in Japan, starting with a bow shows respect for local customs.' 
                  },
                  { 
                    text: 'Give a friendly hug', 
                    correct: false,
                    feedback: 'Physical contact like hugging is considered too familiar and inappropriate in Japanese business settings.' 
                  }
                ]
              },
              {
                id: 'business_cards',
                prompt: 'Your Japanese counterpart presents their business card to you. What should you do?',
                options: [
                  { 
                    text: 'Take it with both hands, examine it respectfully, and place it carefully on the table', 
                    correct: true,
                    feedback: 'Correct! Business cards (meishi) are treated with great respect in Japan. They are an extension of the person and should be handled carefully.' 
                  },
                  { 
                    text: 'Take it with one hand and put it in your pocket', 
                    correct: false,
                    feedback: 'Placing a business card in your pocket immediately is considered disrespectful in Japan.' 
                  },
                  { 
                    text: 'Take it and write notes on it', 
                    correct: false,
                    feedback: 'Writing on someone\'s business card is considered very disrespectful in Japanese business culture.' 
                  }
                ]
              }
            ]
          }
        ]
      },
      france: {
        name: 'France',
        description: 'Learn the art of business lunches in Paris',
        scenarios: [
          {
            id: 'paris_lunch',
            title: 'Parisian Business Lunch',
            description: 'You\'re invited to a business lunch at a restaurant in Paris',
            scene: 'paris_restaurant',
            interactions: [
              {
                id: 'greeting',
                prompt: 'How do you greet your French business associates?',
                options: [
                  { 
                    text: 'A light handshake and "Bonjour"', 
                    correct: true,
                    feedback: 'Correct! A handshake with "Bonjour" (or "Bonjour Madame/Monsieur") is the appropriate formal greeting in French business culture.' 
                  },
                  { 
                    text: 'Kiss on both cheeks', 
                    correct: false,
                    feedback: 'While "la bise" (cheek kisses) is common in social settings in France, it\'s typically not appropriate for initial business meetings unless you know the person well.' 
                  },
                  { 
                    text: 'Just say "Hey" with a wave', 
                    correct: false,
                    feedback: 'This greeting is too casual for French business culture, which values formality and politeness in professional settings.' 
                  }
                ]
              },
              {
                id: 'business_discussion',
                prompt: 'When is the appropriate time to begin discussing business during the lunch?',
                options: [
                  { 
                    text: 'After some general conversation and when the main course is served', 
                    correct: true,
                    feedback: 'Correct! In France, it\'s customary to engage in general conversation before discussing business matters, usually around the main course.' 
                  },
                  { 
                    text: 'Immediately after ordering', 
                    correct: false,
                    feedback: 'Starting business talk immediately is considered too direct and may be perceived as rude or impatient in French business culture.' 
                  },
                  { 
                    text: 'Not at all - a business lunch is purely social', 
                    correct: false,
                    feedback: 'While relationship building is important, a business lunch in France does typically include business discussion, just not at the very beginning.' 
                  }
                ]
              }
            ]
          }
        ]
      }
    };
    
    // Three.js setup
    this.initThreeJS();
    
    // Start the game
    this.showCountrySelection();
  }
  
  initThreeJS() {
    console.log("Initializing Three.js...");
    
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB); // Sky blue background
    
    // Camera setup
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 1.6, 5); // Positioning camera at human eye level
    
    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    
    // Get the container and add the renderer
    const container = document.getElementById('game-container');
    container.appendChild(this.renderer.domElement);
    
    // Controls setup
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2; // Prevent camera from going below ground
    
    // Lighting setup
    this.addLights();
    
    // Basic ground
    this.addGround();
    
    // Scene assets loader
    this.loader = new GLTFLoader();
    
    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize(), false);
    
    // Animation loop
    this.animate();
    
    console.log("Three.js initialization complete!");
  }
  
  addLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    // Directional light (sun)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7.5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    this.scene.add(dirLight);
  }
  
  addGround() {
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x1a5e1a });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }
  
  loadCountryScene(country) {
    // Clear existing scene objects (except for lights and ground)
    this.clearScene();
    
    // Load appropriate scene based on country
    if (country === 'japan') {
      this.loadJapanScene();
    } else if (country === 'france') {
      this.loadFranceScene();
    }
  }
  
  loadJapanScene() {
    console.log("Loading Japan scene...");
    
    // Create office room
    const roomGeometry = new THREE.BoxGeometry(10, 5, 10);
    const roomMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xeeeeee,
      side: THREE.BackSide // Render inside of the box
    });
    const room = new THREE.Mesh(roomGeometry, roomMaterial);
    room.position.set(0, 2.5, 0);
    this.scene.add(room);
    
    // Add office furniture (simplified)
    this.addTable(0, 1, 0);
    this.addChairs();
    
    // Position camera inside the room
    this.camera.position.set(0, 1.6, 4);
    this.camera.lookAt(0, 1.6, 0);
  }
  
  loadFranceScene() {
    console.log("Loading France scene...");
    
    // Create restaurant interior
    const roomGeometry = new THREE.BoxGeometry(10, 5, 10);
    const roomMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xf5f5dc, // Beige
      side: THREE.BackSide // Render inside of the box
    });
    const room = new THREE.Mesh(roomGeometry, roomMaterial);
    room.position.set(0, 2.5, 0);
    this.scene.add(room);
    
    // Add restaurant table with tablecloth
    this.addTable(0, 1, 0, 0xffffff); // White tablecloth
    this.addChairs();
    this.addTableSettings();
    
    // Position camera inside the restaurant
    this.camera.position.set(0, 1.6, 4);
    this.camera.lookAt(0, 1.6, 0);
  }
  
  addTable(x, y, z, color = 0x8B4513) {
    // Table top
    const tableTopGeometry = new THREE.BoxGeometry(3, 0.1, 2);
    const tableTopMaterial = new THREE.MeshStandardMaterial({ color: color });
    const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial);
    tableTop.position.set(x, y, z);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    this.scene.add(tableTop);
    
    // Table legs
    const legGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    
    const positions = [
      [x - 1.4, y - 0.5, z - 0.9],
      [x + 1.4, y - 0.5, z - 0.9],
      [x - 1.4, y - 0.5, z + 0.9],
      [x + 1.4, y - 0.5, z + 0.9]
    ];
    
    positions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(...pos);
      leg.castShadow = true;
      this.scene.add(leg);
    });
  }
  
  addChairs() {
    // Simplified chair representation
    const positions = [
      [-1.5, 0.5, 1.5], // Chair 1
      [1.5, 0.5, 1.5],  // Chair 2
      [0, 0.5, -1.5]    // Chair 3 (your position)
    ];
    
    positions.forEach((pos, index) => {
      const seatGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.8);
      const seatMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const seat = new THREE.Mesh(seatGeometry, seatMaterial);
      seat.position.set(...pos);
      seat.castShadow = true;
      this.scene.add(seat);
      
      // Add backrest except for "your" chair
      if (index < 2) {
        const backGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.1);
        const back = new THREE.Mesh(backGeometry, seatMaterial);
        back.position.set(pos[0], pos[1] + 0.45, pos[2] - 0.45);
        back.castShadow = true;
        this.scene.add(back);
      }
    });
  }
  
  addTableSettings() {
    // Add plates, glasses, etc. for the restaurant scene
    const plateGeometry = new THREE.CircleGeometry(0.3, 32);
    const plateMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    
    const positions = [
      [-0.8, 1.05, 0.6], // Plate 1
      [0.8, 1.05, 0.6],  // Plate 2
      [0, 1.05, -0.6]    // Plate 3 (your position)
    ];
    
    positions.forEach(pos => {
      const plate = new THREE.Mesh(plateGeometry, plateMaterial);
      plate.rotation.x = -Math.PI / 2;
      plate.position.set(...pos);
      this.scene.add(plate);
      
      // Add wine glasses
      const glassGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16);
      const glassMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.5
      });
      const glass = new THREE.Mesh(glassGeometry, glassMaterial);
      glass.position.set(pos[0] + 0.4, pos[1] + 0.1, pos[2]);
      this.scene.add(glass);
    });
  }
  
  clearScene() {
    // Keep track of permanent objects (lights, ground)
    const permanentObjects = [];
    this.scene.children.forEach(child => {
      if (child instanceof THREE.AmbientLight || 
          child instanceof THREE.DirectionalLight || 
          (child instanceof THREE.Mesh && child.geometry instanceof THREE.PlaneGeometry)) {
        permanentObjects.push(child);
      }
    });
    
    // Clear scene
    this.scene.clear();
    
    // Add back permanent objects
    permanentObjects.forEach(obj => this.scene.add(obj));
  }
  
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
  
  showCountrySelection() {
    console.log("Showing country selection...");
    
    // Get the country selection UI element
    const countrySelectionUI = document.getElementById('country-selection');
    
    // Clear previous content
    countrySelectionUI.innerHTML = '';
    
    // Add title
    const title = document.createElement('h2');
    title.textContent = 'Global Business Quest';
    countrySelectionUI.appendChild(title);
    
    // Add subtitle
    const subtitle = document.createElement('p');
    subtitle.textContent = 'Select a country to begin your business adventure:';
    countrySelectionUI.appendChild(subtitle);
    
    // Create country buttons
    Object.keys(this.countries).forEach(countryId => {
      if (this.unlockedCountries.includes(countryId)) {
        const country = this.countries[countryId];
        
        const countryButton = document.createElement('div');
        countryButton.classList.add('country-button');
        
        countryButton.innerHTML = `
          <h3>${country.name}</h3>
          <p>${country.description}</p>
        `;
        
        countryButton.addEventListener('click', () => {
          this.selectCountry(countryId);
        });
        
        countrySelectionUI.appendChild(countryButton);
      }
    });
    
    // Display the country selection UI
    countrySelectionUI.style.display = 'block';
    document.getElementById('scenario-ui').style.display = 'none';
    document.getElementById('feedback-ui').style.display = 'none';
    
    // Update score display
    this.updateScoreDisplay();
  }
  
  updateScoreDisplay() {
    const scoreDisplay = document.getElementById('score-display');
    scoreDisplay.innerHTML = `<h3>Cultural Competence: ${this.playerScore}</h3>`;
  }
  
  selectCountry(countryId) {
    console.log("Country selected:", countryId);
    this.currentCountry = countryId;
    
    // Load the country's 3D scene
    this.loadCountryScene(countryId);
    
    // Hide country selection UI
    document.getElementById('country-selection').style.display = 'none';
    
    // Show first scenario
    const scenarios = this.countries[countryId].scenarios;
    if (scenarios && scenarios.length > 0) {
      this.startScenario(scenarios[0].id);
    }
  }
  
  startScenario(scenarioId) {
    console.log("Starting scenario:", scenarioId);
    
    // Find scenario
    const scenario = this.countries[this.currentCountry].scenarios.find(s => s.id === scenarioId);
    this.currentScenario = scenario;
    
    if (!scenario) return;
    
    // Get scenario UI
    const scenarioUI = document.getElementById('scenario-ui');
    
    // Set up scenario UI
    scenarioUI.innerHTML = `
      <h3>${scenario.title}</h3>
      <p>${scenario.description}</p>
    `;
    
    // Show first interaction
    if (scenario.interactions && scenario.interactions.length > 0) {
      this.showInteraction(scenario.interactions[0]);
    }
    
    // Display scenario UI
    scenarioUI.style.display = 'block';
  }
  
  showInteraction(interaction) {
    console.log("Showing interaction:", interaction.id);
    
    // Get scenario UI
    const scenarioUI = document.getElementById('scenario-ui');
    
    // Add interaction to UI
    const interactionContainer = document.createElement('div');
    interactionContainer.innerHTML = `<p class="prompt">${interaction.prompt}</p>`;
    scenarioUI.appendChild(interactionContainer);
    
    // Add options
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    
    interaction.options.forEach(option => {
      const optionButton = document.createElement('button');
      optionButton.textContent = option.text;
      optionButton.classList.add('option-button');
      
      optionButton.addEventListener('click', () => {
        this.selectOption(interaction, option);
      });
      
      optionsContainer.appendChild(optionButton);
    });
    
    scenarioUI.appendChild(optionsContainer);
  }
  
  selectOption(interaction, selectedOption) {
    console.log("Option selected:", selectedOption.text);
    
    // Hide the scenario UI
    document.getElementById('scenario-ui').style.display = 'none';
    
    // Show feedback
    this.showFeedback(selectedOption);
    
    // Update score
    if (selectedOption.correct) {
      this.playerScore += 10;
    }
    this.updateScoreDisplay();
    
    // Find next interaction
    const currentInteractionIndex = this.currentScenario.interactions.findIndex(i => i.id === interaction.id);
    const nextInteraction = this.currentScenario.interactions[currentInteractionIndex + 1];
    
    // Set timeout to continue
    setTimeout(() => {
      document.getElementById('feedback-ui').style.display = 'none';
      
      if (nextInteraction) {
        // Show next interaction
        document.getElementById('scenario-ui').style.display = 'block';
        this.showInteraction(nextInteraction);
      } else {
        // End of scenario
        this.endScenario();
      }
    }, 3000);
  }
  
  showFeedback(option) {
    console.log("Showing feedback");
    
    // Get feedback UI
    const feedbackUI = document.getElementById('feedback-ui');
    
    // Create feedback content
    feedbackUI.innerHTML = '';
    
    const result = document.createElement('h3');
    result.textContent = option.correct ? 'Correct!' : 'Not quite right';
    result.style.color = option.correct ? '#28a745' : '#dc3545';
    feedbackUI.appendChild(result);
    
    const feedback = document.createElement('p');
    feedback.textContent = option.feedback;
    feedbackUI.appendChild(feedback);
    
    // Display feedback UI
    feedbackUI.style.display = 'block';
  }
  
  endScenario() {
    console.log("Scenario complete");
    
    // Get feedback UI
    const feedbackUI = document.getElementById('feedback-ui');
    
    // Show scenario completion message
    feedbackUI.innerHTML = `
      <h3>Scenario Complete!</h3>
      <p>You've completed this business scenario.</p>
      <button id="continue-button" class="continue-button">Continue</button>
    `;
    
    // Add event listener to the continue button
    document.getElementById('continue-button').addEventListener('click', () => {
      feedbackUI.style.display = 'none';
      this.showCountrySelection();
    });
    
    // Display feedback UI
    feedbackUI.style.display = 'block';
  }
}

// Initialize the game when page loads
window.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded, initializing game...");
  const game = new GlobalBusinessQuest();
});
