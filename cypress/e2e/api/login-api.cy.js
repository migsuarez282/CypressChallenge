import LoginPage from '../../support/pages/LoginPage';

import LoginPageActions from '../../support/commands/LoginPageActions';
const {
    faker
} = require('@faker-js/faker');

describe('API Login and API Sign up Test', () => {
    
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

    it('Register, activate, and authenticate a new user successfully', () => {
    const user = {
        email: faker.internet.email(),
        password: faker.internet.password(12, false, /[A-Za-z0-9]/),
        name: faker.person.fullName()
    };

    LoginPageActions.apiSignup(user.name, user.email, user.password).then((signupResponse) => {
        expect(signupResponse.status).to.eq(201);
        expect(signupResponse.body).to.have.property('message', 'Usuario creado correctamente');

        const confirmToken = signupResponse.body.token;
        const activationUrl = `https://www.laboratoriodetesting.com/auth/confirm-account?token=RpdSbIGhZz5o0yqKOSuNhXcw5vqT4b&email=${user.email}`;
        cy.log('Account activation URL:', activationUrl);

        // Activa la cuenta por UI y espera a que se procese
        cy.visit(activationUrl);
        cy.wait(1500); // Espera suficiente para que el backend procese la activación

        // Ahora intenta el login
        LoginPageActions.apiLogin(user.email, user.password).then((loginResponse) => {
            cy.log('Login response:', JSON.stringify(loginResponse.body));
            expect(loginResponse.status).to.eq(201);
            expect(loginResponse.body).to.have.property('token');
            expect(loginResponse.body).to.have.property('id');
            expect(loginResponse.body).to.have.property('name');
            expect(loginResponse.body.token).to.not.be.empty;
            Cypress.env('apiToken', loginResponse.body.token);
        });
    });
    
    LoginPage.actions.visitLoginPage();
    LoginPage.actions.fillLoginForm(user.email, user.password);

    LoginPage.actions.submitLoginForm();
    LoginPage.actions.assertLoginSuccess();


});

});