$(function() {

    $('input[type="radio"]').click(function() {
        if ($(this).attr('id') == 'yesAthlete') {
            $('.sports').show();
        }

        if ($(this).attr('id') == 'noAthlete') {
            $('.sports').hide();
        }
    });

});
