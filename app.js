const { settings } = require('cluster');
const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const isWin = process.platform === "win32";

function init() {
    //people model
    let pplPath = path.join(electron.remote.app.getPath('userData'), 'people.json');
    let settingsPath = path.join(electron.remote.app.getPath('userData'), 'settings.json');
    
    var ppl = {
        currentPerson: "",
        currentTurn: 0,
        nextPerson: "",
        totalPersonCount: 0,
        people: [],
        peopleRemaining: [],
        appendCurrent: _elem("current"),
        appendNext: _elem("next"),
        appendProgress: _elem("progress"),
        _getPersonIndex: function (d) {
            if (d.length == 0)
                return -1;
            var i = getRandomInt(d.length);
            return i;
        },
        _getNextPerson: function (d) {
            console.log(ppl);
            var i = ppl._getPersonIndex(d);
            var person = ppl.peopleRemaining[i];
            ppl.peopleRemaining.splice(i, 1);
            return person;
        }
    };

    //timer variables
    var individual = {
        mVal: 0,
        sVal: 0,
        appendMins: _elem("mins"),
        appendSeconds: _elem("secs")
    };

    var total = {
        mVal: 0,
        sVal: 0,
        appendMins: _elem("tmins"),
        appendSeconds: _elem("tsecs")
    };

    //UI variables
    var ui = {
        buttonNext: _elem('button-next'),
        buttonPause: _elem('button-pause'),
        buttonRestart: _elem('button-restart'),

        scrumStarted: false,
        pauseState: true,
        initText: 'Click Next to start...',
        space: '&nbsp;',
        next: 'Next',
        pause: 'Pause',
        resume: 'Resume',
        almostdone: 'Are we done yet?',
        luckylast: 'Lucky last! ',
        completed: 'Stand up is over',
        alldone: 'All Done!',
        whosnextstart: 'Who\'s next? <i>',
        whosnextend: '</i>',
    }
    ppl.appendProgress.innerHTML = ui.initText;
    ppl.appendNext.innerHTML = ui.space;


    //initi logic
    function loadData() {
        try {
            var alldata = require(pplPath);
            ppl.people = Object.values(Object.fromEntries(
                Object.entries(alldata)
                .filter(([ key, val ]) => val.include !== false)
              ));
            console.log(ppl);
            ppl.totalPersonCount = ppl.people.length;
            ppl.peopleRemaining = Array.from(ppl.people);
            ppl.peopleRemaining = randomiseArray(ppl.peopleRemaining);
        } catch (err) {
            // handle your file not found (or other error) here
        }
    }

    function randomiseArray(array){
        for(let i = array.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * i)
            const temp = array[i]
            array[i] = array[j]
            array[j] = temp
          }
        return array;
    }

    //Events
    ui.buttonNext.onclick = function () {
        if (!ui.scrumStarted)
        {
            loadData();
            startTotalTimer();
        }

        ui.buttonPause.innerHTML = ui.pause;
        ui.pauseState = false;
        pick();
        _show(ui.buttonRestart);
    }

    ui.buttonPause.onclick = function () {
        if (ui.pauseState) {
            //resume
            timer.interval = setInterval(timer.startTimer, 1000, individual);
            timer.total = setInterval(timer.startTimer, 1000, total);
            ui.buttonPause.innerHTML = ui.pause;
            ui.pauseState = !ui.pauseState;
        } else {
            pauseTimer();
            pauseTotalTimer();
            ui.buttonPause.innerHTML = ui.resume;
            ui.pauseState = !ui.pauseState;
        }

    }

    ui.buttonRestart.onclick = function () {
        //stop all timers 
        timer.resetTimer(individual, timer.interval);
        timer.resetTimer(total, timer.totalInterval);
        //reset data
        loadData();
        ppl.currentTurn = 0;
        //reset ui
        ppl.appendCurrent.innerHTML = '';
        ppl.appendProgress.innerHTML = ui.initText;
        console.log(ui.initText);

        ui.buttonPause.innerHTML = ui.pause;

        _hide(ui.buttonPause);
        _hide(ui.buttonRestart);

        ui.buttonNext.innerHTML = ui.next;
        ppl.appendNext.innerHTML = ui.space;

        ui.scrumStarted = false;
    }


    //functions
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function pick() {
        ppl.currentTurn++;
        timer.resetTimer(individual, timer.interval);
        timer.stopTimer(timer.interval);
        if (ppl.currentTurn > ppl.totalPersonCount) {
            //we stop and return because we are done!
            ppl.appendProgress.innerHTML = '';
            ppl.appendCurrent.innerHTML = ui.completed;
            ui.buttonNext.innerHTML = ui.alldone;
            _hide(ui.buttonPause);
            pauseTotalTimer();
            return;
        } else {
            _show(ui.buttonPause);

            if (ppl.currentTurn == ppl.totalPersonCount) {
                ppl.appendProgress.innerHTML = ui.luckylast;
                ui.buttonNext.innerHTML = ui.almostdone;
            } else {
                ppl.appendProgress.innerHTML = ' (' + ppl.currentTurn + '/' + ppl.totalPersonCount + ')';
                ui.buttonNext.innerHTML = ui.next;
            }
        }
        startIndividualTimer();


        if (ppl.currentTurn == 1) {
            ppl.currentPerson = ppl._getNextPerson(ppl.peopleRemaining);
        } else {
            ppl.currentPerson = ppl.nextPerson;
        }
        if (ppl.currentTurn !== ppl.totalPersonCount) {
            ppl.appendCurrent.innerHTML = (ppl.currentPerson.name.length > 35) ? ppl.currentPerson.name.substr(0,35) + '...': ppl.currentPerson.name;
            ppl.nextPerson = ppl._getNextPerson(ppl.peopleRemaining);
            let nextPerson = ppl.nextPerson.name.length > 51 ? ppl.nextPerson.name.substr(0,51) + '...': ppl.nextPerson.name;
            ppl.appendNext.innerHTML = ui.whosnextstart + nextPerson + ui.whosnextend;
        } else {
            ppl.appendCurrent.innerHTML = (ppl.currentPerson.name.length > 29) ? ppl.currentPerson.name.substr(0,29) + '...': ppl.currentPerson.name;
            ppl.appendNext.innerHTML = ui.space;
            ppl.nextPerson = '';
        }

    }

    function startIndividualTimer() {
        timer.interval = setInterval(timer.startTimer, 1000, individual);
    }

    function startTotalTimer() {
        ui.scrumStarted = true;
        timer.totalInterval = setInterval(timer.startTimer, 1000, total);
    }
    function pauseTotalTimer() {
        timer.stopTimer(timer.totalInterval);
    }

    function pauseTimer() {
        timer.stopTimer(timer.interval);
    }

    var timer = {
        interval: null,
        totalInterval: null,
        startTimer: function (obj) {
            obj.sVal++;

            if (obj.sVal < 9) {
                obj.appendSeconds.innerHTML = "0" + obj.sVal;
            }

            if (obj.sVal > 9) {
                obj.appendSeconds.innerHTML = obj.sVal;
            }

            if (obj.sVal > 59) {
                obj.mVal++;
                obj.appendMins.innerHTML = obj.mVal;
                obj.sVal = 0;
                obj.appendSeconds.innerHTML = "00";
            }
        },
        stopTimer: function (i) {
            clearInterval(i);
        },
        resumeTimer: function (i) {
            i = setInterval(timer.startTimer, 1000, i);
        },
        resetTimer: function (obj, i) {
            clearInterval(i);
            obj.mVal = 0;
            obj.sVal = 0;
            obj.appendMins.innerHTML = obj.mVal;
            obj.appendSeconds.innerHTML = obj.sVal;
        }
    }

    //dom helpers
    function _elem(name) {
        return document.getElementById(name);
    }

    function _hide(obj) {
        obj.style.display = 'none';
    }

    function _show(obj) {
        obj.style.display = 'block';
    }


    //editor
    const button = _elem('editor');
    button.addEventListener('click', () => {
        createBrowserWindow();
    });

    function createBrowserWindow() {
        var settings = require(settingsPath);
        const remote = require('electron').remote;
        const BrowserWindow = remote.BrowserWindow;
        const win = new BrowserWindow({
            height: settings.editor.height, //600
            width: settings.editor.width, //500,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                enableRemoteModule: true,
                nodeIntegration: true,
            },
            shadow: isWin,
            titleBarStyle: 'hidden',
            frame: false,
        });

        win.removeMenu();
        win.loadFile('./editor/editor.html');
        win.setAlwaysOnTop(true, 1);
        win.on('closed', function () {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            win = null
        });
        win.loadURL(__dirname + '/editor/editor.html');
    }
}