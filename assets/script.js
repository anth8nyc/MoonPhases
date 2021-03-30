dateUnix = "675925223"
let phaseSpanEl = document.querySelector(`.phaseText`)
let apodEl = document.querySelector(`.apod`)

let dateInput = document.querySelector('#datepicker')


fetch("https://api.farmsense.net/v1/moonphases/?d="+dateUnix)
.then(response => response.json())
.then(function(data){
  console.log(data)

  let moonPhase = data[0].Phase
  console.log(moonPhase)
  
  phaseSpanEl.textContent = moonPhase;
  
  
})


fetch("https://api.nasa.gov/planetary/apod?api_key=U61IPOajBkfKLl3G6HYZAV3GIsW9nhyLb030wyt9")
.then(response => response.json())
.then(function(data){
    
    console.log(data)
  
    let imageLink = data.url

    console.log(imageLink)  
    document.getElementById("apod").src = imageLink ;

    
});

//let dateInputVal = document.querySelector('#datepicker').value

//$(function(){
  
  $('#datepicker').datepicker({
    onSelect: function(dateText, inst) {
      $("#dateCheck").val(dateText);
      console.log(dateText);
      let unix = moment(dateText).format("X");
      console.log(unix);
    }
//});

});


//console.log(dateInputVal);
//let unix = Date.parse($("2021.3.30").val())
