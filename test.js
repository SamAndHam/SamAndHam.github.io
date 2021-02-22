var Page_State = "All"  // All, Blog, Programming, Language, Linux , Readings, Links
var Previous_State = ""
var Page_SelectedDate = "All";
var Base_URL = window.location.href;

var historyList = [];  //To maintain history

var JSON_STATC_DATA;   // List of files JSON 
var JSON_HEADER_KEYS;
var JSON_DATE_KEYS = new Set();

function initList() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      JSON_STATC_DATA = JSON.parse(xhr.responseText);
      loadHeader();
      loadDateSidebar();
      //loadSubPage();
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
        contentDate.innerHTML  = State + " | " +  SelectedDate;

        var contentData        =  document.createElement("DIV");
        contentData.className  = "contentData";
        console.log(State);
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
  date.innerHTML = State + " | " + JSON_STATC_DATA[SelectedDate][State][num].Date.replace(/_/g,"/") ;
  synopsis.innerHTML = JSON_STATC_DATA[SelectedDate][State][num].Synopsis;
  
  contentDiv.appendChild(title);
  contentDiv.appendChild(date);
  contentDiv.appendChild(synopsis);

  hrefContainer.appendChild(contentDiv);
  document.getElementById("content").appendChild(contentDiv); 
}


function loadHeader() {
  JSON_HEADER_KEYS = Object.keys(JSON_STATC_DATA);

  var all = document.createElement("DIV");
  all.innerHTML = "All"
  all.onclick = function() {
    Page_State = this.innerHTML;
    loadDateSidebar();
    loadSubPage();
  }
  document.getElementById("header").appendChild(all);  

  for (var i = 0; i < JSON_HEADER_KEYS.length; i++) {
    var header = document.createElement("DIV");
    header.innerHTML = JSON_HEADER_KEYS[i];
    header.onclick = function () {
      Page_State = this.innerHTML;
      loadDateSidebar();
      loadSubPage();
    }
    document.getElementById("header").appendChild(header);
  }

}

function loadDateSidebar() {
  JSON_DATE_KEYS.clear();
  document.getElementById("sidebar").innerHTML = "";

  var dateUL = document.createElement("UL");

  var dateLiAll = document.createElement("LI");
  dateLiAll.innerHTML = "All";
  dateLiAll.onclick  = function() {
    Page_SelectedDate = this.innerHTML;
    loadSubPage();
  }

  dateUL.appendChild(dateLiAll);

  if (Page_State == "All") {
    console.log("All");
    for (var i = 0; i < JSON_HEADER_KEYS.length; i++) {
      var tmpDateKeys = Object.keys(JSON_STATC_DATA[ JSON_HEADER_KEYS[i]]);

      for(var z=0; z < tmpDateKeys.length;z++)
        JSON_DATE_KEYS.add(tmpDateKeys[z]);
    }
  } else {
    var tmpDateKeys = Object.keys(JSON_STATC_DATA[Page_State]);
    console.log(tmpDateKeys);
    for(var z=0; z < tmpDateKeys.length;z++)
      JSON_DATE_KEYS.add(tmpDateKeys[z]);
 
  }

  
  JSON_DATE_KEYS.forEach( function(value) {
    var dateLi = document.createElement("LI");
    dateLi.innerHTML = value;
    dateLi.onclick = function() {
      Page_SelectedDate = this .innerHTML;
      loadSubPage();
      console.log(Page_SelectedDate);
    }
    dateUL.appendChild(dateLi);
  })

  document.getElementById("sidebar").appendChild(dateUL);
}

function loadSubPage() {
  document.getElementById("content").innerHTML = "";
            //parseElementContent(z, JSON_DATE_KEYS[j], JSON_HEADER_KEYS[i]);
  if (Page_State == "All") {
    if (Page_SelectedDate == "All") {

    }
  } else {
    
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

