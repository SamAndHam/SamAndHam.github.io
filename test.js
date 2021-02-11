var Page_State = "Blog"  // HOME, PROGRAMMING LANGUAGE READING
var Previous_State = ""
var Page_SelectedDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');;

var JSON_STATC_DATA;
var JSON_KEYS;

function initList() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      JSON_STATC_DATA = JSON.parse(xhr.responseText);
      loadHeader();
      loadDateSidebar();
      loadSubPage();
    }
  }

  xhr.open("GET", "List.json" , true);
  xhr.send();
}

function parseElementContent(num) {
  var contentDiv = document.createElement("DIV");
  contentDiv.className = "contentDiv";

  var title       = document.createElement("DIV");
  title.className ="contentTitle";

  var date        = document.createElement("DIV");
  date.className = "contentDate";

  var synopsis   = document.createElement("P");
  synopsis.className = "contentSynopsis";

  title.innerHTML = JSON_STATC_DATA[Page_State][Page_SelectedDate][num].Title;
  date.innerHTML = JSON_STATC_DATA[Page_State][Page_SelectedDate][num].Date.replace(/_/g,"/");
  synopsis.innerHTML = JSON_STATC_DATA[Page_State][Page_SelectedDate][num].Synopsis;
  
  contentDiv.appendChild(title);
  contentDiv.appendChild(date);
  contentDiv.appendChild(synopsis);
  document.getElementById("content").appendChild(contentDiv); 
}


function loadHeader() {
  JSON_KEYS = Object.keys(JSON_STATC_DATA);

  for (var i = 0; i < JSON_KEYS.length; i++) {
    var header = document.createElement("DIV");
    header.innerHTML = JSON_KEYS[i];
    document.getElementById("header").appendChild(header);
  }

}

function loadDateSidebar() {
 //to modify JSON to include date as key
  var date_keys = Object.keys(JSON_STATC_DATA[Page_State]);

  var dateUL = document.createElement("UL");
  
   for (var i = 0; i < date_keys.length; i++) {
    var dateLI = document.createElement("LI");
    dateLI.innerHTML = date_keys[i];
    console.log(date_keys[i]);
    console.log(date_keys.length);
    dateUL.appendChild(dateLI);
  } 
  document.getElementById("sidebar").appendChild(dateUL);
  Page_SelectedDate = date_keys[0];
}

function loadSubPage() {
  console.log(JSON_STATC_DATA);

  for ( var i = 0; i < JSON_STATC_DATA[Page_State][Page_SelectedDate].length; i++ ) {
    parseElementContent(i);
  }      

  return;
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



