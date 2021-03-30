let phaseSpanEl = document.querySelector(`.phaseText`)
let apodEl = document.querySelector(`.apod`)
let pastSearchBtns = document.querySelector(".historyButtonCon");

fetch("https://api.nasa.gov/planetary/apod?api_key=U61IPOajBkfKLl3G6HYZAV3GIsW9nhyLb030wyt9")
.then(response => response.json())
.then(function(data){
    
  console.log(data)
  
  // let moonPhase = data[0].Phase
  // console.log(moonPhase)
  let imageLink = data.url
  console.log(imageLink)  

  document.getElementById("apod").src = imageLink ;
    
})

pastSearchBtns.addEventListener('click', dateSelected);
searchHistArray = [];

let unix = "675925223"


function getPhaseInfo(unix) {

  
  fetch("https://api.farmsense.net/v1/moonphases/?d="+unix)
  .then(response => response.json())
  .then(function(data){
    console.log(data)
  
    let moonPhase = data[0].Phase
    console.log(moonPhase)
    
    phaseSpanEl.textContent = moonPhase;
    
    
  })

}


function dateSelected(event) {

  getPhaseInfo(event.target.textContent)
  
}

// Check/get local storage for past searched dates, parse and set equal to search array
function init (){

// fetch("https://api.nasa.gov/planetary/apod?api_key=U61IPOajBkfKLl3G6HYZAV3GIsW9nhyLb030wyt9")
// .then(response => response.json())
// .then(function(data){
  
//   console.log(data)
  
//   let imageLink = data.url
  
//   console.log(imageLink)  
//   document.getElementById("apod").src = imageLink ;
  
  
// });


let dateInput = document.querySelector('#datepicker')

$('#datepicker').datepicker({
  onSelect: function(dateText, inst) {
    $("#dateCheck").val(dateText);
    console.log(dateText);
    let unix = moment(dateText).format("X");
    console.log(unix);
    
    for (let i = 0; i < searchHistArray.length; i++) {
      if (searchHistArray[i] === unix){
        getPhaseInfo(unix)
        return;    
      } 
    }  
    searchHistArray.unshift(unix);
    storeSearches();
    renderSearches();
    getPhaseInfo(unix);  

  }
  //use unix into API 
});
  let savedSearches = JSON.parse(localStorage.getItem("searchHistArray"));
  if (savedSearches !== null) {
    searchHistArray = savedSearches;
  }
  
  renderSearches();

}

// Unshift date search into search array and stringify to set for local storage
function storeSearches (){

  localStorage.setItem("searchHistArray", JSON.stringify(searches));

}

// Using current search array render buttons with attached unix information  
// and call after submit event and on init function
function renderSearches () {

  // inner html 
  pastSearchBtns.innerHTML = "";
  
  for (var i = 0; i < searchHistArray.length; i++) {
    let dateB = searchHistArray[i];
    dateHistBtn = $(`<button class="btn btn-info btn-block mb-3 histBtn" id="searchBtn">${dateB}</button>`)
    
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
