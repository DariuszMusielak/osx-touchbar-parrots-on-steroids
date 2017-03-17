const path = require('path');
const {app, BrowserWindow, TouchBar} = require('electron');

const {TouchBarLabel, TouchBarButton, TouchBarSpacer, TouchBarSlider} = TouchBar

const numOfParrotsToDisplay = 2;
const parrots = [];
let parrotsShouldDance = true;
let parrotsSpeed = 30;
let parrotTimeout = ''

let parrotDisplayType = false;

let parrotConfig = {
  dance: { coverImage: '005.png', framesAmount: 9 },
  run:   { coverImage: '006.png', framesAmount: 19 }
}

const initParrots = () => {
  for (let x = 0; x < numOfParrotsToDisplay; x++) {
    parrots.push(new TouchBarButton({
      icon: path.join(__dirname, `/parrot/${parrotDisplayType}/001.png`),
      backgroundColor: '#000'
    }));
  }
  return parrots;
};

const initTouchBar = () => { return [sliderBtn, slider]; }

const initTouchBarWithParrots = () => {
  initParrots();
  return [ parrotBtn(), stopBtn, slowerBtn, fasterBtn, parrots[0], parrots[1] ];
}

const parrotBtn = () => {
  if(parrotDisplayType == 'dance'){ return parrot_1; }else{ return parrot_2; }
}

const parrot_1 = new TouchBarButton({
  label: 'Run',
  backgroundColor: '#000',
  click: () => { parrotDisplayType = 'run'; setNewTouchBar(); }
})

const parrot_2 = new TouchBarButton({
  label: 'Dance',
  backgroundColor: '#000',
  click: () => { parrotDisplayType = 'dance'; setNewTouchBar(); }
})

const sliderBtn = new TouchBarButton({
  label: 'Move slider to choose parrot!',
  backgroundColor: '#000',
  click: () => {
    if (!parrotDisplayType){ return }
    setNewTouchBar();
  }
})

const slider = new TouchBarSlider({
  value: 1,
  minValue: 1,
  maxValue: 3,
  change: (newValue) => {
    if (newValue == 1) { parrotDisplayType = 'dance'; }else{ parrotDisplayType = 'run'; }
    sliderBtn.icon = path.join(__dirname, `/parrot/${parrotDisplayType}/${parrotConfig[parrotDisplayType]['coverImage']}`);
    sliderBtn.label = `${parrotDisplayType}`;
  }
})

const stopBtn = new TouchBarButton({
  label: '⏸',
  backgroundColor: '#000000',
  click: () => { if(parrotsShouldDance) { parrotsShouldDance = false; } else { parrotsShouldDance = true; } }
})

const slowerBtn = new TouchBarButton({
  label: '👮',
  backgroundColor: '#000000',
  click: () => { parrotsSpeed = parrotsSpeed + 5 }
})

const fasterBtn = new TouchBarButton({
  label: '🔥',
  backgroundColor: '#000000',
  click: () => { if (parrotsSpeed - 5 > 0) { parrotsSpeed = parrotsSpeed - 5 }else{ parrotsSpeed = 1 } }
})

const setNewTouchBar = () => {
  let newTouchBar = new TouchBar(initTouchBarWithParrots());
  window.setTouchBar(newTouchBar);
  clearTimeout(parrotTimeout);
  animateParrots();
}

const touchBar = new TouchBar(initTouchBar());

let parrotFrame = 1;

const updateParrotsFrames = () => {
  if (parrotFrame > parrotConfig[parrotDisplayType].framesAmount + 1) {
    parrotFrame = 1;
  } else {
    parrotFrame += 1;
  }

  const parrotPath = path.join(__dirname, `/parrot/${parrotDisplayType}/00${parrotFrame}.png`);

  for (let x = 0; x < numOfParrotsToDisplay; x++) {
    if(parrotsShouldDance) { parrots[x].icon = parrotPath; }
  }
  parrotTimeout = setTimeout(updateParrotsFrames, parrotsSpeed)
}

const animateParrots = () => { updateParrotsFrames() };

let window;

app.once('ready', () => {
    window = new BrowserWindow({
        width: 200,
        height: 200
    });
    window.loadURL(`file://${path.join(__dirname, '/index.html')}`);
    window.setTouchBar(touchBar);
})

// Quit when all windows are closed and no other one is listening to this.
app.on('window-all-closed', () => {
    app.quit();
});
