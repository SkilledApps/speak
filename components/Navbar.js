import NavigationBar from 'react-native-navbar';


import React from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, } = React;


export default class TracksListItem extends React.Component {

	render() {
    const rightButtonConfig =  <TouchableOpacity onPress={() => this.props.onSettings()}>
			<Icon name={'ios-settings'} size={28} color={'#222'} style={{marginHorizontal: 10, top: 0, marginTop: 0}}/>
		</TouchableOpacity>

		const leftButton = <TouchableOpacity onPress={() => this.props.onBack()}>
			<Icon name={'ios-arrow-left'} size={28} color={'#222'} style={{marginHorizontal: 10, top: 0, marginTop: 0}}/>
		</TouchableOpacity>

    return (
      <NavigationBar
        title={this.props.titleComponent}
        tintColor={'#F5D700'}
        rightButton={rightButtonConfig}
				leftButton={this.props.isBack ? leftButton : {title:''}} />
    );
  }
}
