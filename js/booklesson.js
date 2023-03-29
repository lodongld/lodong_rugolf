$(function(){

  $('.multiple-items').slick({
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  })
  
  function today(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
  
    today = yyyy + '-' + mm + '-' + dd;
    return today;
  }
  
  function getsearchdate(){
    var url_string = window. location. href; 
      var url = new URL(url_string);
      var c = url.searchParams.get("date");
      
      if(c != null){
        var searchdate = document.getElementById("reservationdate").value = c;  
      }else{
        var searchdate = document.getElementById("reservationdate").value = today();  
      }
  
      return searchdate;
  }

  function gettutordata(){
    var tmp = null;
    $.ajax({//START...
      url:"http://210.99.223.38:30000/rest/v1/position/get/reservation-list?date="+getsearchdate(),
      type:'GET',
      async:false,
      dataType:'json',
      success: function(response){
          tmp = response;
      }
    });//END....
    return tmp;
  }

});