// @flow
import React, { Component, Children, cloneElement } from 'react';
import { TitleBar as WinTitleBar } from 'react-desktop/windows';
import { TitleBar as DarTitleBar } from 'react-desktop/macOs';
import os from 'os';

import {
  registerMain, addFileChangeHandler, triggerFileOpen,
  isWindowFullscreen, setFullScreen, closeWindow, minimizeWindow
} from '../utils/windowActions';
import { getJSONFileContent } from '../utils/files';

export default class App extends Component {

  props: { // eslint-disable-line
    children: HTMLElement
  }

  state = { isFullscreen: false, content: '' };

  componentWillMount() {
    this.updateFullscreen();
    window.addEventListener('resize', this.updateFullscreen.bind(this));
  }

  componentDidMount() {
    const renderer = registerMain();
    addFileChangeHandler(renderer, () => {
      getJSONFileContent()
        .then((content) => console.log('got content', content))
        .catch((err) => console.log('file get err', err));
    });
    triggerFileOpen();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateFullscreen.bind(this));
  }

  updateFullscreen() {
    this.setState({ isFullscreen: isWindowFullscreen() });
  }

  toggleFullScreen() {
    const { isFullscreen } = this.state;
    setFullScreen(!isFullscreen);
  }

  render() {
    const { isFullscreen } = this.state;
    const platform = os.platform() === 'darwin' ? 'darwin' : 'win32';
    // const platform = 'win32';
    const barProps = {
      className: 'app-title-bar',
      title: `My ${platform} App`,
      onCloseClick: closeWindow,
      onMinimizeClick: minimizeWindow,
      controls: true
    };

    return (
      <div className={`app-wrapper ${platform}-background`}>
        {
          platform === 'darwin' ? (
            <DarTitleBar
              {...barProps}
              isFullscreen={isFullscreen}
              onResizeClick={this.toggleFullScreen.bind(this)}
            />
          ) : (
            <WinTitleBar
              {...barProps}
              isMaximized={isFullscreen}
              onMaximizeClick={setFullScreen.bind(this, true)}
              onRestoreDownClick={setFullScreen.bind(this, false)}
            />
          )
        }
        <div className={`app-container ${platform}-app-wrapper`}>
          {Children.map(this.props.children, (child) => cloneElement(child, { platform }))}
        </div>
      </div>
    );
  }
}
