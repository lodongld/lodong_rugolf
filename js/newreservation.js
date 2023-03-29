function postbat(dataParam,url){
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
  })
  .catch(err => console.error(err)); 
}


// var data = {
//     "date" : "2022-12-07",
//     "time" : "06:00:00",
//     "createAt" : "2022-12-07T05:02:35",
//     "positionId" : 1,
//     "userId" : "45db2a9f-ddf1-4c5c-9195-fb9abdf4aed1"
// };
var data = {
  "date" : "2022-12-06",
  "time" : "19:00:00",
  "createAt" : "2022-12-07T05:02:35",
  "positionId" : 1,
  "userId" : "45db2a9f-ddf1-4c5c-9195-fb9abdf4aed1"
};
var url = "http://210.99.223.38:30000/rest/v1/position/reservation";
postbat(data,url);
