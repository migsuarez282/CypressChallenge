// cypress/page-objects/main-navigation-page.js

class MainNavigationPage {

    // Selector for the overall container that holds the main navigation links.
    // Based on your working test, this is the parent used to count children.
    // NOTE: While this selector worked for you, keep in mind that chained
    // `.find('.hidden')` can sometimes be brittle if DOM structure changes.
    // However, since it's working for you, we'll keep it here.
    getNavigationContainer() {
        return cy.get('.px-5').find('.hidden');
    }

    // Getters for individual navigation links using their text content.
    // cy.contains() is generally very robust for visible text elements.
    getInicioLink() {
        return cy.contains('a', 'Inicio');
    }

    getAccederLink() {
        return cy.contains('a', 'Acceder');
    }

    getRegistrarseLink() {
        return cy.contains('a', 'Registrarse');
    }
    

    // You could also add other specific element selectors here if needed, e.g.:
    // getLoginButton() { return cy.get('[data-qa="login-button"]'); }

    //Selectors to interact with the logo

    // The main header element, which contains the logo and navigation
    getHeaderContainer() {
        return cy.get('[data-at="header"]');
    }


    // The logo image itself. Note: There are two <img> tags with this data-at,
    // one for small screens (hidden on large) and one for large screens (hidden on small).
    // Cypress's .should('be.visible') will correctly assert that the currently visible one is present.
    getBrandLogoImage() {
        return cy.get('[data-at="brand-logo"]');
    }

     getBrandLogoLink() {
        return  cy.get('a.flex');
      
    }

    getCartOpenerMobileButton() {
        return cy.get('[data-at="cart-opener"]');
    
}
 getCartModal() {
        // This selector targets the <aside> element that acts as the cart modal.
        // It combines the tag name with a unique set of key CSS classes for robustness.
        // 'aside.fixed.h-full.w-full.right-0.z-40' is very specific and unlikely to clash.
        return cy.get('aside.fixed.h-full.w-full.right-0.z-40');
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

    // Getter for the "Ir al checkout" button within the modal
getCheckoutButtonInModal() {
    // We use .contains() because the text is user-facing and reliable
    // and scope it to the modal to ensure we find the right one
    return this.getCartModal().contains('button', 'Ir al checkout');
}

// Getter for the "Limpiar" button within the modal
getClearCartButtonInModal() {
    // We use the excellent 'data-at' attribute for this button,
    // also scoped within the modal
    return this.getCartModal().find('[data-at="empty-cart"]');
}

     getCartModalCloseButton() {
        // This finds the button directly within the cart modal.
        // Using the classes on the button (escaping the colon in hover:scale-105) for precision.
        return this.getCartModal().find('button.hover\\:scale-105.duration-200');
        // Alternatively, if it's the ONLY button directly inside the modal and its position is stable:
        // return this.getCartModal().find('button');
    }
}


// Export an instance of the page object so you can directly import and use its methods
export default new MainNavigationPage();