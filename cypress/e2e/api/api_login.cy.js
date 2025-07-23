import LoginPageActions from '../../support/commands/LoginPageActions';
const {
    faker
} = require('@faker-js/faker');

describe('API Login Test', () => {

    // --- Test Case 1: Basic API login process --- ✅
    it('Authenticate successfully a registered user and return a token', () => {
        cy.fixture('login').then((user) => {
            LoginPageActions.apiLogin(user.email, user.password).then((response) => {
                expect(response.status).to.eq(201);
                expect(response.body).to.have.property('token');
                expect(response.body).to.have.property('id');
                expect(response.body).to.have.property('email', user.email);
                expect(response.body).to.have.property('name');
                expect(response.body.token).to.not.be.empty;
                // Optional: save the token for other tests
                Cypress.env('apiToken', response.body.token);
            });
        });
    });
    

});