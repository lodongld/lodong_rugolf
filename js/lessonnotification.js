$(function (){
  // const $container = $("#infodiv");
  // const $paginationContainer = $("#pagination");
  
    const $userListContainer = 'infodiv';
    const $paginationContainer = $("#pagination");
    const $back = $(".back");
    const $next = $(".next");

    // lesson notification data
    function getData(){
      var tmp = null;
      $.ajax({//START...
        url:"http://210.99.223.38:30000/rest/v1/lesson/notification",
        type:'GET',
        async:false,
        dataType:'json',
        success: function(response){
            tmp = response.data;
        }
      });//END....
      return tmp;
    }

    function getname(uid){
      var tmp = null;
        $.ajax({//START...
          url:"http://210.99.223.38:30000/rest/v1/my/info?uid="+uid,
          type:'GET',
          async:false,
          dataType:'json',
          success: function(response){
              tmp = response.data;
          }
        });//END....
        return tmp;
    }

    function makeunreadarray(){
      var newarray = [];
      var rawarray = getData();

      var num = 0;
      $.each(rawarray,function(i,data){
        if(data.isReadNotification === false){
          newarray[num] = {
            'createAt': data.createAt,
            'customerName':data.customerName,
            'id':data.id,
            'isReadNotification':data.isReadNotification,
            'kind': data.kind,
            'instructorName': data.instructorName,
            'reservationDate': data.reservationDate,
            'endTime': data.reservationEndTime,
            'startTime': data.reservationStartTime
          }
          num++;
        }
      });
      return newarray;
    }

    function display(lesson,listContainer){    
      let template = 'notificationTemp';
      $('#'+listContainer).empty()      
      $.each(lesson, function(i, service){
          
          var id = service.id;
          var time = service.startTime;
              time = time.replace(/:/g,""); 
          var date = service.reservationDate;
              date = date.replace(/-/g,"");
          var divId = id+date.substr(4,4)+time.substr(0,5); 
          
          if(service.kind === "cancel"){
            var kindstat = "수업이 취소되었습니다!";
          }
          else if (service.kind === "reservation"){
            var kindstat = "새로운 레슨 예약이 있습니다!";
          }
          
          data = {
            'name': service.customerName,
            'date': service.reservationDate,
            'instructor': service.instructorName,
            'startTime': service.startTime,
            'endTime': service.endTime,
            'createAt': timeAgo(service.createAt),
            'id': service.id,
            'divid': divId,
            'kind': service.kind,
            'message': kindstat
          }
          
          mustacheTemplating(listContainer,template,data);

          $('#'+divId).on('click',function(){

            var id = $(this).attr('data-id');
            var kind = $(this).attr('data-kind');
            console.log(id)
            console.log(kind)
            if(kind === "cancel"){
              var readurl = "http://210.99.223.38:30000/rest/v1/lesson/notification/read-cancel";
            }
            else if(kind === "reservation"){
              var readurl = "http://210.99.223.38:30000/rest/v1/lesson/notification/read";
            }
            var data = {
              "id": id
            };
            
            postread(readurl,data);

          });
        
      });   
    }
    
    const MONTH_NAMES = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];        
    
    function getFormattedDate(date, prefomattedDate = false, hideYear = false) {
      const day = date.getDate();
      const month = MONTH_NAMES[date.getMonth()];
      const year = date.getFullYear();
      const hours = date.getHours();
      let minutes = date.getMinutes();
    
      if (minutes < 10) {
        // Adding leading zero to minutes
        minutes = `0${ minutes }`;
      }
    
      if (prefomattedDate) {
        // Today at 10:20
        // Yesterday at 10:20
        return `${ prefomattedDate } at ${ hours }:${ minutes }`;
      }
    
      if (hideYear) {
        // 10. January at 10:20
        return `${ day }. ${ month } at ${ hours }:${ minutes }`;
      }
    
      // 10. January 2017. at 10:20
      return `${ day }. ${ month } ${ year }. at ${ hours }:${ minutes }`;
    }        
    // --- Main function
    function timeAgo(dateParam) {
      if (!dateParam) {
        return null;
      }
    
      const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
      const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
      const today = new Date();
      const yesterday = new Date(today - DAY_IN_MS);
      const seconds = Math.round((today - date) / 1000);
      const minutes = Math.round(seconds / 60);
      const isToday = today.toDateString() === date.toDateString();
      const isYesterday = yesterday.toDateString() === date.toDateString();
      const isThisYear = today.getFullYear() === date.getFullYear();
    
    
      if (seconds < 5) {
        return 'now';
      } else if (seconds < 60) {
        return `${ seconds } seconds ago`;
      } else if (seconds < 90) {
        return 'about a minute ago';
      } else if (minutes < 60) {
        return `${ minutes } minutes ago`;
      } else if (isToday) {
        return getFormattedDate(date, 'Today'); // Today at 10:20
      } else if (isYesterday) {
        return getFormattedDate(date, 'Yesterday'); // Yesterday at 10:20
      } else if (isThisYear) {
        return getFormattedDate(date, false, true); // 10. January at 10:20
      }
    
      return getFormattedDate(date); // 10. January 2017. at 10:20
    }

    function postread(url,dataParam){
      fetch(url, {
        method: 'POST',
        headers : {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataParam)
      })        
      .then(response => response.json())
      .then(response =>{    
        console.log(response.message);
        display(makeunreadarray(),$userListContainer,rows,cpage);
      })
      .catch(err => console.error(err)); 
    }
    
    console.log("pagination array:",makeunreadarray())
    let lessondata = getData();
    console.log(lessondata.length)
    if(makeunreadarray().length === 0){
      $('.alert-danger').removeClass('d-none') 
      $('.infodiv').addClass('d-none')        
    }else{
      $('.alert-danger').addClass('d-none')
      $('.infodiv').removeClass('d-none')
    }
    var prev_count  = localStorage.current;
    display(makeunreadarray(),$userListContainer)
    setInterval(function(){    
      if(localStorage.current > prev_count || localStorage.current < prev_count){
        console.log('data has been auto update!');
        display(makeunreadarray(),$userListContainer);  
        prev_count = localStorage.current;
      }
    }, 1000);  
  });
  