var alerted = localStorage.getItem('alerted') || ''; // Retrieve the value from localStorage
var topic = document.querySelector('.clik');

topic.addEventListener("click", function() {
    if (alerted !== 'yes') { // Check if the alert has not been shown before
        alert("File size must be less than 5Mb");
        localStorage.setItem('alerted', 'yes'); // Set the flag in localStorage
    }
});
