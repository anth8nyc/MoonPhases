let phaseSpanEl = document.querySelector(`.phaseText`)

let factsConEl = document.querySelector(`#factsCon`)
let factPhaseEl = document.querySelector(`#factPhase`)
let factIllumEl = document.querySelector(`#factIllum`)
let factMNameEl = document.querySelector(`#factMName`)
let factDSunEl = document.querySelector(`#factDSun`)
let factDEarthEl = document.querySelector(`#factDEarth`)

let dateSelectedEl = document.querySelector(`#dateSelected`)
let pastSearchBtns = document.querySelector(".historyButtonCon");
let clearSearchBtn = document.querySelector("#clearBtn");

let mHeadEl = document.querySelector(`.mHead`)
let mViewEl = document.querySelector(`.mView`)
let mFactsEl = document.querySelector(`.mFacts`)

let moonDisplayEl = document.getElementById("moonDisplay");

let todaysDate = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
let searchHistArray = [];

function nasaAPOD() {
  
  fetch("https://api.nasa.gov/planetary/apod?api_key=U61IPOajBkfKLl3G6HYZAV3GIsW9nhyLb030wyt9")
  // fetch("https://api.nasa.gov/planetary/apod?api_key=U61IPOajBkfKLl3G6HYZAV3GIsW9nhyLb0")
  // fetch("https://api.nasa.gov/planetary/apod?api_key=U61IPOajBkfKLl3G6HYZAV3GIsW9nhyLb030wyt9&date=2021-04-01")
  // fetch("https://api.nasa.gov/planetary/apod?api_key=U61IPOajBkfKLl3G6HYZAV3GIsW9nhyLb030wyt9&date=2017-07-08")
    .then(response => response.json())
    .then(function(data){
    
    console.log(data)
    let apodType = data.media_type;
    let apodURL = data.url;
    console.log(apodURL) 
    mViewEl.classList.add("d-none")
    mHeadEl.classList.add("d-none")
    mFactsEl.classList.add("d-none")

    let apodCon = $(`<div class="apodCon container text-light text-center"><h5 class="text-center text-light">NASA Astronomy Picture of the Day</h5></div>`)
    
    $(".rightContainer").prepend(apodCon);

    if(apodType == "image"){

      let apodImg = $(`<div class="justify-content-center">
      <img class="ltgray" style="width: 38%" src="${apodURL}">
      </div>`);
      
      $(".apodCon").append(apodImg);

      
    } else if (apodType == "video"){

      let apodVid = $(`<div class="justify-content-center">
      <iframe class="apodVid ltgray" width="500px" height="300px" src="${apodURL}"></iframe>
      </div>`);
            
      $(".apodCon").append(apodVid);

    } else {

      let apodError = $(`<div class="row text-center bgRed rounded mb-5">
            <h5 class="text-light">We had trouble loading the NASA APOD media! 
            Please visit their site directly at: <a class="text-info" href="https://apod.nasa.gov/apod/astropix.html">apod.nasa.gov</a>
            </h5>
            </div>`);
            
        $(".apodCon").append(apodError);

    }

  })  

};

// Updates current time and date in header
let datetime = null;
let date = null;

function update() {
  date = moment(new Date())
  datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
};

$(document).ready(function(){
    datetime = $('#currentDay')
    update();
    setInterval(update, 1000);
});


init();



pastSearchBtns.addEventListener('click', dateSelected);
clearSearchBtn.addEventListener('click', clearSearches);

let unix = ""

let dateInput = document.querySelector('#datepicker')

//Date picker with unix conversion included for API Call
// Acts opposite clear button to remove start screen/apod content vs phase content
$('#datepicker').datepicker({
  
  buttonText: "Select date",
  showOn: "button",
  buttonImage: "./assets/calendar.png",
  buttonImageOnly: true,
  changeMonth: true, 
  changeYear: true, 
  yearRange: "-90:+90",

  onSelect: function(dateText, inst) {

    $( ".apodCon" ).remove();
    mViewEl.classList.remove("d-none")
    mHeadEl.classList.remove("d-none")
    mFactsEl.classList.remove("d-none")

    $("#dateCheck").val(dateText);
    console.log(dateText);
    dateSelectedEl.textContent = "Date Selected: " + dateText + " ";
    
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
// API call for moon phase data
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
    
    factPhaseEl.textContent = "Moon Phase: " + factPhase 
    factIllumEl.textContent = "Illumination: " + factIllum 
    factMNameEl.textContent = "Full Moon Cycle Name: " + factMName 
    factDSunEl.textContent = "Distance from the Sun: " + factDSun + "km"
    factDEarthEl.textContent = "Distance from the Earth: " + factDEarth  + "km"
    

  })

}

// Supplies the correct moon phase picture to the page from date info
function moonPhoto(moonPhase) {

  if (moonPhase === "Waxing Crescent") {
    moonDisplayEl.src = "assets/moons/waxingcrescent.png"
    
  } else if (moonPhase ==="Waxing Gibbous") {
    moonDisplayEl.src = "assets/moons/waxinggibbous.png"
    
  } else if (moonPhase ==="1st Quarter") {
    moonDisplayEl.src = "assets/moons/firstquarter.png"
    
  } else if (moonPhase ==="3rd Quarter") {
    moonDisplayEl.src = "assets/moons/thirdquarter.png"
    
  } else if (moonPhase ==="Waning Crescent") {
    moonDisplayEl.src = "assets/moons/waningcrescent.png"
    
  } else if (moonPhase ==="Waning Gibbous") {
    moonDisplayEl.src = "assets/moons/waninggibbous.png"
    
  } else if (moonPhase ==="Full Moon") {
    moonDisplayEl.src = "assets/moons/fullmoon.png"
    
  } else if (moonPhase ==="New Moon") {
    moonDisplayEl.src = "assets/moons/newmoon.png"

  };
};


// Reruns the content console for selected date on search history buttons
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
  
  nasaAPOD();
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


    dateHistBtn = $(`<button class="btn bgBlue text-light btn-block mb-3 histBtn" id="searchBtn">${dateDisp}</button>`)
    
    $(".historyButtonCon").append(dateHistBtn);
  }
  
}
// Clear the buttons and search array, and calls upon render/store to clear and set to local storage
function clearSearches (event){
  
  $( ".apodCon" ).remove();
  event.preventDefault();
  dateSelectedEl.textContent = "";
  
  nasaAPOD();
  searchHistArray = [];
  renderSearches();
  storeSearches();
  
}



// Star field
///////////////////////////////////

//Extends the canvas element to entire window size and adds resizing capabilities to follow window
let canvas = document.getElementById("canvas");
    let c = canvas.getContext("2d");

    let w;
    let h;

    let canvasSize = () => {
      w = document.body.clientWidth;
      h = document.body.clientHeight;
      canvas.width = w;
      canvas.height = h;
    };

    canvasSize();

    window.onresize = () => {
      canvasSize();
    };
    // Randomly generates star coordinates on xyz plane
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
    //Calls above random coordinate generator times 10000
    let stars = makeStars(10000);

    let clear = () => {
      c.fillStyle = "black";
      c.fillRect(0, 0, canvas.width, canvas.height);
    };
    //Give stars pixel brightness to display at given coordinates
    let putPixel = (x, y, brightness) => {
      let intensity = brightness * 255;
      let rgb = "rgb(" + intensity + "," + intensity + "," + intensity + ")";
      c.fillStyle = rgb;
      c.fillRect(x, y, 1, 1);
    };
    //changes z coordinate for stars to move forwards
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
    // Changes refresh and therefore star movement speed
    let prevTime;
    let initial = time => {
      prevTime = time;
      requestAnimationFrame(tick);
    };

    let tick = time => {
      let elapsed = time - prevTime;
      prevTime = time;

      moveStars(elapsed * 0.04);

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