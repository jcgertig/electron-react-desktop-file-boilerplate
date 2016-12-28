// @flow
import React, { Component, PropTypes } from 'react';

export default class RenderByOS extends Component {
  static propTypes = {
    platform: PropTypes.string.isRequired,
  };

  darwinRender() { // eslint-disable-line
    return <div />;
  }

  win32Render() { // eslint-disable-line
    return <div />;
  }

  render() {
    return this[`${this.props.platform}Render`].call(this); // eslint-disable-line
  }
}
