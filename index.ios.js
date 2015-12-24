/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React from 'react-native';
import Video from './components/Video';
const {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
} = React;

class speak extends React.Component {
  constructor() {
    super();
    this.state = {
      layout: Dimensions.get('window'),
    }
  }
  render() {
    const { width, height} = this.state.layout;

    return (
      <View style={styles.container}>
        <Video layout={width, height} source='example' style={{width, height: height / 3}}></Video>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('speak', () => speak);
