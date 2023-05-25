document.addEventListener('DOMContentLoaded', function() {
    // スタイルシート定義
    var style = document.createElement('style');
    style.innerHTML = `
    #nn_edit {
    width: 100%;
    height: auto;
    }
    #nn_menu {
    font-size: 12px;
    display: table;
    border: 1px solid #ccc;
    padding: 8px 10px 0;
    background: #fff;
    text-align: left;
    height: 20px;
    margin-bottom: 1em;
    }
    #nn_menu a {
    color:#333;
    }
    .nn_win_box {
    padding: 10px;
    font-size: 16px;
    }
    `;
    document.body.appendChild(style);

    // 全HTML要素にdata-nnnoを追加
    var count = 0;
    function addDataAttribute(element) {
        if (element.nodeName != 'BR') {
            element.dataset.nnno = 'custom-value-' + count;
            count ++;
        }
        var children = element.children;
        for (var i = 0; i < children.length; i++) {
            addDataAttribute(children[i]);
        }
    }
    var allElements = document.querySelectorAll('body *');
    for (var i = 0; i < allElements.length; i++) {
        addDataAttribute(allElements[i]);
    }

    // p, h1, h2, h3, h4, h5, spanにテキストエディット用イベント追加
    function addEditText(element) {
        console.log(element);

        if (!element.length) {
            console.log('SET:'+element);
            element.addEventListener('mouseover', pOver, false);
        } else {
            var children = element.children;
            console.log('IN:'+children[j]);
            for (var j = 0; j < children.length; j++) {
                addEditText(children[j]);
            }
        }
    }
    var items = document.querySelectorAll('p, h1, h2, h3, h4, h5, span');
    for (var i = 0; i < items.length; i++) {
        if (!items[i].children.length) {
            items[i].addEventListener('mouseover', pOver, false);
        } else {
            var child = items[i].children;
            for (var j = 0; j < child.length; j++) {
                var ng = 0;
                console.log(child[j].children);
                if (child[j].tagName != 'A' && child[j].tagName != 'BR' && child[j].tagName != 'SPAN') {
                    ng = 1;
                } else {
                    var child2 = child[j].children;
                    for (var jj = 0; jj < child2.length; jj++) {
                        if (child2[jj].tagName != 'A' && child2[jj].tagName != 'BR' && child2[jj].tagName != 'SPAN') {
                            ng = 1;
                        }
                    }
                }
            }
            if (!ng) {
                items[i].addEventListener('mouseover', pOver, false);
            }
        }
    }

    // Aタグを無効化
    var items = document.querySelectorAll('a');
    for (var i = 0; i < items.length; i++) {
        items[i].removeAttribute('href');
    }

    // Frame設定
    const jsFrame = new JSFrame();
    // const frames = [];
    const frame = jsFrame.create({
        name: `Win`,
        title: `NNCOM EDIT MENU`,
        left: 20 + 320, top: 50, width: 320, height: 120, minWidth: 200, minHeight: 110,
        appearanceName: 'Win10 style',

        style: {
            backgroundColor: 'rgba(255,255,255,0.9)',
            overflow:'auto',
        },
        html: '<div id="nn_win_default" class="nn_win_box">編集する要素を選択してください。</div>' +
        '<div id="nn_win_pedit" class="nn_win_box" style="display:none;">編集した内容を保存するか、元に戻すか最後に選択してください。<br><br><a href="javascript: nn_menu_save();">SAVE</a>｜<a href="javascript: nn_menu_close();">CANCEL</a></div>'
    }).show();
    frame.setControl({
        styleDisplay:'inline',
        maximizeButton: 'zoomButton',
        demaximizeButton: 'dezoomButton',
        minimizeButton: 'minimizeButton',
        deminimizeButton: 'deminimizeButton',
        hideButton: 'closeButton',
        animation: true,
        animationDuration: 150,

    });
    frame.hideFrameComponent('closeButton');
    frame.control.on('hid', (frame, info) => {
        frame.closeFrame();
    });
    var elm = document.getElementById(frame.htmlElement.parent.htmlElement.parent.parentCanvas.parentElement.id);
    elm.style.zIndex = 99999;
});

function pOver(e) {
    if (e.target.style.cssText) e.target.dataset.defstyle = e.target.style.cssText;
    e.target.style.boxShadow = '0 0 8px gray';
    e.target.style.cursor = 'copy';
    e.target.addEventListener('click', pEdit, false);
    e.target.addEventListener('mouseout', pOut, false);

}
function pOut(e) {
    if (e.target.contentEditable != true) {
        if (e.target.dataset.defstyle) {
            e.target.style.cssText = e.target.dataset.defstyle;
        } else {
            var a = e.target;
            a.removeAttribute('style');
        }
        delete e.target.dataset.defstyle;
        delete e.target.style.cursor;
    }
}
function pEdit(e) {
    var pedit = document.getElementById('nn_win_pedit');
    if (pedit.dataset.editon && e.target.id != 'nn_edit') {
        var elm = document.getElementById('nn_edit');
        elm.addEventListener('mouseover', pOver, false);
        elm.innerHTML = elm.dataset.defhtml;
        delete elm.dataset.defhtml;
        nn_menu_cancel(elm);
    }
    pedit.style.display = 'block';
    pedit.dataset.editon = 1;
    document.getElementById('nn_win_default').style.display = 'none';

    if (e.target.id) e.target.dataset.defid = e.target.id;
    e.target.id = 'nn_edit';
    e.target.dataset.defhtml = e.target.innerHTML;
    e.srcElement.style.boxShadow = '2px 2px 4px';
    e.target.removeEventListener('mouseout', pOut);
    e.target.removeEventListener('click', pEdit);
    e.target.removeEventListener('mouseover', pOver);
    e.target.contentEditable = true;

    // var ne = document.createElement('div');
    // ne.setAttribute('id', 'nn_menu');

    // var elm = document.getElementById('nn_edit').parentElement;
    // elm.insertBefore(ne, document.getElementById('nn_edit'));

    // var elm = document.getElementById('nn_menu');
    // elm.innerHTML = 'MENU｜<a href="javascript: nn_menu_save();">SAVE</a>｜<a href="javascript: nn_menu_close();">CANCEL</a>';
}

function nn_menu_save() {
    var elm = document.getElementById('nn_edit');
    elm.addEventListener('mouseover', pOver, false);
    var edit = {
        'nnno': elm.dataset.nnno,
        'html': elm.innerHTML
    };

    nn_menu_cancel(elm);
}

function nn_menu_close() {
    var elm = document.getElementById('nn_edit');
    elm.addEventListener('mouseover', pOver, false);
    elm.innerHTML = elm.dataset.defhtml;
    delete elm.dataset.defhtml;
    nn_menu_cancel(elm);
}

function nn_menu_cancel(elm) {
    elm.removeAttribute('contentEditable');
    delete elm.style.cursor;
    elm.style.cssText = elm.dataset.defstyle;
    delete elm.dataset.defstyle;

    if (elm.dataset.defid) {
        elm.id = elm.dataset.defid;
        delete elm.dataset.defid;
    } else {
        elm.removeAttribute('id');
    }
    document.getElementById('nn_win_default').style.display = 'block';
    document.getElementById('nn_win_pedit').style.display = 'none';
    delete document.getElementById('nn_win_pedit').dataset.editon;
}

// 未使用
function get_doctype() {
  let doctype = "";
  if(document.doctype){
    doctype += "<!DOCTYPE HTML";
    if(document.doctype.publicId){
      doctype += ' PUBLIC "'+document.doctype.publicId+'"';
    }
    if(document.doctype.systemId){
      doctype += ' "'+document.doctype.systemId+'"';
    }
    doctype += ">";
  }
  return doctype;
}
