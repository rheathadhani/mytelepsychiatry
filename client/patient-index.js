$(document).ready(function() {
    $('#profile-link').click(function(event) {
      event.preventDefault(); // Prevent the default link behavior
      $('#page-content-wrapper').load('profile.html'); // Load the profile content into the page content wrapper
    });
  });
  