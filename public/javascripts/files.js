'use strict';
let path = [];
let currentDirectory;
let currentMemo;
let parentID = [];
let pathHTML;
let itemsHTML;
let memoHTML;
let memoTitle;
let memoContents;
let directory;
window.onload = main;
function main() {
  pathHTML = document.getElementById("path");
  itemsHTML = document.getElementById("items");
  memoHTML = document.getElementById("memo");
  memoTitle = document.getElementById("memo-title");
  memoContents = document.getElementById("memo-contents");
  $.ajax(location.href, {
    type: "post"
  }).done((data) => {
    directory = data;
    parentID.push(data.id);
    showDirectory();
    showPath();
  }).fail(() => {
    window.alert("Sorry.Communication with the server failed.");
  });
}
function showDirectory() {
  currentDirectory = directory;
  for(let i = 0; i < path.length; i++) {
    currentDirectory = currentDirectory.dir;
    currentDirectory = currentDirectory[path[i]];
  }
  $.ajax(location.href + "/dir/" + currentDirectory.id, {
    type: "post"
  }).done((data) => {
    currentDirectory.dir = data.dir;
    currentDirectory.memo = data.memo;
    currentDirectory.id = data.id;

    let contentsCount = 0;
    let source = "";
    for (let i in currentDirectory) {
      if (i == "dir") {
        for (let i in currentDirectory.dir) {
          source += "<a onclick=changeDirectory(" + "'" + i + "'" + "); class=folder>" + i + "</a>";
          contentsCount++;
        }
      } else if (i == "memo") {
        for (let i in currentDirectory.memo) {
          source += "<a onclick=showMemo(" + "'" + i + "'" + "); class=text>" + i + "</a>";
          contentsCount++;
        }
      }
    };
    if (contentsCount < 1) {
      source = "<div id='nocontents'>No Contents</div>";
    }
    itemsHTML.innerHTML = source;
  }).fail(() => {
    console.log("Sorry.Communication with the server failed.");
  });
}
function showPath() {
  let pathString = "";
  if (path.length < 1) {
    pathString = "/";
    $("#header > .rename")[0].style.display = "none";
    $("#header > .delete")[0].style.display = "none";
  } else {
    for (let i in path) {
      pathString += " / " + path[i];
    }
    $("#header > .rename")[0].style.display = "block";
    $("#header > .delete")[0].style.display = "block";
  }
  pathHTML.innerText = pathString;
}
function renameDirectory() {
  let newName = window.prompt("Please enter new directory name", path[path.length - 1]);
  $.ajax(location.href + "/dir/edit/" + currentDirectory.id, {
    type: "put",
    data: {
      id: parentID[parentID.length - 1],
      rename: newName
    }
  }).done(() => {
    path[path.length - 1] = newName;
    showPath();
  }).fail(() => {
    console.log("Sorry.Communication with the server failed.");
  });
}
function deleteDirectory() {
  let tmp = path[path.length - 1];
  $.ajax(location.href + "/dir/" + currentDirectory.id, {
    type: "delete",
    data: {
      id: parentID[parentID.length - 1]
    }
  }).done(() => {
    backDirectory();
    delete currentDirectory[tmp];
    showDirectory();
  });
}
function showMemo(name) {
  currentMemo = name;
  memoTitle.innerText = name;
  $.ajax(location.href + "/memo/" + currentDirectory.memo[currentMemo], {
    type: "post"
  }).done((data) => {
    memoContents.value = data;
    memoHTML.style.display = "block";
  }).fail(() => {
    console.log("Sorry.Communication with the server failed.");
  })
}
function hideMemo() {
  memoHTML.style.display = "none";
}
function renameMemo() {
  hideMemo();
  let newName = window.prompt("Please enter new Memo name", currentMemo);
  $.ajax(location.href + "/memo/edit/" + currentDirectory.memo[currentMemo], {
    type: "put",
    data: {
      id: parentID[parentID.length - 1],
      rename: newName
    }
  }).done(() => {
    currentDirectory.memo[newName] = currentDirectory.memo[currentMemo];
    delete currentDirectory.memo[currentMemo];
    showMemo(newName);
		showDirectory();
  }).fail(() => {
    console.log("Sorry.Communication with the server failed.");
  });
}
function saveMemo() {
  $.ajax(location.href + "/memo/edit/" + currentDirectory.memo[currentMemo], {
    type: "put",
    data: {
      id: currentDirectory.id,
      value: memoContents.value
    }
  }).fail(() => {
    console.log("Sorry.Communication with the server failed.");
  });
}
function deleteMemo() {
  hideMemo();
  $.ajax(location.href + "/memo/" + currentDirectory.memo[currentMemo], {
    type: "delete",
    data: {
      id: parentID[parentID.length - 1]
    }
  }).done(() => {
    delete currentDirectory.memo[currentMemo];
    showDirectory();
  }).fail(() => {
    console.log("Sorry.Communication with the server failed.");
  });
}
function changeDirectory(name) {
  path.push(name);
  showDirectory();
  showPath();
  parentID.push(currentDirectory.id);
}
function backDirectory() {
  if (parentID.length > 0) {
    parentID.pop();
  }
  if (path.length > 0) {
    path.pop();
  }
  showDirectory();
  showPath();
}
function addDirectory() {
  let newName = window.prompt("Please enter new directory name");
  $.ajax(location.href + "/dir/create", {
    type: "put",
    data: {
      id: parentID[parentID.length - 1],
      name: newName
    }
  }).done((data) => {
    currentDirectory.dir[newName] = {};
    currentDirectory.dir[newName].id = data;
    showDirectory();
  }).fail(() => {
    console.log("Sorry.Communication with the server failed.");
  });
}
function addMemo() {
  let newName = window.prompt("Please enter new memo name");
  $.ajax(location.href + "/memo/create", {
    type: "put",
    data: {
      id: parentID[parentID.length - 1],
      name: newName
    }
  }).done((data) => {
    currentDirectory.memo[newName] = data;
    showDirectory();
  }).fail(() => {
    console.log("Sorry.Communication with the server failed.");
  });
}
