this.tgd = this.tgd || {};

(function()
{
  this.myVar = {};
  this.started;
  this.t;
  this.domain = window.location.host;
  
  var timer = {};
  timer.init = function() {  
	  var myVar = setInterval(function(){myTimer()},1000); //initialize timer
	  var started = 1; //timer flag
	  var t = 0; //set start time
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
      myVar=setInterval(function(){myTimer()},1000);
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