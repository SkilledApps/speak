'use strict';

import React from 'react-native';
import SingleTrackContainer from './SingleTrackContainer';
import TracksList from './TracksList';
import Navbar from './Navbar';
import SearchInput from './SearchInput';
import Bench from './Benchmarking';
import TabBar from './Tabbar';
import Settings from './Settings';
import CoursesList from './CoursesList';
import Recordings from './Recordings';
import LikedList from './LikedList';

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
					initialRouteStack={[{name: 'TracksList'}]}
					renderScene={this.renderContainer.bind(this)}
					configureScene={route =>
						route.name === 'Settings' ?
							Navigator.SceneConfigs.VerticalUpSwipeJump :
							{
								...Navigator.SceneConfigs.HorizontalSwipeJump,
								gestures: {
									jumpBack: null,
									jumpForward: null
								}
							}
						}
			/>
		);
	}

	renderContainer(route, navigator) {
		return (
			<View style={styles.container}>
				<Navbar
					titleComponent={this.renderTitle(route)}
					isBack={route.name !== 'TracksList'}
					isSettings={route.name === 'Settings'}
					onBack={() => navigator.pop()}
					onSettings={() => navigator.push({name: 'Settings'})}
				/>
				{this.renderScene(route, navigator)}
			</View>
		);
	}

	renderScene(route, navigator) {
		if (route.name === 'TracksList') {
				const tabs = {}
        tabs.tab1 = <TracksList
					tracks={this.props.isSearching ? this.props.foundTracks : this.props.savedTracks}
					isLoading={this.props.isLoading}
					{...this.props}
					onSelect={(track) => {
						navigator.push({name: 'Track', track});
					}} />
				tabs.tab2 = <CoursesList />
				tabs.tab3 = <Recordings tracks={this.props.savedTracks} deleteRecording={this.props.deleteRecording}/>
				tabs.tab4 = <LikedList tracks={this.props.savedTracks} onSelect={(track) => {
					navigator.push({name: 'Track', track});
				}} />
				return <TabBar ref={(ref) => this._tabbar = ref} tabs={tabs} />
    }
		if (route.name === 'Track') {
        return <SingleTrackContainer
					track={route.track}
					{...this.props}
				/>
    }
		if (route.name === 'Settings') {
				const { settings } = this.props;
				return <Settings
					{...this.props}
					onSettingsChanged={newSettings => this.props.applySettings({...settings, ...newSettings})}
				/>
		}

		if (route.name === 'Bench') {
				const t = {
					currentTime: '5.01',
					source: 'https://r4---sn-8ph2xajvh-axqe.googlevideo.com/videoplayback?key=yt6&mime=video/mp4&dur=192.052&sver=3&ratebypass=yes&fexp=9408502,9414808,9416126,9419476,9420452,9420540,9422596,9423662,9424135,9426414,9426492,9426719&sparams=dur,id,initcwndbps,ip,ipbits,itag,lmt,mime,mm,mn,ms,mv,pcm2cms,pl,ratebypass,requiressl,source,upn,expire&lmt=1441353190333351&ipbits=0&requiressl=yes&source=youtube&initcwndbps=2620000&ip=95.24.49.75&mm=31&mn=sn-8ph2xajvh-axqe&expire=1453329333&itag=18&pl=19&signature=64F3F4BA7FBE99F8A1F24FD6B6E5F98D6BC79DFE.8A7CE4C2FA2FF326503B512E2F2B959A497B0058&id=o-AFjkxNFQhjpelWMT-x1n0qdRtNyuli_iPXS5T7FfhXQF&mt=1453307649&mv=m&upn=PNRLcyLj-GE&pcm2cms=yes&ms=au&signature=18',
				}
        return <Bench
					track={t}
					currentTime={t && t.currentTime}
					onProgress={(t) => this.props.tick(t.currentTime)}
				/>
    }
	}

	renderTitle(route) {
		if (route.name === 'TracksList') {
        return <SearchInput
					onSearch={q => this.props.searchYoutube(q)}
					onFirstTabActive={() => this._tabbar.setFirstTab()}
					onStopSearching={() => this.props.stopSearching()}
				/>
    }
		if (route.name === 'Track') {
      return <View style={{width: 200, top: 5, height: 35, justifyContent: 'center'}}><Text
				style={{fontSize: 12, textAlign: 'center'}}
				numberOfLines={2}>{route.track.snippet.title}</Text></View>;
    }
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// justifyContent: 'center',
		// alignItems: 'center',
		//backgroundColor: '#fff',
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
