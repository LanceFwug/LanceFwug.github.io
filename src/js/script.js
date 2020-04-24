function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
}

function getUrlParam(parameter, defaultvalue){
  var urlparameter = defaultvalue;
  if(window.location.href.indexOf(parameter) > -1){
    urlparameter = getUrlVars()[parameter];
    // alert("here")
  }
  return urlparameter;
}

function hashCode(str) {
  var hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function restart(nowarn) {
  var localStorage = findStorage();
  var ok = true; 
  if (!nowarn) {
    ok = confirm("Do you really want to reset progress for this session?")
  }
  if (ok) {
  	localStorage.clear();

  	var test = document.getElementById('testForm');
  	test.submit();
  }
}

function playFunc(e) {
  var localStorage = findStorage();
  let count = localStorage[e + "Count"];
  if (!count) {
  	count = 0;
  }
  count++;
  localStorage.setItem(e + "Count", count);
}

function findStorage() {
  var localStorage = null;
  try {
	  localStorage = window.localStorage;
  } catch (e) {
  	// alert("Local Storage is not available");
  }
  if (!localStorage) {
    try {
      localStorage = window.sessionStorage;
    } catch (e) {
      // alert("Session Storage is not available");
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
    // alert("Session Storage is available");
  }
  return localStorage;
}

function onLoad() {
  var localStorage = findStorage();

  // console.log(window.location);
  // var mykey = getUrlParam("key", "none");
  // // console.log(mykey);
  // if (mykey != "none") {
  //  // alert("none");
  //   return;
  // }
  // alert("test");
  // alert(getUrlParam()["key"]);
  
  if (localStorage.audio == undefined) {
    var audio = [ ['a.wav', 'a.wav'], ['a.wav', 'a.wav'] ]; 
    
    // ['33207081.wav','04735018.wav'],['72334441.wav','63351081.wav'],['88347877.wav','51715105.wav'],['83853862.wav','40856834.wav'],['51800553.wav','80071625.wav'],['56303612.wav','34235667.wav'],['03062804.wav','28617635.wav'],['42824554.wav','37767241.wav'],['32314140.wav','10266653.wav'],['84652125.wav','44581505.wav'],['43258017.wav','28273585.wav'],['65652171.wav','83248272.wav'],['85831485.wav','57264344.wav'],['26812570.wav','58385750.wav'],['20736086.wav','11187507.wav'],['26381286.wav','37682387.wav'],['73235486.wav','57600035.wav'],['06013150.wav','60244047.wav'],['73723013.wav','36234262.wav'],['65202384.wav','08118533.wav'],['48664572.wav','25115452.wav'],['57061004.wav','37374626.wav'],['36305802.wav','14146835.wav'],['83031203.wav','87373442.wav'],['54826322.wav','77312428.wav'],['76561402.wav','36563843.wav'],['16858475.wav','64551105.wav'],['64437408.wav','48375388.wav'],['26040507.wav','63001471.wav'],['07335056.wav','13633081.wav'] ];

		function shuffle(array) {
			var currentIndex = array.length, tempValue, randomIndex;
			while (currentIndex != 0) {
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;

				tempValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = tempValue;
			}

			return array;
		}

		var arr = shuffle(audio);
		localStorage.audio = JSON.stringify(arr);
		localStorage.querylen = audio.length;
		// console.log(localStorage.audio, localStorage.querylen);
	}

	document.querySelector('#counter').innerHTML = Number(localStorage.count) + ' of ' + Number(localStorage.querylen);
	var intro = document.getElementById('intro');

	if (localStorage.count == undefined) {
		localStorage.count = 0;
	}

  var resetButton = document.getElementById('restartButton');
	var startButton = document.getElementById('startButton');
	startButton.value = Number(localStorage.count) == 0 ? 'Start' : 'Next';
  // if (Number(localStorage.count) == Number(localStorage.querylen)) {
	//   startButton.value = 'Finish';
	// }

	var counter = document.getElementById('counter');

	var testTable = document.getElementById('testTable');
	var nameField = document.getElementById('nameField');
	var name = document.getElementById('name');
	var audioAField = document.getElementById('audioAField');
	var audioBField = document.getElementById('audioBField');
	var neitherField = document.getElementById('neitherField');

	var choicea = document.getElementById('a');
  var choiceb = document.getElementById('b');
  var choicec = document.getElementById('c');

	if (Number(localStorage.count) == 0) {
		testTable.hidden = false;
		nameField.hidden = false;
    name.required = true;
    audioAField.hidden = true;
		audioBField.hidden = true;
		neitherField.hidden = true;
		choicea.required = false;
		choiceb.required = false;
		choicec.required = false;
    counter.hidden = true;
    resetButton.hidden = false;
		intro.innerHTML = "Please enter your name and click START.";
	} else if (Number(localStorage.count) > 0 && Number(localStorage.count) <= Number(localStorage.querylen)) {
	  testTable.hidden = false;
    nameField.hidden = true;
    name.required = false;
		audioAField.hidden = false;
		audioBField.hidden = false;
		neitherField.hidden = false;
    choicea.required = true;
    choicea.checked = false;
    choiceb.required = true;
    choiceb.checked = false;
    choicec.required = true;
    choicec.checked = false;
    counter.hidden = false;
    resetButton.hidden = false;
		intro.innerHTML = "Listen to both audio files and choose the one that sounds best.";

	  var audioa = document.getElementById('audioa');
		var audiob = document.getElementById('audiob');

	  var audio = JSON.parse(localStorage.audio);
    audioa.src = './src/audio/' + audio[Number(localStorage.count)-1][0];
    audiob.src = './src/audio/' + audio[Number(localStorage.count)-1][1];

	  audioa.load();
	  audiob.load();
  }

  if (localStorage.status == "Finished") {
	  testTable.hidden = false;
    nameField.hidden = true;
    name.required = false;
		audioAField.hidden = true;
		audioBField.hidden = true;
		neitherField.hidden = true;
		choicea.required = false;
		choiceb.required = false;
		choicec.required = false;
    counter.hidden = true;
    intro.innerHTML = "Please send the results file to: <p><a href='mailto:lancefwug@gmail.com?Subject=Audio%20Evaluation'>lancefwug@gmail.com</a></p><p>Thank You.</p>";
    startButton.value = 'Finish';
    resetButton.hidden = true;
    localStorage.status = "Reset";
  }
  
  // document.load(); // .close();
  // document.getElementById('staticrypt-form').style.display = 'none';
  // document.getElementById('staticrypt-form').style.display = 'block';
  // document.submit();

  // if (localStorage.myvalue == "one") {
  //   var test = document.getElementById('testForm');
  //   localStorage.myvalue = "two";
  //   // test.submit();

  //   // location.reload();
  // }
}

function myEntry(ev) {
  // console.log("submit");
  // ev.preventDefault();
  // console.log("test");
  // localStorage.myvalue = "one";
  
  var name = document.getElementById('name');

  if (Number(localStorage.count) == 0) {
    localStorage.name = name.value;
    localStorage.start = Date.now();
  }

  if (localStorage.results == undefined || localStorage.results == "") {
    localStorage.results = JSON.stringify([]);
  }

  var audioa = document.getElementById('audioa');
  var audiob = document.getElementById('audiob');
  var choicea = document.getElementById('a');
  var choiceb = document.getElementById('b');

  if (Number(localStorage.count) > 0) {
    var aplay = { duration: audioa.duration };
    for (var i = 0; i < audioa.played.length; i++) {
      if (aplay["timeFrames"] == undefined) {
        aplay["timeFrames"] = [];
      }
      aplay["timeFrames"].push({start: audioa.played.start(i), end: audioa.played.end(i)});
    }

    var bplay = { duration: audiob.duration };
    for (var i = 0; i < audiob.played.length; i++) {
      if (bplay["timeFrames"] == undefined) {
        bplay["timeFrames"] = [];
      }
      bplay["timeFrames"].push({start: audiob.played.start(i), end: audiob.played.end(i)});
    }
      
    var obj = [ localStorage.start, audioa.src, localStorage.audioaCount, aplay, audiob.src, localStorage.audiobCount, bplay, choicea.checked ? "0" : choiceb.checked ? "1" : "2", localStorage.name, Date.now() ];

    var results = JSON.parse(localStorage.results);
    results.push(obj);
    localStorage.results = JSON.stringify(results);
  }

  // increase the count
  localStorage.count = Number(localStorage.count) + 1;

  localStorage.audioaCount = 0;
  localStorage.audiobCount = 0;

  // if we are at the end of the test clear the storage and write out the resutls
  if (Number(localStorage.count) > Number(localStorage.querylen)) {
    if (localStorage.status == "Reset") {
      // clear the localStorage
      // localStorage.clear();

      restart(true);
    } else {
      localStorage.status = "Finished";

      var results = JSON.parse(localStorage.results);
      results.push(hashCode(localStorage.results));
      var str = JSON.stringify(results);
      var blob = new Blob([str], {type: "application/json"});
      var url = window.URL.createObjectURL(blob);

      var downloadLink = document.createElement("a");
      downloadLink.download = "result_" + localStorage.name + "_" + Date.now() + ".txt";
      downloadLink.innerHTML = "Download File";
      downloadLink.href = url;
      // downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);

      downloadLink.click();
    }
  }
  
  if (ev) {
    ev.preventDefault();
  } else {
    onLoad();
  }
}