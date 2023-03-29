const mustacheTemplating = (container,template,data) =>{
  const $container = $("#"+container);
  const $template = $("#"+template).html();  

  $container.append(Mustache.render($template, data)); 
}
$(function(){
    loginsec();
    var prev_count = getCount();
    function loginsec(){
      var session = localStorage.getItem('loginsess');
      if(session === null){
        window.location.href = 'index.html';
      }
    }

    function getNotification(url){
      var tmp = null;
      $.ajax({
        type:'GET',
          async:false,
          dataType:'json',
        url: url,
        success: function(results){
          tmp = results.data;
        }
      });
        return tmp;
    }

    function getCount(){
      var baturl = "http://210.99.223.38:30000/rest/v1/position/notification";
      var lessonurl = "http://210.99.223.38:30000/rest/v1/lesson/notification";
      var bat = getNotification(baturl);
      var lesson = getNotification(lessonurl);
      var ibat = 0;
      $.each(bat, function(i,batdata){
        if(batdata.isReadNotification === false){
          ibat++;
        }
      });
       var ilesson = 0;
      $.each(lesson, function(i,lessondata){
        if(lessondata.isReadNotification === false){
          ilesson++;
        }
      });
      var tbat = ibat;
      var tlesson = ilesson;
      var talert = tbat + tlesson;
      return talert;
    }

    const countbell = $('#numbell');
    const bell = $('#bell');

    var audioElement = document.createElement('audio');    
    audioElement.setAttribute('src', './sound/notification933.mp3');

    audioElement.addEventListener('ended', function() { 
      this.play();   
    }, false);

    function displaynotification(prev){
      countbell.html("("+ prev +")");
      if(prev > 0){
        bell.effect("bounce", { times: 3 }, "slow");
      } 
    }

    function playBell(){
      audioElement.play();
      audioElement.addEventListener("timeupdate",function(){
        if (audioElement.currentTime > 1){
          audioElement.pause();
        }   
      });  
    }
    
    displaynotification(prev_count);
    setTimeout(
      setInterval(function(){  
        var count = getCount();
        localStorage.setItem("current",Number(count));     
        displaynotification(prev_count);
         //console.log("global previews: "+localStorage.previews);
        if(localStorage.current > prev_count){    
          playBell();
          prev_count = localStorage.current;
        }
        else if(localStorage.current < prev_count){
          prev_count = localStorage.current;
        }
         //console.log("global current: "+localStorage.current);
      }, 1000)
    ,200)
    
    $('#logout').on('click',function(){
      var session = localStorage.getItem('loginsess');
      localStorage.clear();
      loginsec();
    });
    
});