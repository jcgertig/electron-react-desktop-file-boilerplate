import storage from 'electron-json-storage';
import { writeFileSync as write, readFile as read } from 'fs';
import { dialog, ipcRenderer } from 'electron';
import { isString } from 'lodash';
import { FILE, FILE_DATA, FILE_CHANGED, TRIGGER_SAVE, DATA_READY_FOR_SAVE } from './consts';

const baseFilters = [
  { name: 'JSON', extensions: ['json', 'JSON'] }
];

const baseFormater = (content) => JSON.stringify(content, null, 2);

export function saveContentToFile(content) {
  if (!isString(content)) {
    content = JSON.stringify(content); // eslint-disable-line
  }
  storage.set(FILE_DATA, content, (error) => {
    if (error) { throw error; }

    ipcRenderer.send(DATA_READY_FOR_SAVE, 'ping');
  });
}

export function clearData() {
  storage.remove(FILE_DATA);
}

export function saveFile(cb = () => {}, formater = baseFormater) {
  storage.has(FILE, (error, hasKey) => {
    if (error) {
      dialog.showErrorBox(
        'Unable To Find File',
        'There was a error while trying to find the filepath.'
      );
      clearData();
    }

    if (hasKey) {
      storage.get(FILE, (innerError, data) => {
        if (innerError) {
          dialog.showErrorBox(
            'Unable To Find File',
            'There was a error while trying to find the filepath.'
          );
          clearData();
        }

        if (data) {
          storage.get(FILE_DATA, (innerError2, content) => {
            if (innerError2) {
              dialog.showErrorBox(
                'Unable To Get File Data',
                'There was a error while trying to get the new file data.'
              );
            }

            if (content) {
              write(data.filePath, formater(content));
              dialog.showMessageBox(null, {
                type: 'info',
                buttons: [],
                title: 'Success',
                message: 'File saved successfully.'
              });
              cb();
            }
            clearData();
          });
        }
      });
    }
  });
}

export function openFile(mainRenderer, renderer, filters = baseFilters) {
  dialog.showOpenDialog({ filters }, (fileNames) => {
    if (typeof fileNames === 'undefined') { return; }
    const fileName = fileNames[0];
    storage.set(FILE, { filePath: fileName }, (error) => {
      if (error) {
        dialog.showErrorBox(
          'Unable To Open File',
          'There was a error while trying to save the filepath.'
        );
      } else {
        if (mainRenderer !== null) {
          mainRenderer.send(FILE_CHANGED, 'pong');
        }
        if (renderer !== null) {
          renderer.send(FILE_CHANGED, 'pong');
        }
      }
    });
  });
}

export function getJSONFileContent() {
  return getFileContent(JSON.parse);
}

export function getFileContent(parser = (c) => c) {
  return new Promise((resolve, reject) => {
    storage.has(FILE, (error, hasKey) => {
      if (error) reject(error);

      if (hasKey) {
        storage.get(FILE, (innerError, data) => {
          if (innerError) reject(innerError);

          let content = null;
          let broken = false;

          read(data.filePath, 'utf8', (err, fileData) => {
            if (err) {
              reject(err);
            } else {
              try {
                content = parser(fileData);
              } catch (e) {
                reject(e);
                broken = true;
              }

              if (!broken) {
                resolve(content);
              }
            }
          });
        });
      }
    });
  });
}

export function triggerSave(mainRenderer, renderer) {
  if (mainRenderer !== null) {
    mainRenderer.send(TRIGGER_SAVE, 'pong');
  }
  if (renderer !== null) {
    renderer.send(TRIGGER_SAVE, 'pong');
  }
}
