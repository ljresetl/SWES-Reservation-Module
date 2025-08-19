// Bootstrap form validation
(() => {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault()
            event.stopPropagation()
            if (form.checkValidity()) {
                alert('Reservation submitted (simulated REST call).')
                form.reset()
            }
            form.classList.add('was-validated')
        }, false)
    })
})();

// Initialize DataTable with spinner & empty state
$(document).ready(function() {

    // Initialize Datepicker
    $('.datepicker').datepicker({
        format: 'yyyy-mm-dd',
        todayHighlight: true,
        autoclose: true,
        startDate: new Date()
    }).on('changeDate', function(e) {
        console.log('Date selected: ' + e.format())
    });

    // Show spinner for 1 second
    setTimeout(() => {
        $('#tableSpinner').hide();
        if ($('#equipmentTable tbody tr').length === 0) {
            $('#emptyState').show();
        } else {
            $('#tableContainer').show();
            $('#equipmentTable').DataTable({
                pageLength: 10,
                lengthMenu: [10, 25, 50],
                order: [[0, 'desc']]
            });
        }
    }, 1000);

    // Refresh table button
    $('#refreshTable').click(function() {
        $('#equipmentTable').DataTable().ajax.reload(null, false);
        alert('Table refreshed (simulated).');
    });

});
