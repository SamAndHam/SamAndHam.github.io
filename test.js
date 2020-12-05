

function reply() {
  var xhr = new XMLHttpRequest();
  
  var toRet = "EMPTY";


  xhr.open("GET", "/" , true);

xhr.onreadystatechange = function () {


  // In local files, status is 0 upon success in Mozilla Firefox
  if(xhr.readyState === XMLHttpRequest.DONE) {
    var status = xhr.status;
    console.log(xhr.responseText);
    var ret = xhr.responseText
    let elementList = document.getElementById("content");
    
    var node = document.createElement("P");
    var text = document.createTextNode(ret);
    node.appendChild(text);

    elementList.appendChild(node);

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



