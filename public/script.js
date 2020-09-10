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
var interval;
var graphingstart = false;
var timeOuts;

//https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript
function AdjustingInterval(workFunc, interval, errorFunc) {
    var that = this;
    var expected, timeout;
    this.interval = interval;

    this.start = function() {
        expected = Date.now() + this.interval;
        timeout = setTimeout(step, this.interval);
    }

    this.stop = function() {
        clearTimeout(timeout);
    }

    function step() {
        var drift = Date.now() - expected;
        if (drift > that.interval) {
            // You could have some default stuff here too...
            if (errorFunc) errorFunc();
        }
        workFunc();
        expected += that.interval;
        timeout = setTimeout(step, Math.max(0, that.interval-drift));
    }
}

var doWork = function() {
    console.log("interval " + interval);
    if(model === 1){  
        pausing = false;
        console.log(new Date().getMilliseconds());
        playCurModelAudio();
    }
    else if(model === 2){
    
        pausing = false;
        playNewModelAudio();            
        
    }

};

// Define what to do if something goes wrong
var doError = function() {
    console.warn('The drift exceeded the interval.');
};

// (The third argument is optional)
var ticker = new AdjustingInterval(doWork, 1000, doError);

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
    if(model === 0) alert("Please Choose A Model");
    else if (model == 1 || checkifInstrumentSelected() == true){ 
        updateInterfaceVitalValues();
        for(var i=0; i<2; i++){
            sliders[i].addEventListener('input', intervalTime);
        }
        for(var i=5; i<8; i++){
            sliders[i].addEventListener('input', intervalTime);
        }
        currentModelBtn.addEventListener('click', intervalTime);
        newModelBtn.addEventListener('click', intervalTime);
        for(var i=0; i<sliders.length; i++){
            sliders[i].addEventListener('input', updateInterfaceVitalValues);
        }   
        playBtn.style.display = 'none';
        stopBtn.style.display = 'block';
        document.getElementById('interface').style.display = 'block';
        
        var temp = document.getElementsByClassName('instuments-type');
        if(temp[0]){
            temp[0].disabled = true;
            temp[1].disabled = true;
        } 
        graphingstart = true;
        graph();
        ticker.interval = interval;
        if(interval == Infinity) {
            flatLine();
        }
        else if(interval != Infinity){ 
            ticker.start();          
        }

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
    currentModelBtn.removeEventListener('click', intervalTime);
    newModelBtn.removeEventListener('click', intervalTime);
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
    graphingstart = false;
    ticker.stop();
    if(os!= null && interval == Infinity){
        isAlive();
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
    else if(model == 2){
        interval = (60 / sliders[5].value) * 1000;
        if(checkifInstrumentSelected() == false){
            ticker.stop();   
            stopClicked(); 
            return; 
        }
    }
    if(os!= null && interval != Infinity){isAlive();}
    if(interval != Infinity){
        ticker.stop();   
        ticker.interval = interval;
        ticker.start();
    }
    else{
        flatLine(); 
    }
}

var pausing = true;
var ctxs;
var os;

function flatLine(){
    ticker.stop();
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
    var trace1 = {
        y:[getHRData()],
        type:'line',
        line: {
            color: '#e5474b'
        }
    }
    var data = [trace1];
    
    var layout = {
        autosize: false,
        margin: {
            l: 40,
            r: 0,
            b: 20,
            t: 20,
            pad: 0
          },
        height: 110 ,
        width: widths
    }
    var config = {responsive: true}

    Plotly.newPlot('graph', data, layout, config)

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
    var trace1 = {
        y:[getData("bp")],
        type:'line',
        line: {
            color: '#e5474b'
        }
    }
    var data = [trace1];
    
    var layout = {
        autosize: false,
        margin: {
            l: 40,
            r: 0,
            b: 20,
            t: 20,
            pad: 0
          },
        height: 110 ,
        width: widths
    }
    var config = {responsive: true}

    Plotly.newPlot('graph1', data, layout, config)
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
    }, 40)
    
}
var widths = document.getElementsByClassName('content');
widths = widths[0].offsetWidth * .8;

function graphO2(){
    var trace1 = {
        y:[getData("o2")],
        type:'line',
        line: {
            color: '#e5474b'
        }
    }
    var data = [trace1];
    
    var layout = {
        autosize: false,
        margin: {
            l: 40,
            r: 0,
            b: 20,
            t: 20,
            pad: 0
          },
        height: 110 ,
        width: widths
    }
    var config = {responsive: true}

    Plotly.newPlot('graph2', data, layout, config)


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
    }, 40)
    
}

function graphRR(){
    var trace1 = {
        y:[getData("rr")],
        type:'line',
        line: {
            color: '#e5474b'
        }
    }
    var data = [trace1];
    
    var layout = {
        autosize: false,
        margin: {
            l: 40,
            r: 0,
            b: 20,
            t: 20,
            pad: 0
          },
        height: 110 ,
        width: widths
    }
    var config = {responsive: true}

    Plotly.newPlot('graph3', data, layout, config)

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
    }, 40)
    
}
function graphTemp(){
    var trace1 = {
        y:[getData("temp")],
        type:'line',
        line: {
            color: '#e5474b'
        }
    }
    var data = [trace1];
    
    var layout = {
        autosize: false,
        margin: {
            l: 40,
            r: 0,
            b: 20,
            t: 20,
            pad: 0
          },
        height: 110 ,
        width: widths
    }
    var config = {responsive: true}

    Plotly.newPlot('graph4', data, layout, config)

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
    }, 40)
    
}


