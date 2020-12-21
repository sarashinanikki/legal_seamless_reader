window.onload = load;

function load() {
    setEvent();

    chrome.storage.local.get('setting', function (item) {
        console.log(item);
        if (Object.keys(item).length) {
            const setting = item['setting'];
            if (setting === 'ON') {
                sioriON();
            }
            else if (setting === 'OFF') {
                sioriOFF();
            }
        }
        else {
            sioriON();
            updateSetting();
        }
    });
}

function sioriON() {
    var sioriONRadio = document.getElementById('sioriON');
    sioriONRadio.setAttribute("checked", '');
}

function sioriOFF() {
    var sioriOFFRadio = document.getElementById('sioriOFF');
    sioriOFFRadio.setAttribute("checked", '');
}

function updateSetting(param) {
    chrome.storage.local.set({'setting': param}, function() {
        console.log(`set ${param}`);
    });
}

function setEvent() {
    var sioriONRadio = document.getElementById('sioriON');
    var sioriOFFRadio = document.getElementById('sioriOFF');

    sioriONRadio.addEventListener('click', function () { updateSetting('ON'); }, false);
    sioriOFFRadio.addEventListener('click', function () { updateSetting('OFF'); }, false);
}