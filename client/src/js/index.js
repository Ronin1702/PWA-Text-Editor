// core-js/stable is a polyfill library that includes ES2019+ features such as Array.prototype.flat() and Array.prototype.flatMap() that are not supported in older browsers.
import 'core-js/stable';

// regenerator-runtime/runtime is a library that enables async/await syntax to work in older browsers. 
import 'regenerator-runtime/runtime';

import { Workbox } from 'workbox-window';
import Editor from './editor';
import './database';
import '../css/style.css';

const main = document.querySelector('#main');
main.innerHTML = '';

const loadSpinner = () => {
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  spinner.innerHTML = `
  <div class="loading-container">
  <div class="loading-spinner" />
  </div>
  `;
  main.appendChild(spinner);
};

const editor = new Editor();

if (typeof editor === 'undefined') {
  loadSpinner();
}

// Check if service workers are supported
if ('serviceWorker' in navigator) {
  // register workbox service worker
  const workboxSW = new Workbox('/dist-sw.js');
  workboxSW.register();
} else {
  console.error('Service workers are not supported in this browser.');
}
