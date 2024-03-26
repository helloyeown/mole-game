var requestId;
var html ;
var mode;

function loadPage(requestId){

    if(requestId === 'GM-001'){
        html = 'index.html';
    }
    else if(requestId === 'GM-002'){
        html = 'gameStart.html';
    }
    else if(requestId ==='GM-007'){
        document.querySelector('#modalPage').classList.remove('display-none');
        return;
    }
    else if(requestId === 'GM-008'){
        html = 'gameStart.html';
    }

    location.href= html;
}

function mainPage(){
    requestId = 'GM-001';
    loadPage(requestId);
}

function ready(difficulty){
    mode = difficulty;

    localStorage.setItem('mode', mode);

    requestId = 'GM-008';
    loadPage(requestId);
}