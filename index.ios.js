/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React from 'react-native';
import TrackContainer from './components/TrackContainer';

const {
	AppRegistry,
	StyleSheet,
	Text,
	Navigator,
	View,
	Dimensions,
} = React;

class SpeakApp extends React.Component {
	constructor() {
		super();
		this.state = {
			videos: 
			[
				'english1',
				'english2',
				'english3',
				'french1',
				'french2',
				'french3',
			]
		}
	}
	render() {
		return (
			<View style={styles.container}>
				<TrackContainer source={this.state.videos} />
			</View>
		);
	}
}

var styles = StyleSheet.create({
	container: {
		flex: 1,
		// justifyContent: 'center',
		// alignItems: 'center',
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

AppRegistry.registerComponent('speak', () => SpeakApp);
