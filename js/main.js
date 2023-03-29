$(function(){
const signinForm = document.getElementById('form-signin');

signinForm.addEventListener('submit', function (e){
  e.preventDefault();
  var userIdval = document.getElementById('userId').value;
  var passwordval = document.getElementById('password').value;

  fetch("http://210.99.223.38:30000/rest/v1/auth/do-admin", {
  method: 'POST',
  headers : {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: userIdval,
    password: passwordval
  })
  }).then(response => response.json())
  .then(response =>{
    console.log(response);
    if (response.status == "OK") {
        localStorage.setItem("loginsess", response.data);
        document.getElementById('message').innerHTML = response.message;
        setTimeout(function(){
        window.location.href = 'reservation.html';
    }, 1000);
    } else {
        document.getElementById('message').innerHTML = response.message;
    }
  })
  .catch(err => console.error(err));
})

var session = localStorage.getItem('loginsess');
if(session !== null){
  window.location.href = 'reservation.html';
}
console.log(session);

  var session = localStorage.getItem('loginsess');
  if(session !== null){
    window.location.href = 'reservation.html';
  }
  console.log(session);

});
