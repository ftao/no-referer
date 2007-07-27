/*
 * No Referer extension
 * Version 0.1
 * Copyright (C) 2007 Filia Tao (Filia.Tao@gmail.com)
 *

/*
 * check weather a string is end with another 
 * usage: somestirng.endWith(antoherString)
 * @param {string} subfix  
 */
String.prototype.isEndWith = function(subfix)
{
    var index = this.lastIndexOf(subfix);
    return index != -1 && index + subfix.length == this.length;
}

var noref_domains = new Array();
try{
	var gPrefService = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
	var tmp  = gPrefService.getCharPref("noreferer.domains");
	noref_domains = tmp.split(';');

}
catch(e){};

dump("NO REF DOMAINS " + noref_domains + "\n");

function norefObserver()
{
  this.register();
}

norefObserver.prototype =
{
  observe: function(subject, topic, data)
  {
    if (topic == "http-on-modify-request") {
      var httpChannel = subject.QueryInterface(Components.interfaces.nsIHttpChannel);
      var host = httpChannel.getRequestHeader("host");
      for (var i=0; i < noref_domains.length; i++) {
		domain = noref_domains[i];
		if (domain[0] != '.')
			domain = '.' + domain;
		if (host.isEndWith(domain) || (host == noref_domains[i]))
		{
		  dump(host);
          httpChannel.setRequestHeader("referer", "", false);
		  break;
        }
      }
    }
  },

  get observerService() {
    return Components.classes["@mozilla.org/observer-service;1"]
                     .getService(Components.interfaces.nsIObserverService);
  },

  register: function()
  {
    this.observerService.addObserver(this, "http-on-modify-request", false);
  },

  unregister: function()
  {
    this.observerService.removeObserver(this, "http-on-modify-request");
  }
};

window.addEventListener("load", function() {
  var observer = new norefObserver();
  window.addEventListener("unload", function() {
    observer.unregister();
  }, false);
}, false);