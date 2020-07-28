/*
**Global Variables
*/
var RAMP_VALUE = 0.00001
var RAMP_DURATION = 1.5
var stopclicked = false;

var sliders = document.getElementsByClassName("slider");
var currentModelBtn = document.getElementById("current-model");
var newModelBtn = document.getElementById("new-model");

var model = 0;
var playBtn = document.getElementById("play");
var stopBtn= document.getElementById('stop');

var canvas = document.getElementById("graph");
var interfaceContainer = document.getElementById('interface').scrollWidth;
interfaceContainer *= .75
canvas.width = interfaceContainer;
window.addEventListener("resize", canvasResize);

var ctx = canvas.getContext("2d");
var x = 0;
ctx.moveTo(0,75);
ctx.lineWidth = 0.7;
var count = 0;

/*
**Event Listeners
*/
currentModelBtn.addEventListener('click', currentModel);
newModelBtn.addEventListener('click', newModel);
playBtn.addEventListener('click', play);
for(var i=0; i<(sliders.length); i++) {
    sliders[i].addEventListener('input', function() {
        var tempSlider = this.getAttribute('id')+'val';
        document.getElementById(tempSlider).textContent = this.value;
        if(tempSlider == 'slider5val' || tempSlider == 'slider10val'){
            var celsius = (this.value - 32) * (5/9);
            celsius = Math.round(celsius * 10) / 10
            document.getElementById(tempSlider).textContent = this.value + "°F / " + celsius + "°C";
        }
  });
}

/***************************************************************
**Name:currentModel
**Description:Opens Dropdown of current model sliders
****************************************************************/
function currentModel(event){
    document.getElementById("cur").style.pointerEvents = "auto";
    document.getElementById("cur").style.opacity = 1;
    currentModelBtn.style.backgroundColor = "#2c3531";
    document.getElementById("new").style.pointerEvents = "none";
    document.getElementById("new").style.opacity = 0.4;
    newModelBtn.style.backgroundColor = "#116466";
    model = 1;
}

/***************************************************************
**Name:newModel
**Description:Opens Dropdown of new model sliders
****************************************************************/
function newModel(event){
    document.getElementById("new").style.pointerEvents = "auto";
    document.getElementById("new").style.opacity = 1;
    newModelBtn.style.backgroundColor = "#2c3531";
    document.getElementById("cur").style.pointerEvents = "none";
    document.getElementById("cur").style.opacity = 0.4;
    currentModelBtn.style.backgroundColor = "#116466";

    model = 2;
}

/***************************************************************
**Name:frequencySetter
**Description: Determines which frequency should be played depending on Blood Pressure
****************************************************************/
function play(){
    if(model === 0){
        alert("Please Choose A Model");
    }
    else if (model == 1 || checkifInstrumentSelected() == true){ 
        playBtn.style.display = 'none';
        stopBtn.style.display = 'block';
        beep();
    }
}
/***************************************************************
**Name:stopBtn.addEventListener
**Description: If the stop button is clicked set stopclicked to true to end loop
****************************************************************/
stopBtn.addEventListener('click', stopClicked);
function stopClicked(){
    playBtn.style.display = 'block';
    stopBtn.style.display = 'none';
    var temp = document.getElementsByClassName('instuments-type');
    if(temp[0]){
        temp[0].disabled = false;
        temp[1].disabled = false;
    } 
    stopclicked = true;
 }

/***************************************************************
**Name:beep
**Description: Determines wich model is choosen and loops through and beeps till the user stops the audio via the stop button
**Resource Description: Adapted from brower-beep node modules 
**Resource: https://www.npmjs.com/package/browser-beep
****************************************************************/
function beep () {
    var interval;
    var interfaceValues = document.getElementById('labels');
    var displayValue = document.getElementsByClassName('val'); 

    (function loop () {
        if (model == 2 && checkifInstrumentSelected() == false){ 
            stopClicked();
            return;
        }
        if (stopclicked === true){
            stopclicked = false;
            return 0;
        }
        else{
            if(model === 1){
                interval = (60 / sliders[0].value) * 1000;
                displayValue[0].textContent = sliders[0].value;
                displayValue[1].textContent = sliders[1].value;
                displayValue[2].textContent = sliders[2].value;
                displayValue[3].textContent = sliders[3].value;
                displayValue[4].textContent = sliders[4].value;
                var celsius = (sliders[4].value - 32) * (5/9);
                celsius = Math.round(celsius * 10) / 10;
                document.getElementById('temps').textContent = "°F  (" + celsius + "°C)"
                interfaceValues.style.display = 'block';

                if(sliders[0].value != 0){
                    graphing(interval);
                    sliders[0].removeEventListener('input', loop);
                    playCurModelAudio();
                    setTimeout(loop, interval)
                }
                else{
                    dead(); 
                    sliders[0].addEventListener('input', loop);
                }
            }
            else if (model === 2){
                var temp = document.getElementsByClassName('instuments-type');
                if(temp[0]){
                    var temp = document.getElementsByClassName('instuments-type');
                    temp[0].disabled = true;
                    temp[1].disabled = true;
                }
                interval = (60 / sliders[5].value) * 1000;
                graphing(interval);
                displayValue[0].textContent = sliders[5].value;
                displayValue[1].textContent = sliders[6].value;
                displayValue[2].textContent = sliders[7].value;
                displayValue[3].textContent = sliders[8].value;
                displayValue[4].textContent = sliders[9].value;

                interfaceValues.style.display = 'block';

                if(sliders[5].value != 0){
                    sliders[5].removeEventListener('input', loop);
                    playNewModelAudio();
                    setTimeout(loop, interval)
                    
                }
                else{
                    sliders[5].addEventListener('input', loop); 
                }
                
            }
        }
        
         
    })(0)
}

/***************************************************************
**Name:o2range
**Description: Determines the oxygen amount for each range
****************************************************************/
function o2range(){
    var o2 = sliders[7].value;
    var oxygenValue;
    if(o2>= 0 && o2 < 80) oxygenValue = 0;
    else if(o2>= 80 && o2 < 85) oxygenValue = 0.1;
    else if(o2>= 85 && o2 < 88) oxygenValue = 0.2;
    else if(o2>= 88 && o2 < 90) oxygenValue = 0.3;
    else if(o2>= 90 && o2 < 91) oxygenValue = 0.4;
    else if(o2>= 91 && o2 < 92) oxygenValue = 0.5;
    else if(o2>= 92 && o2 < 95) oxygenValue = 0.6;
    else if(o2>= 95 && o2 < 96) oxygenValue = 0.7;
    else if(o2>= 96 && o2 < 98) oxygenValue = 0.8;
    else if(o2>= 98 && o2 < 100) oxygenValue = 0.9;
    else if(o2 == 100) oxygenValue = 1;
   return oxygenValue;
}

/*
graph
*/



function canvasResize(){
    interfaceContainer = document.getElementById('interface').scrollWidth;
    interfaceContainer *= .75
    canvas.width = interfaceContainer;
}
// function dead(){
//     ctx.beginPath();
//     ctx.lineTo(x+=10,75);
//     ctx.lineTo(x+=10,75);
//     ctx.stroke();
// }

function graphing(interval){
    if(x + 100 >= canvas.width){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        x=0;
        ctx.moveTo(0,75);
        ctx.beginPath();
        ctx.lineWidth = 0.7;
    }
    ctx.beginPath();
    ctx.lineTo(x+=10,75);
    ctx.lineTo(x+=10,75);
    ctx.lineTo(x+=10,60);
    ctx.lineTo(x+=10,90);
    ctx.lineTo(x+=10,20);
    ctx.lineTo(x+=10, 120);
    ctx.lineTo(x+=10, 75);
    ctx.lineTo(x+=10,75);
    ctx.lineTo(x+=10, 60);
    ctx.lineTo(x+=10,75);
    ctx.lineTo(x+=interval/50,75);

    x = x-10;
    ctx.stroke();
    count++;
    if(count % 2 == 0){
        ctx.closePath();
    }

    
}
//https://www.youtube.com/watch?v=QjEyjmNkN3k&list=RDyEb4kojtVHw&index=3
//https://www.youtube.com/watch?v=jcXidSeirMU&t=9s  