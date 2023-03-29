$(function (){
  // const $container = $("#infodiv");
  // const $paginationContainer = $("#pagination");

        const $userListContainer = $("#infodiv");
        const $paginationContainer = $("#pagination");
        const $back = $(".back");
        const $next = $(".next");
        var batTemplate = "" +
        "<div class='col-md-12 col-xs-12 subinfodiv'>" +
          "<div class='col-md-3 col-xs-12 pull-right'>" +
              "<div class='col-md-12 text-right read' id='{{divid}}' data-kind='{{kind}}' data-id='{{id}}' ><i class='fa fa-window-close fa-2x' aria-hidden='true'></i></div>" +
              "<div class='col-md-12 text-right'><time class='timeago' datetime='{{createAt}}'>{{createAt}}</time></div>" +
          "</div>" +
          "<div class='col-md-4 col-xs-12 pull-left'>" +
              "<h4 class='text-left'>{{date}}</h4>"+
              "<span class='notification'>{{message}}</span><br />" +
              "<span class='client'>{{name}}</span><br />" +
              "<span class='sched'>{{instructor}}({{startTime}}~{{endTime}})</span><br />" +
          "</div>" +
        "</div>";

        var buttonTemplate = "<button class ></button>";

        let cpage = 1
        let rows = 3

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

        //previews version
        // function display(lesson,listContainer,rowsCount,currentPage){
        //   listContainer.empty()

        //   let endIndex = rowsCount * currentPage
        //   let startIndex = endIndex - rowsCount

        //   let paginatedUsers = lesson.slice(startIndex, endIndex)
        //   console.log(paginatedUsers);
        //   $.each(paginatedUsers, function(i, service){
        //     if(service.isReadNotification === false){
        //       var id = service.id;
        //       var time = service.reservationStartTime;
        //           time = time.replace(/:/g,"");
        //       var date = service.reservationDate;
        //           date = date.replace(/-/g,"");
        //       var divId = date.substr(4,4)+time.substr(0,5);
        //       if(service.kind === "cancel"){
        //         var kindstat = "예약을 취소하셨습니다";
        //       }
        //       else if (service.kind === "reservation"){
        //         var kindstat = "새로운 레슨예약이 있어요!";
        //       }

        //       data = {
        //         'name': service.customerName,
        //         'date': service.reservationDate,
        //         'instructor': service.instructorName,
        //         'startTime': service.reservationStartTime,
        //         'endTime': service.reservationEndTime,
        //         'createAt': timeAgo(service.createAt),
        //         'id': service.id,
        //         'divid': divId,
        //         'kind': service.kind,
        //         'message': kindstat
        //       }

        //       listContainer.append(Mustache.render(batTemplate, data));
        //       $('#'+divId).on('click',function(){
        //         var id = $(this).attr('data-id');
        //         var kind = $(this).attr('data-kind');

        //         if(kind === "cancel"){
        //           var readurl = "http://210.99.223.38:30000/rest/v1/lesson/notification/read-cancel";
        //         }
        //         else if(kind === "reservation"){
        //           var readurl = "http://210.99.223.38:30000/rest/v1/lesson/notification/read"
        //         }
        //         var data = {
        //           "id": id
        //         };
        //         postread(readurl,data);
        //       });
        //     }

        //   });
        // }

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
        console.log("pagination array:")
        console.log(makeunreadarray())

        function display(lesson,listContainer,rowsCount,currentPage){
          listContainer.empty()
          let endIndex = rowsCount * currentPage
          let startIndex = endIndex - rowsCount

          let paginatedUsers = lesson.slice(startIndex, endIndex)
          // console.log("pagination array:")
          // console.log(paginatedUsers)
          $.each(paginatedUsers, function(i, service){

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

              listContainer.append(Mustache.render(batTemplate, data));

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

        function setupPagination(allAlert, pageContainer, rowsCount){
          pageContainer.empty();

          var alertlength = 0;
          $.each(allAlert,function(i,alert){
            if(alert.isReadNotification === false){
              alertlength++;
            }
          });

          let pageCount = Math.ceil(alertlength / rowsCount)

          for(let i = 1; i < pageCount + 1 ; i++){
            let btn = generateButton(i, allAlert)
            pageContainer.append(btn)
          }
        }

        function generateButton(page, allAlert){
          let button = document.createElement("button");

          button.innerHTML = page;

          if(page === cpage){
            button.classList.add("active")
          }

          button.addEventListener("click", function(){
            pagenum = page

            display(allAlert,$userListContainer,rows,pagenum)

            let prevPage = document.querySelector("button.active")

            prevPage.classList.remove("active")

            button.classList.add("active")
          })

          return button
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

        console.log(getData())
        var prev_count  = localStorage.current;
        display(makeunreadarray(),$userListContainer,rows,cpage)
        setupPagination(makeunreadarray(),$paginationContainer, rows)
        setInterval(function(){
          if(localStorage.current > prev_count || localStorage.current < prev_count){
            console.log('data has been auto update!');
            display(makeunreadarray(),$userListContainer,rows,cpage);
            setupPagination(makeunreadarray(),$paginationContainer, rows);
            prev_count = localStorage.current;
          }
        }, 1000);
  });
