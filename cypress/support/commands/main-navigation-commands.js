// cypress/support/main-navigation-commands.js

import mainNavigationPage from '../elements/main-navigation-page'; // Import the page object

class MainNavigationActions {

    // Method to navigate to the base URL of the application.
    // This could also be in a more general 'common-actions.js' or directly in beforeEach.
    visitHomePage() {
        cy.visit('https://www.laboratoriodetesting.com/');
    }

    // Method to assert the total number of primary navigation links.
    assertNumberOfNavigationLinks(expectedCount) {
        mainNavigationPage.getNavigationContainer()
            .children() // Get the direct <a> children within the container
            .should('have.length', expectedCount);
    }

    // Method to validate the 'Inicio' link.
    validateInicioLink() {
        mainNavigationPage.getInicioLink()
            .should('be.visible')
            .and('have.attr', 'href', '/'); // Assert the correct href value
    }

    // Method to validate the 'Acceder' link.
    validateAccederLink() {
        mainNavigationPage.getAccederLink()
            .should('be.visible')
            .and('have.attr', 'href', '/auth/login')// Assert the correct href value
             
    }

    // Method to validate the 'Registrarse' link.
    validateRegistrarseLink() {
        mainNavigationPage.getRegistrarseLink()
            .should('be.visible')
            .and('have.attr', 'href', '/auth/signup'); // Assert the correct href value
    }
     validateRegistrarseLink2() {
        mainNavigationPage.getRegistrarseLink()
            .should('be.visible')
            .and('have.attr', 'href', '/auth/signup')
            .click(); // Assert the correct href value
    }

    // Example of an action: Clicking the Acceder link
    clickAccederLink() {
        mainNavigationPage.getAccederLink().click();
    }

    //Logo commands

    // --- NEW LOGO ACTION METHODS ---

    validateHeaderContainerIsVisible() {
        mainNavigationPage.getHeaderContainer().should('be.visible');
    }

    validateBrandLogoLink(){
        mainNavigationPage.getBrandLogoLink().should('be.visible')
        .should('have.attr', 'href', '/') ;
    }
   

    validateBrandLogoImageIsVisible() {
        mainNavigationPage.getBrandLogoImage().children().children().should('be.visible')
        
    }

    validateCartOptionImageIsVisible() {
        mainNavigationPage.getCartOpenerMobileButton().should('be.visible')
       
        
    }

     clickMobileCartOpener() {
        mainNavigationPage.getCartOpenerMobileButton().click();
    }

    assertCartModalIsOpen(expectedTitle = 'Your Cart') {
        mainNavigationPage.getCartModal()
            .should('be.visible')
            .and('have.css', 'right', '0px') // Assert it's positioned on the right
            .and('have.css', 'width'); // Check width to ensure it's not collapsed
            // You might add more assertions based on actual modal content, e.g.:
            // .and('contain', expectedTitle); // Check for modal title text
            // .find('.cart-total').should('exist'); // Check if a cart total element exists
    }
// Method to validate the "Ir al checkout" button
validateCheckoutButtonInModal() {
    mainNavigationPage.getCheckoutButtonInModal()
        .should('be.visible')
        .and('contain', 'Ir al checkout')
        .and('not.be.disabled'); // Or .and('be.disabled') if that's the expected initial state
}

// Method to validate the "Limpiar" button
validateClearCartButtonInModal() {
    mainNavigationPage.getClearCartButtonInModal()
        .should('be.visible')
        .and('contain', 'Limpiar')
        .and('not.be.disabled'); // Or .and('be.disabled') if that's the expected initial state
}



closeCartModal() {
        mainNavigationPage.getCartModalCloseButton().click();
    }

    assertCartModalIsClosed() {
        mainNavigationPage.getCartModal().should('not.be.visible');
        // If the modal is completely removed from the DOM after closing, use:
        // mainNavigationPage.getCartModal().should('not.exist');
    }

    
}

// Export an instance of the actions class
export default new MainNavigationActions();