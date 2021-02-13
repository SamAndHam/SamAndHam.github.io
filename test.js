var Page_State = "Blog"  // HOME, PROGRAMMING LANGUAGE READING
var Previous_State = ""
var Page_SelectedDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');;

var JSON_STATC_DATA;
var JSON_HEADER_KEYS;

function initList() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      JSON_STATC_DATA = JSON.parse(xhr.responseText);
      Page_SelectedDate = JSON_STATC_DATA[0];
      loadDateSidebar();
      loadHeader();
      loadSubPage();
    }
  }

  xhr.open("GET", "List.json" , true);
  xhr.send();
}

function parseElementContent(num) {
  var hrefContainer = document.createElement("a");
  hrefContainer.href = JSON_STATC_DATA[Page_SelectedDate][Page_State][num].Path;
  

  var contentDiv = document.createElement("DIV");
  contentDiv.className = "contentDiv";
  contentDiv.onclick  = function() {
    var innerSite = document.createElement("object");
    innerSite.setAttribute("data", JSON_STATC_DATA[Page_SelectedDate][Page_State][num].Path) ;
    innerSite.setAttribute("type", "text/html");
    
    var innerDiv = document.createElement("div");
    innerDiv.appendChild(innerSite);

    document.getElementById("content").innerHTML = "";
    document.getElementById("content").appendChild(innerDiv);
  };

  var title       = document.createElement("DIV");
  title.className ="contentTitle";

  var date        = document.createElement("DIV");
  date.className = "contentDate";

  var synopsis   = document.createElement("P");
  synopsis.className = "contentSynopsis";

  title.innerHTML = JSON_STATC_DATA[Page_SelectedDate][Page_State][num].Title;
  date.innerHTML = JSON_STATC_DATA[Page_SelectedDate][Page_State][num].Date.replace(/_/g,"/");
  synopsis.innerHTML = JSON_STATC_DATA[Page_SelectedDate][Page_State][num].Synopsis;
  
  contentDiv.appendChild(title);
  contentDiv.appendChild(date);
  contentDiv.appendChild(synopsis);

  hrefContainer.appendChild(contentDiv);
  document.getElementById("content").appendChild(contentDiv); 
}


function loadHeader() {
  JSON_HEADER_KEYS = Object.keys(JSON_STATC_DATA[Page_SelectedDate]);

  for (var i = 0; i < JSON_HEADER_KEYS.length; i++) {
    var header = document.createElement("DIV");
    header.innerHTML = JSON_HEADER_KEYS[i];
    document.getElementById("header").appendChild(header);
  }

}

function loadDateSidebar() {
 //to modify JSON to include date as key
  var date_keys = Object.keys(JSON_STATC_DATA);

  var dateUL = document.createElement("UL");
  
   for (var i = date_keys.length -1 ; i > -1 ; i--) {
    var dateLI = document.createElement("LI");
    dateLI.innerHTML = date_keys[i];

    var date_var = date_keys[i].split("_", 3);
    var year = date_var[0];
    var month = date_var[1];

    console.log(year);
    console.log(month);

    dateUL.appendChild(dateLI);
  } 
  document.getElementById("sidebar").appendChild(dateUL);
  Page_SelectedDate = date_keys[date_keys.length -1];
}

function loadSubPage() {
  console.log(JSON_STATC_DATA);

  for ( var i = 0; i < JSON_STATC_DATA[Page_SelectedDate][Page_State].length; i++ ) {
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

  var toRet = "EMPTY";




  return toRet;
}


function test()  {

    var ret = reply();
    loadSubPage();
    //Retrieve class list of elements
};


window.onload=main;



