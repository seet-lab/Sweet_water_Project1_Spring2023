/** 
 * This function resets the form validation messages
 * by removing the 'is-valid' and 'is-invalid' classes from each form element,
 * clearing the text content and removing the 'valid-feedback' and
 * 'invalid-feedback' classes from their corresponding feedback elements.
 * Finally, the function calls the reset() method on the form element
 * to reset its values to their initial state.
 */
const resetForm = () => {
    const forgotPasswordFormEle = document.getElementById('forgotPwdForm');
    const formElements = forgotPasswordFormEle.elements;

    // Remove validation classes and messages for each form element
    for (let element of formElements) {
        element.classList.remove('is-valid');
        element.classList.remove('is-invalid');
        const feedbackElement = element.nextElementSibling;
        if (feedbackElement) {
            feedbackElement.innerText = '';
            feedbackElement.classList.remove('valid-feedback');
            feedbackElement.classList.remove('invalid-feedback');
        }
    }

    forgotPasswordFormEle.reset();
};

// Reset the form when user swtich from one secton page to another.
window.addEventListener('hashchange', () => {
    if (window.location.hash === '#forgotpassword') {
        resetForm();
    }
});

/**
 * Method to handle password validations. 
 * 1. Atleast one uppercase letter.
 * 2. Atleast one lowercase leeter
 * 3. Atleast one number between 0 to 9.
 * 4. Atleast one special character.
 * 5. Password characters length should be between 8 and 15.
 * @param {*} password 
 * @returns boolean
 */         
const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
    return regex.test(password);
};

/**
 * Helper method to handle valid feedback message
 * when user enters correct value for email,
 * new password or confimr new password field.
 * @param {*} input: target input field to validate
 * @param {*} message: valid feedback message to show
 */
const showValidFeedback = (input, message) => {
    input.classList.add('is-valid');
    const feedbackElement = input.nextElementSibling;
    feedbackElement.innerText = message;
    feedbackElement.classList.add('valid-feedback');
};
/**
 * `showInvalidFeedback` is a helper method to handle invalid feedback message
 * when user miss to enter/invalid value for email,
 * new password or confimr new password field.
 * @param {*} input: target input field to validate
 * @param {*} message: invalid feedback message to be removed
 */
const showInvalidFeedback = (input, message) => {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    const feedbackElement = input.nextElementSibling;
    feedbackElement.innerText = message;
    feedbackElement.classList.add('invalid-feedback');
    feedbackElement.classList.remove('valid-feedback');
};
/**
 * `clearInvalidFeedback` is a helper method to remove invalid feedback messages
 * when user enters valid value for email,
 * new password or confimr new password field.
 * @param {*} input: target input field
 */
const clearInvalidFeedback = (input) => {
    input.classList.remove('is-invalid');
    const feedbackElement = input.nextElementSibling;
    feedbackElement.innerText = '';
    feedbackElement.classList.remove('invalid-feedback');
    feedbackElement.classList.remove('valid-feedback');
};

/**
 * validateEmail is a helper method to handle verification of email id value.
 * Check for empty value, valid email type.
 * @param {*} emailInput: email input field value to validate
 */
const validateEmail = (emailInput) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value) {
        showInvalidFeedback(emailInput, 'Email is required.');
    } else if (!regex.test(emailInput.value)) {
        showInvalidFeedback(emailInput, 'Please enter a valid email address.');
    } else {
        clearInvalidFeedback(emailInput);
        showValidFeedback(emailInput, 'Email is valid.');
    }
};

/**
 * `validateNewPassword` is a helper method to validate new password.
 * Check for empty value, valid password type, helper method
 * `validatePassword` is used to verify the desired password format.
 * @param {*} newPasswordInput: new password input field value to validate
 */
const validateNewPassword = (newPasswordInput) => {
    if (!newPasswordInput.value) {
        showInvalidFeedback(newPasswordInput, 'Password is required.');
    } else if (!validatePassword(newPasswordInput.value)) {
        showInvalidFeedback(newPasswordInput, 'Password must contain at least one uppercase letter, one lowercase letter, one number between 0-9, one special character, and be between 8-15 characters long.');
    } else {
        clearInvalidFeedback(newPasswordInput);
        showValidFeedback(newPasswordInput, 'Password is valid.');
    }
};

/**
 * `validateConfirmPassword` is a helper method to validate confirm password.
 * Check for empty value, orconfirm password valueis matching or not
 * with the nw password entered.
 * @param {*} newPasswordInput: new password input field value
 * @param {*} confirmPasswordInput: confirm password input field value
 */
const validateConfirmPassword = (confirmPasswordInput, newPasswordInput) => {
    if (!confirmPasswordInput.value) {
        showInvalidFeedback(confirmPasswordInput, 'Please confirm your password.');
    } else if (newPasswordInput.value !== confirmPasswordInput.value) {
        showInvalidFeedback(confirmPasswordInput, 'Passwords do not match.');
    } else {
        clearInvalidFeedback(confirmPasswordInput);
        showValidFeedback(confirmPasswordInput, 'Passwords match.');
    }
};
const forgotPwdForm = document.querySelector('#forgotPwdForm');
const userEmailInput = forgotPwdForm.elements['user-email'];
const newPasswordInput = forgotPwdForm.elements['new-password'];
const confirmPasswordInput = forgotPwdForm.elements['confirm-password'];

userEmailInput.addEventListener('input', () => validateEmail(userEmailInput));
newPasswordInput.addEventListener('input', () => validateNewPassword(newPasswordInput));
confirmPasswordInput.addEventListener('input', () => validateConfirmPassword(confirmPasswordInput, newPasswordInput));

/**
 * Sets up an event listener for the "forgot password" form's submission event.
 * When the form is submitted, this code prevents the default behavior,
 * validates the email, new password, and confirm password inputs using
 * their respective validation functions, and checks for validation errors
 * by searching for elements with the "is-invalid" class.
 * If there are validation errors, the form submission is prevented.
 * Otherwise, the form is submitted.
 */
const updatePwd = document.querySelector('#updatePwd');
updatePwd.addEventListener('click', (event) => {
    // Call all the validation functions
    validateEmail(userEmailInput);
    validateNewPassword(newPasswordInput);
    validateConfirmPassword(confirmPasswordInput, newPasswordInput);
    // Check if there are any validation errors
    if (forgotPwdForm.querySelector('.is-invalid')) {
        // There are validation errors, do not submit the form
        return;
    } else {
        axios.post('https://dapper-pika-dbaf53.netlify.app/.netlify/functions/forgotPassword', {
            email: userEmailInput.value,
            password: newPasswordInput.value
        }, {
            withCredentials: true
        }).then(response => {
            const invalidUserEle = document.getElementById("invalid-user");
            if(response.data.message && response.data.message === "password updated"){
                invalidUserEle.classList.remove("invalid-user");
                const successDiv = document.createElement('div');
                successDiv.classList.add('alert', 'alert-success');
                successDiv.textContent = 'Successfully updated the password! Redirecting you to sign-in.';
                forgotPwdForm.insertBefore(successDiv, forgotPwdForm.firstChild);
                setTimeout(() => {
                    successDiv.remove();
                    window.location.href = '/#usersignin';
                }, 6000);
            } else if(response.data.message==="User not found") {
                invalidUserEle.innerHTML = "Please use registered email Id to set/update password";
                invalidUserEle.classList.add("invalid-user");
            }
        }).catch(error => {
            console.error(error);
        });
    }
});