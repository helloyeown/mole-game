var requestId;  // 화면 바뀌는 부분 저장하기 위해 사용
var html;       // 동일
var clicked = false;    // 두더지 클릭했는지 여부 확인용
var gameEnded = false;  // 게임 종료 확인 여부용
var timerId;            // 두더지 올라오는 시간 저장 용
var closeBtn = document.getElementById('closeButton');  // 닫기버튼
var audio = document.getElementById('audio');   // 배경음악
var audio2 = document.getElementById('audio2'); // 두더지 잡기 효과음
var holes = document.getElementsByClassName('hole');    // 두더지 나오는 구멍들 전체
holes = Array.prototype.slice.call(holes);
var score = document.getElementById('score');           // 현재 점수
var scoreElement = document.getElementById('score').innerHTML;              // 점수 바뀔때 사용할 용도
var bestScoreElement = document.getElementById('bestScore').innerHTML;      // 기본 bestScore
var bestScoreText = document.getElementById('final-bestScore').innerHTML;   // 모달창 bestScore
var bestScore = localStorage.getItem('bestScore');
var mode = localStorage.getItem('mode');

window.onload = function() {
    var storedBestScore = localStorage.getItem('bestScore');    // 최고점수
    score.textContent = mode + ' SCORE ' + result;
    // localStorage.removeItem('bestScore')
    
    if(storedBestScore === null || isNaN(storedBestScore)){
        storedBestScore = 0;
    }
    else{
        document.getElementById('final-bestScore').innerHTML = 'BEST SCORE : ' + storedBestScore;
        document.getElementById('bestScore').innerHTML = 'BEST SCORE : ' +  storedBestScore;
    }

};

if(bestScore === null || isNaN(bestScore)){
    bestScore = 0;
}else{
    bestScore = parseInt(bestScore);
}

function loadPage(requestId){
    if(requestId === 'GM-001'|| requestId === 'lose'){  
        html = 'index.html';    // 초기화면
    }
    else if(requestId === 'GM-002'){
        document.querySelector('#howList').classList.add('display-none');   // 설명모달
        return;
    }
    else if(requestId ==='GM-007'){
        document.querySelector('#modalPage').classList.remove('display-none');  // 게임종료모달
        return;
    }
    else if(requestId === 'GM-008'){
        html = 'gameStart.html';    // 게임시작화면
    }
    if (requestId !== 'lose') {
        localStorage.setItem('bestScore', bestScore);
    }
    location.href= html;
}

function ready(){   // 게임 준비
    requestId = 'GM-008';
    loadPage(requestId);
}

function mainPage(){    // 초기화면
    requestId = 'GM-001';
    loadPage(requestId);
}

var startClick = false;

function startGame(){   //게임 시작
    audio.currentTime = 0;
    audio.play();

    requestId = 'GM-002';
    loadPage(requestId);

    closeBtn.disabled = false;
    
    moveMole();
}

function closePage(){   // 게임종료
    clearTimeout(timerId);
    requestId = 'GM-007';
    loadPage(requestId);

    gameEnded = true;
    var modalPage = document.getElementById('modalPage');

    modalPage.classList.remove('display-none');
}

function continueGame(){    // 게임 이어하기
    gameEnded = false;

    if(result == 0){
        score.innerHTML = mode + ' SCORE ' + result;
    }
    else{
        score.textContent = mode + ' SCORE ' + result;
    }
    document.getElementById('modalPage').classList.add('display-none');
    moveMole(); 
}

function loseScore(){   // 중간에 게임종료
    bestScore = 0;
    storedBestScore = 0;
    result = 0;

    requestId = 'lose';
    loadPage(requestId);
}

function gameOver(){ // 게임오버 화면
    for (var i = 0; i < holes.length; i++) {    //두더지 클릭 못하게
        holes[i].removeEventListener('click', handleMoleClick);
    }

    gameEnded = true;

    var audio3 = new Audio('../sound/blip01.mp3');  //효과음
    audio3.play();
    clearInterval(timerId);

    requestId = 'GM-006';

    document.querySelector('#modalPage2').classList.remove('display-none');

    document.getElementById('final-score').innerHTML = mode + '<br>' + ' SCORE : '+ result;
    document.getElementById('final-bestScore').innerHTML =  'BEST SCORE : ' + bestScore;
    document.getElementById('bestScore').innerHTML =  'BEST SCORE : ' + bestScore;
}

function missMole(){    // 두더지 놓쳤을때
    clearInterval(timerId);
    var moleHole = document.getElementById(hitPosition);
    var moleImage = moleHole.querySelector('img');
    if (moleImage) {
        moleHole.removeChild(moleImage);
    }

    var moleImage = moleHole.querySelector('img');
    if (moleImage) {
        moleImage.classList.add('mole-enter'); 
    }
    setTimeout(function() {
        gameOver();
    }, 500);  
}

var result = 0;

var img = new Image();  // 두더지 이미지
img.src = "../img/mole1-removebg-preview.png";
img.width = "150";
img.height = "150";

function randomHole(mode) { // 번호 랜덤 생성
    if (mode == 'NORMAL') {
        for (var i = 0; i < holes.length; i++) {
            holes[i].innerHTML = '';
        }
    }
    
    var randomIndex = Math.floor(Math.random() * holes.length);
    var randomHole = holes[randomIndex];

    var imgElement = document.createElement('img'); // 두더지이미지
    imgElement.src = img.src; 
    imgElement.width = img.width; 
    imgElement.height = img.height;

    imgElement.style.position = 'relative';
    imgElement.style.left = '22%';
    imgElement.style.bottom = '90%';
    imgElement.classList.add("animated-image");
    imgElement.style.zIndex = '0';
    randomHole.appendChild(imgElement); 

    if (mode == 'HARD') {
        for (var i = 0; i < holes.length; i++) {
            (function(hole) {
                showMole(hole);
            })(holes[i]);
        }
    }

    hitPosition = randomHole.id;

    clicked = false;    // 두더지를 놓쳤을 경우
}

function showMole() {
    setTimeout(() => {
        // 두더지 이미지 삭제 후 다시 호출
        setTimeout(() => {
            // hole.removeChild(imgElement);
            showMole(hole); // 재귀적으로 호출하여 반복
        }, 500); // 두더지가 사라지는 시간
    }, Math.random() * 2000 + 500); // 각 구멍별로 랜덤한 시간 간격
}


function handleMoleClick(event) {   // 두더지를 클릭했을때
    if(!clicked && !gameEnded){
        var moleElement = this;
        
        if (moleElement.id == hitPosition) {    // hitPosition: 두더지가 나오는 포지션
            audio2.currentTime = 0;
            audio2.play();

            result += 100;
            score.innerHTML = mode + ' SCORE '+ result;

            if(result >= bestScore){
                bestScore = result;
                bestScoreText.innerHTML = 'BEST SCORE : ' + bestScore;
            }

            var imgElement2 = new Image();  // 두더지 클릭했을때, >< 두더지 이미지
            imgElement2.src = "../img/mole2-removebg-preview.png"; 
            imgElement2.width = "150"; 
            imgElement2.height = "150"; 
        
            imgElement2.style.position = 'relative';
            imgElement2.style.left = '22%';
            imgElement2.style.bottom = '90%';

            var currentImage = moleElement.querySelector('img');
            moleElement.removeEventListener('click', handleMoleClick);

            if (currentImage) {
                moleElement.replaceChild(imgElement2, currentImage);
                
                setTimeout(function() {
                    moleElement.removeChild(imgElement2);
                    moleElement.addEventListener('click', handleMoleClick);
                    randomHole(mode);
                }, 250);
            }

            gameEnded = false;
            clicked = true;
            moveMole();

            setTimeout(function () {
                audio2.pause();
                audio2.currentTime = 0;
            }, 450);
        }
        
    }

}

for (var i = 0; i < holes.length; i++) {
    var hole = holes[i];
    clicked = true;
    hole.addEventListener('click', handleMoleClick);
}

function moveMole() {   // 점수가 높아질수록 빨라짐
    var interval = 3000; 

    // if (result > 2000) {
    //     interval = 500; 
    // } 
    // else if (result > 1000) {
    //     interval = 1000; 
    // } 
    // else if (result > 500) {
    //     interval = 2000; 
    // }

    clearInterval(timerId);
    timerId = setInterval(function() {

    if(!clicked){
        missMole();
    }
    else{
        randomHole(mode);
    } 
    }, interval);
}