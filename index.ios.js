/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React from 'react-native';
import SingleTrackContainer from './components/SingleTrackContainer';
import TracksList from './components/TracksList';
import Navbar from './components/Navbar';
import { searchYoutube } from './API/youtubeAPI'

const {
	AppRegistry,
	StyleSheet,
	Text,
	TextInput,
	Navigator,
	View,
	Dimensions,
} = React;

class SpeakApp extends React.Component {
	constructor() {
		super();
		this.state = {
			tracks:
			[

			]
		}
	}
	render() {
		return (
			<Navigator
					ref={'navigator'}
					initialRouteStack={[{name: 'TracksList'}]}
					renderScene={this.renderContainer.bind(this)}
			/>
		);
	}

	renderContainer(route, navigator) {
		return (
			<View style={styles.container}>
				<Navbar titleComponent={this.renderTitle(route)} />
				{this.renderScene(route, navigator)}
			</View>
		);
	}

	renderScene(route, navigator) {
		if (route.name === 'TracksList') {
        return <TracksList
					navigator={navigator}
					tracks={this.state.tracks} />
    }
	}

	renderTitle(route) {
		if (route.name === 'TracksList') {
        return <SearchInput
					onSearch={tracks => this.setState({tracks})}
					onLoading={(loading) => this.setState({loading})} />
    }
	}
}

class SearchInput extends React.Component {
  render() {
    return(
      <TextInput
        placeholder={'Search for video...'}
        style={{height: 32, width: 200, top: 5, textAlign: 'center', backgroundColor: 'white'}}
        onChangeText={query => {
					if (query.length < 3) {
						return;
					}
					searchYoutube(query).then(tracks => this.props.onSearch(tracks))
			}} />
    )
  }
}

const styles = StyleSheet.create({
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
