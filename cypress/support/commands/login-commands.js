import utils from '../utilities';
import uiLogin from '../elements/login-elements';

Cypress.Commands.add('typeDataLogin', (email, password) => {
    utils.getByCssSelector(uiLogin.EMAIL).type(email);
    utils.getByCssSelector(uiLogin.PASSWORD).type(password);
    utils.getByCssSelector(uiLogin.LOGIN_BUTTON).click();
});
