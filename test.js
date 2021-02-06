var Page_State = "BLOG"  // HOME, PROGRAMMING LANGUAGE READING
var Previous_State = ""

var JSON_STATC_DATA;

function initList() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      JSON_STATC_DATA = JSON.parse(xhr.responseText);
      loadSubPage();
    }
  }

  xhr.open("GET", "List.json" , true);
  xhr.send();
}


function loadSubPage() {
  console.log(JSON_STATC_DATA);

  switch(Page_State) {
    case "HOME": {
        console.log(Page_State);
      }
      break;
    case "BLOG": {
      console.log(Page_State);
      console.log(JSON_STATC_DATA.Blog.length);
      console.log(JSON_STATC_DATA.Blog[0].Path); 
      document.getElementById("content").innerHTML = JSON_STATC_DATA.Blog[0].Title;
      document.getElementById("content").innerHTML += "<br>";
      document.getElementById("content").innerHTML += JSON_STATC_DATA.Blog[0].Synopsis;
    }
      break;
    case "LANGUAGE":
      break;
    default:
      break;
  }

}

function modifyPageState_OnButtonClick(newState) {
  //SubPage button clicked-> Change state -> Reload page
  Page_State = newState;
  loadSubPage();
}




//onload->main()-> initList()-> loadSubPage()
function main() {
  console.log("parse json");
  initList();

  var xhr = new XMLHttpRequest();
  
  var toRet = "EMPTY";


  xhr.open("GET", "Categories/Blog/2021_1_31/1_HelloWorld.html" , true);

xhr.onreadystatechange = function () {


  // In local files, status is 0 upon success in Mozilla Firefox
  if(xhr.readyState === XMLHttpRequest.DONE) {
    var status = xhr.status;
    var xmlRet = xhr.responseText;

   // document.getElementById("content").innerHTML = xmlRet;


    var parser = new DOMParser();
    var resp  = parser.parseFromString(xmlRet , "text/html");
    //var x = retXML.getElementById("title").innerHTML;
    console.log(resp.getElementById("title").innerHTML);
  }
};


  xhr.send();

  return toRet;
}


function test()  {

    var ret = reply();
    loadSubPage();
    //Retrieve class list of elements
};


window.onload=main;



