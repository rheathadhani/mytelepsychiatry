$(document).ready(function() {

    $("#datepicker").datepicker({
        altField: "#actualDate", // If you need to submit the date, use an altField
        altFormat: "dd-mm-yy", // Adjust date format as needed
    });

    // Handle therapist selection change
    $('#therapistSelect').on('change', function() {
        $('#selectedTherapist').text($(this).val());
    });

    // Handle date change
    $('#date').on('change', function() {
        updateReviewSection();
    });

    // Handle time change
    $('#time').on('change', function() {
        updateReviewSection();
    });

    // Function to update the review section
    function updateReviewSection() {
        const selectedDate = $('#date').val();
        const selectedTime = $('#time').val();
        $('#selectedDateTime').text(`${selectedDate} ${selectedTime}`);
    }

    // Handle confirm button click
    $('#confirmAppointment').on('click', function() {
        alert('Appointment Confirmed!');
        // You can add more logic here, like submitting the data to the server
    });
  });
  
  $(document).ready(function() {
    $('.select-button').on('click', function () {
        var psychiatrist = $(this).data('psychiatrist');
        $('#selected-psy').text(psychiatrist);

        // Update psychiatrist profile details
        $('#psy-Name').text(psychiatrist);
        $('#psy-details').text(psychiatrist + ' Profile Details Here');
        $('#psy-Image').attr('src', 'path/to/image.png'); // Update with correct path

        // Show the psychiatrist profile
        $('#psychiatrist-profile').show();

        // Adjust the width of the psychiatrist selection and profile sections
        $('#psychiatrist-selection').removeClass('col-md-12').addClass('col-md-6');
        $('#psychiatrist-profile').removeClass('col-md-6').addClass('col-md-6');

        // Select the corresponding radio button
        $(this).closest('.form-group').find('input[type="radio"]').prop('checked', true);
    });
  });