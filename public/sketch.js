let snake;
let food;
let bonusFood;
let scl;
let gamescore = 0;
let highScore = 0;
let gameOver = false;
let showGrid = true;
let foodCount = 0;
let bgm;
let eatf;
let eatbf;
let sounds = [];
let playbgmusic = true;
let playsound = true;
let wall = true;
let gameRunning = false;
let gridBlocks = 15;//no of sqaures in each row or col if this is lowered windowscalefac is increased
let windowScaleFac = 22;//higher is smaller
let gamespeed = 10;
let scores;
let gotnewhs = false;
var database;
var ref;
//ALL HTML ELEMENTS
const toggleGridButton = document.getElementById("toggle-grid-button");
const toggleMusicButton = document.getElementById("music-toggle-button");
const toggleSoundButton = document.getElementById("sound-toggle-button");
const toggleWallButton = document.getElementById("toggle-wall-button");
const startButton = document.getElementById("start-button");

function preload() {
  bgm = loadSound("soundsmp3/bgmusic.mp3");
  eatf = loadSound("soundsmp3/eat.mp3");
  eatbf = loadSound("soundsmp3/bonuseat.mp3");
  for (let i = 97; i <= 110; i++) {
    sounds.push(loadSound("soundsmp3/" + String.fromCharCode(i) + ".mp3"))
  }
}

function addUser(){
  if (highScore > 0 && gotnewhs) {
    // Prompt the user to enter their username
    let username = prompt("Enter your username");
    if(username==undefined) {
      return;
    }
    // Reference to the Firebase database
    ref = firebase.database().ref("scores");

    // Check if the username already exists in the database
    ref.orderByChild("username").equalTo(username).once("value", function(snapshot) {
      if (snapshot.exists()) {
        snapshot.forEach(function(child) {
          // Compare the new highscore with the previous score
          if (highScore > child.val().score) {
            ref.child(child.key).update({ score: highScore });
          }
        });
      } else {
        // If the username is new, add a new entry to the Firebase database
        let data = {      
          username: username,
          score: highScore
        };
        ref.push(data);
      }
    });
  }
}


function setup() {
  scl = min(floor(windowHeight / windowScaleFac), floor(windowWidth / windowScaleFac));
  createCanvas(scl * gridBlocks, scl * gridBlocks);
  frameRate(gamespeed);
  gotnewhs=false;
      const firebaseConfig = {
        apiKey: "AIzaSyD1SEjnu0iyODS9jx4_r9UMemuE5NVsEuA",
        authDomain: "snake-game-v3.firebaseapp.com",
        projectId: "snake-game-v3",
        storageBucket: "snake-game-v3.appspot.com",
        messagingSenderId: "1032752301810",
        databaseURL:"https://snake-game-v3-default-rtdb.asia-southeast1.firebasedatabase.app",
        appId: "1:1032752301810:web:acc947216328503ea8726b",
        measurementId: "G-8C29NT82DS"
      };
    
      // Initialize Firebase
      const app = firebase.initializeApp(firebaseConfig);
      //const analytics = getAnalytics(app);
      database=firebase.database()
      ref = database.ref("scores")

      var data = {
        name:"Say" ,
        score:400
      }
      //ref.push(data);



  if (playbgmusic) {
    bgmPlay();
  } else {
    bgm.stop();
  }
  console.log(scores)
}


function eatfsound() {
  let ind = foodCount % sounds.length;
  sounds[ind].setVolume(0.3);
  sounds[ind].play();
}

function bgmPlay() {
  bgm.setVolume(0.1);
  bgm.play();
  bgm.loop();

}
function updateHighScore() {
  if (gamescore > highScore) {
    highScore = gamescore;
    localStorage.setItem("highScore", highScore);
    gotnewhs=true;
  }
  const highScoreElement = document.getElementById("high-score");
  highScoreElement.innerHTML = `High Score: ${highScore}`;
}


function loadHighScore() {
  highScore = localStorage.getItem("highScore") || 0;
}

function updateScore() {
  const scoreElement = document.getElementById("score");
  scoreElement.innerHTML = `Score: ${gamescore}`;
}

toggleGridButton.addEventListener("click", () => {
  if (!gameRunning) {
    showGrid = !showGrid;
    toggleGridButton.classList.toggle("toggle-on");
  }
});


toggleMusicButton.addEventListener("click", () => {
  playbgmusic = !playbgmusic;
  toggleMusicButton.classList.toggle("toggle-on");
  if (playbgmusic) {
    bgmPlay();
  } else {
    bgm.stop();
  }
});

toggleSoundButton.addEventListener("click", () => {
  toggleSoundButton.classList.toggle("toggle-on");
  playsound = !playsound;
});

toggleWallButton.addEventListener("click", () => {
  if (!gameRunning) {
    toggleWallButton.classList.toggle("toggle-on");
    wall = !wall;
  }
});

startButton.addEventListener("click", () => {
  startButton.style.display = "none";
  startGame();
});

function draw() {
  background(51);

  if (!gameRunning) {
    strokeWeight(3);
    fill(255);
    textSize(width * 1 / 20);
    textAlign(LEFT)
    textStyle(BOLD);
    text("Rules :", width / 30, height / 10)
    textSize(width * 1 / 27);
    textStyle(NORMAL);
    text("1) This is a Classic game of Snake Where your goal is to score the HIGHEST in the leaderboard!!!", width / 30, height / 15, width - 25, height / 4)
    text("2) You will lose the game if you run into yourself or run into the wall when Wall option is toggled", width / 30, height / 5, width - 25, height / 4)
    text("3) You can only toggle the grid and wall option when the game is not running, the music and sounds can be toggled any time", width / 30, height / 3, width - 25, height / 4)
    textSize(width * 1 / 10);
    fill("gold")
    stroke(0)
    strokeWeight(5);
    textAlign(CENTER, CENTER);
    text("HAVE FUN!!!", width / 2, height * (2 / 3))
    //noLoop();
    return;
  }
  else {
    //grid
    if (showGrid) {
      for (let i = 1; i < width; i += 1) {
        strokeWeight(0.5)
        stroke("#00BCD4")
        line(i * scl, 0, i * scl, height)
      }
      for (let i = 1; i < height; i += 1) {
        strokeWeight(0.5)
        stroke("#00BCD4")
        line(0, i * scl, width, i * scl)
      }
    }
    //wall
    if (wall) {
      push()
      stroke(255, 76, 90)
      strokeWeight(5)
      line(0, 0, width, 0)
      line(0, 0, 0, height)
      line(0, height, width, height)
      line(width, 0, width, height)
      pop()
    }

    snake.update();
    snake.show();
    if (snake.eat(food, "normal")) {
      foodCount++;
      if (foodCount % 5 === 0) {
        // every 5th food is a bonus food
        bonusFood = new BonusFood();
        food = new Food();
      } else {
        food = new Food();
      }
    }
    food.show();
    if (bonusFood) {
      bonusFood.show();
      bonusFood.update();
    }
    updateHighScore();
    updateScore();
    if (gameOver) {
      addUser()

      if (confirm("Game over. Do you want to Continue Playing with the current settings? If you want to change any Settings Before playing click cancel :) ")) {
        startGame()
      }
      else {
        gameRunning = false;
        gamescore = 0;
        updateScore();
        document.getElementById("start-button").style.display = "block"
      }
    }
  }
}

function startGame() {
  scl = min(floor(windowHeight / windowScaleFac), floor(windowWidth / windowScaleFac));
  createCanvas(scl * gridBlocks, scl * gridBlocks);
  snake = new Snake();
  food = new Food();
  bonusFood = null;
  gameOver = false;
  gamescore = 0;
  foodCount = 0;
  gameRunning = true;
  gotnewhs=false;
}

function keyPressed() {
  // handle keyboard input
  if (keyCode === UP_ARROW && snake.yv !== 1) {
    snake.dir(0, -1);
  } else if (keyCode === DOWN_ARROW && snake.yv !== -1) {
    snake.dir(0, 1);
  } else if (keyCode === LEFT_ARROW && snake.xv !== 1) {
    snake.dir(-1, 0);
  } else if (keyCode === RIGHT_ARROW && snake.xv !== -1) {
    snake.dir(1, 0);
  }
}
