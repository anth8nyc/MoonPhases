let phaseSpanEl = document.querySelector(`.phaseText`)

let factPhaseEl = document.querySelector(`#factPhase`)
let factIllumEl = document.querySelector(`#factIllum`)
let factMNameEl = document.querySelector(`#factMName`)
let factDSunEl = document.querySelector(`#factDSun`)
let factDEarthEl = document.querySelector(`#factDEarth`)

let dateSelectedEl = document.querySelector(`#dateSelected`)
let apodEl = document.querySelector(`.apod`)
let pastSearchBtns = document.querySelector(".historyButtonCon");
let clearSearchBtn = document.querySelector("#clearBtn");

fetch("https://api.nasa.gov/planetary/apod?api_key=U61IPOajBkfKLl3G6HYZAV3GIsW9nhyLb030wyt9")
.then(response => response.json())
.then(function(data){
    
  console.log(data)
  
  // let moonPhase = data[0].Phase
  // console.log(moonPhase)
  let imageLink = data.url
  console.log(imageLink)  

  // document.getElementById("apod").src = imageLink ;
    
})

// let stormapi = "1f5e8eca-92f4-11eb-b01a-0242ac130002-1f5e8f7e-92f4-11eb-b01a-0242ac130002"

// const lat = 58.7984;
// const lng = 17.8081;
// const start = 1549312452;


// fetch(`https://api.stormglass.io/v2/astronomy/point?lat=${lat}&lng=${lng}&start=${start}`, {
//   headers: {
//     'Authorization': stormapi
//   }
// }).then((response) => response.json()).then((data) => {
//   // Do something with response data.
//   console.log(data)

// });

// stormData(mooninfo);

// function stormData (jsonData) {

//   console.log(jsonData)

// }


pastSearchBtns.addEventListener('click', dateSelected);
clearSearchBtn.addEventListener('click', clearSearches);

searchHistArray = [];
let unix = ""

let dateInput = document.querySelector('#datepicker')

init();

$('#datepicker').datepicker({
  
  buttonText: "Select date",
  showOn: "button",
  buttonImage: "./assets/calendar.png",
  buttonImageOnly: true,
  changeMonth: true, 
  changeYear: true, 
  yearRange: "-90:+00",

  onSelect: function(dateText, inst) {
    $("#dateCheck").val(dateText);
    console.log(dateText);
    dateSelectedEl.textContent = "Date Selected: " + dateText;
    
    let unix = moment(dateText).format("X");
    console.log(unix);
    
    for (let i = 0; i < searchHistArray.length; i++) {
      if (searchHistArray[i] === unix){
        getPhaseInfo(unix)
        return;    
      } 
    }  
    searchHistArray.unshift(unix);
    console.log(searchHistArray)
    storeSearches();
    renderSearches();
    getPhaseInfo(unix);  
    
  },

});

function getPhaseInfo(unix) {

  fetch("https://api.farmsense.net/v1/moonphases/?d="+unix)
  .then(response => response.json())
  .then(function(data){
    console.log(data)
  
    let moonPhase = data[0].Phase
    moonPhoto(moonPhase);

    let factPhase = data[0].Phase
    let factIllum = data[0].Illumination
    let factMName = data[0].Moon
    let factDSun = data[0].DistanceToSun
    let factDEarth = data[0].Distance

    console.log(moonPhase)
    phaseSpanEl.textContent = moonPhase;
    phaseSpanEl.classList.remove("invisible")

    factPhaseEl.textContent = " " + factPhase 
    factIllumEl.textContent = " " + factIllum 
    factMNameEl.textContent = " " + factMName 
    factDSunEl.textContent = " " + factDSun 
    factDEarthEl.textContent = " " + factDEarth 
    

  })

}

function moonPhoto(moonPhase) {
  let moonDisplayEl = document.getElementById("moonDisplay")

  if (moonPhase === "Waxing Crescent") {
    moonDisplayEl.src = "assets/moons/waxingcrescent.jpg"
    
  } else if (moonPhase ==="Waxing Gibbous") {
    moonDisplayEl.src = "assets/moons/waxinggibbous.jpg"
    
  } else if (moonPhase ==="1st Quarter") {
    moonDisplayEl.src = "assets/moons/firstquarter.jpg"
    
  } else if (moonPhase ==="3rd Quarter") {
    moonDisplayEl.src = "assets/moons/thirdquarter.jpg"
    
  } else if (moonPhase ==="Waning Crescent") {
    moonDisplayEl.src = "assets/moons/waningcrescent.png"
    
  } else if (moonPhase ==="Waning Gibbous") {
    moonDisplayEl.src = "assets/moons/waninggibbous.jpg"
    
  } else if (moonPhase ==="Full Moon") {
    moonDisplayEl.src = "assets/moons/fullmoon.jpg"
    
  } else if (moonPhase ==="New Moon") {
    moonDisplayEl.src = "assets/moons/newmoon.jpeg"

  };
};

function dateSelected(event) {

  
  console.log(event.target.textContent)
  buttonDate = event.target.textContent
  let unixB = moment(buttonDate).format("X");
  console.log(unixB)

  dateSelectedEl.textContent = "Date Selected: " + buttonDate;
  getPhaseInfo(unixB)

}
// Check/get local storage for past searched dates, parse and set equal to search array
function init (){
  let savedSearches = JSON.parse(localStorage.getItem("searchHistArray"));
  if (savedSearches !== null) {
    searchHistArray = savedSearches;
  }
  
  renderSearches();
  
}
// Unshift date search into search array and stringify to set for local storage
function storeSearches (){
  
  localStorage.setItem("searchHistArray", JSON.stringify(searchHistArray));
  
}
// Using current search array render buttons with attached unix information  
// and call after submit event and on init function
function renderSearches () {
  
  // inner html 
  pastSearchBtns.innerHTML = "";
  
  for (var i = 0; i < searchHistArray.length; i++) {
    
    let dateB = searchHistArray[i];
    let dateDisp = moment.unix(dateB).format("MM/DD/YYYY");


    dateHistBtn = $(`<button class="btn btn-info btn-block mb-3 histBtn" id="searchBtn">${dateDisp}</button>`)
    
    $(".historyButtonCon").append(dateHistBtn);
  }
  
}
// Clear the buttons and search array, and calls upon render/store to clear and set to local storage
function clearSearches (event){
  
  event.preventDefault();
  searchHistArray = [];
  renderSearches();
  storeSearches();
  
}




// fetch("https://api.nasa.gov/planetary/apod?api_key=U61IPOajBkfKLl3G6HYZAV3GIsW9nhyLb030wyt9")
// .then(response => response.json())
// .then(function(data){
  
  //   console.log(data)
  
  //   let imageLink = data.url
  
//   console.log(imageLink)  
//   document.getElementById("apod").src = imageLink ;

// });

//use unix into API 


///////////////////////////////////

let canvas = document.getElementById("canvas");
    let c = canvas.getContext("2d");

    let w;
    let h;

    let setCanvasExtents = () => {
      w = document.body.clientWidth;
      h = document.body.clientHeight;
      canvas.width = w;
      canvas.height = h;
    };

    setCanvasExtents();

    window.onresize = () => {
      setCanvasExtents();
    };

    let makeStars = count => {
      let out = [];
      for (let i = 0; i < count; i++) {
        let s = {
          x: Math.random() * 1600 - 800,
          y: Math.random() * 900 - 450,
          z: Math.random() * 1000
        };
        out.push(s);
      }
      return out;
    };

    let stars = makeStars(10000);

    let clear = () => {
      c.fillStyle = "black";
      c.fillRect(0, 0, canvas.width, canvas.height);
    };

    let putPixel = (x, y, brightness) => {
      let intensity = brightness * 255;
      let rgb = "rgb(" + intensity + "," + intensity + "," + intensity + ")";
      c.fillStyle = rgb;
      c.fillRect(x, y, 1, 1);
    };

    let moveStars = distance => {
      let count = stars.length;
      for (var i = 0; i < count; i++) {
        let s = stars[i];
        s.z -= distance;
        while (s.z <= 1) {
          s.z += 1000;
        }
      }
    };

    let prevTime;
    let initial = time => {
      prevTime = time;
      requestAnimationFrame(tick);
    };

    let tick = time => {
      let elapsed = time - prevTime;
      prevTime = time;

      moveStars(elapsed * 0.05);

      clear();

      let cx = w / 2;
      let cy = h / 2;

      let count = stars.length;
      for (var i = 0; i < count; i++) {
        let star = stars[i];

        let x = cx + star.x / (star.z * 0.001);
        let y = cy + star.y / (star.z * 0.001);

        if (x < 0 || x >= w || y < 0 || y >= h) {
          continue;
        }

        let d = star.z / 1000.0;
        let b = 1 - d * d;

        putPixel(x, y, b);
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(initial);