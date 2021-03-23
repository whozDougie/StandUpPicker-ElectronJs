const electron = require('electron');
const path = require('path');
var fs = require("fs");


function init() {
    let pplPath = path.join(electron.remote.app.getPath('userData'), 'people.json');
    var data;
    var total = 0;
    var buttonCancel = _elem('button-cancel');
    var buttonSave = _elem('button-save');
    var buttonAdd = _elem('button-add');
    var inputNewName = _elem('newName');

    buttonCancel.onclick = function () {
        cancel();
    };

    buttonAdd.onclick = function () {
        var newName = _elem('newName');
        if (newName.value.length == 0)
            return;
        total++;
        addnewrow(newName.value);
        newName.value = '';
    };

    buttonSave.onclick = function () {
        try {
            var b = _elem('tbody');
            var rows = b.childNodes;
            var newdata = [];

            for (var i = 1; i <= total; i++) {
                var n = _elem('nameof' + i);
                var incl = _elem('includeof' + i);
                if (n) {
                    var ndrow = {
                        name: n.innerText,
                        include: incl.checked
                    };
                    newdata.push(ndrow);
                }
            }

            data = newdata;
            console.log(data);
            var processedData = JSON.stringify(data);
            savedata(processedData);
            alert('Saved Successfully\nNote: Restart this app for changes to take effect.');
        }
        catch (e) {
            alert('Failed to save: ' + e);
        }
    };

    inputNewName.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            buttonAdd.click();
        }
    });

    function addnewrow(name, isIncluded = true) {
        try {
            var b = _elem('tbody');
            var rowtemplate = '<tr id="' + total + '">' +
                '<td><div class="button6 deleteBtn smallBtn left" id="delete" onclick="deleterow(' + total + ');">Delete</div></td>' +
                '<td>' + total + '</td>' +
                '<td id="nameof' + total + '">' + name + '</td>' +
                '<td><input id="includeof' + total + '" type="checkbox" ' + (isIncluded ? 'checked' : '') + '></td>' +
                '</tr>';
            b.innerHTML = rowtemplate + b.innerHTML;
        }
        catch (e) {
            console.debug(e);
        }
    }

    function clearallrows() {
        var b = _elem('tbody');
        console.log(b);
        b.innerHTML = '';
    }

    function cancel() {
        var window = electron.remote.getCurrentWindow();
        window.close();
    }

    
    function load() {

        data = [];
        try {           
            console.log('Getting people from: '+ pplPath);
            data = require(pplPath);
            clearallrows();
            total = 0;
            data.forEach(function (d) {
                total++;
                addnewrow(d.name, d.include);
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    function savedata(d) {
        write_file(pplPath, d);
    }

    function write_file(path, output) {
        fs.writeFileSync(path, output);
    }

    function fileExists(path) {
        let r = false;
        try {
            if (fs.existsSync(path)) {
                return true;
            }
        } catch (err) {
            console.error(err)
        }
        return r;
    }

    load();
}

function deleterow(name) {
    _elem(name).remove();
}
function _elem(name) {
    return document.getElementById(name);
}


