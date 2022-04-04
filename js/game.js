var gameRunsOnMobileDevice;
detectMobileDeviceOrDesktop();

var canvasDefaultWidth = 420;
var canvasDefaultHeight = 550;
var canvasWidth;
var canvasHeight;
initCanvasSize();
var canvasBackgroundColor = "darkgrey";

var gameStatus = "info"; // Possible values: "info", "in game", "pause", "restart", "game over"
var maxPlayerLife = 3;
var actualPlayerLife = maxPlayerLife;
var actualLevel = 1;
var maxLevel = 3;
var score = 0;
var hitPoint = 10;

var messages;
var scorePrefix;
var levelPrefix;
var livesPrefix;
initMessagesAndPrefixes();

var aboutMeActualIndex = 0;
var actualMessage = messages.infos;
var textMarginTopAndBottom = canvasHeight * 0.05;
var textFontSize = 10;
var lineSpace = 3;
var textColor = "#333333";
let separatorSign = "=";
var separatorString = "";

var columns = 5;
var defaultRows = 3;
var actualRows = defaultRows;
var maxRows = 5;
var gap = canvasWidth * 0.05;
var brickWidth = (canvasWidth - gap) / columns - gap;
var brickHeight = ( (canvasHeight - gap) / maxRows - gap ) * 0.4;
var normalBrickColor = "#4f9563";
var infoBrickColor = "#e81010";
var marginTopBricks = textMarginTopAndBottom + textFontSize + gap * 1.4;
var marginLeft = canvasWidth * 0.05;
var marginRight = canvasWidth * 0.05;
var bricks = [];
var infoBrickIndexes = [];

var paddleDefaultWidth = canvasWidth * 0.25;
var paddleDefaultHeight = 10;
var paddleColor = "#2b2b82";
var paddleMarginBottom = textMarginTopAndBottom * 2 + gap * 1.5;
var paddleDefaultStepSize = 4;
var leftArrow = false;
var rightArrow = false;

var ballRadius = 6;
var defaultBallSpeed = 3;
var ballColor = "#703d75";

const CANVAS_CONTAINER = document.querySelector("#canvas-container");
const GAME_CANVAS = document.createElement("canvas");
GAME_CANVAS.setAttribute("id", "break-out-scene");
GAME_CANVAS.width = canvasWidth;
GAME_CANVAS.height = canvasHeight;
GAME_CANVAS.style.backgroundColor = canvasBackgroundColor;
CANVAS_CONTAINER.appendChild(GAME_CANVAS);
const CANVAS_CONTEXT = GAME_CANVAS.getContext("2d");

initSeparatorString();

var paddle = {
    xPos: GAME_CANVAS.width/2 - paddleDefaultWidth/2,
    yPos: GAME_CANVAS.height - paddleDefaultHeight - paddleMarginBottom,
    width: paddleDefaultWidth,
    height: paddleDefaultHeight,
    stepSize: paddleDefaultStepSize
};

var ball = {
    xPos: GAME_CANVAS.width / 2,
    yPos: paddle.yPos - ballRadius,
    radius: ballRadius,
    speed: defaultBallSpeed,
    xStepSize: defaultBallSpeed * getRandomNumber(),
    yStepSize: defaultBallSpeed * -1
};

function detectMobileDeviceOrDesktop() {
    // Detect if the browser runs on mobile device or desktop:
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        gameRunsOnMobileDevice = true;
    } else {
        gameRunsOnMobileDevice = false;
    }
}

function initCanvasSize() {
    let gameContainer = document.getElementsByClassName("game-container")[0];
    let style = gameContainer.currentStyle || window.getComputedStyle(gameContainer);
    let paddingLeft = parseInt((style.paddingLeft).replace("p",""));

    let testDatas = document.createElement("p");
    testDatas.textContent = "window.innerWidth: " + window.innerWidth + ", window.innerHeight: " + window.innerHeight + ", paddingLeft: " + paddingLeft;
    document.getElementsByClassName("back-to-main-screen")[0].appendChild(testDatas);
    
    if (window.innerWidth < canvasDefaultWidth + paddingLeft*2) {
        canvasWidth = window.innerWidth - paddingLeft*2;
    } else {
        canvasWidth = canvasDefaultWidth - paddingLeft*2;
    }
    if (window.innerHeight < canvasDefaultHeight ) {
        canvasHeight = window.innerHeight;
    } else {
        canvasHeight = canvasDefaultHeight;
    }
}

function initMessagesAndPrefixes() {
    let lang = document.getElementsByTagName('html')[0].getAttribute('lang'); 
    let infoText;
    let winText;
    let loseText;
    if (lang === "hu") {
        if (gameRunsOnMobileDevice) {
            infoText = "A játék irányításához használd a játéktér alatti gombokat.";
            winText = "Nyertél, gratulálok! Nyomd meg az Új játék gombot az újrakezdéshez, vagy térj vissza a főoldalra.";
            loseText = "Játék vége. Köszönöm a próbálkozást. Nyomd meg az Új játék gombot az újrakezdéshez.";
        } else {
            infoText = "Mozgatás: balra és jobbra nyíl. Játék indítása: S, szünet: P, vissza az elejére: B.";
            winText = "Nyertél, gratulálok! Nyomd meg a B gombot az újrakezdéshez, vagy térj vissza a főoldalra.";
            loseText = "Játék vége. Köszönöm a próbálkozást. Nyomd meg a B gombot az újrakezdéshez.";
        }

        messages = {
            infos: infoText,
            aboutMe: ["Első számítógépem egy Commodore Plus/4 volt. A szüleimtől kaptam 1987 karácsonyán.",
                    'A kedvenc Bud Spencer–Terence Hill-filmem az "...és megint dühbe jövünk".',
                    "A Quake 2-t ötször játszottam végig.",
                    "Kedvenc rockzenekarok: Queen, Pink Floyd, Omega.",
                    "Szabadidőmben egy gyerekeknek szóló nyelvtani oktatóprogramon dolgozom.",
                    "Egyebek mellett írtam egy horrorregényt, amit a Magvető Kiadó jelentetett meg 2012-ben."],
            win: winText,
            lose: loseText
        };
        scorePrefix = "Pont";
        levelPrefix = "Szint";
        livesPrefix = "Élet";
    } else if (lang === "en") {
        if (gameRunsOnMobileDevice) {
            infoText = "Use the buttons below to control the game.";
            winText = "You win! Congratulations! Please, press New Game button to start again.";
            loseText = "Game over. Please, press New Game button to start again.";
        } else {
            infoText = "Move: left and right arrow. Start game: S, pause: P, back to the beginning: B.";
            winText = "You win! Congratulations! Please, press B to start again.";
            loseText = "Game over. Please, press B to start again.";
        }
        messages = {
            infos: infoText,
            aboutMe: ["My first computer was a Commodore Plus/4. My parents gave it to me at Christmas 1987.",
                    'My favourite Bud Spencer & Terence Hill movie is "Odds and Evens".',
                    "I played through Quake 2 five times.",
                    "Favourite rock bands: Queen, Pink Floyd, Omega.",
                    "My pet project is a grammar training software.",
                    "I wrote a horror novel that was published by Magvető Kiadó in 2012."],
            win: winText,
            lose: loseText
        };
        scorePrefix = "Score";
        levelPrefix = "Level";
        livesPrefix = "Lives";
    }
}

function initSeparatorString() {
    let separatorSignLength = CANVAS_CONTEXT.measureText(separatorSign).width;
    for (let index = 0; index < (canvasWidth/separatorSignLength); index++) {
        separatorString = separatorString + separatorSign;
    }
}

function createBricks() {
    for (let rowIndex = 0; rowIndex < actualRows; rowIndex++) {
        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
            let newBrick = {
                xPos: marginLeft + columnIndex * (brickWidth + gap),
                yPos: marginTopBricks + rowIndex * (brickHeight + gap),
                unharmed: true
            };
            bricks.push(newBrick);
        }
    }
    
    infoBrickIndexes = [];
    if (Math.random() > 0.5 ) {
        infoBrickIndexes.push(1);
        infoBrickIndexes.push(3);
    } else {
        infoBrickIndexes.push(0);
        infoBrickIndexes.push(4);
    }
}

createBricks();

function clearCanvas() {
    CANVAS_CONTEXT.clearRect(0, 0, canvasWidth, canvasHeight);
}

function drawBricks() {
     for (let [index, brick] of bricks.entries()) {
        drawBrick(index, brick);
     };
}

function drawBrick(index, brick) {
    let color;
    if (infoBrickIndexes.includes(index)) {
        color = infoBrickColor;
    } else {
        color = normalBrickColor;
    }
    if (brick.unharmed) {
        CANVAS_CONTEXT.fillStyle = color;
        CANVAS_CONTEXT.fillRect(brick.xPos, brick.yPos, brickWidth, brickHeight);
    }
}

function resetBricks() {
    bricks = [];
    infoBrickIndexes = [];
    createBricks();
}

function drawPaddle() {
    CANVAS_CONTEXT.fillStyle = paddleColor;
    CANVAS_CONTEXT.fillRect(paddle.xPos, paddle.yPos, paddle.width, paddle.height);
}

function resetPaddle() {
    paddle.xPos = GAME_CANVAS.width/2 - paddleDefaultWidth/2,
    paddle.yPos =  GAME_CANVAS.height - paddleDefaultHeight - paddleMarginBottom,
    paddle.width = paddleDefaultWidth,
    paddle.height = paddleDefaultHeight,
    paddle.stepSize = paddleDefaultStepSize;
}

function drawBall() {
    CANVAS_CONTEXT.beginPath();
    CANVAS_CONTEXT.arc(ball.xPos, ball.yPos, ball.radius, 0, 2 * Math.PI);
    CANVAS_CONTEXT.fillStyle = ballColor;
    CANVAS_CONTEXT.fill();
    CANVAS_CONTEXT.closePath();
}

function moveBall() {
    ball.xPos = ball.xPos + ball.xStepSize;
    ball.yPos = ball.yPos + ball.yStepSize;
}

function resetBall(gameIsOver) {
    ball.xPos = GAME_CANVAS.width/2;
    ball.yPos = paddle.yPos - ballRadius;
    if (gameIsOver) {
        ball.speed = defaultBallSpeed;
    }
    ball.xStepSize = ball.speed * getRandomNumber();
    ball.yStepSize = ball.speed * -1;
}

function resetGame(){
    gameStatus = "info";
    actualMessage = messages.infos;
    aboutMeActualIndex = 0;
    actualRows = defaultRows;
    resetBricks();
    resetPaddle();
    resetBall(true);
    actualPlayerLife = maxPlayerLife;
    actualLevel = 1;
    score = 0;
}

function gameOver(result) {
    gameStatus = "game over";
    resetBall(true);
    if (result == "win") {
        actualMessage = messages.win;
    } else if (result == "lose") {
        actualMessage = messages.lose;
    }
}

function checkLevelUp() {
    let everyBrickBroken = true;
    for (let brick of bricks) {
        if (brick.unharmed) {
            everyBrickBroken = false;
            break;
        }
    }
    if (everyBrickBroken) {
        levelUp();
    }
}

function levelUp() {
    actualLevel = actualLevel + 1;
    if (actualLevel > maxLevel) {
        gameOver("win");
    } else {
        actualRows = actualRows + 1;
        paddle.width = paddle.width - paddleDefaultWidth * 0.2;
        ball.speed = ball.speed + 0.75;
        resetBricks();
        resetBall(false);
    }
}

function checkBallWallCollision() {
    if ( (ball.xPos + ball.radius) > GAME_CANVAS.width || (ball.xPos - ball.radius) < 0 ) {
        ball.xStepSize = ball.xStepSize * -1;
    }
    if ( ball.yPos - ball.radius < textMarginTopAndBottom * 2) {
        ball.yStepSize = ball.yStepSize * -1;
    }
    if ( ball.yPos + ball.radius > GAME_CANVAS.height - textMarginTopAndBottom * 2 - textFontSize*0.5) {
        actualPlayerLife = actualPlayerLife - 1;
        if (actualPlayerLife < 1) {
            gameOver("lose");
        } else {
            resetBall(false);
        }
    }
}

function checkBallPaddleCollision() {
    if (ball.yPos + ball.radius > paddle.yPos &&
        ball.yPos - ball.radius < paddle.yPos + paddle.height &&
        ball.xPos + ball.radius > paddle.xPos &&
        ball.xPos - ball.radius < paddle.xPos + paddle.width) {
            let collisionPoint = ( ball.xPos - (paddle.xPos + paddle.width / 2) ) / (paddle.width / 2);
            let angle = collisionPoint * (Math.PI / 3);
            ball.xStepSize = ball.speed * Math.sin(angle);
            ball.yStepSize = ball.speed * Math.cos(angle) * -1;
    }
}

function checkBallBrickCollision() {
    for (let [index, brick] of bricks.entries()){
        if (brick.unharmed) {
            if (ball.xPos + ball.radius > brick.xPos &&
                ball.xPos - ball.radius < brick.xPos + brickWidth &&
                ball.yPos + ball.radius > brick.yPos &&
                ball.yPos - ball.radius < brick.yPos + brickHeight) {
                    brick.unharmed = false;
                    
                    if ( collisionOnBottom(brick) && collisionOnLeft(brick) ) {
                        if ( ball.xPos + ball.radius - brick.xPos > brick.yPos + brickHeight - (ball.yPos - ball.radius) ) {
                            ball.yStepSize = ball.yStepSize * -1;
                        } else {
                            ball.xStepSize = ball.xStepSize * -1;
                        }
                    } else if (collisionOnTop(brick) && collisionOnLeft(brick)) {
                        if ( ball.xPos + ball.radius - brick.xPos > ball.yPos + ball.radius - brick.yPos ) {
                            ball.yStepSize = ball.yStepSize * -1;
                        } else {
                            ball.xStepSize = ball.xStepSize * -1;
                        }
                    } else if (collisionOnBottom(brick) && collisionOnRight(brick)) {
                        if ( brick.xPos + brickWidth - (ball.xPos - ball.radius) > brick.yPos + brickHeight - (ball.yPos - ball.radius) ) {
                            ball.yStepSize = ball.yStepSize * -1;
                        } else {
                            ball.xStepSize = ball.xStepSize * -1;
                        }
                    } else if (collisionOnTop(brick) && collisionOnRight(brick)) {
                        if ( brick.xPos + brickWidth - (ball.xPos - ball.radius) > ball.yPos + ball.radius - brick.yPos ) {
                            ball.yStepSize = ball.yStepSize * -1;
                        } else {
                            ball.xStepSize = ball.xStepSize * -1;
                        }
                    } else if ( collisionOnTop(brick) || collisionOnBottom(brick) ) {
                        ball.yStepSize = ball.yStepSize * -1;
                    } else if ( collisionOnLeft(brick) || collisionOnRight(brick) ) {
                        ball.xStepSize = ball.xStepSize * -1;
                    }

                    score = score + hitPoint;
                    if (infoBrickIndexes.includes(index)) {
                        actualMessage = messages.aboutMe[aboutMeActualIndex];
                        if (aboutMeActualIndex < messages.aboutMe.length - 1) {
                            aboutMeActualIndex++;
                        }
                    }
                    checkLevelUp();
            }
        }
    };
}

function collisionOnTop(brick) {
    return brick.yPos > ball.yPos - ball.radius && brick.yPos < ball.yPos + ball.radius;
}

function collisionOnBottom(brick) {
    return  brick.yPos + brickHeight < ball.yPos + ball.radius && brick.yPos + brickHeight > ball.yPos - ball.radius;
}

function collisionOnLeft(brick) {
    return brick.xPos > ball.xPos - ball.radius && brick.xPos < ball.xPos + ball.radius;
}

function collisionOnRight(brick) {
    return brick.xPos + brickWidth > ball.xPos - ball.radius && brick.xPos + brickWidth < ball.xPos + ball.radius;
}

function getRandomNumber() {
    return Math.random() * 2 - 1;
}

function showText(text, textXPos, textYPos) {
    CANVAS_CONTEXT.fillStyle = textColor;
    var fontStyle = textFontSize.toString() + "px 'Press Start 2P'";
    CANVAS_CONTEXT.font = fontStyle;
    CANVAS_CONTEXT.fillText(text, textXPos, textYPos);
}

function showGameStats() {
    let scoreString = scorePrefix + ": " + score.toString();
    showText(scoreString, marginLeft, textMarginTopAndBottom);
    let levelString = levelPrefix + ": " + actualLevel.toString();
    let levelStringLength = CANVAS_CONTEXT.measureText(levelString).width;
    showText(levelString, canvasWidth/2 - levelStringLength/2, textMarginTopAndBottom);
    let lifeString = livesPrefix + ": " + actualPlayerLife.toString();
    let lifeStringLength = CANVAS_CONTEXT.measureText(lifeString).width;
    showText(lifeString, canvasWidth - marginRight - lifeStringLength, textMarginTopAndBottom);
    showText(separatorString, 0, textMarginTopAndBottom * 2 );
}

function showMessages() {
    let message = actualMessage;
    let textLength = CANVAS_CONTEXT.measureText(message).width + marginLeft + marginRight;
    if (textLength > canvasWidth) {
        let words = message.split(" ");
        let textRows = [];
        let textRow = "";
        for (let index = 0; index < words.length; index++){
            if (CANVAS_CONTEXT.measureText(textRow).width + CANVAS_CONTEXT.measureText(words[index]).width + marginLeft + marginRight < canvasWidth){
                if (textRow.length > 0) {
                    textRow = textRow + " " + words[index];
                } else {
                    textRow = words[index];
                }
            } else {
                textRows.push(textRow);
                textRow = words[index];
            }
            if (index + 1 >= words.length) {
                textRows.push(textRow);
            }
        }
        for (let rowIndex = 0; rowIndex < textRows.length; rowIndex++) {
            let rowLength = CANVAS_CONTEXT.measureText(textRows[rowIndex]).width;
            showText(textRows[rowIndex], GAME_CANVAS.width/2 - rowLength/2, canvasHeight - textMarginTopAndBottom * (0.5*textRows.length) + rowIndex*(textFontSize + lineSpace));
        }
    } else {
        showText(message, GAME_CANVAS.width/2 - textLength/2 + marginLeft, canvasHeight - textMarginTopAndBottom);
    }

    showText(separatorString, 0, GAME_CANVAS.height - textMarginTopAndBottom * 2 );
}

function initControl() {
    if (gameRunsOnMobileDevice) {
        document.getElementById("game-button-container").style.display = "block";
    
        document.getElementById("left-btn").addEventListener("touchstart", function(event){
            event.preventDefault();
            leftArrow = true;
        });
    
        document.getElementById("right-btn").addEventListener("touchstart", function(event){
            event.preventDefault();
            rightArrow = true;
        });
    
        document.getElementById("start-btn").addEventListener("click", function(event){
            event.preventDefault();
            gameStatus = "in game";
        });
    
        document.getElementById("pause").addEventListener("click", function(event){
            event.preventDefault();
            if (gameStatus == "pause") {
                gameStatus = "in game";
            } else {
                gameStatus = "pause";
            }
        });
    
        document.getElementById("new-game").addEventListener("click", function(event){
            event.preventDefault();
            resetGame();
        });
    
        document.getElementById("left-btn").addEventListener("touchend", function(event){
            event.preventDefault();
            leftArrow = false;
        });
    
        document.getElementById("right-btn").addEventListener("touchend", function(event){
            event.preventDefault();
            rightArrow = false;
        });
    } else {
        document.getElementById("game-button-container").style.display = "none";
    
        document.addEventListener("keydown", function(event){
            if (event.key == "ArrowLeft"){
                event.preventDefault();
                leftArrow = true;
            } else if (event.key == "ArrowRight"){
                event.preventDefault();
                rightArrow = true;
            } else if (event.key == "S" || event.key == "s") {
                gameStatus = "in game";
            } else if (event.key == "B" || event.key == "b") {
                resetGame();
            } else if (event.key == "P" || event.key == "p") {
                if (gameStatus == "pause") {
                    gameStatus = "in game";
                } else {
                    gameStatus = "pause";
                }
            }
        });
        
        document.addEventListener("keyup", function(event){
            if (event.key == "ArrowLeft"){
                event.preventDefault();
                leftArrow = false;
            } else if (event.key == "ArrowRight"){
                event.preventDefault();
                rightArrow = false;
            }
        })
    }
}

function movePaddle() {
    if (leftArrow && (paddle.xPos > 0)){
        paddle.xPos = paddle.xPos - paddle.stepSize;
    } else if (rightArrow && ((paddle.xPos + paddle.width) < GAME_CANVAS.width)) {
        paddle.xPos = paddle.xPos + paddle.stepSize;
    }
}

function draw() {
    drawPaddle();
    if (gameStatus != "game over") {
        drawBall();
    }
    drawBricks();
    showGameStats();
    showMessages();
}

function update(){
    if (gameStatus != "pause") {
        movePaddle();
    }
    if (gameStatus != "info" && gameStatus != "pause" && gameStatus != "game over") {
        moveBall();
    }
    checkBallWallCollision();
    checkBallPaddleCollision();
    checkBallBrickCollision();
}

function loop() {
    clearCanvas();
    draw();
    update();
    requestAnimationFrame(loop);
}

window.onload = function() {
    let testDatas = document.createElement("p");
    testDatas.textContent = "GAME_CANVAS.width: " + GAME_CANVAS.width + ", GAME_CANVAS.height: " + GAME_CANVAS.height;
    document.getElementsByClassName("back-to-main-screen")[0].appendChild(testDatas);
    
    loop();
    initControl();
}