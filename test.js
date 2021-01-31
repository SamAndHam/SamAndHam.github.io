

function reply() {
  var xhr = new XMLHttpRequest();
  
  var toRet = "EMPTY";


  xhr.open("GET", "Categories/Blog/2021_1_31/1_HelloWorld.html" , true);

xhr.onreadystatechange = function () {


  // In local files, status is 0 upon success in Mozilla Firefox
  if(xhr.readyState === XMLHttpRequest.DONE) {
    var status = xhr.status;
    //var parser = new DOMParser();
    //var ret = parser.parseFromString( xhr.responseText, "text/html");
    var xmlRet = xhr.responseText;
    //var synopsis = xmlRet.getElementsByClassName("synopsis");

    document.getElementById("content").innerHTML = xmlRet;
    
  }
};


  xhr.send();
  console.log(toRet);

  return toRet;
}


function test()  {

    var ret = reply();
    //Retrieve class list of elements
};


window.onload=test;



