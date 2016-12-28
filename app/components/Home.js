// @flow
import React from 'react';
import { Box, Text as DarText } from 'react-desktop/macOs';
import { View, Text as WinText } from 'react-desktop/windows';
import styles from '../styles/Home.css';

import RenderByOS from './RenderByOS';

export default class Home extends RenderByOS {
  darwinRender() {
    const { platform } = this.props;
    return (
      <Box label="Box" padding="10px 30px">
        <DarText>{platform}</DarText>
      </Box>
    );
  }

  win32Render() {
    const { platform } = this.props;
    return (
      <View>
        <WinText>{platform}</WinText>
      </View>
    );
  }
}
