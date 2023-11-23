/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */

import { precacheAndRoute } from 'workbox-precaching'

importScripts("OneSignalSDKWorker.js");
importScripts("OneSignalSDKUpdaterWorker.js");

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST)
