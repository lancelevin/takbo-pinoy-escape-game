const BOARD_SIZE = 8;

const ENEMY_MOVE_INTERVAL = 2;


/*
  MAP

  # = Wall
  P = Player
  N = Nanay
  D = Tatay
  A = Ate
  K = Key
  E = Exit
  F = Food
  M = Money
*/


const levels = [

  {
    introTitle:
      "Hala! Gising si Nanay!",

    introDescription:
      "Hanapin ang susi at lumabas bago ka maabutan ng tsinelas.",

    map: [
      "########",
      "#P..F..#",
      "#.#.#..#",
      "#...#K.#",
      "#.#....#",
      "#..M.#.#",
      "#..N..E#",
      "########"
    ]
  },


  {
    introTitle:
      "Nandito Rin si Tatay?!",

    introDescription:
      "Dalawa na sila. Kunin ang susi at huwag magpa-corner.",

    map: [
      "########",
      "#P.#..F#",
      "#..#.#.#",
      "#M...#K#",
      "##.#...#",
      "#..N.#.#",
      "#.D...E#",
      "########"
    ]
  },


  {
    introTitle:
      "HALA KA! SI ATE ISUSUMBONG KA NA RIN!",

    introDescription:
      "Nanay, Tatay, at Ate na ang humahabol. Wala nang kakampi. TAKBO!",

    map: [
      "########",
      "#P.F...#",
      "#..#..N#",
      "#......#",
      "#M.#..K#",
      "#..D...#",
      "#A..F.E#",
      "########"
    ]
  }

];


/* ===========================
   DOM
   =========================== */

const titleScreen =
  document.getElementById("title-screen");

const startGameButton =
  document.getElementById("start-game-btn");

const levelIntro =
  document.getElementById("level-intro");

const introLevel =
  document.getElementById("intro-level");

const introTitle =
  document.getElementById("intro-title");

const introDescription =
  document.getElementById("intro-description");

const beginLevelButton =
  document.getElementById("begin-level-btn");

const gameBoard =
  document.getElementById("game-board");

const levelElement =
  document.getElementById("level");

const movesElement =
  document.getElementById("moves");

const scoreElement =
  document.getElementById("score");

const timerElement =
  document.getElementById("timer");

const objectiveText =
  document.getElementById("objective-text");

const keyStatusElement =
  document.getElementById("key-status");

const collectibleStatusElement =
  document.getElementById("collectible-status");

const alertText =
  document.getElementById("alert-text");

const restartButton =
  document.getElementById("restart-btn");

const homeButton =
  document.getElementById("home-btn");

const resultModal =
  document.getElementById("result-modal");

const modalIcon =
  document.getElementById("modal-icon");

const modalEyebrow =
  document.getElementById("modal-eyebrow");

const modalTitle =
  document.getElementById("modal-title");

const modalMessage =
  document.getElementById("modal-message");

const finalMoves =
  document.getElementById("final-moves");

const finalScore =
  document.getElementById("final-score");

const finalTime =
  document.getElementById("final-time");

const modalButton =
  document.getElementById("modal-btn");


/* ===========================
   STATE
   =========================== */

let currentLevel = 0;

let map = [];

let player = {
  row: 0,
  col: 0
};

let exitPosition = {
  row: 0,
  col: 0
};

let momEnemies = [];
let dadEnemies = [];
let ateEnemies = [];

let keyCollected = false;

let moves = 0;
let score = 0;

let collectiblesCollected = 0;
let totalCollectibles = 0;

let seconds = 0;

let timerInterval = null;
let timerStarted = false;

let gameOver = false;
let levelCompleted = false;
let levelStarted = false;


/* ===========================
   START
   =========================== */

function startGame() {

  score = 0;

  currentLevel = 0;

  titleScreen.classList.add(
    "hidden"
  );

  prepareLevel(
    currentLevel
  );
}


/* ===========================
   PREPARE LEVEL
   =========================== */

function prepareLevel(levelIndex) {

  currentLevel =
    levelIndex;

  levelStarted =
    false;

  loadLevelData();

  showLevelIntro();
}


/* ===========================
   INTRO
   =========================== */

function showLevelIntro() {

  const data =
    levels[currentLevel];

  introLevel.textContent =
    `LEVEL ${currentLevel + 1}`;

  introTitle.textContent =
    data.introTitle;

  introDescription.textContent =
    data.introDescription;

  levelIntro.classList.remove(
    "hidden"
  );
}


function beginLevel() {

  levelIntro.classList.add(
    "hidden"
  );

  levelStarted =
    true;

  updateUI();

  renderBoard();
}


/* ===========================
   LOAD LEVEL
   =========================== */

function loadLevelData() {

  stopTimer();

  moves = 0;

  seconds = 0;

  timerStarted = false;

  keyCollected = false;

  collectiblesCollected = 0;

  gameOver = false;

  levelCompleted = false;

  momEnemies = [];

  dadEnemies = [];

  ateEnemies = [];

  totalCollectibles = 0;

  exitPosition = {
    row: 0,
    col: 0
  };

  map =
    levels[currentLevel]
      .map
      .map(
        row =>
          row.split("")
      );

  scanMap();

  resultModal.classList.add(
    "hidden"
  );

  updateUI();

  renderBoard();
}


/* ===========================
   SCAN MAP
   =========================== */

function scanMap() {

  for (
    let row = 0;
    row < BOARD_SIZE;
    row++
  ) {

    for (
      let col = 0;
      col < BOARD_SIZE;
      col++
    ) {

      const tile =
        map[row][col];


      if (tile === "P") {

        player = {
          row,
          col
        };

        map[row][col] =
          ".";
      }


      if (tile === "N") {

        momEnemies.push({
          row,
          col
        });

        map[row][col] =
          ".";
      }


      if (tile === "D") {

        dadEnemies.push({
          row,
          col
        });

        map[row][col] =
          ".";
      }


      if (tile === "A") {

        ateEnemies.push({
          row,
          col
        });

        map[row][col] =
          ".";
      }


      if (tile === "E") {

        exitPosition = {
          row,
          col
        };
      }


      if (
        tile === "F" ||
        tile === "M"
      ) {

        totalCollectibles++;
      }

    }

  }

}


/* ===========================
   IMAGE CREATOR
   =========================== */

function createImage(
  src,
  className,
  alt = ""
) {

  const img =
    document.createElement(
      "img"
    );

  img.src =
    src;

  img.className =
    `entity-image ${className}`;

  img.alt =
    alt;

  img.draggable =
    false;

  return img;
}


/* ===========================
   RENDER BOARD
   =========================== */

function renderBoard() {

  gameBoard.innerHTML =
    "";


  for (
    let row = 0;
    row < BOARD_SIZE;
    row++
  ) {

    for (
      let col = 0;
      col < BOARD_SIZE;
      col++
    ) {

      const tile =
        document.createElement(
          "div"
        );

      tile.classList.add(
        "tile"
      );

      const value =
        map[row][col];


      /* WALL */

      if (
        value === "#"
      ) {

        tile.classList.add(
          "wall"
        );
      }


      /* KEY */

      if (
        value === "K"
      ) {

        tile.classList.add(
          "key"
        );

        tile.appendChild(
          createImage(
            "assets/key.png",
            "key-sprite",
            "Susi"
          )
        );
      }


      /* FOOD */

      if (
        value === "F"
      ) {

        tile.classList.add(
          "collectible"
        );

        tile.appendChild(
          createImage(
            "assets/food.png",
            "food-sprite",
            "Pagkain"
          )
        );
      }


      /* MONEY */

      if (
        value === "M"
      ) {

        tile.classList.add(
          "collectible"
        );

        tile.appendChild(
          createImage(
            "assets/money.png",
            "money-sprite",
            "Baon"
          )
        );
      }


      /* EXIT */

      if (
        row ===
          exitPosition.row &&
        col ===
          exitPosition.col
      ) {

        tile.classList.add(
          "exit"
        );


        if (
          !keyCollected
        ) {

          tile.classList.add(
            "locked-exit"
          );
        }


        tile.appendChild(
          createImage(
            "assets/door.png",
            "door-sprite",
            "Pinto"
          )
        );
      }


      /* NANAY */

      const momHere =
        momEnemies.some(
          enemy =>
            enemy.row === row &&
            enemy.col === col
        );


      if (
        momHere
      ) {

        tile.innerHTML =
          "";

        tile.classList.add(
          "enemy"
        );

        tile.appendChild(
          createImage(
            "assets/mom-chasing.png",
            "mom-sprite",
            "Nanay"
          )
        );
      }


      /* TATAY */

      const dadHere =
        dadEnemies.some(
          enemy =>
            enemy.row === row &&
            enemy.col === col
        );


      if (
        dadHere
      ) {

        tile.innerHTML =
          "";

        tile.classList.add(
          "dad"
        );

        tile.appendChild(
          createImage(
            "assets/dad-chasing.png",
            "dad-sprite",
            "Tatay"
          )
        );
      }


      /* ATE */

      const ateHere =
        ateEnemies.some(
          enemy =>
            enemy.row === row &&
            enemy.col === col
        );


      if (
        ateHere
      ) {

        tile.innerHTML =
          "";

        tile.classList.add(
          "ate"
        );

        tile.appendChild(
          createImage(
            "assets/ate-chasing.png",
            "ate-sprite",
            "Ate"
          )
        );
      }


      /* PLAYER */

      if (
        player.row === row &&
        player.col === col
      ) {

        tile.innerHTML =
          "";

        tile.classList.add(
          "player"
        );

        tile.appendChild(
          createImage(
            "assets/player-running.png",
            "player-sprite",
            "Ikaw"
          )
        );
      }


      gameBoard.appendChild(
        tile
      );

    }

  }

}


/* ===========================
   PLAYER MOVEMENT
   =========================== */

function movePlayer(
  rowChange,
  colChange
) {

  if (
    !levelStarted ||
    gameOver ||
    levelCompleted
  ) {

    return;
  }


  startTimer();


  const newRow =
    player.row +
    rowChange;

  const newCol =
    player.col +
    colChange;


  if (
    !canPlayerMoveTo(
      newRow,
      newCol
    )
  ) {

    return;
  }


  player.row =
    newRow;

  player.col =
    newCol;

  moves++;


  handlePlayerTile();


  checkEnemyCollision();


  if (
    gameOver
  ) {

    updateUI();

    renderBoard();

    return;
  }


  checkExit();


  if (
    levelCompleted
  ) {

    return;
  }


  if (
    moves %
      ENEMY_MOVE_INTERVAL ===
    0
  ) {

    moveAllEnemies();

    checkEnemyCollision();
  }


  updateUI();

  renderBoard();
}


/* ===========================
   PLAYER VALIDATION
   =========================== */

function canPlayerMoveTo(
  row,
  col
) {

  if (
    row < 0 ||
    row >= BOARD_SIZE ||
    col < 0 ||
    col >= BOARD_SIZE
  ) {

    return false;
  }


  return (
    map[row][col] !== "#"
  );
}


/* ===========================
   PLAYER TILE EVENTS
   =========================== */

function handlePlayerTile() {

  const value =
    map[player.row]
      [player.col];


  if (
    value === "K"
  ) {

    keyCollected =
      true;

    score +=
      150;

    map[player.row]
      [player.col] =
      ".";
  }


  if (
    value === "F"
  ) {

    collectiblesCollected++;

    score +=
      75;

    map[player.row]
      [player.col] =
      ".";
  }


  if (
    value === "M"
  ) {

    collectiblesCollected++;

    score +=
      100;

    map[player.row]
      [player.col] =
      ".";
  }

}


/* ===========================
   EXIT
   =========================== */

function checkExit() {

  const atDoor =
    player.row ===
      exitPosition.row &&
    player.col ===
      exitPosition.col;


  if (
    !atDoor ||
    !keyCollected
  ) {

    return;
  }


  completeLevel();
}


/* ===========================
   ENEMY MOVEMENT
   =========================== */

function moveAllEnemies() {

  momEnemies =
    moveEnemyGroup(
      momEnemies,
      [
        ...dadEnemies,
        ...ateEnemies
      ]
    );


  dadEnemies =
    moveEnemyGroup(
      dadEnemies,
      [
        ...momEnemies,
        ...ateEnemies
      ]
    );


  ateEnemies =
    moveEnemyGroup(
      ateEnemies,
      [
        ...momEnemies,
        ...dadEnemies
      ]
    );

}


/* ===========================
   ENEMY AI
   =========================== */

function moveEnemyGroup(
  enemies,
  otherEnemies
) {

  const occupied =
    new Set();


  for (
    const enemy
    of otherEnemies
  ) {

    occupied.add(
      `${enemy.row},${enemy.col}`
    );
  }


  for (
    const enemy
    of enemies
  ) {

    occupied.add(
      `${enemy.row},${enemy.col}`
    );
  }


  return enemies.map(
    enemy => {

      occupied.delete(
        `${enemy.row},${enemy.col}`
      );


      const options = [

        {
          row: -1,
          col: 0
        },

        {
          row: 1,
          col: 0
        },

        {
          row: 0,
          col: -1
        },

        {
          row: 0,
          col: 1
        }

      ];


      const valid =
        options.filter(
          move => {

            const targetRow =
              enemy.row +
              move.row;

            const targetCol =
              enemy.col +
              move.col;


            return (

              canEnemyMoveTo(
                targetRow,
                targetCol
              )

              &&

              !occupied.has(
                `${targetRow},${targetCol}`
              )

            );

          }
        );


      if (
        valid.length === 0
      ) {

        occupied.add(
          `${enemy.row},${enemy.col}`
        );

        return enemy;
      }


      valid.sort(
        (a, b) => {

          const aDistance =
            distanceToPlayer(
              enemy.row +
                a.row,
              enemy.col +
                a.col
            );


          const bDistance =
            distanceToPlayer(
              enemy.row +
                b.row,
              enemy.col +
                b.col
            );


          return (
            aDistance -
            bDistance
          );

        }
      );


      const move =
        valid[0];


      const newEnemy = {

        row:
          enemy.row +
          move.row,

        col:
          enemy.col +
          move.col

      };


      occupied.add(
        `${newEnemy.row},${newEnemy.col}`
      );


      return newEnemy;

    }
  );

}


/* ===========================
   ENEMY VALIDATION
   =========================== */

function canEnemyMoveTo(
  row,
  col
) {

  if (
    row < 0 ||
    row >= BOARD_SIZE ||
    col < 0 ||
    col >= BOARD_SIZE
  ) {

    return false;
  }


  if (
    map[row][col] === "#"
  ) {

    return false;
  }


  if (
    map[row][col] === "K"
  ) {

    return false;
  }


  if (
    row ===
      exitPosition.row &&
    col ===
      exitPosition.col
  ) {

    return false;
  }


  return true;
}


/* ===========================
   DISTANCE
   =========================== */

function distanceToPlayer(
  row,
  col
) {

  return (

    Math.abs(
      player.row -
      row
    )

    +

    Math.abs(
      player.col -
      col
    )

  );

}


/* ===========================
   COLLISION
   =========================== */

function checkEnemyCollision() {

  const caughtByAte =
    ateEnemies.some(
      enemy =>
        enemy.row ===
          player.row &&
        enemy.col ===
          player.col
    );


  const caughtByDad =
    dadEnemies.some(
      enemy =>
        enemy.row ===
          player.row &&
        enemy.col ===
          player.col
    );


  const caughtByMom =
    momEnemies.some(
      enemy =>
        enemy.row ===
          player.row &&
        enemy.col ===
          player.col
    );


  if (
    caughtByAte
  ) {

    loseGame(
      "ate"
    );

    return;
  }


  if (
    caughtByDad
  ) {

    loseGame(
      "dad"
    );

    return;
  }


  if (
    caughtByMom
  ) {

    loseGame(
      "mom"
    );
  }

}


/* ===========================
   WIN
   =========================== */

function completeLevel() {

  if (
    levelCompleted
  ) {

    return;
  }


  levelCompleted =
    true;

  levelStarted =
    false;

  stopTimer();

  score +=
    300;

  renderBoard();

  updateUI();

  showResultModal(
    true
  );

}


/* ===========================
   LOSE
   =========================== */

function loseGame(
  caughtBy
) {

  if (
    gameOver
  ) {

    return;
  }


  gameOver =
    true;

  levelStarted =
    false;

  stopTimer();

  showResultModal(
    false,
    caughtBy
  );

}


/* ===========================
   RESULT MODAL
   =========================== */

function showResultModal(
  won,
  caughtBy = ""
) {

  finalMoves.textContent =
    moves;

  finalScore.textContent =
    score;

  finalTime.textContent =
    seconds;

  modalIcon.innerHTML =
    "";


  /* WIN */

  if (
    won
  ) {

    modalIcon.appendChild(
      createImage(
        "assets/player-running.png",
        "player-sprite",
        "Nakatakas"
      )
    );


    modalEyebrow.textContent =
      "NAKATAKAS!";


    modalTitle.textContent =
      currentLevel ===
        levels.length - 1

        ? "NAKALIGTAS KA SA BUONG PAMILYA!"

        : "Ligtas Ka... Muna";


    modalMessage.textContent =
      collectiblesCollected ===
      totalCollectibles

        ? "Nakatakas ka at nakuha mo pa lahat ng baon. Sulit!"

        : "Nakalabas ka bago ka maabutan.";


    modalButton.textContent =
      currentLevel <
      levels.length - 1

        ? "Susunod na Takbuhan"

        : "Ulitin ang Laro";


    openModal();

    return;
  }


  /* ATE */

  if (
    caughtBy ===
    "ate"
  ) {

    modalIcon.appendChild(
      createImage(
        "assets/player-caught-ate.png",
        "ate-caught-sprite",
        "Nahuli ni Ate"
      )
    );


    modalEyebrow.textContent =
      "HALA KA!";


    modalTitle.textContent =
      "NAHULI KA NI ATE";


    modalMessage.textContent =
      "Isusumbong ka na kay Nanay at Tatay. Wala ka nang lusot.";


    modalButton.textContent =
      "TAKBO ULIT";


    openModal();

    return;
  }


  /* TATAY */

  if (
    caughtBy ===
    "dad"
  ) {

    modalIcon.appendChild(
      createImage(
        "assets/player-caught-dad.png",
        "dad-caught-sprite",
        "Nahuli ni Tatay"
      )
    );


    modalEyebrow.textContent =
      "AY NAKO!";


    modalTitle.textContent =
      "Nahuli Ka ni Tatay";


    modalMessage.textContent =
      "Akala mo mabagal si Tatay? Mali ka.";


    modalButton.textContent =
      "Takbo Ulit";


    openModal();

    return;
  }


  /* NANAY */

  modalIcon.appendChild(
    createImage(
      "assets/player-caught-mom.png",
      "player-caught-sprite",
      "Nahuli ni Nanay"
    )
  );


  modalEyebrow.textContent =
    "LAGOT!";


  modalTitle.textContent =
    "Naabutan Ka ni Nanay";


  modalMessage.textContent =
    "Hindi nakalusot. Mabilis pa rin ang tsinelas.";


  modalButton.textContent =
    "Takbo Ulit";


  openModal();

}


/* ===========================
   OPEN MODAL
   =========================== */

function openModal() {

  setTimeout(
    () => {

      resultModal.classList.remove(
        "hidden"
      );

      modalButton.focus();

    },
    220
  );

}


/* ===========================
   MODAL BUTTON
   =========================== */

function handleModalButton() {

  resultModal.classList.add(
    "hidden"
  );


  if (
    gameOver
  ) {

    loadLevelData();

    levelStarted =
      true;

    return;
  }


  if (
    currentLevel <
    levels.length - 1
  ) {

    currentLevel++;

    prepareLevel(
      currentLevel
    );

    return;
  }


  score = 0;

  currentLevel = 0;

  titleScreen.classList.remove(
    "hidden"
  );

}


/* ===========================
   RESTART
   =========================== */

function restartLevel() {

  score = 0;

  loadLevelData();

  levelStarted =
    true;

}


/* ===========================
   HOME
   =========================== */

function returnHome() {

  stopTimer();

  resultModal.classList.add(
    "hidden"
  );

  levelIntro.classList.add(
    "hidden"
  );

  titleScreen.classList.remove(
    "hidden"
  );

  levelStarted =
    false;

  gameOver =
    false;

  levelCompleted =
    false;

  score =
    0;

}


/* ===========================
   TIMER
   =========================== */

function startTimer() {

  if (
    timerStarted
  ) {

    return;
  }


  timerStarted =
    true;


  timerInterval =
    setInterval(
      () => {

        seconds++;

        timerElement.textContent =
          seconds;

      },
      1000
    );

}


function stopTimer() {

  clearInterval(
    timerInterval
  );

  timerInterval =
    null;

}


/* ===========================
   UI
   =========================== */

function updateUI() {

  levelElement.textContent =
    currentLevel + 1;

  movesElement.textContent =
    moves;

  scoreElement.textContent =
    score;

  timerElement.textContent =
    seconds;


  keyStatusElement.textContent =
    keyCollected

      ? "SUSI: NASA'YO NA"

      : "SUSI: WALA PA";


  collectibleStatusElement.textContent =
    `BAON: ${collectiblesCollected} / ${totalCollectibles}`;


  /* LEVEL 1 */

  if (
    currentLevel === 0
  ) {

    alertText.textContent =
      "NANAY ALERT";


    objectiveText.textContent =
      keyCollected

        ? "Nasa'yo na ang susi. Diretsong pinto!"

        : "Hanapin ang susi bago ka maabutan ni Nanay.";

  }


  /* LEVEL 2 */

  if (
    currentLevel === 1
  ) {

    alertText.textContent =
      "NANAY + TATAY ALERT";


    objectiveText.textContent =
      keyCollected

        ? "Takbo! Pareho silang nasa likod mo!"

        : "Hanapin ang susi habang umiwas kina Nanay at Tatay.";

  }


  /* LEVEL 3 */

  if (
    currentLevel === 2
  ) {

    alertText.textContent =
      "BUONG PAMILYA ALERT";


    objectiveText.textContent =
      keyCollected

        ? "Susi secured! TAKBO! Lahat sila humahabol!"

        : "Hala ka! Si Ate isusumbong ka na rin — kunin ang susi!";

  }

}


/* ===========================
   KEYBOARD
   =========================== */

document.addEventListener(
  "keydown",
  event => {

    const key =
      event.key.toLowerCase();


    const controls = {

      arrowup:
        [-1, 0],

      w:
        [-1, 0],

      arrowdown:
        [1, 0],

      s:
        [1, 0],

      arrowleft:
        [0, -1],

      a:
        [0, -1],

      arrowright:
        [0, 1],

      d:
        [0, 1]

    };


    if (
      !controls[key]
    ) {

      return;
    }


    event.preventDefault();


    movePlayer(
      controls[key][0],
      controls[key][1]
    );

  }
);


/* ===========================
   D-PAD
   =========================== */

document
  .querySelectorAll(
    ".dpad button"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const direction =
            button.dataset.direction;


          const controls = {

            up:
              [-1, 0],

            down:
              [1, 0],

            left:
              [0, -1],

            right:
              [0, 1]

          };


          movePlayer(
            controls[
              direction
            ][0],
            controls[
              direction
            ][1]
          );

        }
      );

    }
  );


/* ===========================
   EVENTS
   =========================== */

startGameButton.addEventListener(
  "click",
  startGame
);


beginLevelButton.addEventListener(
  "click",
  beginLevel
);


restartButton.addEventListener(
  "click",
  restartLevel
);


homeButton.addEventListener(
  "click",
  returnHome
);


modalButton.addEventListener(
  "click",
  handleModalButton
);


/* ===========================
   INITIAL
   =========================== */

loadLevelData();