// retrieve the recordId from sessionStorage
const recordId = sessionStorage.getItem('recordId');
if (recordId) {
    // make a POST request to retrieve user account details using axios
    axios.post('https://dapper-pika-dbaf53.netlify.app/.netlify/functions/userAccountDetails', {
        recordId
    }).then(response => {
        if(response.data){
            // retrieve user profile information from the response
            const { userProfilePic, userInfo, userFullName, userEducation } = response.data;
            // update the profile picture if available, otherwise hide it
            if (userProfilePic) {
                document.getElementById('profile-img').src = userProfilePic;
            } else {
                document.getElementById('profile-img').style.display = "none";
            }
            // update the user information if available, otherwise hide it
            if (userInfo) {
                document.getElementById('user-info').innerText = userInfo;
            } else {
                document.getElementById('user-info').style.display = "none";
            }
            // update the user information
            document.getElementById('user-full-name').innerText = userFullName;
            document.getElementById('user-education').innerText = userEducation;
        }
    }).catch(error => {
        console.error(error);
    });	
}