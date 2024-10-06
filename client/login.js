
$(document).ready(function () {
    // Handle the form control validation issue by adding/updating the name attribute
    function setFormNames(role) {
        // Update the 'name' attribute based on the active role
        if (role === 'patient') {
            $('#patientEmail').attr('name', 'email');
            $('#patientPassword').attr('name', 'password');
            $('#psychiatristEmail, #psychiatristPassword, #adminEmail, #adminPassword').removeAttr('name');
        } else if (role === 'psychiatrist') {
            $('#psychiatristEmail').attr('name', 'email');
            $('#psychiatristPassword').attr('name', 'password');
            $('#patientEmail, #patientPassword, #adminEmail, #adminPassword').removeAttr('name');
        } else if (role === 'admin') {
            $('#adminEmail').attr('name', 'email');
            $('#adminPassword').attr('name', 'password');
            $('#patientEmail, #patientPassword, #psychiatristEmail, #psychiatristPassword').removeAttr('name');
        }
    }

    // Initialize with 'patient' as the default active tab
    setFormNames('patient');

    // Listen for tab change events to adjust the form names dynamically
    $('#pills-tab a').on('shown.bs.tab', function (event) {
        let role = event.target.id.split('-')[0]; // Extract role from tab ID
        setFormNames(role);
    });

    // Handle the login form submission
    $('#loginForm').submit(function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Determine the selected role based on the active tab
        let selectedRole;
        if ($('#patient-tab').hasClass('active')) {
            selectedRole = 'patient';
        } else if ($('#psychiatrist-tab').hasClass('active')) {
            selectedRole = 'psychiatrist';
        } else if ($('#admin-tab').hasClass('active')) {
            selectedRole = 'admin';
        }

        // Get the email and password based on the selected role
        let email, password;
        if (selectedRole === 'patient') {
            email = $('#patientEmail').val();
            password = $('#patientPassword').val();
        } else if (selectedRole === 'psychiatrist') {
            email = $('#psychiatristEmail').val();
            password = $('#psychiatristPassword').val();
        } else if (selectedRole === 'admin') {
            email = $('#adminEmail').val();
            password = $('#adminPassword').val();
        }

        // Prepare the login data
        const loginData = {
            email: email,
            password: password,
            role: selectedRole
        };

        axios.post('http://184.73.250.53:5500/api/login', loginData)
    .then(function (response) {
        const user = response.data.user; // Assuming `user` object contains the IDs
        if (selectedRole == 'patient') {
            localStorage.setItem('patientId', user.patient_id); // Store patientId
            window.location.href = 'patient-index.html';
        } else if (selectedRole == 'psychiatrist') {
            localStorage.setItem('psychiatristId', user.psychiatrist_id); // Store psychiatristId
            window.location.href = 'psy-index.html';
        } else if (selectedRole == 'admin') {
            window.location.href = 'admin-index.html';
        }
    })
    .catch(function (error) {
        if (error.response) {
            alert('Login failed: ' + error.response.data.message);
        } else {
            alert('Login failed: ' + error.message);
        }
    });
    })

})
