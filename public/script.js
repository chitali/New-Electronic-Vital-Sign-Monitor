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

/*
**Event Listeners
*/
currentModelBtn.addEventListener('click', currentModel);
newModelBtn.addEventListener('click', newModel);
playBtn.addEventListener('click', play);
for(var i=0; i<(sliders.length); i++) {
    sliders[i].addEventListener('input', function() {
        document.getElementById(this.getAttribute('id')+'val').textContent = this.value;
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
    console.log("The element at index is:", model);
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
    console.log("The element at index is:", model);
}

/***************************************************************
**Name:frequencySetter
**Description: Determines which frequency should be played depending on Blood Pressure
****************************************************************/
function play(){
    if(model === 0){
        alert("Please Choose what model you would like to hear");
    }
    else{
        document.getElementById("warning").innerHTML ="";
        playBtn.style.display = 'none';
        stopBtn.style.display = 'block';
        beep();
    }  
}

/***************************************************************
**Name:playCurModelAudio
**Description: Plays a single beep
**Resource: 
****Description: Adapted from brower-beep node modules 
****URL: https://www.npmjs.com/package/browser-beep
****************************************************************/
function playCurModelAudio() {

    var context = new AudioContext();
    var currentTime = context.currentTime
    var osc = context.createOscillator()
    var gain = context.createGain()

    osc.connect(gain)
    gain.connect(context.destination)

    gain.gain.setValueAtTime(gain.gain.value, currentTime)
    gain.gain.exponentialRampToValueAtTime(RAMP_VALUE, currentTime + RAMP_DURATION)

    osc.onended = function () {
    gain.disconnect(context.destination)
    osc.disconnect(gain)
    }

    osc.type = 'sine'
    osc.frequency.value = frequencySetter()
    osc.start(currentTime)
    osc.stop(currentTime + RAMP_DURATION)
}

/***************************************************************
**Name:playNewModelAudio
**Description: Plays a single beep that interpolates two different oscillators
**Resource: 
****Description: Adapted from brower-beep node modules 
****URL: https://www.npmjs.com/package/browser-beep
****************************************************************/
function playNewModelAudio(){
    var o2content = sliders[4].value / 100
    var context = new AudioContext();
    var currentTime = context.currentTime;
    var osc = context.createOscillator();
    var osc1 = context.createOscillator();
    var gain = context.createGain();
    var oscGain = context.createGain();
    var oscGain1 = context.createGain();

    osc.connect(oscGain);
    osc1.connect(oscGain1);
    oscGain.connect(gain);
    oscGain1.connect(gain);
    gain.connect(context.destination)
    oscGain.gain.value = o2content;
    oscGain1.gain.value = 1- o2content;

    gain.gain.setValueAtTime(gain.gain.value, currentTime)
    gain.gain.exponentialRampToValueAtTime(RAMP_VALUE, currentTime + RAMP_DURATION)

    osc.onended = function () {
    gain.disconnect(context.destination)
    oscGain1.disconnect(gain)
    oscGain.disconnect(gain)
    osc.disconnect(oscGain)
    osc1.disconnect(oscGain1)
    }

    osc.type = 'sine'
    osc1.type='square'
    osc.frequency.value = frequencySetter()
    osc1.frequency.value = frequencySetter()
    osc.start(currentTime)
    osc1.start(currentTime)
    osc.stop(currentTime + RAMP_DURATION)
    osc1.stop(currentTime + RAMP_DURATION)

}



/***************************************************************
**Name:stopBtn.addEventListener
**Description: If the stop button is clicked set stopclicked to true to end loop
****************************************************************/
stopBtn.addEventListener('click', function (){
    playBtn.style.display = 'block';
    stopBtn.style.display = 'none';
    stopclicked = true;
 });

/***************************************************************
**Name:beep
**Description: Determines wich model is choosen and loops through and beeps till the user stops the audio via the stop button
**Resource Description: Adapted from brower-beep node modules 
**Resource: https://www.npmjs.com/package/browser-beep
****************************************************************/
function beep () {
    var interval;
    var interfaceValues = document.getElementById('labels');
    var oxygenValue = document.getElementsByClassName('o2');
    var displayValue = document.getElementsByClassName('val'); 

    (function loop () {
        if (stopclicked === true){
            stopclicked = false;
            return 0;
        }
        else{
            if(model === 1){
                interval = (60 / sliders[0].value) * 1000;
                displayValue[0].textContent = sliders[0].value;
                displayValue[1].textContent = sliders[1].value;
                interfaceValues.style.display = 'block';
                oxygenValue[0].style.display = 'none';

                if(sliders[0].value != 0){
                    sliders[0].removeEventListener('input', loop);
                    playCurModelAudio();
                    setTimeout(loop, interval)
                }
                else{
                    sliders[0].addEventListener('input', loop); 
                }
            }
            else if (model === 2){
                interval = (60 / sliders[2].value) * 1000;
                displayValue[0].textContent = sliders[2].value;
                displayValue[1].textContent = sliders[3].value;
                displayValue[2].textContent = sliders[4].value;
                interfaceValues.style.display = 'block';
                oxygenValue[0].style.display = 'block';

                if(sliders[2].value != 0){
                    sliders[2].removeEventListener('input', loop);
                    playNewModelAudio();
                    setTimeout(loop, interval)
                }
                else{
                    sliders[2].addEventListener('input', loop); 
                }
                
            }
        }
        
         
    })(0)
}
/***************************************************************
**Name:frequencySetter
**Description: Determines which frequency should be played depending on Blood Pressure
****************************************************************/
function frequencySetter(){
    var bp;
    var frequency;
    if(model === 1){
        bp = sliders[1].value
    }
    else if(model === 2){
        bp = sliders[3].value
    }
    if(bp>= 0 && bp< 20){
        frequency = 73.42;
    }
    else if(bp>= 20 && bp< 30){
        frequency = 82.41; 
    }
    else if(bp>= 30 && bp< 40){
        frequency = 92.50;
    }
    else if(bp>= 40 && bp< 50){
        frequency = 103.83;
    }
    else if(bp>= 50 && bp< 60){
        frequency = 116.54;       
    }
    else if(bp>= 60 && bp< 70){
        frequency = 130.81;    
    }
    else if(bp>= 70 && bp< 80){
        frequency = 146.83;   
    }
    else if(bp>= 80 && bp< 90){
        frequency = 164.81;  
    }
    else if(bp>= 90 && bp< 100){
        frequency = 185;  
    }
    else if(bp>= 100 && bp< 110){
        frequency = 207.65;  
    }
    else if(bp>= 110 && bp< 120){
        frequency = 233.08;  
    }
    else if(bp>= 120 && bp< 130){
        frequency = 261.63;  
    }
    else if(bp>= 130 && bp< 140){
        frequency = 293.66; 
    }
    else if(bp>= 140 && bp< 150){
        frequency = 329.63;  
    }
    else if(bp>= 150 && bp< 160){
        frequency = 369.99;  
    }
    else if(bp>= 160 && bp< 170){
        frequency = 415.30;  
    }
    else if(bp>= 170 && bp< 180){
        frequency = 466.16;  
    }
    else if(bp>= 180 && bp< 190){
        frequency = 523.25;  
    }
    else if(bp>= 190 && bp< 200){
        frequency =  587.33;  
    } else if(bp>= 200 && bp< 210){
        frequency = 659.26;  
    }
    else if(bp>= 210){
        frequency = 739.99;  
    }

    return frequency;
}