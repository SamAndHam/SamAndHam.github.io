var Page_State = "All"  // All, Blog, Programming, Language, Linux , Readings, Links
var Previous_State = ""
var Page_SelectedDate = "All";
var Base_URL = window.location.href;

var historyList = [];  //To maintain history

var JSON_STATC_DATA;   // List of files JSON 
var JSON_PAGE_METADATA = [];  // List of pages sorted
var TOPIC_SET = new Set();    // Set of all the topics
var TOPIC_SELECTED = "";      // Topic filter. if blank no filter.


var JSON_HEADER_KEYS;
var JSON_DATE_KEYS = new Set(); //Set of dates, Biggest to smallest

// create struct to store topics.
// topics -> date
//        -> topic
//        -> title
//        -> tags
//        -> title
//        -> synopsis
//        -> Link to actual data
//
function populateTopics(node, articleDate) 
{
  this.articleDate  = articleDate;
  this.Topic        = node.Topic;
  this.Title        = node.Title;
  this.Tags         = node.Tags;
  this.Synopsis     = node.Synopsis;
  this.Path         = node.Path;
}
//TODO insert DATE into json itself. instead of another nest
 
function initList() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      JSON_STATC_DATA = JSON.parse(xhr.responseText);
      //Struct
      //  Path
      //  FileName
      //  Topic
      //  Date
      //  Tags
      //  Synopsis
      var keys = Object.keys(JSON_STATC_DATA);

      //extract all page metadata
      for ( var x  in JSON_STATC_DATA ) {
        for ( var y in JSON_STATC_DATA[x] ) {
          for (var  i = 0; i <  JSON_STATC_DATA[x][y].length; i++) {
            JSON_PAGE_METADATA.push(JSON_STATC_DATA[x][y][i]);
            TOPIC_SET.add( JSON_STATC_DATA[x][y][i].Topic);
          }
        }
      }

      JSON_PAGE_METADATA.sort(function(a,b){
        var dateA  = new Date(a.Date);
        var dateB  = new Date(b.Date);
        return dateB - dateA;
      });
     
      //DEBUG 
      /*
      for ( var x in JSON_PAGE_METADATA ) {
        console.log(JSON_PAGE_METADATA[x]);
      }

      TOPIC_SET.forEach((value) => {console.log(value)});
      */
      //DEBUG

      //========
      //retrieve all date keys, sort and store
      var tmpDate = []
      for ( var i = 0 ; i < keys.length; i++) {
        var dates = Object.keys(JSON_STATC_DATA[keys[i]]);

        for (var z =0 ; z < dates.length; z ++) {
          tmpDate.push(new Date(dates[z]));
          //console.log(JSON_STATC_DATA[keys[i]][dates[z]]);
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


//Header Div -> Dates
function loadHeader() { 
  JSON_HEADER_KEYS = Object.keys(JSON_STATC_DATA);

  document.getElementById("topics").innerHTML = "";
 
  TOPIC_SET.forEach( value => {
    var topicDiv = document.createElement("DIV");
    topicDiv.className = "button";
    topicDiv.innerHTML = value;
    topicDiv.onclick = function() { 
      TOPIC_SELECTED = this.innerHTML; 
      //console.log(this.innerHTML);
      
      //reload page here
      loadSubPage();
    };
    document.getElementById("topics").appendChild(topicDiv);
  }); 

  //Home button
  document.getElementById("homeButton").onclick = function() {
    TOPIC_SELECTED = "";
    loadSubPage();
  }
}

function parseElementContent( topic ) 
{
  var contentDiv = document.createElement("DIV");
  contentDiv.className = "article";
  contentDiv.setAttribute("data", topic.Path) ;
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

        var info        = document.createElement("DIV");
        info.className = "info";
        var date        = document.createElement("DIV");
        date.className = "date";
        date.innerHTML =  topic.Date;
        var tags        = document.createElement("DIV");
        tags.className = "tags";
        tags.innerHTML =  topic.Topic;
        info.appendChild(tags);
        info.appendChild(date);

        var contentData        =  document.createElement("DIV");
        contentData.className  = "contentData";
        contentData.innerHTML  = container.getElementById("synopsis").innerHTML +  container.getElementById("contents").innerHTML; 

        var contentDiv          = document.createElement("DIV");
        contentDiv.className    = "contentDiv";
        contentDiv.appendChild(contentTitle);
        contentDiv.appendChild(info);
        contentDiv.appendChild(contentData); 
        document.getElementById("content").innerHTML = "";
        document.getElementById("content").appendChild(contentDiv);
        
        history.pushState( '', topic.Path, topic.Path);
        historyList.push(window.location.href);

      }
    }
    xhr.open("GET", topic.Path , true);
    xhr.send();
  }

  var title       = document.createElement("DIV");
  title.className ="title";

  var info        = document.createElement("DIV");
  info.className = "info";
  var date        = document.createElement("DIV");
  date.className = "date";
  var tags        = document.createElement("DIV");
  tags.className = "tags";

  var synopsis   = document.createElement("DIV");
  synopsis.className = "synopsis";

  title.innerHTML = topic.Title;
  date.innerHTML =  topic.Date ;
  tags.innerHTML =  topic.Topic ;
  synopsis.innerHTML = topic.Synopsis;

  info.appendChild(tags);
  info.appendChild(date);
 
  contentDiv.appendChild(title);
  contentDiv.appendChild(info);
  contentDiv.appendChild(synopsis);

  document.getElementById("content").appendChild(contentDiv); 


} 


function loadSubPage() {
  document.getElementById("content").innerHTML = "";

  if (TOPIC_SELECTED == "" ) {
    JSON_PAGE_METADATA.forEach( value => {
      console.log(value);
      parseElementContent(value);
    });
  } else {
    JSON_PAGE_METADATA.forEach( value => {
      if ( value.Topic == TOPIC_SELECTED )  
        parseElementContent(value);
    });
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

