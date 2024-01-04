//This section is used to document the custom commands. 

declare namespace Cypress {
    interface Chainable {
        /**
         * Represents the signup data entry. This method types in the user data into the signup form. 
         * @param email - The user email address
         * @param password - The user password
         * @example
         * cy.typeDataSignUp('email@email.com', 'myPassword*.!')
         */
        typeDataSingUp(email:string, password:string)

        /**
         * Represents a method that fills up the signup form fields with the user personal data.
         * This object must contain the following keys: 
         * - password
         * - day
         * - month
         * - year
         * - mobile
         * @param personalData - An object with the data to be typed in. 
         * @example
         * cy.fillPersonalData({
         *  password: 'myPassword*.!',
         *  day: '11',
         *  month: 'august',
         *  year: '1995',
         *  mobile: '3122456789'
         *  })
         */
        fillPersonalData(personalData:object)

        /**
         * Represents a method that fills up the shipping data with the provided information.
         * This object must contain the following keys: 
         * - name 
         * - lastName 
         * - address 
         * - country 
         * - state 
         * - city 
         * - zipCode 
         * @param shippingData - An object with the data to be typed in.
         * @example
         * cy.fillShippingData({
         *  name: 'Jhon',
         *  lastName: 'Due',
         *  address: 'Calle 95 # 5-6',
         *  country: 'United States',
         *  state: 'California',
         *  city: 'Los Angeles',
         *  zipCode: '11001'
         *  })
         */
        fillShippingData(shippingData:object)

        /**
         * Represents a method that clicks on the submit button to create the account. No parameters are required.
         */
        createAccount()
    }
}