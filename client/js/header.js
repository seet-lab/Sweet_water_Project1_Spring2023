// Retrieve the user token from sessionStorage
const userToken = sessionStorage.getItem('jwtToken');
// Retrieve the element that contains the view for logged-in users
const loggedInView = document.querySelector("#loggedInView");
// If no user token is present, hide the "Opportunities" and "Access" navigation links and the logged-in view.
if (!userToken){
    const opportunitiesNav = document.querySelector("#nav-opportunities");
    const accessNav = document.querySelector("#nav-access");
    opportunitiesNav.style.display = "none";
    accessNav.style.display = "none";
    loggedInView.style.display = "none";
}
// Otherwise, show the logged-in view and display the user's name
else {
    const loggedInUserName = sessionStorage.getItem('loggedInUserName');
    const navViewLoggedOut = document.querySelector("#navViewLoggedOut");
    navViewLoggedOut.style.display = "none";
    document.querySelector("#userNameMsg").innerHTML = "Welcome, "+loggedInUserName +"!"
}
// Get the "Sign Out" link
const userLogoutLink = document.getElementById("userLogout");

// Add an event listener to the link to handle sign-out
userLogout.addEventListener("click", function(event) {
    // Prevent the default behavior of the link
    event.preventDefault();

    // Remove the user token, logged-in user's name, and record ID from sessionStorage.
    sessionStorage.removeItem('jwtToken');
    sessionStorage.removeItem('loggedInUserName');
    sessionStorage.removeItem('recordId');
    // Redirect the user to the home page
    window.location.href = "/";
});