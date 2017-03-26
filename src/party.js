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

let reselectSliderBtn = null;
let reselectTouchBar = null;
let reselectSlider = null;
let reselectParrotBtn = null;

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
const initTouchBarWithParrots = () => { return [ reselectParrotBtn, stopBtn, slowerBtn, fasterBtn, parrots[0], parrots[1] ]; }

const initReselectParrotBtn = () => {
  reselectParrotBtn = new TouchBarButton({
    label: 'next parrot?',
    backgroundColor: '#000',
    click: () => {
      window.setTouchBar(reselectTouchBar);
      clearTimeout(parrotTimeout);
      animateParrots();
    }
  })
}

const initReselect = () => {
  initReselectParrotBtn();
  initReselectSliderBtn();
  initReselectSlider();
  initReselectTouchBar();

  popover = new TouchBarPopover({ label: 'next parrot?', items: reselectTouchBar, showCloseButton: true })
}

const initReselectTouchBar = () => { reselectTouchBar = [reselectSliderBtn, reselectSlider]; }

const initReselectSliderBtn = () => {
  reselectSliderBtn = new TouchBarButton({
    label: 'Move slider to choose parrot!',
    backgroundColor: '#000',
    click: () => {
      if (!parrotDisplayType){ return }
      setNewTouchBar();
    }
  })
}

const initReselectSlider = () => {
  reselectSlider = new TouchBarSlider({
    value: 1,
    minValue: 0,
    maxValue: parrotsAmount,
    change: (newValue) => {
      if(newValue == parrotsAmount) { newValue--; }
      parrotDisplayType = parrotTypes[newValue];
      reselectSliderBtn.icon = parrotConfigs[parrotDisplayType]['coverImage'];
      reselectSliderBtn.label = parrotDisplayType;
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

const parrotsLoader = () => {
  const loaderPromise = new Promise( (resolve, reject) => {
    fs.readdir(assetsFolderPath, (err, files) => {
      const dirTotalCount = files.length;
      let dirCounter = 0;
      files.forEach(parrotDirName => {
        let parrotAssetsDirPath = `${assetsFolderPath}${parrotDirName}/`;
        fs.readdir(parrotAssetsDirPath, (err, files) => {
          parrotTypes.push(parrotDirName)
          parrotConfigs[parrotDirName] = {
            coverImage: `${parrotAssetsDirPath}cover_image.png`, framesAmount: (files.length - 1)
          }
          dirCounter = dirCounter + 1;
          if(dirCounter == dirTotalCount){ resolve() }
        })
      });
    })
  })

  return loaderPromise;
}

app.once('ready', () => {
  window = new BrowserWindow({ width: 200, height: 200 });
  parrotsLoader().then( () => {
    parrotsAmount = Object.keys(parrotConfigs).length;
    initParrots();
    initSlider();
    touchBar = new TouchBar(initTouchBar());
    initReselect()
    window.loadURL(`file://${path.join(__dirname, '/index.html')}`);
    window.setTouchBar(touchBar);
  })
})

// Quit when all windows are closed and no other one is listening to this.
app.on('window-all-closed', () => {
    app.quit();
});
