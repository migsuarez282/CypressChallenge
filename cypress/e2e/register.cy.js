import registerData from '../fixtures/data.json';
const path = 'login';

before(() => {
  cy.visit(path);
});

describe('Register Scenarios', () => {
  it('Do Register of a new user : ', function () {
    cy.typeDataSingUp(registerData.name);
    cy.fillPersonalData(registerData.personalData[0]);
    cy.fillShippingData(registerData.shippingInformation[0]);
    cy.createAccount();
  });
});