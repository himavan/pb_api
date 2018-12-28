function openApi(evt, apiName, divId) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementById(divId).getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementById(divId).getElementsByClassName("tablinks")
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(apiName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("userOpen").click();
document.getElementById("conOpen").click();
document.getElementById("groupOpen").click();

var all_codes = document.getElementsByTagName('code').length;

for(var i=0;i<all_codes;i++){
    var code_json = document.getElementsByTagName('code')[i].innerHTML;
    document.getElementsByTagName('code')[i].innerHTML = JSON.stringify(JSON.parse(code_json),null,5);
}


// Get all buttons with class="btn" inside the container
var btns = document.getElementsByClassName("btn");

// Loop through the buttons and add the active class to the current/clicked button
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}
