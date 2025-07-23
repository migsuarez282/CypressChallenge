// Page Object into Elements (selectors) and Actions (methods that interact with 
// elements), you end up with two distinct files. While this is great for separation 
// of concerns, your test files would then have to import both SignupPageElements and 
// SignupPageActions to interact with the login page.
// This is where the aggregator file comes in. Its primary purpose is to re-bundle 
// these related components (elements and actions) back into a single, 
// cohesive unit that represents the entire "Login Page" from the perspective of
// your tests.

import CartPageElements from '../elements/CartPageElements';
import CartPageActions from '../commands/CartPageActions';

class CartPage {
    constructor() {
        this.elements = CartPageElements;
        this.actions = CartPageActions;
    }
}

export default new CartPage();