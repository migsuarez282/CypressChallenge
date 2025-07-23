// Page Object into Elements (selectors) and Actions (methods that interact with 
// elements), you end up with two distinct files. While this is great for separation 
// of concerns, your test files would then have to import both SignupPageElements and 
// SignupPageActions to interact with the signup page.
// This is where the aggregator file comes in. Its primary purpose is to re-bundle 
// these related components (elements and actions) back into a single, 
// cohesive unit that represents the entire "Signup Page" from the perspective of
// your tests.

import SignupPageElements from '../elements/SignupPageElements';
import SignupPageActions from '../commands/SignupPageActions';

class SignupPage {
    constructor() {
        this.elements = SignupPageElements;
        this.actions = SignupPageActions;
    }
}

export default new SignupPage();