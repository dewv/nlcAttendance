$(function(){
      
  $('input[type="radio"]').click(function() {
       if($(this).attr('id') == 'yesAthlete') {
            $('#sports').show();           
       }
   });
   
    $('input[type="radio"]').click(function() {
       if($(this).attr('id') == 'noAthlete') {
            $('#sports').hide();           
       }
   });

});
