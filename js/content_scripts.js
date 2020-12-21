var blocked = false;
var novelId;

window.onload = function () {
    setReadLaterButton();
};

// 後で読む機能
function setReadLaterButton() {
    const urlElements = location.href.split('/');
    if (urlElements.length < 5) {
        return;
    }
    var novelId = '';
    novelId = urlElements[3];
    const url = 'https://ncode.syosetu.com/${novelId}/';
    var contents1 = document.getElementsByClassName('contents1')[0];
    var headNav = document.getElementById('head_nav');

    var title = '';
    if (urlElements.length === 5) {
        title = document.getElementsByClassName('novel_title')[0].textContent;
    }
    else if (urlElements.length === 6) {
        title = contents1.getElementsByTagName('a')[0].textContent;
    }

    var laterButton = document.createElement('a');
    laterButton.id = 'later-button';
    laterButton.href = '#';
    laterButton.innerHTML = '「後で読む」に追加';
    laterButton.addEventListener('click', function() {
        var entity = {};
        const date = new Date();
        entity['$'+novelId] = {
            "title": title,
            "url": url,
            "number": 0,
            "date": date.getTime()
        }
        console.log(entity);
        chrome.storage.local.set(entity, function () {
            console.log('readLaterList updated!');
            chrome.runtime.sendMessage({ message: "readLater"}, function (res) {
            });
            myAlert();
        });
    });
    headNav.appendChild(laterButton);
}

function myAlert() {
    var body = document.querySelector('body');
    var dialog = document.createElement('div');
    dialog.id = 'my-alert'
    var message = document.createElement('p');
    message.className = 'alert-message';
    message.innerHTML = '登録されました';
    var check = document.createElement('img');
    check.className = 'checkmark';
    check.src = chrome.runtime.getURL('images/checkmark.png');
    dialog.appendChild(check);
    dialog.appendChild(message);
    body.appendChild(dialog);

    setTimeout(function() {
        body.removeChild(dialog);
    }, 3000);
}

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
    if (req.message === 'novelId') {
        const url = location.href;
        var urlElements = url.split('/');
        var response = '';
        if (urlElements.length >= 5) {
            response = urlElements[3];
        }
        sendResponse(response);
    }
    return true
})
