this.tgd = this.tgd || {};

(function()
{
  var myVar = {};
  var started = false;
  var t = {};
  var domain = "";
  
  var timer = {};

  timer.init = function()
  {
	  myVar = setInterval(function(){myTimer()},1000); //initialize timer
	  started = 1; //timer flag
	  t = 0; //set start time
	  domain = window.location.host;
  }
  
  function myTimer()
  {
    t = t + 1;
    document.getElementById("timer").innerHTML=t;
  }
  
  timer.restartTimer = function()
  {
      if (!started)
      {
          myVar = setInterval(function(){myTimer()},1000);
          started = 1;
      }
  }
  
  timer.pauseTimer = function()
  {
    clearInterval(myVar);
    started = 0;
  }
  
  timer.saveTime = function()
  {
    localStorage.setItem(domain, t); //saves to the database, key/value
    window.alert(domain + " : " + t); //dev
  }
  
  timer.getTime = function()
  {
    window.alert(domain + " : " + localStorage.getItem(domain)); //dev
  }
  
  this.tgd.timer = timer;
})();