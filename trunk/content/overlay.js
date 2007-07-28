/*
 * No Referer extension
 * Version 0.1
 * Copyright (C) 2007 Filia Tao (Filia.Tao@gmail.com)
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2, or (at your option)
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 */
 
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

var gPrefService = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);

function get_noref_domains()
{
	var noref_domains = new Array();
	try{

		var tmp  = gPrefService.getCharPref("noreferer.domains");
		noref_domains = tmp.split(';');
	}
	catch(e){
		//gPrefService.setCharPref("noreferer.domains","");
	};
	dump("get noref domains" + noref_domains + "\n");
	return noref_domains;
}



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
	  var noref_domains = get_noref_domains();
      for (var i=0; i < noref_domains.length; i++) {
		domain = noref_domains[i];
		if (domain[0] != '.')
			domain = '.' + domain;
		if (host.isEndWith(domain) || (host == noref_domains[i]))
		{
		  dump("this host not sedn referer "  + host + "\n");
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