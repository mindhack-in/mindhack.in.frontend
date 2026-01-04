const data = [
  [],
  [
    {
      "liquid": 50,
      "color": "red"
    },
    {
      "liquid": 25,
      "color": "yellow"
    }
  ],
  [
    {
      "liquid": 25,
      "color": "yellow"
    },
    {
      "liquid": 25,
      "color": "blue"
    },
    {
      "liquid": 25,
      "color": "green"
    }
  ],
  [
    {
      "liquid": 50,
      "color": "yellow"
    },
    {
      "liquid": 25,
      "color": "red"
    },
    {
      "liquid": 25,
      "color": "green"
    }
  ],
  [
    {
      "liquid": 50,
      "color": "blue"
    },
    {
      "liquid": 25,
      "color": "red"
    }
  ],
  [
    {
      "liquid": 50,
      "color": "green"
    },
    {
      "liquid": 25,
      "color": "blue"
    }
  ]
];


const levelId= document.getElementById('levelId');
let email = localStorage.getItem("email");
let levelStage=0;
if(email===null)
    levelStage= -1;
else
   levelStage=500;


levelId.innerHTML=levelStage;

// if()
const colorPairs = { red: ["#ff6b6b", "#ff4757"], blue: ["#74b9ff", "#0984e3"], green: ["#55efc4", "#00b894"], yellow: ["#ffeaa7", "#fdcb6e"], pink: ["#ff9ff3", "#f368e0"] };

let fullJars = [];
let activeJars = []
function createJar(i, jarData) {

  const jar = document.createElement("div");
  jar.classList.add("jar");
  jar.id = "jar_" + i;

  const rim = document.createElement('div');
  rim.classList.add('rim');
  jar.appendChild(rim);

  const ring = document.createElement('div');
  ring.classList.add('ring');
  jar.appendChild(ring);


  const liquid = document.createElement('div');
  liquid.id = "liquid_jar_" + i;
  jar.appendChild(liquid);


  let jarLiquidHeight = 0;

  jar.jarLiquidHeight = jarLiquidHeight;
  for (let j = 0; j < jarData.length; j++) {
    const liquid_child = document.createElement('div');
    liquid_child.classList.add('liquid');
    liquid_child.id = "liquid_jar_" + i + "_layer_" + j;
    const liquidHeight = jarData[j].liquid;
    liquid_child.style.height = `${liquidHeight}%`;
    liquid_child.style.position = 'absolute';
    liquid_child.style.bottom = `${jarData.slice(0, j).reduce((sum, l) => sum + l.liquid, 0)}%`;

    color = jarData[j].color;
    colors = colorPairs[color]

    liquid_child.style.background = `linear-gradient(180deg,${colors[0]},${colors[1]} )`;
    liquid.appendChild(liquid_child);

    jarLiquidHeight += liquidHeight
  }
  liquid.dataset.totalHeight = jarLiquidHeight;

  jar.addEventListener("click", (e) => {
    if (jarLiquidHeight !== '100%' && fullJars.indexOf(jar.id) === -1) {
      jar.classList.toggle('lifted');
      if (activeJars.indexOf(jar.id) === -1)
        activeJars.push(jar.id)
      if (activeJars.length == 2) {
        playerMove();
        if (checkWin()) {
          loadCongratsScript(() => {
            showCongratsAnimation({
              message: "Level Passed! 🧠"
            });
          });
        }
      }
    }

  });





  return jar;
}
function checkWin() {
  console.log("--------------");

  for (let i = 0; i < data.length; i++) {
    const liquid = document.getElementById("liquid_jar_" + i);
    let height = liquid.lastElementChild
      ? parseInt(liquid.lastElementChild.style.height)
      : 0;

    console.log(height);
    if (height !== 0 && height !== 100) {
      return false;
    }
  }
  return true;
}

function playerMove() {

  const liquid1 = document.getElementById("liquid_" + activeJars[0]);
  const liquid2 = document.getElementById("liquid_" + activeJars[1]);
  if (liquid2.lastElementChild !== null && liquid1.lastElementChild.style.background !== liquid2.lastElementChild.style.background) {
    unlockJars();
    return;
  }
  let height1 = parseInt(liquid1.lastElementChild.style.height);
  let height2 = liquid2.lastElementChild !== null ? parseInt(liquid2.lastElementChild.style.height) : 0;
  let totalHeight1 = parseInt(liquid1.dataset.totalHeight)
  let totalHeight2 = liquid2.lastElementChild !== null ? parseInt(liquid2.dataset.totalHeight) : 0;
  while (height1 > 0 && height2 < 100) {
    if (totalHeight2 === 100) {
      break;
    }
    height1 -= 25;
    height2 += 25;
    totalHeight2 += 25;
    totalHeight1 -= 25;
  }
  const bg = liquid1.lastElementChild.style.background;;
  if (height1 === 0) {
    liquid1.lastElementChild.remove();
  } else {
    liquid1.lastElementChild.style.height = height1 + "%"; // or "px" depending on your CSS
  }

  if (liquid2.lastElementChild !== null)
    liquid2.lastElementChild.style.height = height2 + "%";
  else {
    const liquid_child = document.createElement('div');
    liquid_child.classList.add('liquid');
    liquid_child.id = activeJars[1] + "_layer_" + 0;
    const liquidHeight = height2;
    liquid_child.style.height = `${liquidHeight}%`;
    liquid_child.style.position = 'absolute';
    liquid_child.style.bottom = height2;

    liquid_child.style.background = bg;
    liquid2.appendChild(liquid_child);
  }


  liquid1.dataset.totalHeight = totalHeight1;
  liquid2.dataset.totalHeight = totalHeight2;
  if (height2 === 100)
    fullJars.push(activeJars[1])

  unlockJars();
}



function unlockJars() {

  const jar1 = document.getElementById(activeJars[0]);
  jar1.classList.toggle('lifted');

  if (activeJars.length === 2) {
    const jar2 = document.getElementById(activeJars[1]);
    jar2.classList.toggle('lifted');
    activeJars = []
  }
}


const container = document.getElementById("jar-container");
for (let i = 0; i < data.length; i++) {
  const jar = createJar(i, data[i]);
  container.appendChild(jar);
}

function loadCongratsScript(callback) {
  const script = document.createElement("script");
  script.src = "../../../utility/js/congratulation.js";
  script.onload = callback;
  document.head.appendChild(script);
}