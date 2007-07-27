/*
 * Access Flickr! extension
 * Version 1.5
 * Copyright (C) 2007 Hamed Saber <hsaber@gmail.com>
 *
 * ***** BEGIN LICENSE BLOCK *****
 *   Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 * 
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Access Flickr!.
 *
 * The Initial Developer of the Original Code is
 * Hamed Saber.
 * Portions created by the Initial Developer are Copyright (C) 2007
 * the Initial Developer. All Rights Reserved.
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 * 
 * ***** END LICENSE BLOCK ***** */

// *.flickr.com is banned in Iran! We simply substitute them with other known URLs pointing to the same host!

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

var noref_domains = new Array(
	"163.com",
	"bbs.nju.edu.cn",
	"sohu.com",
	"sina.com",
	"imageshack.us"
	);

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