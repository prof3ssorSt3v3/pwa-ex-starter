const version = 1;
let isOnline = true; //will get updated via messaging
const staticCache = `pwaEx3StaticCache${version}`;
const dynamicCache = `pwaEx3DynamicCache${version}`;
const cacheList = [
  '/',
  '/index.html',
  '/other.html',
  '/404.html',
  '/css/main.css',
  '/js/app.js',
  '/manifest.json',
  //TODO: add all the icons from the img folder
  //TODO: add a google font in your css and here
  //TODO: if you add any other JS files include them here
];

//TODO: complete the functions for these events
self.addEventListener('install', (ev) => {
  ev.waitUntil(
    caches.open(cacheName).then((cache) => {
      //save the whole cacheList
      cache.addAll(cacheList);
    })
  );
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => {
              if (key === staticCache || key === dynamicCache) {
                return false;
              } else {
                return true;
              }
            })
            .map((key) => caches.delete(key))
        ); //keys.filter().map() returns an array of Promises
      })
      .catch(console.warn)
  );
});

self.addEventListener('fetch', (ev) => {
  //TODO:
  //update the script here to look in the caches first
  //if not in the cache check if online
  //if online, do a fetch
  //if fetch returns 404 and request.mode == 'navigation'
  //return the 404 page from the cache
  //save any new fetched files in the dynamic cache
  ev.respondWith(
    caches.match(ev.request).then((cacheRes) => {
      return (
        cacheRes ||
        fetch(ev.request)
          .then((fetchRes) => {
            //TODO: check here for the 404 error
            
            return caches.open(dynamicCache).then((cache) => {
              let copy = fetchRes.clone(); //make a copy of the response
              cache.put(ev.request, copy); //put the copy into the cache
              return fetchRes; //send the original response back up the chain
            });
          })
          .catch((err) => {
            console.log('SW fetch failed');
            console.warn(err);
            //if we were offline then the fetch() will fail
            //check for 404 and ev.request properties
            //ev.request.mode == 'navigation'
            //ev.request.url.pathname
            //ev.request.headers.get('Content-Type');
          })
      );
    })
  ); //what do we want to send to the browser?
};);

self.addEventListener('message', (ev) => {
  console.log(ev.data);
  //message received from script
  if (ev.data.ONLINE) {
    isOnline = ev.data.ONLINE;
    //we could confirm if actually online and send a message to the browser if not
    // use a fetch with method: HEAD to do this
    // in the webpage-side code set a timer to resend the online message 
    // which will trigger this code again
  }
  //handle other messages from the browser...
  //EG: CLEARDYNAMICCACHE, CLEARSTATICCACHE, LOADFILE, CONFIRMONLINE, 
  //    GETFROMDB, etc
});

function sendMessage(msg) {
  //send a message to the browser
  //from the service Worker
  //code from messaging.js Client API send message code
  self.clients.matchAll().then(function (clients) {
    if (clients && clients.length) {
      //Respond to last focused tab
      clients[0].postMessage(msg);
    }
  });
  //See the code from the online video for the version that messages ALL Clients
}
