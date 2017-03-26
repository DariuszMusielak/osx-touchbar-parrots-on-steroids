const fs = require('fs');
const path = require('path');
const {app, BrowserWindow, TouchBar} = require('electron');

const {TouchBarLabel, TouchBarButton, TouchBarSpacer, TouchBarSlider, TouchBarPopover} = TouchBar;

const numOfParrotsToDisplay = 2;
const parrots = [];
let parrotsShouldDance = true;
let parrotsSpeed = 30;
let parrotTimeout = '';
let parrotDisplayType = false;
let parrotsAmount = 0;
const assetsFolderPath = path.join(__dirname, '/parrot/assets/');
let parrotConfigs = {};
let parrotFrame = 1;
let parrotTypes = [];

let touchBar = null;

let slider = null;
let sliderBtn = null;

let popoverSliderBtn = null;
let popoverTouchBar = null;
let popoverSlider = null;

let window;

const initParrots = () => {
  let backgroundsFolderPath = `${assetsFolderPath}${parrotDisplayType}/001.png`;
  for (let x = 0; x < numOfParrotsToDisplay; x++) {
    parrots.push(new TouchBarButton({ icon: backgroundsFolderPath, backgroundColor: '#000' }));
  }
  return parrots;
};

const initSlider = () => {
  initSliderBtn();
  slider = new TouchBarSlider({
    value: 1,
    minValue: 0,
    maxValue: parrotsAmount,
    change: (newValue) => {
      if(newValue == parrotsAmount) { newValue--; }
      parrotDisplayType = parrotTypes[newValue];
      sliderBtn.icon = parrotConfigs[parrotDisplayType]['coverImage'];
      sliderBtn.label = parrotDisplayType;
    }
  })
}

const initTouchBar = () => { return [sliderBtn, slider]; }
const initTouchBarWithParrots = () => { return [ popover, stopBtn, slowerBtn, fasterBtn, parrots[0], parrots[1] ]; }



const initPopover = () => {
  initPopoverSliderBtn();
  initPopoverSlider();
  popoverTouchBar = initPopoverTouchBar();

  popover = new TouchBarPopover({ label: 'next parrot?', items: popoverTouchBar, showCloseButton: true })
}


const initPopoverTouchBar = () => { return [popoverSliderBtn, popoverSlider]; }

const initPopoverSliderBtn = () => {
  popoverSliderBtn = new TouchBarButton({
    label: 'Move slider to choose parrot!',
    backgroundColor: '#000',
    click: () => {
      if (!parrotDisplayType){ return }
      setNewTouchBar();
    }
  })
}

const initPopoverSlider = () => {
  popoverSlider = new TouchBarSlider({
    value: 1,
    minValue: 0,
    maxValue: parrotsAmount,
    change: (newValue) => {
      if(newValue == parrotsAmount) { newValue--; }
      parrotDisplayType = parrotTypes[newValue];
      popoverSliderBtn.icon = parrotConfigs[parrotDisplayType]['coverImage'];
      popoverSliderBtn.label = parrotDisplayType;
    }
  })
}

const initSliderBtn = () => {
  sliderBtn = new TouchBarButton({
    label: 'Move slider to choose parrot!',
    backgroundColor: '#000',
    click: () => {
      if (!parrotDisplayType){ return }
      setNewTouchBar();
    }
  })
}

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

const updateParrotsFrames = () => {
  if (parrotFrame > parrotConfigs[parrotDisplayType].framesAmount + 1) {
    parrotFrame = 1;
  } else {
    parrotFrame += 1;
  }
  const parrotPath = `${assetsFolderPath}${parrotDisplayType}/00${parrotFrame}.png`;

  for (let x = 0; x < numOfParrotsToDisplay; x++) {
    if(parrotsShouldDance) { parrots[x].icon = parrotPath; }
  }
  parrotTimeout = setTimeout(updateParrotsFrames, parrotsSpeed)
}

const animateParrots = () => { updateParrotsFrames() };

const parrotsDirectories = () => {
  const dirPromise = new Promise( (resolve, reject) => {
    fs.readdir(assetsFolderPath, (err, files) => {
      const dirAmount = files.length;
      let dirCounter = 0;
      files.forEach(directoryName => {
        let backgroundsFolderPath = `${assetsFolderPath}${directoryName}/`;
        fs.readdir(backgroundsFolderPath, (err, files) => {
          parrotTypes.push(directoryName)
          parrotConfigs[directoryName] = {
            coverImage: `${backgroundsFolderPath}cover_image.png`, framesAmount: (files.length - 1)
          }
          dirCounter = dirCounter + 1;
          if(dirCounter == dirAmount){ resolve() }
        })
      });
    })
  })

  return dirPromise;
}

app.once('ready', () => {
  window = new BrowserWindow({ width: 200, height: 200 });
  parrotsDirectories().then( () => {
    parrotsAmount = Object.keys(parrotConfigs).length;
    initParrots();
    initSlider();
    touchBar = new TouchBar(initTouchBar());
    initPopover()
    window.loadURL(`file://${path.join(__dirname, '/index.html')}`);
    window.setTouchBar(touchBar);
  })
})

// Quit when all windows are closed and no other one is listening to this.
app.on('window-all-closed', () => {
    app.quit();
});
