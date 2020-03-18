function findStorage() {
  var localStorage = null;
  try {
	  localStorage = window.localStorage;
  } catch (e) {
  	alert("Local Storage is not available");
  }
  if (!localStorage) {
    try {
      localStorage = window.sessionStorage;
    } catch (e) {
      alert("Session Storage is not available");
    }
  }

  if (!localStorage) {
    if (window.myStorage == null) {
      window.myStorage = {};
      window.myStorage.clear = function () {
      	this.audio = null;
      	this.count = null;
      	this.queryLen = null;
      }
    }
    localStorage = window.myStorage;
  } else {
    alert("Session Storage is available");
  }
  return localStorage;
}

function onLoad() {
  var localStorage = findStorage();

}