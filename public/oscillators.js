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
    var o2content = o2range();
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
    oscGain1.gain.value = Math.round(10*(1- o2content))/10;

    gain.gain.setValueAtTime(gain.gain.value, currentTime)
    gain.gain.exponentialRampToValueAtTime(RAMP_VALUE, currentTime + RAMP_DURATION)

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
        bp = sliders[6].value
    }
    if(bp>= 0 && bp< 30)frequency = 82.41; 
    else if(bp>= 30 && bp< 40) frequency = 92.50;
    else if(bp>= 40 && bp< 50) frequency = 103.83;
    else if(bp>= 50 && bp< 60) frequency = 116.54;       
    else if(bp>= 60 && bp< 70) frequency = 130.81;
    else if(bp>= 70 && bp< 80) frequency = 146.83;
    else if(bp>= 80 && bp< 90) frequency = 164.81;
    else if(bp>= 90 && bp< 100) frequency = 185;  
    else if(bp>= 100 && bp< 110) frequency = 207.65;  
    else if(bp>= 110 && bp< 120) frequency = 233.08;  
    else if(bp>= 120 && bp< 130) frequency = 261.63;  
    else if(bp>= 130 && bp< 140) frequency = 293.66; 
    else if(bp>= 140 && bp< 150) frequency = 329.63;  
    else if(bp>= 150 && bp< 160) frequency = 369.99; 
    else if(bp>= 160 && bp< 170) frequency = 415.30;  
    else if(bp>= 170 && bp< 180)frequency = 466.16;  
    else if(bp>= 180 && bp< 190) frequency = 523.25;  
    else if(bp>= 190 && bp< 200) frequency =  587.33;  
    else if(bp>= 200 && bp< 210) frequency = 659.26;  
    else if(bp>= 210) frequency = 739.99; 
    return frequency;
}

/***************************************************************
**Name:checkifInstrumentSelected
**Description: Returns true because uses oscillators not instruments, so it is always true
****************************************************************/
function checkifInstrumentSelected(){
    return true;
}
