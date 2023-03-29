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

// let userurl = "http://210.99.223.38:30000/rest/v1/my/reservation-list";
// let userdata = getData(userurl);
//
// let baturl = "http://210.99.223.38:30000/rest/v1/lesson/get/list";
// const bat = getData(baturl).data;

// let baturl = "http://210.99.223.38:30000/rest/v1/position/get/reservation-list?date="+today();
// const bat = getData(baturl).data;
function getarraytime(bat,slots){
    var timearray = [];
    $.each(bat, function(i,data){
      let id = data.id;
      $.each(slots[id],function(j,slot){
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

// let time = apitime(getarraytime(bat,slot));
// let today = today();
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
              let baturl = "http://210.99.223.38:30000/rest/v1/lesson/get/list";
              let sloturl = "http://210.99.223.38:30000/rest/v1/position/get/reservation-list/web?date="+date;
              const slots = getData(sloturl).data;
              const bat = getData(baturl).data;
              updateContents(bat,slots);
              result = responses;
              console.log(result);
          //})
      }
  });
  //return result;
}

function postbat(dataParam,url,type){
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
    //updateContents();
  })
  .catch(err => console.error(err));
}

// let baturl = "http://210.99.223.38:30000/rest/v1/lesson/get/list";
// const bat = getData(baturl).data;
// let timeData = apitime(getarraytime(bat,slot));
// let sloturl = "http://210.99.223.38:30000/rest/v1/position/get/reservation-list?date="+today();
// const slots = getData(sloturl).data;
function displayReservation(bat,timeData){
  $.each(bat,function(i, bat){
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

// let baturl = "http://210.99.223.38:30000/rest/v1/lesson/get/list";
// const bat = getData(baturl).data;
// let sloturl = "http://210.99.223.38:30000/rest/v1/position/get/reservation-list?date="+today();
// const slots = getData(sloturl).data;
function updateContents(bat,slots){
  $.each(bat,function(i, bat){
    var id = bat.id;

    if( id < 21){
      var contentBat = "<div class='index text-center batpositions' id='bat"+ id +"' data-id='"+ id +"'>"+ id +"번 카카오vx TR</div>";
    }
    else if(id >20){
      var contentBat = "<div class='index text-center batpositions' id='bat"+ id +"' data-id='"+ id +"'>"+ id +"번 SG골프 SDR</div>";
    }

    var batstat = null;
    $.each(slots[id], function(j,cell){
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

function lockbyTime(bat,slots){
  let date = $('#reservationdate').val();
  $.each(bat,function(i, bat){
    var id = bat.id;
    $.each(slots[id], function(j,col){
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

function lockbyBat(bat,slots){
  let date = $('#reservationdate').val();
  $.each(bat,function(i, bat){
    var id = bat.id;
    var batDiv = '#bat'+id;
    $(batDiv).on('click',function(){
      var dataId = $(this).attr('data-id');
      var stat = $(this).attr('data-lock');
      var postdata = [];
      var x = 0;
      
      console.log(stat)
      $.each(slots[dataId], function(j,col){
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

  let baturl = "http://210.99.223.38:30000/rest/v1/lesson/get/list";
  let sloturl = "http://210.99.223.38:30000/rest/v1/position/get/reservation-list/web?date="+today();
  const slots = getData(sloturl).data;
  const bat = getData(baturl).data;
  slots === null ? $('.alert-danger').removeClass('d-none'):$('.alert-danger').addClass('d-none')
  let timeData = apitime(getarraytime(bat,slots));
  
  displayTimeSlot(timeData);
  displayReservation(bat,timeData);
  lockbyTime(bat,slots);
  lockbyBat(bat,slots);
  updateContents(bat,slots);

  var prev_count  = localStorage.current;
    setTimeout(
      setInterval(function(){
        //console.log("reservation previews: "+prev_count);
        if(localStorage.current > prev_count || localStorage.current < prev_count){
          console.log('reservation data has been auto update!');
          prev_count = localStorage.current;
          updateContents(bat,slots);
        }
        //console.log("reservation current: "+localStorage.current);
      }, 1000)
    ,1000)
})
  $("#reservationdate").change(function(){
    $("table thead").empty();
    $("table tbody").empty();
    //searchdate = document.getElementById('reservationdate').value;
    searchdate = $(this).val();
    let baturl = "http://210.99.223.38:30000/rest/v1/lesson/get/list";
    let sloturl = "http://210.99.223.38:30000/rest/v1/position/get/reservation-list/web?date="+searchdate;
    const slots = getData(sloturl).data;
    const bat = getData(baturl).data;
    slots === null ? $('.alert-danger').removeClass('d-none'):$('.alert-danger').addClass('d-none')
    const rawtime = getarraytime(bat,slots);
    let timeData = apitime(rawtime);
    //console.log(searchdate,slots)
    console.log(searchdate,bat)
    
    displayTimeSlot(timeData,today);
    displayReservation(bat,timeData);
    lockbyTime(bat,slots,searchdate);
    lockbyBat(bat,slots,searchdate);
    updateContents(bat,slots);

  });

  // $('.slotdiv').on('click',function(){
  //   let baturl = "http://210.99.223.38:30000/rest/v1/lesson/get/list";

  //   let sloturl = "http://210.99.223.38:30000/rest/v1/position/get/reservation-list?date="+today();
  //   let date = $('#reservationdate').val();
  //   console.log(date)
  //   let slots = getData(sloturl).data;
  //   let bat = getData(baturl).data;

  //   let id = $(this).attr('data-bat');      
  //   const tdTime = $(this).attr('data-time');
  //   const stat = $(this).attr('data-lock');
  //   const reservation = $(this).attr('data-reservation');
  //   const time = tdTime;
  //   let divId = id+time.substr(0,2);
  //       divId = divId.replace(":","");  
  //   let postdata = [];
  //   stat === 'false' ? $(this).append("<i class='fa fa-lock fa-2x' aria-hidden='true'></i>") : $(this).html("<i class='fa fa-unlock fa-2x' aria-hidden='true'></i>");;
  //   stat === 'false' ? $(this).attr('data-lock','true') : $(this).attr('data-unlock','false');
      
  //     if(reservation === 'false'){
  //       postdata = [{
  //         positionId: id,
  //         date: date,
  //         time: tdTime
  //       }];
  //       if(stat === 'false'){          
  //         var url = "http://210.99.223.38:30000/rest/v1/position/lock";
  //       }else{          
  //         var url = "http://210.99.223.38:30000/rest/v1/position/unlock";
  //       }         
  //       postData(postdata,url);          
        
  //     }
  //     else{
  //       var text = "해당 타석 예약을 취소 하시겠습니까?";
  //       deldata = {
  //         date: date,
  //         time: tdTime,
  //         positionId: id,
  //       };
  //       var cancelbaturl = "http://210.99.223.38:30000/rest/v1/position/delete";

  //       if (confirm(text) == true) {
  //         postData(deldata,cancelbaturl);
  //       } else {
  //         return false;
  //       }
  //     }
  // });
  // $('.batpositions').on('click',function(){
  //   $.each(bat,function(i, bat){
  //   var id = bat.id;
  //   var batDiv = '#bat'+id;
  //   $(batDiv).on('click',function(){
  //     var dataId = $(this).attr('data-id');
  //     var stat = $(this).attr('data-lock');
  //     var postdata = [];
  //     var x = 0;

  //     $.each(slots[dataId], function(j,col){
  //       var tdTime = col.startTime;
  //       var divId = id+tdTime.substr(0,5);
  //           divId = divId.replace(":","");

  //         //if(col.reservation === false){
  //           if(col.lock === false){
  //             postdata[j] = {
  //               positionId: dataId,
  //               date: date,
  //               time: tdTime
  //             }
  //             //stat = false;
  //             $("#"+divId).html("<i class='fa fa-lock fa-2x' aria-hidden='true'></i>");
  //           }
  //           else{
  //             postdata[j] = {
  //               positionId: dataId,
  //               date: date,
  //               time: tdTime
  //             }
  //             //stat = true;
  //             $("#"+divId).html("<i class='fa fa-unlock fa-2x' aria-hidden='true'></i>");
  //           }
  //         //}


  //     }); // end of slot foreach
  //       if(stat === 'false'){
  //         var urlpost = "http://210.99.223.38:30000/rest/v1/position/lock";
  //         $(batDiv).attr('data-lock',true);
          
  //       }else{
  //         var urlpost = "http://210.99.223.38:30000/rest/v1/position/unlock";
  //         $(batDiv).attr('data-lock',false);
  //       }
        
  //       postData(postdata,urlpost)
  //       updateContents(bat,slots);
  //   });
  // });// end of bat foreach
  // });

