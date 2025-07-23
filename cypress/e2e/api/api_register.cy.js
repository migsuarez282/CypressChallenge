import LoginPageActions from '../../support/commands/LoginPageActions';
const {
    faker
} = require('@faker-js/faker');

describe('API Sign up Test', () => {

   
    // --- Test Case 1: Basic Register and API login process --- ✅
    it('Register, activate, and authenticate a new user successfully', () => {
        
        const user = {
            email: faker.internet.email(),
            password: faker.internet.password(12, false, /[A-Za-z0-9]/),
            name: faker.person.fullName()
        };

        LoginPageActions.apiSignup(user.name, user.email, user.password).then((signupResponse) => {
            expect(signupResponse.status).to.eq(201);
            expect(signupResponse.body).to.have.property('message', 'Usuario creado correctamente');

            const activationUrl = `https://www.laboratoriodetesting.com/auth/confirm-account?token=RpdSbIGhZz5o0yqKOSuNhXcw5vqT4b&email=${user.email}`;
            cy.log('Account activation URL:', activationUrl);

            cy.visit(activationUrl);
            cy.wait(1500);

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

    });

});