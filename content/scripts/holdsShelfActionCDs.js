"use strict";

var box = document.createElement('input'),
  boxLabel = document.createElement('label'),
  labelText = document.createElement('span'),
  parentWrapper = document.getElementById('yui-main'),
  tableNotLoaded = document.getElementById('outputscreen'),
  origTable = document.getElementById("mytab"),
  origHead,
  origBody,
  cdArray = [],
  otherArray = [];
  
  if (origTable) {
    origHead = origTable.tHead.children[0];
    origBody = origTable.tBodies[0];
    
    origHead.children[3].click();
    
    for (var i = 0; i < origHead.children.length; i++) {
      if (origHead.children[i].textContent.trim() !== "Remove") {
        origHead.children[i].addEventListener('click',function() {
          box.checked = false;
        });
      }
    }
    
    // Populate separate arrays
    for (var i = 0; i < origBody.children.length; i++) {
      if (/^CD[AJY]MS(ID)?/.test(origBody.children[i].children[2].textContent.trim().substring(0,7))) {
        cdArray.push(origBody.children[i]);
      } else {
        otherArray.push(origBody.children[i]);
      }
    }
  }

  function separateCDs() {
    if (this.checked) {
      
      cdArray.sort(function(a,b) {
        if (a.children[3].textContent.replace(/\s\s+/g, ' ') < b.children[3].textContent.replace(/\s\s+/g, ' ')) {
          return -1;
        }
        if (a.children[3].textContent.replace(/\s\s+/g, ' ') > b.children[3].textContent.replace(/\s\s+/g, ' ')) {
          return 1;
        }
        return 0;
      });
      
      otherArray.sort(function(a,b) {
        if (a.children[3].textContent.replace(/\s\s+/g, ' ') < b.children[3].textContent.replace(/\s\s+/g, ' ')) {
          return -1;
        }
        if (a.children[3].textContent.replace(/\s\s+/g, ' ') > b.children[3].textContent.replace(/\s\s+/g, ' ')) {
          return 1;
        }
        return 0;
      });
      
      origBody.textContent = "";
      
      for (var i = 0; i < otherArray.length; i++) {
        origBody.appendChild(otherArray[i]);
      }
      
      for (var i = 0; i < cdArray.length; i++) {
        origBody.appendChild(cdArray[i]);
      }
    }
  }

if (/\/cgi-bin\/koha\/reports\/holdsaction\.pl/.test(location.pathname)) {
  parentWrapper = !!parentWrapper ? parentWrapper.children[0] : null;

  if (!tableNotLoaded) {
    box.type = "checkbox";
    box.checked = false;
    box.style.verticalAlign = "middle";
    box.style.cursor = "pointer";
    box.style.margin = "0 1em 0 1.5em";
    boxLabel.style.cursor = "pointer";
    boxLabel.style.margin = "1em 0";
    boxLabel.appendChild(box);
    labelText.textContent = "Separate CDs from other hold items.";
    boxLabel.appendChild(labelText);
    parentWrapper.insertBefore(boxLabel, parentWrapper.children[1]);
    
    box.addEventListener('change', separateCDs);
  }
}