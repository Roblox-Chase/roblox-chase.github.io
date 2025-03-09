// Global Business Quest - UI Management
// This module handles the user interface

export class UIManager {
    constructor(gameInstance) {
        this.game = gameInstance;
        
        // Get UI elements
        this.countrySelectionUI = document.getElementById('country-selection');
        this.scenarioUI = document.getElementById('scenario-ui');
        this.feedbackUI = document.getElementById('feedback-ui');
        this.scoreDisplay = document.getElementById('score-display');
        
        // Initialize event listeners
        this.initEventListeners();
    }
    
    initEventListeners() {
        // Listen for continue button clicks
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('continue-button')) {
                this.hideFeedback();
                this.game.nextInteraction();
            }
        });
    }
    
    showCountrySelection() {
        console.log("Showing country selection UI");
        
        // Clear previous content
        this.countrySelectionUI.innerHTML = '';
        
        // Add title
        const title = document.createElement('h2');
        title.textContent = 'Global Business Quest';
        this.countrySelectionUI.appendChild(title);
        
        // Add subtitle
        const subtitle = document.createElement('p');
        subtitle.textContent = 'Select a country to begin your business adventure:';
        this.countrySelectionUI.appendChild(subtitle);
        
        // Create country buttons
        Object.keys(this.game.countries).forEach(countryId => {
            const country = this.game.countries[countryId];
            
            const countryButton = document.createElement('div');
            countryButton.classList.add('country-button');
            
            countryButton.innerHTML = `
                <h3>${country.name}</h3>
                <p>${country.description}</p>
            `;
            
            countryButton.addEventListener('click', () => {
                this.game.selectCountry(countryId);
            });
            
            this.countrySelectionUI.appendChild(countryButton);
        });
        
        // Show country selection and hide other UIs
        this.countrySelectionUI.style.display = 'block';
        this.scenarioUI.style.display = 'none';
        this.feedbackUI.style.display = 'none';
    }
    
    showScenario(scenario) {
        // Clear existing content
        this.scenarioUI.innerHTML = '';
        
        // Add title
        const title = document.createElement('h3');
        title.textContent = scenario.title;
        this.scenarioUI.appendChild(title);
        
        // Add description
        const description = document.createElement('p');
        description.textContent = scenario.description;
        this.scenarioUI.appendChild(description);
        
        // Hide country selection and show scenario UI
        this.countrySelectionUI.style.display = 'none';
        this.scenarioUI.style.display = 'block';
    }
    
    showInteraction(interaction) {
        // Add situation if available
        if (interaction.situation) {
            const situationElement = document.createElement('p');
            situationElement.className = 'situation';
            situationElement.textContent = interaction.situation;
            this.scenarioUI.appendChild(situationElement);
        }
        
        // Add prompt
        const promptElement = document.createElement('p');
        promptElement.className = 'prompt';
        promptElement.textContent = interaction.prompt;
        this.scenarioUI.appendChild(promptElement);
        
        // Add options
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-container';
        
        interaction.options.forEach(option => {
            const optionButton = document.createElement('button');
            optionButton.textContent = option.text;
            optionButton.classList.add('option-button');
            
            optionButton.addEventListener('click', () => {
                this.game.selectOption(interaction, option);
            });
            
            optionsContainer.appendChild(optionButton);
        });
        
        this.scenarioUI.appendChild(optionsContainer);
    }
    
    showFeedback(option) {
        // Clear existing content
        this.feedbackUI.innerHTML = '';
        
        // Add result
        const result = document.createElement('h3');
        result.textContent = option.correct ? 'Correct!' : 'Not quite right';
        result.style.color = option.correct ? '#28a745' : '#dc3545';
        this.feedbackUI.appendChild(result);
        
        // Add feedback text
        const feedback = document.createElement('p');
        feedback.textContent = option.feedback;
        this.feedbackUI.appendChild(feedback);
        
        // Add continue button
        const continueButton = document.createElement('button');
        continueButton.textContent = 'Continue';
        continueButton.className = 'continue-button';
        this.feedbackUI.appendChild(continueButton);
        
        // Hide scenario UI and show feedback UI
        this.scenarioUI.style.display = 'none';
        this.feedbackUI.style.display = 'block';
    }
    
    hideFeedback() {
        this.feedbackUI.style.display = 'none';
    }
    
    updateScoreDisplay(score) {
        if (!this.scoreDisplay) return;
        
        this.scoreDisplay.innerHTML = `<h3>Cultural Competence: ${score}</h3>`;
    }
}
