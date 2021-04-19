var Page_State = "All"  // All, Blog, Programming, Language, Linux , Readings, Links
var Previous_State = ""
var Page_SelectedDate = "All";
var Base_URL = window.location.href;

var historyList = [];  //To maintain history

var JSON_STATC_DATA;   // List of files JSON 
var JSON_HEADER_KEYS;
var JSON_DATE_KEYS = new Set(); //Set of dates, Biggest to smallest


function initList() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      JSON_STATC_DATA = JSON.parse(xhr.responseText);
      var keys = Object.keys(JSON_STATC_DATA);
      //retrieve all date keys, sort and store
      var tmpDate = []
      for ( var i = 0 ; i < keys.length; i++) {
        var dates = Object.keys(JSON_STATC_DATA[keys[i]]);
        for (var z =0 ; z < dates.length; z ++) {
          tmpDate.push(new Date(dates[z]));
        }
      } 
      tmpDate.sort(function(a,b) {
        return b-a;
      });

      for (var i = 0; i < tmpDate.length; i++) {
        var tmpStr = tmpDate[i].toISOString().substring(0,10);
        JSON_DATE_KEYS.add(tmpStr);
      }
      loadHeader();
      //loadDateSidebar();
      loadSubPage();
      historyList.push(window.location.href);
    }
  };

  xhr.open("GET", "List.json" , true);
  xhr.send();
}


function parseElementContent(num, SelectedState, SelectedDate) {
  var contentDiv = document.createElement("DIV");
  contentDiv.className = "contentDiv";
  contentDiv.setAttribute("data", JSON_STATC_DATA[SelectedState][SelectedDate][num].path) ;
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
        contentDate.innerHTML  = SelectedDate + " | " +  SelectedState;

        var contentData        =  document.createElement("DIV");
        contentData.className  = "contentData";
        contentData.innerHTML  = container.getElementById("synopsis").innerHTML +  container.getElementById("contents").innerHTML; 

        var contentDiv          = document.createElement("DIV");
        contentDiv.className    = "contentDiv";
        contentDiv.appendChild(contentTitle);
        contentDiv.appendChild(contentDate);
        contentDiv.appendChild(contentData); 
        document.getElementById("content").innerHTML = "";
        document.getElementById("content").appendChild(contentDiv);
        
        history.pushState( '', JSON_STATC_DATA[SelectedState][SelectedDate][num].Path,JSON_STATC_DATA[SelectedState][SelectedDate][num].Path);
        historyList.push(window.location.href);

      }
    }
    xhr.open("GET", JSON_STATC_DATA[SelectedState][SelectedDate][num].Path , true);
    xhr.send();
  }

  var title       = document.createElement("DIV");
  title.className ="contentTitle";

  var date        = document.createElement("DIV");
  date.className = "contentDate";

  var synopsis   = document.createElement("DIV");
  synopsis.className = "contentSynopsis";

  title.innerHTML = JSON_STATC_DATA[SelectedState][SelectedDate][num].Title;
  date.innerHTML = SelectedDate + " | " + JSON_STATC_DATA[SelectedState][SelectedDate][num].Date.replace(/_/g,"/") ;
  synopsis.innerHTML = JSON_STATC_DATA[SelectedState][SelectedDate][num].Synopsis;
  
  contentDiv.appendChild(title);
  contentDiv.appendChild(date);
  contentDiv.appendChild(synopsis);

  document.getElementById("content").appendChild(contentDiv); 
}

//Header Div -> Dates
function loadHeader() { 
  JSON_HEADER_KEYS = Object.keys(JSON_STATC_DATA);
  
  var headerContainer = document.createElement("DIV");


  var all = document.createElement("DIV");
  all.innerHTML = "All"
  all.id = "heading"
  all.onclick = function() {
    Page_State = this.innerHTML;
    Page_SelectedDate = "All";
    loadSubPage();
  }
  headerContainer.appendChild(all);  

  for (var i = 0; i < JSON_HEADER_KEYS.length; i++) {
    var header = document.createElement("DIV");
    var key = JSON_HEADER_KEYS[i]
    header.innerHTML = key;
    header.id = "heading"

    header.onclick = function () {
      Page_State = this.innerHTML.split("<")[0];
      Page_SelectedDate = "All";
      loadSubPage();
    }

    headerContainer.appendChild(header);

    var tmpdateKeys = Object.keys(JSON_STATC_DATA[  key]);
    for ( var z = 0; z <  tmpdateKeys.length; z++) {
      var headerDate = document.createElement("DIV");
      headerDate.innerHTML = tmpdateKeys[z];
      headerDate.id        = "headerDate_" + key;
      headerDate.setAttribute("Topic", key);
      headerDate.onclick = function() {
        Page_State = this.getAttribute("Topic");
        Page_SelectedDate = this.innerHTML;
        loadSubPage();
      } 
      headerContainer.appendChild(headerDate);
    }

  }

    document.getElementById("header").appendChild(headerContainer);
}

function loadSubPage() {
  document.getElementById("content").innerHTML = "";

  if (Page_State == "All" && Page_SelectedDate == "All") {
    for (const date of JSON_DATE_KEYS) {
      for (const header of JSON_HEADER_KEYS) {
        if (!JSON_STATC_DATA[header][date]) continue;
        for ( var z = 0; z <JSON_STATC_DATA[header][date].length; z++) {
          parseElementContent( z,  header,date);
        }
      }
    }
  }

  if (Page_SelectedDate  == "All"  && Page_State != "All") {
    var currentPageState = Page_State;
    
    var tmpDateKeys = Object.keys(JSON_STATC_DATA[currentPageState]);
    tmpDateKeys.forEach( function(value) {
    for ( var z = 0; z <JSON_STATC_DATA[currentPageState][value].length; z++) {
        if (JSON_STATC_DATA[currentPageState][value] )
          parseElementContent( z,  currentPageState,value);
      }
    })
  }

  if (Page_State != "All" && Page_SelectedDate != "All") {
    var articles = Object.keys(JSON_STATC_DATA[Page_State][Page_SelectedDate]); 
    for ( var z = 0; z <articles.length; z++) {
        if (JSON_STATC_DATA[Page_State][Page_SelectedDate] )
          parseElementContent( z,   Page_State, Page_SelectedDate);
      }
  }
  history.pushState('Home','Home',Base_URL );
}




//onload->main()-> initList()-> loadSubPage()
function main() {
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

