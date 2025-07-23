

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
}

// Export an instance of the page object so you can directly import and use its methods
export default new MainNavigationPage();