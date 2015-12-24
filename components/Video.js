/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

'use strict';

import 	React from 'react-native';
import 	RNVideo from 'react-native-video';
import 	Slider from 'react-native-slider';

const debug = 0;

const {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SliderIOS,
  ScrollView,
} = React;

export default class Video extends React.Component {
	constructor() {
		super();
		this.state = {
			rate: 1,
			volume: 1,
			muted: false,
			resizeMode: 'cover',
			duration: 0.0,
			currentTime: 0.0,
			chapters: [],
			currentChapter: null,
		};
	}

	onLoad(data) {
		this.setState({duration: data.duration});
	}

	onProgress(data) {
		if (debug) console.log(this.state.currentChapter);
		if (debug) {
			if ( this.state.currentChapter) console.log(this.state.currentChapter.end);
		}
		if (this.state.currentChapter !== null && data.currentTime === this.state.currentChapter.end) {
			alert();
			this.setState({paused: true});
		}

		this.setState({
			currentTime: data.currentTime,
			duration: data.playableDuration,
		});
	}

	getCurrentTimePercentage() {
		if (this.state.currentTime > 0) {
			return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
		} else {
			return 0;
		}
	}

	renderRateControl(rate) {
		var isSelected = (this.state.rate == rate);

		return (
			<TouchableOpacity onPress={() => { this.setState({rate: rate}) }}>
				<Text style={[styles.controlOption, {fontWeight: isSelected ? "bold" : "normal"}]}>
					{rate}x
				</Text>
			</TouchableOpacity>
		)
	}

	renderResizeModeControl(resizeMode) {
		var isSelected = (this.state.resizeMode == resizeMode);

		return (
			<TouchableOpacity onPress={() => { this.setState({resizeMode: resizeMode}) }}>
				<Text style={[styles.controlOption, {fontWeight: isSelected ? "bold" : "normal"}]}>
					{resizeMode}
				</Text>
			</TouchableOpacity>
		)
	}

	renderVolumeControl(volume) {
		var isSelected = (this.state.volume == volume);

		return (
			<TouchableOpacity onPress={() => { this.setState({volume: volume}) }}>
				<Text style={[styles.controlOption, {fontWeight: isSelected ? "bold" : "normal"}]}>
				  {volume * 100}%
				</Text>
			</TouchableOpacity>
		)
	}

	createChapter(time) {
		var chapter = this.state.chapters;
		var c = +chapter.length + 1;
		const chapterName = chapter.length ? 'chapter' + c  : 'chapter1';
		
		if (this.state.chapters.length === 0) {
			chapter = chapter.push({'chapterName' : chapterName, 'start': 0, 'end': time});
		} else {
			chapter = chapter.push({'chapterName' : chapterName, start: chapter[chapter.length - 1].end, end: time});
		}
		this.setState({chapter});
		if (debug) console.log('CHAPTER', this.state.chapters);
	}

	startChapter(startTime, chapter) {
		if (debug) console.log(startTime);
		this.setState({currentChapter: chapter});
		this._videoComponent.seek(startTime);
	}

	render() {
		var flexCompleted = this.getCurrentTimePercentage() * 100;
    	var flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;
		const {width, height } = this.props.layout;
		var chapters = this.state.chapters.length ? this.state.chapters : null;
		let renderChapters = undefined;
		if (chapters) {
			renderChapters = chapters.map( i => {				
				var chapterName = i.chapterName.toString();
				var text = chapterName + ', startTime: ' + i.start + ', endTime: ' + i.end;
				return(
					<View key={i.start} style={{marginVertical: 10}}>
						<TouchableOpacity style={{paddingVertical: 5, paddingHorizontal: 10, borderColor: '#007AFF', borderWidth: 1, 
						borderRadius: 10,
						overflow: 'hidden',
						backgroundColor: '#34AADC'}} onPress={() => { this.startChapter(i.start, i) }}>
							<Text style={{color: '#fff', fontSize: 12}}>{text}</Text>
						</TouchableOpacity>
					</View>
				)
			});
		}

		return (
			<View style={{justifyContent: 'flex-start', alignItems: 'center'}}>
				<TouchableOpacity style={{width, height: height / 2}} onPress={() => {this.setState({paused: !this.state.paused})}}>
					<RNVideo
						ref={component => this._videoComponent = component}
						source={{uri: this.props.source}} // Can be a URL or a local file.
						rate={this.state.rate}
						paused={this.state.paused}
						volume={this.state.volume}
						muted={this.state.muted}
						resizeMode={this.state.resizeMode}
						onLoad={(data) => { this.onLoad(data) }}
						onProgress={(d) => { this.onProgress(d); /*if (debug) console.log('onPROGRESS', d);*/ }}
						onEnd={() => { AlertIOS.alert('Done!') }}
						repeat={true}
						style={this.props.style}>
					</RNVideo>
				</TouchableOpacity>
				<TouchableOpacity style={{backgroundColor: 'orange', marginVertical: 10,}} onPress={ () => { this.createChapter(this.state.currentTime); }}>
					<Text style={{fontSize: 24, fontWeight: '700', padding: 20}}>CREATE CHAPTER</Text>
				</TouchableOpacity>
				<View style={styles.controls}>
		          <View style={styles.generalControls}>
		            <View style={styles.rateControl}>
		              {this.renderRateControl(0.25)}
		              {this.renderRateControl(0.5)}
		              {this.renderRateControl(1.0)}
		            </View>

		            <View style={styles.resizeModeControl}>
		              {this.renderResizeModeControl('cover')}
		              {this.renderResizeModeControl('contain')}
		              {this.renderResizeModeControl('stretch')}
		            </View>
		          </View>

		          <View style={[styles.trackingControls, {width}]}>
		            <Text>Progress</Text>
		            <View style={[styles.progress, {width}]}>
		              <View style={[styles.innerProgressCompleted, {flex: flexCompleted}]} />
		              <View style={[styles.innerProgressRemaining, {flex: flexRemaining}]} />
		            </View>
		          </View>
			    </View>
			    <View style={{width, justifyContent: 'flex-start', alignItems: 'center'}}>
			    	<Text>Chapters</Text>
			    	<ScrollView
			    		horizontal={false}
			    		contentContainerStyle={{justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', width: width * 0.9}}
			    		style={{}}>
			    		{renderChapters}
			    	</ScrollView>
			    </View>
			</View>
		)
	}
}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },

  controls: {
    backgroundColor: "transparent",
    borderRadius: 5,
    marginVertical: 20,
  },
  progress: {
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
  },
  innerProgressCompleted: {
    height: 20,
    backgroundColor: '#000',
  },
  innerProgressRemaining: {
    height: 20,
    backgroundColor: 'green',
  },
  generalControls: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    paddingBottom: 10,
  },
  rateControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  volumeControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resizeModeControl: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlOption: {
    alignSelf: 'center',
    fontSize: 11,
    color: "#000",
    paddingLeft: 2,
    paddingRight: 2,
    lineHeight: 12,
  },
});
var customStyles6 = StyleSheet.create({
  track: {
    height: 14,
    borderRadius: 2,
    backgroundColor: 'white',
    borderColor: '#9a9a9a',
    borderWidth: 1,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 2,
    backgroundColor: '#eaeaea',
    borderColor: '#9a9a9a',
    borderWidth: 1,
  }
});