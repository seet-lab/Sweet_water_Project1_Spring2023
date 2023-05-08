/** 
 * Retrieve the JWT token from the session storage and
 * redirect to the home page if the token exists.
 */
const token = sessionStorage.getItem('jwtToken');
if (token) {
    window.location.href = "/#homesection";
}
// Select form elements and error messages
const form = document.querySelector('#signInForm');
const emailInput = form.elements.email;
const passwordInput = form.elements.password;
const emailError = document.querySelector('.invalid-feedback:nth-of-type(1)');
const passwordError = document.querySelector('.invalid-feedback:nth-of-type(2)');
const myDiv = document.getElementById("invalid-user");
// Add event listener for form submission.
form.addEventListener('submit', async (event) => {
    // Prevent default form submission behavior.
    event.preventDefault();
    // If the form is invalid, display error messages and do not submit.
    if (form.checkValidity() === false) {
        event.stopPropagation();
        emailInput.classList.add('is-invalid');
        passwordInput.classList.add('is-invalid');
    } else {
        // If the form is valid, remove any existing error messages
        emailInput.classList.remove('is-invalid');
        passwordInput.classList.remove('is-invalid');

        // Retrieve email and password values from the form
        const email = emailInput.value;
        const password = passwordInput.value;

        // Send a login request to the server using Axios
        axios.post('https://dapper-pika-dbaf53.netlify.app/.netlify/functions/login', {
            email: email,
            password: password
        }, {
            withCredentials: true
        }).then(response => {
            /** 
             * If the login is successful, store user information in session storage
             * and redirect to the home page.
             */
            if(response.data.token && response.data.token !== null){
                myDiv.classList.remove("invalid-user");
                sessionStorage.setItem('jwtToken', response.data.token);
                sessionStorage.setItem('loggedInUserName', response.data.loggedInUserName);
                sessionStorage.setItem('recordId', response.data.recordId);
                const successDiv = document.createElement('div');
                successDiv.classList.add('alert', 'alert-success');
                successDiv.textContent = 'Successfully logged in';
                form.insertBefore(successDiv, form.firstChild);
                setTimeout(() => {
                    successDiv.remove();
                    window.location.href = '/';
                }, 2000);
            }
            // If the email or password is incorrect, display an error message
            else if(response.data.message==="no match" || response.data.message==="User not found") {
                myDiv.innerHTML = "Incorrect email or password";
                myDiv.classList.add("invalid-user");
            }
            /** 
             * If the user has not set a password, display a message
             * instructing them to use the "Forgot Password" link.
             */
            else if(response.data.message === "password not found") {
                myDiv.innerHTML = "Please set password using Forgot Password link";
                myDiv.classList.add("invalid-user");
            }
        }).catch(error => {
            console.error(error);
        });
    }
    // Add 'was-validated' class to the form to display error messages.
    form.classList.add('was-validated');
});