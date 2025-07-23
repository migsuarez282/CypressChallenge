// cypress/fixtures/test_card_data.js

const TEST_CARD_DATA = {
    VISA_SUCCESS: { // A valid card that should typically result in success
        number: '4301822375925071',
        ExpDate: '2029-09',
        cvv: '668'
    },
    MASTERCARD_SUCCESS: { // Another valid card
        number: '5555555555555555',
        cvv: '222'
    },
    VISA_INVALID_NUMBER: { // An invalid card number (e.g., checksum fails)
        number: '4242424242424241', // Checksum invalid
        cvv: '123'
    },
    VISA_DECLINED: { // A card number that often simulates a decline (if your payment gateway supports it)
        number: '4000000000000002', // Example for simulated decline, confirm with your gateway
        cvv: '123'
    },
    NOTFOUND_CC: { // A card without founds that should typically result in fail
        number: '4577009248375940',
        ExpDate: '2027-05',
        cvv: '254'
    }
};

export default TEST_CARD_DATA;