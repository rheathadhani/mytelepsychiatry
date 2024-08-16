
$(document).ready(function() {
    // Initialize the inline datepicker
    $("#datepicker").datepicker({
        altField: "#actualDate", // If you need to submit the date, use an altField
        altFormat: "yy-mm-dd", // Adjust date format as needed
    });
});
