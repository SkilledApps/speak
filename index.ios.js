/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React from 'react-native';
import SingleTrackContainer from './components/SingleTrackContainer';
import TracksList from './components/TracksList';
import Navbar from './components/Navbar';
import { searchYoutube, obtainVideoFromLink, getCaptions } from './API/youtubeAPI'

const {
	AppRegistry,
	StyleSheet,
	Text,
	TextInput,
	Navigator,
	View,
	LayoutAnimation,
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
				<Navbar
					titleComponent={this.renderTitle(route)}
					isBack={route.name !== 'TracksList'}
					onBack={() => navigator.pop()}/>
				{this.renderScene(route, navigator)}
			</View>
		);
	}

	componentDidMount() {
		// debug
		console.log('get captions')
		getCaptions('en', 'yJXTXN4xrI8').then(r => console.log(r));
	}

	renderScene(route, navigator) {
		if (route.name === 'TracksList') {
        return <TracksList
					navigator={navigator}
					tracks={this.state.tracks}
					onSelect={(track) => obtainVideoFromLink(track.id.videoId)
						.then(url => navigator.push({name: 'Track', url: url, meta: track})) } />
    }
		if (route.name === 'Track') {
        return <SingleTrackContainer
					navigator={navigator}
					meta={route.meta}
					track={route.url}
				/>
    }
	}

	renderTitle(route) {
		if (route.name === 'TracksList') {
        return <SearchInput
					onSearch={tracks => this.setState({tracks})}
					onLoading={(loading) => this.setState({loading})} />
    }
		if (route.name === 'Track') {
      return <Text
				style={{fontSize: 12, width: 200, textAlign: 'center'}}
				numberOfLines={2}>{route.meta.snippet.title}</Text>;
    }
	}
}

class SearchInput extends React.Component {
	constructor() {
		super();
		this.state = {width: 200, color: '#FFE94A'}
	}
	componentWillUpdate() {
		LayoutAnimation.easeInEaseOut();
	}
  render() {
    return(
      <TextInput
        placeholder={'Search for video...'}
				autoCapitalize={'none'}
				autoCorrect={false}
        style={{height: 28, width: this.state.width, top: 5, left: 5, textAlign: 'center', backgroundColor: this.state.color}}
				onFocus={() => this.setState({width: 250, color: 'white'})}
				onBlur={() => this.setState({width: 200, color: '#FFE94A'})}
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
