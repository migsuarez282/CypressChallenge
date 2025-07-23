// cypress/support/pages/checkout/CheckoutPage.js

import CheckoutPageElements from '../elements/CheckoutPageElements';
import CheckoutPageActions from '../commands/CheckoutPageActions';

class CheckoutPage {
    constructor() {
        this.elements = CheckoutPageElements;
        this.actions = CheckoutPageActions;
    }
}

export default new CheckoutPage();