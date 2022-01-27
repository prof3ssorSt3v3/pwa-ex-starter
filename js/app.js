const APP = {
  sw: null,
  isOnline: true,
  init: () => {
    //when the page loads
  },
  registerSW: () => {
    //register the service worker
    //add listener for message
  },
  installSW: () => {
    //install the service worker
  },
  sendMessage: (msg) => {
    //send messages to the service worker
  },
};

document.addEventListener('DOMContentLoaded', APP.init);
