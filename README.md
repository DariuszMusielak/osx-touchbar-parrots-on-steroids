# osx-touchbar-parrots-on-steroids

I found this awesome and decided to add some new features to original version [osx-touchbar-party-parrot](https://github.com/mjaniszew/osx-touchbar-party-parrot):
- select type of parot
- click on ⏸ to pause parrot
- click on 🔥 to speed up parrot
- click on 👮 to slow down parrot
- switch between parrot's types

![alt tag](https://media.giphy.com/media/2KZR91TA1AubK/giphy.gif)

Do you want new parrot? Just add them!

It displays Party Parrots on MacBook's Pro Touch Bar using Electron. Because we need Party Parrots everywhere and running parrots too!

# installation

`npm install` to install all dependencies

`npm start` to run Party Parrots on MacBook's Pro fan https://media.giphy.com/media/2KZR91TA1AubK/giphy.gifcy Touch Bar and serve its true purpose

`npm test` to test parrots

# Add new parrot! Or something else :)

1. Go to `src/parrot/assets/` and create new directory with name for your Gif. (name of this directory will be displayed on button)
2. Prepare frames for you own Gif.
  - Format: PNG with transparent background,
  - Resolution: 128x128
  - File name: `00X.png` when `X` is a number starting from 1. (001.png, 002.png, ... , 0010.png, 0011.png)
4. Put frames in your new directory.
5. Prepare `cover_image.png` and put it in the same folder.
6. Run application and play with your awesome Gif.

## Do you want to share your awesome Gif? Do it! Just create pull request with your changes.
