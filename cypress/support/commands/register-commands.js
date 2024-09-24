import utils from '../utilities';
import uiRegister from '../elements/register-elements';
import uiHome from '../elements/home-elements';
import { faker } from '@faker-js/faker';



Cypress.Commands.add('typeDataSingUp', (name) => {
    utils.getByCssSelector(uiRegister.NAME).type(name);
    utils.getByCssSelector(uiRegister.EMAIL).type(faker.internet.email());
    utils.getByCssSelector(uiRegister.SIGNUP_BUTTON).click();
    utils.getByCssSelector(uiRegister.CREATE_ACCOUNT_BUTTON).should('be.visible');
});
Cypress.Commands.add('fillPersonalData', (personalData) => {
    utils.getById(uiRegister.TITLEMRS).click();
    utils.getByCssSelector(uiRegister.PASSWORD_REGISTER).type(personalData.password);
    utils.getByCssSelector(uiRegister.DAY).select(personalData.day);
    utils.getByCssSelector(uiRegister.MONTH).select(personalData.month);
    utils.getByCssSelector(uiRegister.YEAR).select(personalData.year);
    utils.getByCssSelector(uiRegister.MOBILE_NUMBER).type(personalData.mobile);
});
Cypress.Commands.add('fillShippingData', (shippingData) => {
    utils.getByCssSelector(uiRegister.NAME_ADDRESS).type(shippingData.name);
    utils.getByCssSelector(uiRegister.LAST_NAME_ADDRESS).type(shippingData.lastName);
    utils.getByCssSelector(uiRegister.ADDRESS).type(shippingData.address);
    utils.getByCssSelector(uiRegister.COUNTRY).select(shippingData.country);
    utils.getByCssSelector(uiRegister.STATE).type(shippingData.state);
    utils.getByCssSelector(uiRegister.CITY).type(shippingData.city);
    utils.getByCssSelector(uiRegister.ZIPCODE).type(shippingData.zipCode);
});
Cypress.Commands.add('createAccount', () => {
    utils.getByCssSelector(uiRegister.CREATE_ACCOUNT_BUTTON).click();
    utils.getByCssSelector(uiRegister.CONTINUE_BUTTON).click();
    utils.getByClass(uiHome.LOGOUT).should('be.visible')
});
