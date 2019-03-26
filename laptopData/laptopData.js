browser.runtime.sendMessage({"key": "getAllLaptopData"}).then(res => {
  let table = document.getElementById('laptopData');
  let tableBody = document.getElementById('laptopDataBody');
  let noData = document.getElementById('noData');

  if (res.length === 0) {
    table.style.display = 'none';
    noData.style.display = 'block';
  } else {
    for (let i = res.length-1; i >= 0; i--) {
      let tr = document.createElement('tr');
      let issueDate = document.createElement('td');
      let patronBC = document.createElement('td');
      let itemID = document.createElement('td');
      let powerTD = document.createElement('td');
      let mouseTD = document.createElement('td');
      let headphonesTD = document.createElement('td');
      let dvdTD = document.createElement('td');
      let power = document.createElement('input');
      let mouse = document.createElement('input');
      let headphones = document.createElement('input');
      let dvd = document.createElement('input');
      let noteTD = document.createElement('td');
      let note = document.createElement('span');
      let addNote = document.createElement('a');
      let editDelWrapper = document.createElement('div');
      let editNote = document.createElement('a');
      let editDelSpacer = document.createElement('span');
      let delNote = document.createElement('a');
      let returnDate = document.createElement('td');
      let useLen = document.createElement('td');

      function preventDefault(e){e.preventDefault()};

      function addEditNote(e) {
        e.preventDefault();
        let n = prompt('Add a note:', note.textContent || '');
        if (n) {
          browser.runtime.sendMessage({
            "key": "addLaptopNote",
            "primaryKey": res[i].primaryKey,
            "note": n
          }).then(resolve => {
            console.log("Note added!");
            addNote.style.display = 'none';
            editDelWrapper.style.display = 'block';
            note.textContent = n;
          }, reject => {
            console.error(reject.message);
          });
        } else {

        }
      }

      if (res.length-i % 2 === 1) {
        tr.classList.add('odd');
      } else {
        tr.classList.add('even');
      }

      addNote.textContent = 'add note';
      addNote.href = '#';
      addNote.addEventListener('click', addEditNote);
      editNote.textContent = 'edit';
      editNote.href = '#';
      editNote.addEventListener('click', addEditNote);
      editDelSpacer.textContent = ' | ';
      delNote.textContent = 'delete';
      delNote.href = '#';
      delNote.addEventListener('click', function(e) {
        e.preventDefault();
        let conf = confirm('Are you sure you want to delete the note "' + note.textContent + '"?');

        if (conf) {
          browser.runtime.sendMessage({
            "key": "addLaptopNote",
            "primaryKey": res[i].primaryKey,
            "note": null
          }).then(resolve => {
            console.log("Note deleted.");
            addNote.style.display = 'block';
            editDelWrapper.style.display = 'none';
            note.textContent = '';
          }, reject => {
            console.error(reject.message);
          });
        }
      });

      editDelWrapper.appendChild(editNote);
      editDelWrapper.appendChild(editDelSpacer);
      editDelWrapper.appendChild(delNote);

      powerTD.classList.add('center');
      mouseTD.classList.add('center');
      headphonesTD.classList.add('center');
      dvdTD.classList.add('center');
      power.type = "checkbox";
      power.addEventListener('click', preventDefault);
      mouse.type = "checkbox";
      mouse.addEventListener('click', preventDefault);
      headphones.type = "checkbox";
      headphones.addEventListener('click', preventDefault);
      dvd.type = "checkbox";
      dvd.addEventListener('click', preventDefault);
      issueDate.textContent = res[i].issueDate.toLocaleString();
      patronBC.textContent = res[i].patronBarcode;
      itemID.textContent = res[i].itemID;
      note.textContent = res[i].notes;
      power.checked = /^39078\d{9}$/.test(res[i].powersupply);
      mouse.checked = /^39078\d{9}$/.test(res[i].mouse);
      headphones.checked = /^39078\d{9}$/.test(res[i].headphones);
      dvd.checked = /^39078\d{9}$/.test(res[i].dvdplayer);
      if (res[i].returnDate) {
        returnDate.textContent = res[i].returnDate.toLocaleString();
      }

      powerTD.appendChild(power);
      mouseTD.appendChild(mouse);
      headphonesTD.appendChild(headphones);
      dvdTD.appendChild(dvd);
      noteTD.appendChild(note);
      if (res[i].issueDate.toLocaleDateString() === (new Date()).toLocaleDateString()) {
        noteTD.appendChild(addNote);
        noteTD.appendChild(editDelWrapper);
        if (note.textContent === '') {
          addNote.style.display = 'block';
          editDelWrapper.style.display = 'none';
        } else {
          addNote.style.display = 'none';
          editDelWrapper.style.display = 'block';
        }
      }

      let endDateTime = returnDate.textContent !== '' ? new Date(returnDate.textContent) : new Date();
      let milli = endDateTime - new Date(issueDate.textContent);
      let hr = 0;
      if (milli >= 3600000) {
        hr = Math.floor(milli / 3600000);
        milli = milli - (hr * 3600000);
      }
      let min = 0;
      if (milli >= 60000) {
        min = Math.floor(milli / 60000);
        milli = milli - (min * 60000);
      }
      let sec = 0;
      if (milli >= 1000) {
        sec = Math.floor(milli / 1000);
        milli = milli - (sec * 1000);
      }

      useLen.textContent = hr === 0 ? '00:' : hr < 9 ? '0' + hr + ':' : hr + ':';
      useLen.textContent += min === 0 ? '00:' : min < 9 ? '0' + min + ':' : min + ':';
      useLen.textContent += sec < 9 ? '0' + sec + '.' + milli : sec + '.' + milli;

      tr.appendChild(issueDate);
      tr.appendChild(patronBC);
      tr.appendChild(itemID);
      tr.appendChild(powerTD);
      tr.appendChild(mouseTD);
      tr.appendChild(headphonesTD);
      tr.appendChild(dvdTD);
      tr.appendChild(noteTD);
      tr.appendChild(returnDate);
      tr.appendChild(useLen);

      tableBody.appendChild(tr);
    }
  }
});
