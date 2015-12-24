/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

'use strict';

import 	React from 'react-native';
import 	RNVideo from 'react-native-video';
import 	Slider from 'react-native-slider';
import 	Icon from 'react-native-vector-icons/Ionicons'

const debug = 1;

const {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	SliderIOS,
	ScrollView,
	Animated,
	LayoutAnimation,
	AlertIOS,
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
			paused: false,
			playIcon: 'pause',
		};
	}

	onLoad(data) {
		this.setState({duration: data.duration});
	}

	onProgress(data) {
		// if (debug) console.log(data);
		if (debug) {
			if ( this.state.currentChapter) console.log(this.state.currentChapter.end);
		}
		if (this.state.currentChapter !== null && Math.round(data.currentTime, -2) === this.state.currentChapter.end) {
			this.setState({paused: true});
		}

		if (Math.round(data.currentTime, -2) % 0.05) {
			this.setState({
				currentTime: Math.round(data.currentTime, -2),
				duration: data.playableDuration,
			});
		}
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
			chapter = chapter.push({'chapterName' : chapterName, 'start': 0, 'end': Math.round(time, -2)});
		} else {
			if (chapter[chapter.length - 1].end > Math.round(time, -2)) { return false; }
			chapter = chapter
				.push(
					{
						'chapterName' : chapterName, 
						start: chapter[chapter.length - 1].end, 
						end: Math.round(time, -2)
					});
		}
		this.setState({chapter});
		LayoutAnimation.easeInEaseOut();
		if (debug) console.log('CHAPTER', this.state.chapters);
	}

	startChapter(startTime, chapter, index) {
		if (debug) console.log('INDEX', index);
		if (debug) console.log(startTime);
		if (chapter) {
			this.setState({currentChapter: chapter});
		}
		if (index >= 0) {
			this.setState({currentChapterIndex: index});
		}
		this._videoComponent.seek(startTime);
	}

	playIcon() {
		var playIcon = !this.state.paused ? 'pause' : 'play';
		return playIcon;
	}

	renderChapterControls() {
		const isChaptersAvailable = !(this.state.chapters.length === 0);
		const isChapterMoreThenTwo = this.state.chapters.length > 1;
		const { width, height } = this.props.layout;
		const playIcon = this.playIcon();
		return (
			<View style={{
				width: width * 0.9, top: height * 0.05, 
				backgroundColor: 'transparent',
				justifyContent: 'center', alignItems: 'center',
				flexDirection: 'row',
			}}>
				<TouchableOpacity onPress={() => {this.setState({currentChapter: null, paused: this.state.paused ? false : true})}}>
					<Icon name={playIcon} size={40} color='#000' style={{marginHorizontal: 10}}/>
				</TouchableOpacity>
				{isChaptersAvailable && 
					<TouchableOpacity onPress={ () => { 
						if (this.state.currentChapter !== null) {
							this.startChapter(this.state.currentChapter.start); 
							this.setState({paused: this.state.paused ? false : true}) 
						} 
					}}>
						<Icon name='loop' size={40} color='#000' style={{marginHorizontal: 10}}/>
					</TouchableOpacity>
				}
				{isChapterMoreThenTwo && 
					<TouchableOpacity onPress={ () => { 
						/*
							Найти текущий отрезок в хранилище
							Найти следующий за ним
							Прокинуть следующий в startChapter()
						*/
						let currentChapterIndex = this.state.currentChapterIndex;
						if (debug) console.log('currentChapterIndex', currentChapterIndex);
						let nextChapterIndex = currentChapterIndex+1;
						let chapters = this.state.chapters;
						let nextChapter = chapters[nextChapterIndex];
						if (debug) console.log('chapters', chapters);
						if (debug) console.log('nextChapter', nextChapter)
						this.startChapter(
							nextChapter.start, 
							nextChapter,
							nextChapterIndex,
						); 
						this.setState({paused: this.state.paused ? false : true}) }}>
						<Icon name='skip-forward' size={40} color='#000' style={{marginHorizontal: 10}}/>
					</TouchableOpacity>
				}
			</View>
		)
	}

	render() {
		const 	flexCompleted = this.getCurrentTimePercentage() * 100;
    	const 	flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;
		const 	{width, height } = this.props.layout;
		let 	chapters = this.state.chapters.length ? this.state.chapters : null;
		let renderChapters = undefined;
		if (chapters) {
			renderChapters = chapters.map( (i, index) => {				
				var chapterName = i.chapterName.toString();
				var text = chapterName + ', startTime: ' + i.start + ', endTime: ' + i.end;
				return(
					<View key={i.start} style={{marginVertical: 10}}>
						<TouchableOpacity style={{paddingVertical: 5, paddingHorizontal: 10, borderColor: '#007AFF', borderWidth: 1, 
						borderRadius: 10,
						overflow: 'hidden',
						backgroundColor: '#34AADC'}} onPress={() => { this.startChapter(i.start, i, index) }}>
							<Text style={{color: '#fff', fontSize: 12}}>{text}</Text>
						</TouchableOpacity>
					</View>
				)
			});
		}

		return (
			<View style={{justifyContent: 'flex-start', alignItems: 'center'}}>
				<View style={{width, height: height / 2.5, alignItems: 'center', justifyContent: 'flex-start'}}>
					<RNVideo
						ref={component => this._videoComponent = component}
						source={{uri: this.props.source}} // Can be a URL or a local file.
						rate={this.state.rate}
						paused={this.state.paused}
						volume={this.state.volume}
						muted={this.state.muted}
						resizeMode={this.state.resizeMode}
						onLoad={(data) => { this.onLoad(data) }}
						onProgress={(d) => { this.onProgress(d)}}
						onEnd={() => { AlertIOS.alert('Done!') }}
						repeat={true}
						style={[this.props.style, {height: height * 0.25}]}>
					</RNVideo>
					{this.renderChapterControls()}
				</View>
				<TouchableOpacity 
					style={{backgroundColor: 'orange', marginVertical: 5,}} 
					onPress={ () => { 
						if (this.state.paused !== true) {
							this.createChapter(this.state.currentTime); 
						} else {
							AlertIOS.alert('You can\'t make a chapter on pause');
						}
					}}
				>
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

		          <View style={[styles.trackingControls, {width: width * 0.9}]}>
		            <View style={[styles.progress, {width: width * 0.9}]}>
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

// <Slider
// 	style={{width: width * 0.9}}
// 	trackStyle={customStyles6.track}
// 	thumbStyle={customStyles6.thumb}
// 	minimumTrackTintColor='#e6a954'
// 	minimumValue={0}
// 	maximumValue={flexCompleted}
// ></Slider>


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
    height: 10,
    backgroundColor: '#000',
  },
  innerProgressRemaining: {
    height: 10,
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