app.displayDialogs = DialogModes.ERROR;
doc = app.activeDocument;
do {
  
    //POLYFILL .INCLUDES()
  if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement, fromIndex) {
        if (this == null) {
            throw new TypeError('Array.prototype.includes called on null or undefined');
        }

        var o = Object(this);
        var len = o.length >>> 0;

        if (len === 0) {
            return false;
        }

        var n = fromIndex | 0;
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        while (k < len) {
            if (o[k] === searchElement) {
                return true;
            }
            k++;
        }

        return false;
    };
  }


//indexOf polyfill
Array.prototype.indexOf = function ( item ) {
  var index = 0, length = this.length;
  for ( ; index < length; index++ ) {
    if ( this[index] === item )
    return index;
  }
  return -1;
};

  // POLYFILL FIND
  // https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    }//,
    // configurable: true,
    // writable: true
  // );
}


//start with first item selected
var selectedResult = 0;

// ACTIONSEARCH
// ============
var actionSearch = new Window("dialog");
    actionSearch.text = "ActionSearch";
    actionSearch.preferredSize.width = 300;
    actionSearch.preferredSize.height = 100;
    actionSearch.orientation = "column";
    actionSearch.alignChildren = ["center","top"];
    actionSearch.spacing = 10;
    actionSearch.margins = 16;


//gets alll action sets
    var actionSets = getActionSets();
    aryLng = actionSets.length;
    var actionsObject = new Array(aryLng);
    var allActions = [];
    var whichSet = [];
    var results = [];
    var resultSet = [];


    for(var a = 0; a < actionSets.length; a++){
      var actions = "";
      var aList = getActions(actionSets[a]);
      aryLng = aList.length;
      actionsObject[a] = new Array(aryLng+1);
      actionsObject[a][0] = actionSets[a];

      for(var z = 0; z < aList.length; z++) {
        actionsObject[a][z]=aList[z];
        actions += aList[z];
        actions += "\n";
        allActions.push(aList[z]);
        whichSet.push(actionSets[a]);
      }
    }


var searchBox = actionSearch.add('edittext {properties: {name: "searchBox"}}');
    searchBox.text = "Search String";
    searchBox.alignment = ["fill","top"];
    searchBox.active = true;

    
    var result1 = actionSearch.add("statictext", undefined, undefined, {name: "result1"});
    result1.alignment = ["fill","top"];
    var result2 = actionSearch.add("statictext", undefined, undefined, {name: "result2"});
    result2.alignment = ["fill","top"];
    var result3 = actionSearch.add("statictext", undefined, undefined, {name: "result3"});
    result3.alignment = ["fill","top"];
    actionSearch.add ("button", undefined, "OK");

    var resultTexts = [];
    resultTexts.push(result1, result2, result3);

    applyRecents();
    function applyRecents() {
      var recents = readAct();
      for (var y = 0; y < recents.length; y++) {
        results[y] = recents[y].slice(0, recents[y].indexOf("&"));
        resultSet[y] = recents[y].slice(recents[y].indexOf("&") + 1);
        
      }
    }

    ///should probably be a function to avoid being doubled
    printResults();
    function printResults(base) {
      //add function param "base" set to 0 by default, then change the below to [base], [base + 1], etc. then, in the down button key listener function, if (selected == 2){printResults(currentindex+1)}. Would also need to change the onClicks to use a variable rather than current hardcoded 0,1,2
      if (base === undefined) {
        base = 0;
      }
      result1.text = results[base + 0] + " | " + resultSet[base + 0];
      result2.text = results[base + 1] + " | " + resultSet[base + 1];
      result3.text = results[base + 2] + " | " + resultSet[base + 2];
    }
  


    //keylisterner
    actionSearch.addEventListener ("keyup", function (kd) {pressed (kd)});
    function pressed (k){

      switch (k.keyName) {
        case "Down":
        if (selectedResult < 2) {
          for (var wow = 0; wow < resultTexts.length; wow++) {
          resultTexts[wow].graphics.font = ScriptUI.newFont ("Verdana", "Regular", 12);
          }
          selectedResult++;
          resultTexts[selectedResult].graphics.font = ScriptUI.newFont ("Verdana", "Bold", 16);
        }
        break;
        
        case "Up":
        if (selectedResult > 0) {
          for (var wow = 0; wow < resultTexts.length; wow++) {
          resultTexts[wow].graphics.font = ScriptUI.newFont ("Verdana", "Regular", 12);
          }
          selectedResult--;
          resultTexts[selectedResult].graphics.font = ScriptUI.newFont ("Verdana", "Bold", 16);
        }
        break;
        

        default:

      }

    }//END KEY LISTENER

searchBox.onChanging = function () {
  try {
    //idk what the default is, so set one
    for (var wow = 0; wow < resultTexts.length; wow++) {
      resultTexts[wow].graphics.font = ScriptUI.newFont ("Verdana", "Regular", 12);
    }
    selectedResult = 0;

    var regex = searchBox.text.toLowerCase();
    if (regex == "") {
      applyRecents();
      printResults();
    } else {

    
      var y=0, x=0, z = 0;
      results = [];
      resultSet = [];
      allActions.find(function (el) {

        if ( String(el).toLowerCase().match(regex)!== null) {
          results.push(el);
          x++;
          resultSet.push(whichSet[y]);
        }
        y++;

      })
      // result1.text = results[0] + " | " + resultSet[0];
      // result2.text = results[1] + " | " + resultSet[1];
      // result3.text = results[2] + " | " + resultSet[2];
      printResults();

    }

  } catch (e) {
    alert(e);
  }
  actionSearch.layout.layout(true);
};

//RUN AS BATCH
function runBatch(actionString,actionSetString) {
  var toProcess = [];
  for (var x = 0; x < documents.length; x++) {
    toProcess[x] = documents[x];
  }
  for (var x = 0; x < toProcess.length; x++) {
    app.activeDocument = toProcess[x];
    play(actionString,actionSetString);

  }  
}


result1.onClick = function () {
  actionSearch.close();
  var modifiers = ScriptUI.environment.keyboardState;
  if (modifiers.altKey) {
      var batch = confirm("Run as batch?")
      if (batch) {
        runBatch(String(results[0]), String(resultSet[0]))
      }
  } else {
    play(String(results[0]), String(resultSet[0]));

  }
  // break main;
}
result2.onClick = function () {
  actionSearch.close();
  play(String(results[1]), String(resultSet[1]));
  // break main;
}
result3.onClick = function () {
  actionSearch.close();
  play(String(results[2]), String(resultSet[2]));
  // break main;
}

// actionSearch.onClose = function() {
//   var modifiers = ScriptUI.environment.keyboardState;
//   if (modifiers.altKey) {
//       // Action if Option/Alt is held
//       // alert("Dialog confirmed with Option/Alt key held down");
//       var batch = confirm("Run as batch?");
//       if (batch) {
//         runBatch(String(results[selectedResult]), String(resultSet[selectedResult]));
        
//       }
//   } else {
//     //change this to use selected
//     play(String(results[selectedResult]), String(resultSet[selectedResult]));

//   } 
// };

var wins = actionSearch.show();

if (wins != 1){
  break;
}

// actionSearch.onClose = function() {
  var modifiers = ScriptUI.environment.keyboardState;
  if (modifiers.altKey) {
      // Action if Option/Alt is held
      // alert("Dialog confirmed with Option/Alt key held down");
      var batch = confirm("Run as batch?");
      if (batch) {
        runBatch(String(results[selectedResult]), String(resultSet[selectedResult]));
        
      }
  } else {
    //change this to use selected
    play(String(results[selectedResult]), String(resultSet[selectedResult]));

  } 
// };



function play(action, set) {
  app.doAction(action, set);
  writeAct(action, set);
}

// WRITE ERROR
function writeAct(act, set) {
  if ($.os.search(/windows/i) != -1) {
    fileLineFeed = "Windows"
  } else {
    fileLineFeed = "Macintosh"
  }

  fileOut = new File("~/Documents/.RecentActions.txt")
  fileOut.lineFeed = fileLineFeed

  fileOut.open("r", "TEXT", "????");
  textin = fileOut.read();
  fileOut.close();
  var arr = textin.split('\n');


  var actOut = act + "&" + set;

  // if (arr.includes(actOut)) {
    // alert("here")
    var newout = arr.splice(arr.indexOf(actOut),1);
    // alert(newout + "   " + arr)
    fileOut.open("w", "TEXT", "????")
    fileOut.write(actOut + "\n" + arr[0] + "\n" + arr[1])
    fileOut.close();
    
  // }
  // if (!arr.includes(actOut)) {
  //   fileOut.open("w", "TEXT", "????")
  //   fileOut.write(actOut + "\n" + arr[0] + "\n" + arr[1])
  //   fileOut.close();
    
  // }

}

function readAct(){
  if ($.os.search(/windows/i) != -1) {
    fileLineFeed = "Windows"
  } else {
    fileLineFeed = "Macintosh"
  }

  fileOut = new File("~/Documents/.RecentActions.txt")
  fileOut.lineFeed = fileLineFeed

  fileOut.open("r", "TEXT", "????");
  textin = fileOut.read();
  fileOut.close();
  var arr = textin.split('\n');

  return arr  
}

function getActionSets() {
cTID = function(s) { return app.charIDToTypeID(s); };
sTID = function(s) { return app.stringIDToTypeID(s); };
  var i = 1;
  var sets = [];
  while (true) {
    var ref = new ActionReference();
    ref.putIndex(cTID("ASet"), i);
    var desc;
    var lvl = $.level;
    $.level = 0;
    try {
      desc = executeActionGet(ref);
    } catch (e) {
      break;    // all done
    } finally {
      $.level = lvl;
    }
    if (desc.hasKey(cTID("Nm  "))) {
      var set = {};
      set.index = i;
      set.name = desc.getString(cTID("Nm  "));
      set.toString = function() { return this.name; };
      set.count = desc.getInteger(cTID("NmbC"));
      set.actions = [];
      for (var j = 1; j <= set.count; j++) {
        var ref = new ActionReference();
        ref.putIndex(cTID('Actn'), j);
        ref.putIndex(cTID('ASet'), set.index);
        var adesc = executeActionGet(ref);
        var actName = adesc.getString(cTID('Nm  '));
        set.actions.push(actName);
      }
      sets.push(set);
    }
    i++;
  }
  return sets;
};

function getActions(aset) {
cTID = function(s) { return app.charIDToTypeID(s); };
sTID = function(s) { return app.stringIDToTypeID(s); };
  var i = 1;
  var names = [];
  if (!aset) {
    throw "Action set must be specified";
  }
  while (true) {
    var ref = new ActionReference();
    ref.putIndex(cTID("ASet"), i);
    var desc;
    try {
      desc = executeActionGet(ref);
    } catch (e) {
      break;    // all done
    }
    if (desc.hasKey(cTID("Nm  "))) {
      var name = desc.getString(cTID("Nm  "));
      if (name == aset) {
        var count = desc.getInteger(cTID("NmbC"));
        var names = [];
        for (var j = 1; j <= count; j++) {
          var ref = new ActionReference();
          ref.putIndex(cTID('Actn'), j);
          ref.putIndex(cTID('ASet'), i);
          var adesc = executeActionGet(ref);
          var actName = adesc.getString(cTID('Nm  '));
          names.push(actName);
        }
        break;
      }
    }
    i++;
  }
  return names;
};




} while (false);
