/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React from 'react-native';
import Edit from './components/Edit';
const {
	AppRegistry,
	StyleSheet,
	Text,
	Navigator,
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

	renderComponent(route, navigator) {
		if (route.name === 'edit') {
			return (
				<View style={styles.container}>
					<Edit navigator={navigator} layout={this.state.layout} source='example' style={{width}}></Edit>
				</View>
			);
		} else if (route.name === 'practice') {
			// this.props.navigator.push({name: 'practice', state: 4})
			return (
				<View style={styles.container}>
					<Video state={route.state} layout={this.state.layout} source='example' style={{width}}></Video>
				</View>
			)
		}
	}

	render() {
		const { width, height} = this.state.layout;

		return (
			<View style={styles.container}>
				<Edit layout={this.state.layout} source='example' style={{width}}></Edit>
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
