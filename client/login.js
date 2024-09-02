document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('[data-bs-toggle="pill"]');
    tabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function (event) {
            const target = event.target.getAttribute('href');
            const forms = document.querySelectorAll('.tab-pane');
            forms.forEach(form => form.classList.remove('show', 'active'));
            document.querySelector(target).classList.add('show', 'active');
        });
    });
});

$(document).ready(function () {
    // Hide the register link initially if a non-patient tab is active
    if (!$('#patient-tab').hasClass('active')) {
        $('#registerLink').hide();
    }

    // Show/hide the register link based on the selected tab
    $('#pills-tab a').on('shown.bs.tab', function (event) {
        if (event.target.id === 'patient-tab') {
            $('#registerLink').show();
        } else {
            $('#registerLink').hide();
        }
    });
});