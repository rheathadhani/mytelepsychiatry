
$(document).ready(function() {
    // Initialize the inline datepicker
    $("#datepicker").datepicker({
        altField: "#actualDate", // If you need to submit the date, use an altField
        altFormat: "dd-mm-yy", // Adjust date format as needed
    });
});

$(document).ready(function() {

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