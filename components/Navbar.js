import NavigationBar from 'react-native-navbar';


import React from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, } = React;


export default class TracksListItem extends React.Component {

	render() {
    const rightButtonConfig = {
      title: 'Settings',
      tintColor: '#222',
      handler: () => {
        alert('hello!');
      }
    };

    const titleConfig = {
      title: 'Hello, world',
    };

    return (
      <NavigationBar
        title={this.props.titleComponent}
        tintColor={'yellow'}
        rightButton={rightButtonConfig} />
    );
  }
}
