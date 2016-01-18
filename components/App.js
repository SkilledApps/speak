'use strict';

import React from 'react-native';
import SingleTrackContainer from './SingleTrackContainer';
import TracksList from './TracksList';
import Navbar from './Navbar';
import SearchInput from './SearchInput';


const {
	StyleSheet,
	Text,
	TextInput,
	Navigator,
	View,
	LayoutAnimation,
	Dimensions,
} = React;

export default class App extends React.Component {
	render() {
		return (
			<Navigator
					ref={'navigator'}
					initialRouteStack={[{name: 'Track'}]}
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
		//console.log('get captions')
		//getCaptions('en', 'yJXTXN4xrI8').then(r => console.log(r));
	}

	renderScene(route, navigator) {
		if (route.name === 'TracksList') {
        return <TracksList
					navigator={navigator}
					tracks={this.props.isSearching ? this.props.foundTracks : this.props.savedTracks}
					isLoading={this.props.isLoading}
					{...this.props}
					onSelect={(track) => {
						this.props.selectTrack(track);
						navigator.push({name: 'Track', trackId: track.id});
					}} />
    }
		if (route.name === 'Track') {
        return <SingleTrackContainer
					navigator={navigator}
					{...this.props}
				/>
    }
	}

	renderTitle(route) {
		if (route.name === 'TracksList') {
        return <SearchInput
					onSearch={q => this.props.searchYoutube(q)}
					onStopSearching={() => this.props.stopSearching()}
				/>
    }
		if (route.name === 'Track') {
      return this.props.selectedIndex && <Text
				style={{fontSize: 12, width: 200, top: 10, textAlign: 'center'}}
				numberOfLines={2}>{(this.props.selectedIndex.type === 'found' ?
					this.props.foundTracks[this.props.selectedIndex.index] :
					this.props.savedTracks[this.props.selectedIndex.index]).snippet.title}</Text>;
    }
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
