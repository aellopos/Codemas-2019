//tímto si odchytíme canvas z HTML
let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
let width = 1000;
let height = 600;
let friction = 0.8;
let gravity = 0.3;
let keys = [];
let platforms = [];
let presents = [];
let gingerbreads = [];
let spikes = [];
let exit = [];

let game = {
    introduction: document.querySelector("#introduction"),
    startButton: document.querySelector("#start"),
    canvas: document.querySelector("#canvas"),
    presentScoreElement: document.querySelector("#presentScore"),
    gingerbreadScoreElement: document.querySelector("#gingerbreadScore"),
    lifeElement: document.querySelector("#lifeCount"),
    timeElement: document.querySelector("#time"),
    deadEnd: document.querySelector("#dead-end"),
    end: document.querySelector("#end"),
    result: document.querySelector("#result"),
    endButton: document.querySelector("#again2"),
    endButtonDead: document.querySelector("#again"),
    music: document.querySelector("#music"),
    collectedSound: document.querySelector("#collected"),
    lifeDownSound: document.querySelector("#life-down"),
    gingerbreadScore: 0,
    presentScore: 0,
    time: 0,
    formatedTime: 0
};

//vytvoření herního objektu hráče
let player = {
    //x a y nastavíme tak, aby se nám hráč zobrazil dole uprostřed stránky
    x: width / 2,
    y: height - 30,
    width: 30,
    height: 30,
    speed: 4,
    velX: 0,
    velY: 0,
    jumping: false,
    grounded: false,
    life: 3
};

//vytvoříme si obrázek pro hráče
let hero = new Image();
hero.src = "obrazky/elf_left.png";

//vytvořáme si obrázek pro plošinu
let platformImage = new Image();
platformImage.src = "obrazky/platform.png";

let spike = new Image();
spike.src = "obrazky/spike.png";

let present = new Image();
present.src = "obrazky/present.png";

let gingerbread = new Image();
gingerbread.src = "obrazky/gingerbread.png";

let portal = new Image();
portal.src = "obrazky/portal.png";

//přidáme canvasu šířku a výšku
canvas.width = width;
canvas.height = height;

//funkce na vytvoření portálu
function createExit() {
    // exit
    exit.push({
        x: 850,
        y: 567,
        width: 30,
        height: 30
    });
}

//funkce na vytvoření plošin
function createPlatforms() {
    //leva strana
    platforms.push({
        x: 0,
        y: 0,
        width: 0,
        height: height
    });
    //spodni strana
    platforms.push({
        x: 0,
        y: height - 2,
        width: width,
        height: 51
    });
    //prava strana
    platforms.push({
        x: width - 3,
        y: 0,
        width: 0,
        height: height
    });

    platforms.push({
        x: 100,
        y: 520,
        width: 150,
        height: 15
    });

    platforms.push({
        x: 850,
        y: 520,
        width: 150,
        height: 15
    });

    platforms.push({
        x: 700,
        y: 440,
        width: 200,
        height: 15
    });

    platforms.push({
        x: 850,
        y: 360,
        width: 100,
        height: 15
    });

    platforms.push({
        x: 300,
        y: 440,
        width: 350,
        height: 15
    });


    platforms.push({
        x: 100,
        y: 360,
        width: 350,
        height: 15
    });

    platforms.push({
        x: 700,
        y: 360,
        width: 100,
        height: 15
    });

    platforms.push({
        x: 600,
        y: 280,
        width: 150,
        height: 15
    });

    platforms.push({
        x: 150,
        y: 280,
        width: 250,
        height: 15
    });

    platforms.push({
        x: 800,
        y: 200,
        width: 150,
        height: 15
    });
    platforms.push({
        x: 0,
        y: 200,
        width: 150,
        height: 15
    });

    platforms.push({
        x: 150,
        y: 120,
        width: 650,
        height: 15
    });
}

//funkce na vytvoření perníčk§
function createGingerbreads() {
    gingerbreads.push({
        x: 750,
        y: 410,
        width: 30,
        height: 30
    });

    gingerbreads.push({
        x: 670,
        y: 250,
        width: 30,
        height: 30
    });
}

//funkce na vytvoření dárků
function createPresents() {
    presents.push({
        x: 150,
        y: 250,
        width: 30,
        height: 30
    });

    presents.push({
        x: 450,
        y: 90,
        width: 30,
        height: 30
    });
}

//funkce na vytvoření překážek
function createSpikes() {
    spikes.push({
        x: 710,
        y: 410,
        width: 30,
        height: 30
    });

    spikes.push({
        x: 250,
        y: 90,
        width: 30,
        height: 30
    });

    spikes.push({
        x: 650,
        y: 90,
        width: 30,
        height: 30
    });

    spikes.push({
        x: 870,
        y: 170,
        width: 30,
        height: 30
    });

    spikes.push({
        x: 250,
        y: 250,
        width: 30,
        height: 30
    });
}

function showTime() {
    // z celkového počtu  vteřin spočítáme minutes a vteřiny
    let minutes = Math.floor(game.time / 60);
    let seconds = Math.round(game.time - minutes * 60);

    // spočítané minutes a vteřiny převedeme na formát mm:ss
    let formatedTime =
        ("00" + minutes).slice(-2) + ":" + ("00" + seconds).slice(-2);

    // naformátovaný čas vypíšeme na obrazovku
    game.timeElement.textContent = formatedTime;
    game.formatedTime = formatedTime;
}

// provádí pravidelný odpočet času
function updateTime() {
    // přidáme k času 1/50 vteřiny
    game.time = game.time + 0.02;

    // zobrazíme aktualizovaný čas
    showTime();
}

// první funkce, která se spustí po načtení stránky, spustí úvodní okno
function introduction() {
    changeWindow("introduction");

    game.startButton.addEventListener("click", startGame);
}

function resetGame() {
    // reset skóre
    game.gingerbreadScore = 0;
    game.presentScore = 0;
    // reset životů
    player.life = 3;
    // reset času
    game.time = 0;
    // reset rychlosti pohybu
    player.velX = 0;
    player.velY = 0;
    // reset informačních prvků v hlavičce hry
    game.gingerbreadScoreElement.textContent = `${game.gingerbreadScore}/2`;
    game.presentScoreElement.textContent = `${game.presentScore}/2`;
    game.lifeElement.innerHTML = `${player.life}/3`;
    // reset pozice hráče
    player.x = width / 2;
    player.y = height - 30;

    // reset objektů
    exit.splice(0, 1);

    for (var i = 0; i < presents.length; i++) {
        presents.splice(i, 1);
    }

    for (var i = 0; i < gingerbreads.length; i++) {
        gingerbreads.splice(i, 1);
    }

    for (var i = 0; i < platforms.length; i++) {
        platforms.splice(i, 1);
    }
}

// funkce, která přepne stránku na hru a spustí neustále opakující se funkci update
function startGame() {
    resetGame();

    createPlatforms();
    createSpikes();
    createPresents();
    createGingerbreads();
    createExit();

    game.music.play();

    changeWindow("game");
    update();
}

// funkce, která přepíná okna
function changeWindow(name) {
    // nejprve všechny obrazovky skryjeme
    game.introduction.style = "none"; // úvod
    game.canvas.style.visibility = "hidden"; // herní plocha
    game.deadEnd.style = "none"; // závěrečná obrazovka při smrti
    game.end.style = "none"; // závěrečná obr.

    // podle parametru zobrazíme příslušnou obrazovku
    if (name === "introduction") {
        // úvod je flexbox, nastavíme na flex
        game.introduction.style.display = "flex";
    } else if (name === "game") {
        // herní plocha je blokový prvek, nastavíme na block
        game.canvas.style.visibility = "visible";
    } else if (name === "deadEnd") {
        // závěrečná obr. je stejně jako úvod flexbox, takže nastavíme na flex
        game.deadEnd.style.display = "flex";
    } else if (name === "end") {
        // závěrečná obr. je stejně jako úvod flexbox, takže nastavíme na flex
        game.end.style.display = "flex";
    }
}

//funkce na vykreslení plošin
function drawPlatforms() {
    for (var i = 0; i < platforms.length; i++) {
        ctx.drawImage(
            platformImage,
            platforms[i].x,
            platforms[i].y,
            platforms[i].width,
            platforms[i].height
        );

        let dir = platformColCheck(player, platforms[i]);

        if (dir === "l" || dir === "r") {
            player.velX = 0;
            player.jumping = false;
        } else if (dir === "b") {
            player.jumping = false;
            player.grounded = true;
        } else if (dir === "t") {
            player.velY *= -1;
        }
    }
}

//funkce, která bude vykreslovat hlavní objekty, aktualizovat čas atd.
function update() {
    //volaní funkce pro pohyb
    movement();
    drawPlatforms();
    drawSpikes();
    drawItems();
    //Kontrola sbírání perníčků a dárečků
    colItems();
    colSpikes();

    updateTime();

    if (player.life < 1) {
        changeWindow("deadEnd");

        game.endButtonDead.addEventListener("click", startGame);
    }

    if (game.gingerbreadScore >= 2 && game.presentScore >= 2) {
        drawExit();
        exitCheck();
    }

    ctx.drawImage(hero, player.x, player.y, player.width, player.height);

    if (player.life > 0 && !exitCheck()) {
        requestAnimationFrame(update);
    }
}

//funkce, která vykresluje perníčky a dárečky
function drawItems() {
    for (var i = 0; i < presents.length; i++) {
        ctx.drawImage(
            present,
            presents[i].x,
            presents[i].y,
            presents[i].width,
            presents[i].height
        );
    }

    for (var i = 0; i < gingerbreads.length; i++) {
        ctx.drawImage(
            gingerbread,
            gingerbreads[i].x,
            gingerbreads[i].y,
            gingerbreads[i].width,
            gingerbreads[i].height
        );
    }
}

function drawExit() {
    for (var i = 0; i < exit.length; i++) {
        ctx.drawImage(
            portal,
            exit[i].x,
            exit[i].y,
            exit[i].width,
            exit[i].height);
    }
}

function increaseScore(type) {

    if (type === "gingerbread") {
        // zvětšíme o 1
        game.gingerbreadScore++;
        // vypíšeme do prvku v hlavičce hry
        game.gingerbreadScoreElement.textContent = `${game.gingerbreadScore}/2`;
    }

    if (type === "present") {
        // zvětšíme o 1
        game.presentScore++;
        // vypíšeme do prvku v hlavičce hry
        game.presentScoreElement.textContent = `${game.presentScore}/2`;
    }
}

//funkce, která vykresluje překážky
function drawSpikes() {
    for (var i = 0; i < spikes.length; i++) {
        ctx.drawImage(
            spike,
            spikes[i].x,
            spikes[i].y,
            spikes[i].width,
            spikes[i].height);
    }
}


function platformColCheck(player, platform) {
    // získáme vektory
    let vX = player.x + player.width / 2 - (platform.x + platform.width / 2);
    let vY = player.y + player.height / 2 - (platform.y + platform.height / 2);

    let hWidths = player.width / 2 + platform.width / 2;
    let hHeights = player.height / 2 + platform.height / 2;
    let colDir = null;

    // pomocí porovnávání zjistíme, z jaké strany naše postava na plošinu naráží
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        let oX = hWidths - Math.abs(vX);
        let oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                player.y += oY;
            } else {
                colDir = "b";
                player.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                player.x += oX;
            } else {
                colDir = "r";
                player.x -= oX;
            }
        }
    }
    return colDir;
}

//funkce, která kontroluje sběr dárečků a preníčků
function colItems() {
    for (let index = 0; index < presents.length; index++) {
        if (objectColCheck(player, presents[index])) {
            presents.splice(index, 1);

            increaseScore("present");

            game.collectedSound.play();
        }
    }

    for (let index = 0; index < gingerbreads.length; index++) {
        if (objectColCheck(player, gingerbreads[index])) {
            gingerbreads.splice(index, 1);

            increaseScore("gingerbread");

            game.collectedSound.play();
        }
    }
}

function colSpikes() {
    for (let index = 0; index < spikes.length; index++) {
        if (objectColCheck(player, spikes[index])) {
            player.life--;

            game.lifeDownSound.play();

            game.lifeElement.innerHTML = `${player.life}/3`;

            resetPlayer();
        }
    }
}

function exitCheck() {
    for (let index = 0; index < exit.length; index++) {
        if (objectColCheck(player, exit[index]) && (game.gingerbreadScore >= 2 && game.presentScore >= 2)) {
            changeWindow("end");

            result.textContent = `stihl jsi to ve skvělém čase - ${game.formatedTime}`;
            game.endButton.addEventListener("click", startGame);

            return true;
        }
    }

    return false;
}

function resetPlayer() {
    player.x = width / 2;
    player.y = height - 30;
}

function objectColCheck(player, obj) {
    if (
        player.x + player.width < obj.x ||
        obj.x + obj.width < player.x ||
        player.y + player.height < obj.y ||
        obj.y + obj.height < player.y
    ) {
        return false;
    } else {
        return true;
    }
}

function movement() {
    //pravá šipka
    if (keys[39]) {
        if (player.velX < player.speed) {
            player.velX++;
        }

        hero.src = "obrazky/elf_right.png";
    }
    //levá šipka
    if (keys[37]) {
        if (player.velX > -player.speed) {
            player.velX--;
        }

        hero.src = "obrazky/elf_left.png";
    }

    if (keys[38] || keys[32]) {
        // šipka nahoru nebo mezerník
        if (!player.jumping && player.grounded) {
            player.jumping = true;
            player.grounded = false;
            player.velY = -player.speed * 2;
        }
    }

    //přidání tření
    player.velX *= friction;
    //přidání gracitace
    player.velY += gravity;

    //pohyb hráče
    player.x += player.velX;
    player.y += player.velY;

    if (player.grounded) {
        player.velY = 0;
    }

    //Smazaní objektu 
    ctx.clearRect(0, 0, width, height);

    player.grounded = false;
}

//poslouchače pro práci s klávesami
document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});

//poslouchač, který čeká na načtení stránky, jakmile se stránka načte, spustí se funkce update
window.addEventListener("load", introduction);