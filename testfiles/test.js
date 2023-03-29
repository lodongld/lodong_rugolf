function getData(url){
  var tmp = null;
  $.ajax({//START...
      url:url,
      type:'GET',
      async:false,
      dataType:'json',
      success: function(response){
          tmp = response;
      }
    });//END....
    return tmp;
}

const mustacheTemplatingCust = (container,template,data) =>{
    const $container = $(container);
    const $template = $(template).html();

    $container.append(Mustache.render($template, data));
}

function postData(data,url){
    var result = null;
    $.ajax({
        method: 'POST',
        url: url,
        dataType: 'JSON',
        contentType: "application/json",
        async: false,
        data: JSON.stringify(data),
        success: function (responses) {
           //$.each(responses, function (i, response) {
                result = responses;
            //})
        }
    });
    return result;
}

function today(){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  return today;
}

function addhypen(n){
  var newstring = n.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  return newstring
}

function getDayname(date){
  var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  var a = new Date(date);
  var todayis = weekday[a.getDay()];
  return todayis;
}

function getCell(time){
  $.each(result, function(i,data){
    if(data.startTime === time){
      return cell = data.slot;
    }
  });
  return cell;
}

function genCols(rownum,colnum,stat,name){
  if (stat !== false){
    let row=document.getElementById("schedules").rows[rownum].cells;
    row[colnum].innerHTML="<div class='seat text-center'>"+ name +"</div>";
  }else{
    let row=document.getElementById("schedules").rows[rownum].cells;
    row[colnum].innerHTML="<div class='seat text-center'></div>";
  }
}

function getarraytime(bat,lessonurl){
    var timearray = [];
    $.each(bat, function(i,data){
      let id = data.id;
      let url += id;
      let lesson = getData(url);
      $.each(lesson,function(j,slot){
        timearray.push({
          "startTime" : slot.startTime,
          "endTime" : slot.endTime
          });
      });

    });
    return timearray.sort();
}

function apitime(myArray){
  var result = [];
  $.each(myArray, function (i, e) {
      var matchingItems = $.grep(result, function (item) {
        return item.startTime === e.startTime && item.startTime === e.startTime;
      });
      if (matchingItems.length === 0){
          result.push(e);
      }
  });
  const newarray = result.sort((a,b) => {
    return (a.startTime > b.startTime) ? 1 : -1
  });
  return newarray;
}

function displayTimeSlot(time){
  let addrow = "<tr>"
    addrow+="<th class='fixed-side'><div class='col-lg-12 col-xs-12 text-right bat'> 시간 </div> <div class='col-lg-12 col-xs-12 text-left time'> 타석 </div></th>"
  $.each(time,function(i,slot){
    addrow+="<td><div class='timecont'><div class='start text-center'>"+ slot.startTime + "</div><div class='end text-center'>-" + slot.endTime +"</div></td>"
  });
  addrow+="</tr>";
  $("table thead").append(addrow);
}

function postData(data,url){
  var result = null;
  $.ajax({
      method: 'POST',
      url: url,
      dataType: 'JSON',
      contentType: "application/json",
      async: false,
      data: JSON.stringify(data),
      success: function (responses) {
         //$.each(responses, function (i, response) {
              let date = $("#reservationdate").val();

              let instructorurl = 'http://210.99.223.38:30000/rest/v1/lesson/get/instructor-list';
              let lessonurl = "http://210.99.223.38:30000/rest/v1/lesson/get/reservation-info?date="+date+"&instructorId=";

              const instructor = getData(instructorurl).data;
              updateContents(instructor,lessonurl);
              result = responses;
              console.log(result);
          //})
      }
  });
  //return result;
}

function displayReservation(intructor,timeData){
  $.each(instructor,function(i, bat){
    var id = bat.id;

    var addrow = "<tr>"
      addrow+="<th class='fixed-side'><div class='index text-center' id='bat"+ id +"' data-id='"+ id +"'>"+ id +"</div></th>"
    //display time label
    $.each(timeData, function(j,col){
      j++;
      var time = col.startTime;
      var divId = id+time.substr(0,5);
          divId = divId.replace(":","");
          addrow+="<td><div id='"+ divId +"' data-id='"+ id +"' data-time='"+ col.startTime +"' class='seat text-center'></div></td>"
    });
    addrow+="</tr>";
    $("table tbody").append(addrow);
  });
}

function updateContents(instructor,url){
  $.each(instructor,function(i, bat){
    var id = bat.id;
    var name = tutor.name;
    var contentBat = "<div class='index text-center batpositions' id='bat"+ id +"' data-id='"+ id +"'>"+ name +"<i class='fa fa-book' aria-hidden='true'></i></div>";

    var batstat = null;
    url += id;
    let lesson = getData(url);
    $.each(lesson[id], function(j,cell){
      j++;
      var time = cell.startTime;
      var divId = id+time.substr(0,5);
          divId = divId.replace(":","");

      var revdiv =  "r"+divId;
          if(cell.lock === false){
            $("#"+divId).attr('data-bat',id);
            $("#"+divId).addClass('slotdiv');
            $("#"+divId).attr('data-time',time);
            $('#'+divId).attr('data-lock',cell.lock);
            $('#'+divId).attr('data-reservation',cell.reservation);
            if(cell.reservation === true){
              var contentTime = cell.reservationMemberName+"<br />"+addhypen(cell.reservationMemberPhoneNumber);
            }else{
              var contentTime = "<i class='fa fa-unlock fa-2x' aria-hidden='true'></i>";
              //var content = "";
            }
            batstat = false;
          }else{
            $("#"+divId).attr('data-bat',id);
            $("#"+divId).addClass('slotdiv');
            $("#"+divId).attr('data-time',time);
            $('#'+divId).attr('data-lock',cell.lock);
            $('#'+divId).attr('data-reservation',cell.reservation);
             if(cell.reservation === true){
              var contentTime = cell.reservationMemberName+"<br />"+addhypen(cell.reservationMemberPhoneNumber);
              }else{
                var contentTime = "<i class='fa fa-lock fa-2x' aria-hidden='true'></i>";
                //var content = "";
              }
             batstat = true;
          }
      $("#"+divId).html(contentTime);

    });
    $("#bat"+id).attr('data-lock',batstat);
    $("#bat"+id).html(contentBat);
  });
}

function lockbyTime(instructor,url){
  let date = $('#reservationdate').val();
  $.each(instructor,function(i, bat){
    var id = bat.id;
    url += id;
    let lesson = getData(url);
    $.each(lesson[id], function(j,col){
      j++;
      var time = col.startTime;
      var divId = id+time.substr(0,5);
          divId = divId.replace(":","");

      var postdata = [];
      $('#'+divId).on('click',function(){
        var tdTime = $(this).attr('data-time');
        var stat = $(this).attr('data-lock');
        var id = $(this).attr('data-bat');
        var reservation = $(this).attr('data-reservation');

        if(reservation === 'false'){
          postdata = [{
            positionId: id,
            date: date,
            time: tdTime
          }];
          var type = "time";
          if(stat === 'false'){
            $('#'+divId).attr('data-lock',true);
            $("#"+divId).html("<i class='fa fa-lock fa-2x' aria-hidden='true'></i>");
            var url = "http://210.99.223.38:30000/rest/v1/position/lock";
            console.log('lock');
          }else{
            $('#'+divId).attr('data-unlock',false);
            $("#"+divId).html("<i class='fa fa-unlock fa-2x' aria-hidden='true'></i>");
            var url = "http://210.99.223.38:30000/rest/v1/position/unlock";
            console.log('unlock');
          }
          postData(postdata,url);
        }
        else{
          var text = "해당 타석 예약을 취소 하시겠습니까?";
          deldata = {
            date: date,
            time: tdTime,
            positionId: id,
          };
          var cancelbaturl = "http://210.99.223.38:30000/rest/v1/position/delete";

          if (confirm(text) == true) {
            postData(deldata,cancelbaturl);
          } else {
           return false;
          }
        }

      });// click event closing
    }); // end of slot foreach
  });// end of bat foreach
}

function lockbyBat(instructor,url){
  let date = $('#reservationdate').val();
  $.each(instructor,function(i, bat){
    var id = bat.id;
    var batDiv = '#bat'+id;
    $(batDiv).on('click',function(){
      var dataId = $(this).attr('data-id');
      var stat = $(this).attr('data-lock');
      var postdata = [];
      var x = 0;
      url += id;
      let lesson = getData(url);
      $.each(lesson[id], function(j,col){
        var tdTime = col.startTime;
        var divId = id+tdTime.substr(0,5);
            divId = divId.replace(":","");

          //if(col.reservation === false){
            if(col.lock === false){
              postdata[j] = {
                positionId: dataId,
                date: date,
                time: tdTime
              }
              //stat = false;
              $("#"+divId).html("<i class='fa fa-lock fa-2x' aria-hidden='true'></i>");
            }
            else{
              postdata[j] = {
                positionId: dataId,
                date: date,
                time: tdTime
              }
              //stat = true;
              $("#"+divId).html("<i class='fa fa-unlock fa-2x' aria-hidden='true'></i>");
            }
          //}

      }); // end of slot foreach

        if(stat === 'false'){
          var urlpost = "http://210.99.223.38:30000/rest/v1/position/lock";
          $(batDiv).attr('data-lock',true);

        }else{
          var urlpost = "http://210.99.223.38:30000/rest/v1/position/unlock";
          $(batDiv).attr('data-lock',false);
        }
        postData(postdata,urlpost)
    });
  });// end of bat foreach
}

$(function(){
  if(localStorage.loginsess === null){
      window.location.href = 'index.html';
  }
  $('#reservationdate').val(today());
  // let userurl = "http://210.99.223.38:30000/rest/v1/my/reservation-list";
  // let userdata = getData(userurl);

  let instructorurl = 'http://210.99.223.38:30000/rest/v1/lesson/get/instructor-list';
  let lessonurl = "http://210.99.223.38:30000/rest/v1/lesson/get/reservation-info?date="+today()+"&instructorId=";

  const lesson = getData(sloturl).data;
  const instructor = getData(instructorurl).data;
  let timeData = apitime(getarraytime(instructor,lessonurl));

  displayTimeSlot(timeData);
  displayReservation(bat,timeData);
  lockbyTime(instructor,lessonurl);
  lockbyBat(instructor,lessonurl);
  updateContents(instructor,lessonurl);

  var prev_count  = localStorage.current;
  setTimeout(
      setInterval(function(){
        //console.log("reservation previews: "+prev_count);
        if(localStorage.current > prev_count || localStorage.current < prev_count){
          console.log('reservation data has been auto update!');
          prev_count = localStorage.current;
          updateContents(instructor,lessonurl);
        }
        //console.log("reservation current: "+localStorage.current);
      }, 1000)
    ,200)
})
  $("#reservationdate").change(function(){
    $("table thead").empty();
    $("table tbody").empty();
    //searchdate = document.getElementById('reservationdate').value;
    searchdate = $(this).val();
    let instructorurl = 'http://210.99.223.38:30000/rest/v1/lesson/get/instructor-list';
    let lessonurl = "http://210.99.223.38:30000/rest/v1/lesson/get/reservation-info?date="+searchdate+"&instructorId=";

    const instructor = getData(instructorurl).data;
    let timeData = apitime(getarraytime(instructor,lessonurl));
    //console.log(searchdate,slots)
    console.log(searchdate,lesson)

    displayTimeSlot(timeData);
    displayReservation(bat,timeData);
    lockbyTime(instructor,lessonurl);
    lockbyBat(instructor,lessonurl);
    updateContents(instructor,lessonurl);

  });
