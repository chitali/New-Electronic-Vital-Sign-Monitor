/***************************************************************
**Name: Global Variables
****************************************************************/
var instrument =  document.getElementsByClassName('instuments-type');

/***************************************************************
**Name:playCurModelAudio
**Description: Opens the current audio file and plays a single beep
****************************************************************/
function playCurModelAudio(){
  // Use one instrument or find the actual version?
  var pitch = frequencySetter();
  var audioPath, audioFolder;
  audioPath = 'Cello+Horn' + '/Pitch'+ pitch + '_C0H1.wav';
  var audio = new Audio(audioPath);
  audio.play();

}

/***************************************************************
**Name:playNewModelAudio
****Description: Opens the current audio file and plays a single beep 
****************************************************************/
function playNewModelAudio(){
    var pitch = frequencySetter();
    var audioPath, audioFolder;
    if((instrument[0].value == 'Cello' || instrument[0].value == 'Horn') && (instrument[1].value == 'Cello' ||instrument[1].value == 'Horn')) audioFolder = 'Cello+Horn';
    audioPath = audioFolder + '/Pitch'+ pitch + '_' + o2content('C', 'H') + '.wav';
    var audio = new Audio(audioPath);
    audio.play();
}

/***************************************************************
**Name:checkifInstrumentSelected
**Description: Sees if instruments are selected when pressing play
****************************************************************/
function checkifInstrumentSelected(){
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

/***************************************************************
**Name:frequencySetter
**Description: Determines which frequency should be played depending on Blood Pressure
****************************************************************/
function frequencySetter(){
    var bp;
    var frequency;
    if(model === 1) bp = sliders[1].value;
    else if(model === 2) bp = sliders[6].value;
    frequency = Math.floor(bp / 10 - 1); 
    frequency = 21 - frequency;
    if (frequency < 1) frequency =  1;
    if (frequency > 20) frequency =  20;
    return String(frequency);
}

/***************************************************************
**Name:o2content
**Description:Creates a substring of the filename concerning with the instrument interpolation amount 
****************************************************************/
function o2content(a, b){
    var O2 = o2range(); 
    var CO2 = 1 - O2;
    CO2 = Math.round(10*CO2)/10
    var fileNamePart;
    if(instrument[0].value[0] == a){
        fileNamePart = a + CO2 + b + O2;
    }
    else{
        fileNamePart = a + O2 + b + CO2;
    }
    return fileNamePart;
}

