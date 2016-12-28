import { ipcRenderer } from 'electron';
import { isArray } from 'lodash';

import {
  TRIGGER_WINDOW_ACTION, REGISTER_MAIN, REGISTER, FILE_CHANGED, TRIGGER_SAVE, TRIGGER_FILE_OPEN
} from './consts';

export function triggerAction(action = '', args = []) {
  if (!isArray(args)) {
    args = [args]; // eslint-disable-line no-param-reassign
  }
  return JSON.parse(ipcRenderer.sendSync(TRIGGER_WINDOW_ACTION, JSON.stringify({ action, args })));
}

export function setFullScreen(bool = true) {
  return triggerAction('setFullScreen', bool);
}

export function closeWindow() {
  return triggerAction('close');
}

export function minimizeWindow() {
  return triggerAction('minimize');
}

export function isWindowFullscreen() {
  return triggerAction('isFullScreen');
}

export function registerMain() {
  ipcRenderer.send(REGISTER_MAIN, 'ping');
  return ipcRenderer;
}

export function register() {
  ipcRenderer.send(REGISTER, 'ping');
  return ipcRenderer;
}

export function triggerFileOpen(filters) {
  ipcRenderer.send(TRIGGER_FILE_OPEN, JSON.stringify({ filters }));
}

export function addFileChangeHandler(renderer, cb) {
  renderer.on(FILE_CHANGED, cb);
}

export function addSaveTriggerHandler(renderer, cb) {
  renderer.on(TRIGGER_SAVE, cb);
}
