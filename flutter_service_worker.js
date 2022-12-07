'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "0011391da54dec8027e5e6795c2f5cf9",
"index.html": "9530dda7c957b202cc1051e775cb11f3",
"/": "9530dda7c957b202cc1051e775cb11f3",
"main.dart.js": "f12d025728aad860e736464673342a70",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "c6a51d3af52febd1139947e94ab573fc",
"assets/AssetManifest.json": "4063766200e4877f190fb7351965f283",
"assets/NOTICES": "4d02f90f78a7d19e4917a1613da6f070",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/shaders/ink_sparkle.frag": "4a416fbe67aeb42375292b4d0f2ffa20",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/assets/icons/icon.png": "df8c6ce39e141965a61e935e3303c651",
"assets/assets/icons/drawericons-right.png": "8c64197c956746144ebd365cf8bfe3b0",
"assets/assets/icons/Logout.svg": "72e70359d58453211e79bb6997fe8b16",
"assets/assets/icons/BlogPost.svg": "1591f545f50891d42ea10d582104ed1e",
"assets/assets/icons/Comments.svg": "fe5526f5e201592904e18e0222463199",
"assets/assets/icons/Post.svg": "e6d121c4a6ec5cd00e9c56e647f5fe9b",
"assets/assets/icons/User_image.png": "e6f143107b1b063346a707806c243a73",
"assets/assets/icons/Logout.png": "990df04120b9ea646dae4feb4cb792eb",
"assets/assets/icons/Bell.svg": "9bc59ab4b881ce8834756d6efb9727e4",
"assets/assets/icons/Dashboard.svg": "9fe5ff508d43a7ab5e9e04cb95460e82",
"assets/assets/icons/Pages.svg": "b6036bea7a2a60a8cd0807d1edc0abd0",
"assets/assets/icons/privacy.png": "032e79ad5823ac6bcd501899fcb29c25",
"assets/assets/icons/personal_detail.png": "1ac77fbe63e91605dce04fa02e0fd237",
"assets/assets/icons/Setting.svg": "93dc419a0a2ee4ff7be14c7fabe39c0d",
"assets/assets/icons/Message.svg": "37140f65978e0b67dc31bd815c72af9f",
"assets/assets/icons/Facebook.svg": "e299329132035bb7434be11c853249e2",
"assets/assets/icons/Rate.png": "d88db0fbb5a55055311cfaefc74d9e18",
"assets/assets/icons/Subscribers.svg": "b41a302e79395e32514c221029b7f035",
"assets/assets/icons/language.png": "b8c38b9702d29276a320ded8c4b762b3",
"assets/assets/icons/Dribbble.svg": "ada20573b623c94cc622b680ba937148",
"assets/assets/icons/FAQ.png": "2349a33b0e91726b667a8c3300a024b0",
"assets/assets/icons/Linkedin.svg": "4f2cc8c28af3049b543d44ac3d47628e",
"assets/assets/icons/Twitter.svg": "0776622b3e786189d271a58d6eaed86e",
"assets/assets/icons/About.png": "3c8cccd85b9dc7292a3de5becc0319f8",
"assets/assets/icons/drawer_verify_icons.png": "509b559c1ecdf905562b45ee5d13c902",
"assets/assets/icons/logo.svg": "45466ca51304b62b8e56e35b03c93da8",
"assets/assets/icons/Chat.png": "66efb27212c3e5db21731ca1ab896e8d",
"assets/assets/icons/Statistics.svg": "0853d0fbb5dce77eee9d45129b8c11c4",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
