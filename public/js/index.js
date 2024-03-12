var alerted = localStorage.getItem('alerted') || ''; // Retrieve the value from localStorage
var topic = document.querySelector('.clik');

topic.addEventListener("click", function() {
    if (alerted !== 'yes') { // Check if the alert has not been shown before
        alert("File size must be less than 5Mb");
        localStorage.setItem('alerted', 'yes'); // Set the flag in localStorage
    }
});

var mgs= localStorage.getItem('mgs') || '';
var infor=document.querySelector('.new');
infor.addEventListener('click',function(){
    if (mgs !== 'yes') { // Check if the alert has not been shown before
        alert("Your DOB will be your password");
        localStorage.setItem('mgs', 'yes'); // Set the flag in localStorage
    }

});