/***************************************************************
**Name:playCurModelAudio
**Description: Plays a single beep
**Resource: 
****Description: Adapted from brower-beep node modules 
****URL: https://www.npmjs.com/package/browser-beep
****************************************************************/
function playCurModelAudio() {
  
}

/***************************************************************
**Name:playNewModelAudio
**Description: Plays a single beep that interpolates two different oscillators
**Resource: 
****Description: Adapted from brower-beep node modules 
****URL: https://www.npmjs.com/package/browser-beep
****************************************************************/
function playNewModelAudio(){
   
}

/***************************************************************
**Name:checkifInstrumentSelected
**Description: Sees if instruments are selected when pressing play
****************************************************************/
function checkifInstrumentSelected(){
    var instrument =  document.getElementsByClassName('instuments-type');
    if (instrument[0].value == 'init' || instrument[1].value == 'init'){
        alert("Please Choose An Instrument");
        return false;
    }
    else if (instrument[0].value == instrument[1].value){
        alert("Please Choose Two Different Instruments");
        return false;
    }
    return true;
}

