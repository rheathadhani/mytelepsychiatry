$(document).ready(function() {
    // Handle form submission
    $('#registerForm').submit(function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Collect form data using jQuery
        const firstName = $('#firstName').val();
        const lastName = $('#lastName').val();
        const email = $('#email').val();
        const password = $('#password').val();

        // Prepare the data for Axios
        const registrationData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        };

        // Send data to the backend using Axios
        axios.post('http://localhost:5500/api/register', registrationData)
            .then(function(response) {
                // Handle success
                alert('Registration successful!');
                // Redirect to login page
                window.location.href = 'login.html';
            })
            .catch(function(error) {
                // Handle error
                if (error.response) {
                    alert('Registration failed: ' + error.response.data.message);
                } else {
                    alert('Registration failed: ' + error.message);
                }
            });
    });
});
