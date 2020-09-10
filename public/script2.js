/*
**Global Variables
*/
var RAMP_VALUE = 0.00001
var RAMP_DURATION = 1.5
var stopisclicked = false;

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
//window.addEventListener("resize", canvasResize);
var interval;
var graphingstart = false;
var timeOuts;
var stop = true;

//https://medium.com/@swainson/accurate-javascript-timers-f71e0af5df32
function accuTime(timer, repeatArgument, callbackArgument){
    var init = (t) => {
      let timeStart = new Date().getTime();
      setTimeout(function () {
        if (stop == false) {
          let fix = (new Date().getTime() - timeStart) - timer;
          init(t - fix);
          repeatArgument();
          
        } else {
          callbackArgument();
        }
      }, t);
    }
  init(timer);
  }

/*
**Event Listeners
*/
currentModelBtn.addEventListener('click', currentModel);
newModelBtn.addEventListener('click', newModel);
playBtn.addEventListener('click', play);
stopBtn.addEventListener('click', stopClicked);

for(var i=0; i<sliders.length; i++) {
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
    currentModelBtn.style.backgroundColor = "#e5474b";
    document.getElementById("new").style.pointerEvents = "none";
    document.getElementById("new").style.opacity = 0.4;
    newModelBtn.style.backgroundColor = "white";
    model = 1;
}

/***************************************************************
**Name:newModel
**Description:Opens Dropdown of new model sliders
****************************************************************/
function newModel(event){
    document.getElementById("new").style.pointerEvents = "auto";
    document.getElementById("new").style.opacity = 1;
    newModelBtn.style.backgroundColor = "#e5474b";

    document.getElementById("cur").style.pointerEvents = "none";
    document.getElementById("cur").style.opacity = 0.4;
    currentModelBtn.style.backgroundColor = "white";

    model = 2;
}

/***************************************************************
**Name:frequencySetter
**Description: Determines which frequency should be played depending on Blood Pressure
****************************************************************/
function play(){
    updateInterfaceVitalValues();
    for(var i=0; i<2; i++){
        sliders[i].addEventListener('input', intervalTime);
    }
    for(var i=5; i<8; i++){
        sliders[i].addEventListener('input', intervalTime);
    }
    for(var i=0; i<sliders.length; i++){
        sliders[i].addEventListener('input', updateInterfaceVitalValues);
    }   
    if(model === 0) alert("Please Choose A Model");
    else if (model == 1 || checkifInstrumentSelected() == true){ 
        playBtn.style.display = 'none';
        stopBtn.style.display = 'block';
        document.getElementById('labels').style.display = 'block';
        
        var temp = document.getElementsByClassName('instuments-type');
        if(temp[0]){
            temp[0].disabled = true;
            temp[1].disabled = true;
        } 
        graphingstart = true;
        graph();
        stop = false;
        accuTime(1000, function beep(){
            console.log(new Date().getMilliseconds());
            if (stopisclicked == true){
                stopisclicked = false;    
                return 0;
            }
            if(model === 1){
                if(interval == Infinity) flatLine();
                if(interval != Infinity){ 
                    pausing = false;
                    playCurModelAudio();
                    // timeOuts = setTimeout(beep, interval)
                }
            }
            else if(model === 2){
                if (checkifInstrumentSelected() == false){
                    stopClicked();    
                    stopisclicked = false;
                    return 0;
                }
                if(interval == Infinity) flatLine();
                if(interval != Infinity){ 
                    playNewModelAudio();            
                }
                
            }
        
        });
    }
}
/***************************************************************
**Name:stopBtn.addEventListener
**Description: If the stop button is clicked set stopclicked to true to end loop
****************************************************************/
function stopClicked(){
    for(var i=0; i<2; i++){
        sliders[i].removeEventListener('input', intervalTime);
    }
    for(var i=5; i<8; i++){
        sliders[i].removeEventListener('input', intervalTime);
    }
    for(var i=0; i<sliders.length; i++){
        sliders[i].removeEventListener('input', updateInterfaceVitalValues);
    }
    playBtn.style.display = 'block';
    stopBtn.style.display = 'none';

    var temp = document.getElementsByClassName('instuments-type');
    if(temp[0]){
        temp[0].disabled = false;
        temp[1].disabled = false;
    } 
    stop = true;
    stopisclicked = true;
    graphingstart = false
    if(os!= null && interval == Infinity){
        isAlive()
        if (stopisclicked == true){
            stopisclicked = false;    
        }
    }

 }

/***************************************************************
**Name:beep
**Description: Determines wich model is choosen and loops through and beeps till the user stops the audio via the stop button
**Resource Description: Adapted from brower-beep node modules 
**Resource: https://www.npmjs.com/package/browser-beep
****************************************************************/
function updateInterfaceVitalValues(){
    var displayValue = document.getElementsByClassName('val'); 
    if(model == 1){
        interval = (60 / sliders[0].value) * 1000;
        displayValue[0].textContent = sliders[0].value;
        displayValue[1].textContent = sliders[1].value;
        displayValue[2].textContent = sliders[2].value;
        displayValue[3].textContent = sliders[3].value;
        displayValue[4].textContent = sliders[4].value;
        var celsius = (sliders[4].value - 32) * (5/9);
        celsius = Math.round(celsius * 10) / 10;
        document.getElementById('temps').textContent = "°F  (" + celsius + "°C)"
    }
    else if(model == 2){
        interval = (60 / sliders[5].value) * 1000;
        displayValue[0].textContent = sliders[5].value;
        displayValue[1].textContent = sliders[6].value;
        displayValue[2].textContent = sliders[7].value;
        displayValue[3].textContent = sliders[8].value;
        displayValue[4].textContent = sliders[9].value;
        var celsius = (sliders[9].value - 32) * (5/9);
        celsius = Math.round(celsius * 10) / 10;
        document.getElementById('temps').textContent = "°F  (" + celsius + "°C)"
    }
 
}
function intervalTime(){
   
    if(model == 1)
        interval = (60 / sliders[0].value) * 1000;
    else if(model == 2)
        interval = (60 / sliders[5].value) * 1000;
    stop = true;
    if(os!= null && interval != Infinity){isAlive();}   
    console.log("called");
    stop = false;
    accuTime(interval,beep());
}
var pausing = true;



var ctxs;
var os;
function flatLine(){
    ctxs = new AudioContext();
    os = ctxs.createOscillator();
    os.frequency.value = 466.164;
    os.connect(ctxs.destination);
    os.start();
}
 function isAlive(){
     os.stop();
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

/***************************************************************
**Name:
**Description:
****************************************************************/
function getData(vital){
    if(model == 1){
        if(vital == "bp") return sliders[1].value
        if(vital == "o2") return sliders[2].value
        if(vital == "rr") return sliders[3].value
        if(vital == "temp") return sliders[4].value

    }else{
        if(vital == "bp") return sliders[6].value
        if(vital == "o2") return sliders[7].value
        if(vital == "rr") return sliders[8].value
        if(vital == "temp") return sliders[9].value
    }
}

function graph(){
    graphHR();
    graphBP();
    graphO2();
    graphRR();
    graphTemp();
}
function test(){
    var ctx = document.getElementById('g').getContext('2d');
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                data: [0, 10, 5, 2, 20, 30, 45]
            }]
        },
    
        options:{}
    });
}
var count = 0;
function getHRData(){
    if(pausing == true) {
        count = 0;
        return 50;
    }
    else if(pausing == false && count == 0){
        count++;
        return 60;
    }
    else if(pausing == false && count == 1){
        pausing = true;
        return 40;
    }
}

function graphHR(){
    Plotly.plot('graph',[{
        y:[getHRData()],
        type:'line'
    }]);
    var cnt = 0;
    var intervalgraph = setInterval(function(){
        if(graphingstart == false){
            Plotly.deleteTraces('graph', 0);
            clearInterval(intervalgraph);
        }
        Plotly.extendTraces('graph', {y:[[getHRData()]]}, [0]);
        cnt++;
        if(cnt > 100){
            Plotly.relayout('graph', {
                xaxis: { range: [cnt-100, cnt]}
            })
        }
    }, 40)
}
function graphBP(){
    Plotly.plot('graph1',[{
        y:[getData("bp")],
        type:'line'
    }]);
    var cnt = 0;
    var intervalgraph = setInterval(function(){
        if(graphingstart == false){
            Plotly.deleteTraces('graph1', 0);
            clearInterval(intervalgraph);
        }
        Plotly.extendTraces('graph1', {y:[[getData("bp")]]}, [0]);
        cnt++;
        if(cnt > 20){
            Plotly.relayout('graph1', {
                xaxis: { range: [cnt-20, cnt]}
            })
        }
    }, 200)
    
}
function graphO2(){
    Plotly.plot('graph2',[{
        y:[getData("o2")],
        type:'line'
    }]);
    var cnt = 0;
    var intervalgraph = setInterval(function(){
        if(graphingstart == false){
            Plotly.deleteTraces('graph2', 0);
            clearInterval(intervalgraph);
        }
        Plotly.extendTraces('graph2', {y:[[getData("o2")]]}, [0]);
        cnt++;
        if(cnt > 20){
            Plotly.relayout('graph2', {
                xaxis: { range: [cnt-20, cnt]}
            })
        }
    }, 200)
    
}

function graphRR(){
    Plotly.plot('graph3',[{
        y:[getData("rr")],
        type:'line'
    }]);
    var cnt = 0;

    var intervalgraph = setInterval(function(){
        if(graphingstart == false){
            Plotly.deleteTraces('graph3', 0);
            clearInterval(intervalgraph);
        }
        Plotly.extendTraces('graph3', {y:[[getData("rr")]]}, [0]);
        cnt++;
        if(cnt > 20){
            Plotly.relayout('graph3', {
                xaxis: { range: [cnt-20, cnt]}
            })
        }
    }, 200)
    
}
function graphTemp(){
    Plotly.plot('graph4',[{
        y:[getData("temp")],
        type:'line'
    }]);
    var cnt = 0;
    var intervalgraph = setInterval(function(){
        if(graphingstart == false){
            Plotly.deleteTraces('graph4', 0);
            clearInterval(intervalgraph);
        }
        Plotly.extendTraces('graph4', {y:[[getData("temp")]]}, [0]);
        cnt++;
        if(cnt > 20){
            Plotly.relayout('graph4', {
                xaxis: { range: [cnt-20, cnt]}
            })
        }
    }, 200)
    
}


