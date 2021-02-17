var Page_State = "All"  // All, Blog, Programming, Language, Linux , Readings, Links
var Previous_State = ""
var Page_SelectedDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');;
var Base_URL = window.location.href;

var historyList = [];  //To maintain history

var JSON_STATC_DATA;   // List of files JSON 
var JSON_HEADER_KEYS;  // Date keys

function initList() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      JSON_STATC_DATA = JSON.parse(xhr.responseText);
      Page_SelectedDate = JSON_STATC_DATA[0];
      loadDateSidebar();
      loadHeader();
      loadSubPage();
      historyList.push(window.location.href);
    }
  }

  xhr.open("GET", "List.json" , true);
  xhr.send();
}


function parseElementContent(num, SelectedDate, State) {
  var hrefContainer = document.createElement("a");
  hrefContainer.href = JSON_STATC_DATA[SelectedDate][State][num].Path;
  

  var contentDiv = document.createElement("DIV");
  contentDiv.className = "contentDiv";
  contentDiv.setAttribute("data", JSON_STATC_DATA[SelectedDate][State][num].Path) ;
  //callback function on click
  contentDiv.onclick = function() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        var container = document.implementation.createHTMLDocument("ret");        
        container.write(xhr.responseText);

        document.getElementById("content").innerHTML = "";
        var contentTitle = document.createElement("DIV");
        contentTitle.className = "contentTitle";
        contentTitle.innerHTML = container.getElementById("title").innerHTML;

        var contentDate        = document.createElement("DIV");
        contentDate.className  = "contentDate";
        contentDate.innerHTML  = SelectedDate;

        var contentData        =  document.createElement("DIV");
        contentData.className  = "contentData";
        contentData.innerHTML  = container.getElementById("synopsis").innerHTML +  container.getElementById("contents").innerHTML; 

        var contentDiv          = document.createElement("DIV");
        contentDiv.className    = "contentDiv";
        contentDiv.appendChild(contentTitle);
        contentDiv.appendChild(contentDate);
        contentDiv.appendChild(contentData); 
        document.getElementById("content").appendChild(contentDiv);

        history.pushState( '', JSON_STATC_DATA[SelectedDate][State][num].Path,JSON_STATC_DATA[SelectedDate][State][num].Path);
        historyList.push(window.location.href);
        console.log(historyList);
      }
    }

    xhr.open("GET", JSON_STATC_DATA[SelectedDate][State][num].Path , true);
    xhr.send();

  };


  var title       = document.createElement("DIV");
  title.className ="contentTitle";

  var date        = document.createElement("DIV");
  date.className = "contentDate";

  var synopsis   = document.createElement("P");
  synopsis.className = "contentSynopsis";

  title.innerHTML = JSON_STATC_DATA[SelectedDate][State][num].Title;
  date.innerHTML = JSON_STATC_DATA[SelectedDate][State][num].Date.replace(/_/g,"/");
  synopsis.innerHTML = JSON_STATC_DATA[SelectedDate][State][num].Synopsis;
  
  contentDiv.appendChild(title);
  contentDiv.appendChild(date);
  contentDiv.appendChild(synopsis);

  hrefContainer.appendChild(contentDiv);
  document.getElementById("content").appendChild(contentDiv); 
}


function loadHeader() {
  JSON_HEADER_KEYS = Object.keys(JSON_STATC_DATA[Page_SelectedDate]);

  var all = document.createElement("DIV");
  all.innerHTML = "All"
  document.getElementById("header").appendChild(all);  

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

    dateUL.appendChild(dateLI);
  } 
  document.getElementById("sidebar").appendChild(dateUL);
  Page_SelectedDate = date_keys[date_keys.length -1];
}

function loadSubPage() {
  document.getElementById("content").innerHTML = "";
  if (Page_State == "All") {
    for (var i = 0 ; i < JSON_HEADER_KEYS.length; i++) {
      var currentKey = JSON_HEADER_KEYS[i];

      for ( var z = 0; z < JSON_STATC_DATA[Page_SelectedDate][ currentKey].length; z++ ) 
        parseElementContent(z, Page_SelectedDate, JSON_HEADER_KEYS[i]);
    }

  } else {
    for ( var i = 0; i < JSON_STATC_DATA[Page_SelectedDate][Page_State].length; i++ ) {
      parseElementContent(i, Page_SelectedDate, Page_State);
    }      
  }
  history.pushState('Home','Home',Base_URL );
  return;
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

window.onpopstate = function() {
  historyList.pop();
  console.log(historyList);
  if (historyList.length == 0) {
    history.go(-1);
    location.reload();
  } else {
    //location.reload();
    loadSubPage();
  }
}

