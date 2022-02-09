const APP = {
  sw: null,
  deferredPrompt: null, //used for installing later
  isOnline: true, //TODO: check navigator.onLine
  init: () => {
    //when the page loads (runs on every page load)
    APP.registerSW();
    APP.addListeners();
    APP.updateNavCount();
  },
  registerSW: () => {
    //register the service worker
    navigator.serviceWorker.register('/sw.js').catch(function (err) {
      // Something went wrong during registration. The sw.js file
      // might be unavailable or contain a syntax error.
      console.warn(err);
    });
    navigator.serviceWorker.ready.then((registration) => {
      // .ready will never reject... just wait indefinitely
      APP.sw = registration.active;
      //save the reference to use later or use .ready again
    });
  },
  addListeners: () => {
    //add event listeners for DOM
    //TODO: add dom listener for navigating between home and other.

    //add event listeners for online and offline
    window.addEventListener('online', APP.changeStatus);
    window.addEventListener('offline', APP.changeStatus);

    //add listener for message
    navigator.serviceWorker.addEventListener('message', APP.gotMessage);

    //add listener for install event
    window.addEventListener('beforeinstallprompt', (ev) => {
      // Prevent the mini-infobar from appearing on mobile
      ev.preventDefault();
      // Save the event in a global property
      // so that it can be triggered later.
      APP.deferredPrompt = ev;
      console.log('deferredPrompt saved');
      // Build your own enhanced install experience
      // use the APP.deferredPrompt saved event
    });
  },
  changeStatus: (ev) => {
    //toggling between online and offline
    APP.isOnline = ev.type === 'online' ? true : false;
    //TODO: send message to sw about being online or offline
    //TODO: update something in the HTML to show offline
  },
  gotMessage: (ev) => {
    //received message from service worker
    console.log(ev.data);
  },
  sendMessage: (msg) => {
    //send messages to the service worker
    navigator.serviceWorker.ready.then((registration) => {
      registration.active.postMessage(msg);
    });
  },
  updateNavCount: (ev) => {
    //TODO: when the app loads check to see if the sessionStorage key
    //exists and if the number is greater than 4.
    //if yes, then call the deferred install prompt
    //check for null on APP.deferredPrompt
  },
};

document.addEventListener('DOMContentLoaded', APP.init);
