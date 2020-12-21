var blocked = false;
var novelId;

window.onload = function () {
    updateSiori();
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
    const url = `https://ncode.syosetu.com/${novelId}/`;
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
            setModal();
        });
    });
    headNav.appendChild(laterButton);
}


function setModal() {
    var body = document.querySelector('body');
    var modal = document.createElement('div');
    const modalHtml =  `<div class="modal js-modal">
                            <div class="modal__bg js-modal-close"></div>
                            <div class="modal__content">
                                <p>登録が完了しました</p>
                                <a class="js-modal-close" href="#">閉じる</a>
                            </div><!--modal__inner-->
                        </div><!--modal-->`;

    modal.innerHTML = modalHtml;
    body.appendChild(modal);

    $(function(){
        $('.js-modal').fadeIn();
        $('.js-modal-close').on('click', function() {
            $('.js-modal').fadeOut();
        });
    });
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
});

// しおり自動更新
function updateSiori() {
    const sioriButton = document.getElementsByName("siori_url")[0];
    if (sioriButton) {
        chrome.storage.local.get('setting', function (item) {
            console.log(item['setting']);
            if (!Object.keys(item).length || item['setting'] === 'ON') {
                sioriButton.click();
            }
        });
    }
}
