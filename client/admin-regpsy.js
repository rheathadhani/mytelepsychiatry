$(document).ready(function () {
    // Save button functionality
    $('#savePsychiatrist').click(function () {
        var fullName = $('#fullName').val();
        var email = $('#email').val();
        var password = $('#password').val();
        var specialization = $('#specialization').val();

        // Check if the specialization is selected
        if (!specialization) {
            alert("Please select a specialization.");
            return;
        }

        // Prepare data to send to the server
        var psychiatristData = {
            fullName: fullName,
            email: email,
            password: password,
            specialization: specialization,
            // imageLink: imageLink // Remove if imageLink is not required in the backend logic
        };

        // Send a POST request using Axios
        axios.post('http://localhost:5500/api/psychiatrists', psychiatristData)
            .then(function (response) {
                // Handle success
                alert('Psychiatrist registered successfully!');
                window.location.href = "admin-psy.html"; // Redirect back to the table page
            })
            .catch(function (error) {
                // Handle error
                if (error.response) {
                    alert('Error: ' + error.response.data.message);
                } else {
                    alert('Error: ' + error.message);
                }
            });
    });

    // Cancel button functionality
    $('#cancelRegistration').click(function () {
        window.location.href = "admin-psy.html";
    });
});
