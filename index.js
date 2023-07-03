//port setup
var myPort = chrome.runtime.connect({ name: 'port-from-index' });

function postStartMessage()
{
    console.log(document.getElementById('input_user_id').value);
    var message = {
        'type':'start',
        'user_id': document.getElementById('input_user_id').value
    };
    myPort.postMessage(message);
    window.close();
}


document.getElementById('btn_start').addEventListener('click',postStartMessage);
