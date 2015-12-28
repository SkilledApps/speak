/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

'use strict';

import 	React from 'react-native';
import 	Video from 'react-native-video';
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
	Modal,
} = React;

const HOLD_TIMER = 400;

export default class Edit extends React.Component {
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
			modeChapterDelete: false,
			practice: false,
			practiceScheme: {
				repeating: 3, 	// repeat chapter 3 times
				interval: 1, 	// 1s between repeatings
			}
		};
	}

	onLoad(data) {
		this.setState({duration: data.duration});
	}

	componentWillReceiveProps() {
		if (this.state.practice === true) {
			this.startPractice();
		}
	}

	onProgress(data) {
		// if (debug) console.log(data);
		if (debug) {
			if ( this.state.currentChapter) console.log(this.state.currentChapter.end);
		}
		
		if (this.state.currentChapter !== null 
			&& this.state.practice === false 
			&& Math.round(data.currentTime, -2) === this.state.currentChapter.end) 
		{
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
		const chapterName = chapter.length ? 'chapter' + chapter.length  : 'chapter1';
		
		if (this.state.chapters.length === 0) {
			chapter = chapter.push({'chapterName' : chapterName, 'start': 0, 'end': Math.round(time, -2)});
		} else {
			var item = chapter.length > 0 ? chapter[chapter.length - 1] : chapter[0];
			if (item === undefined) {
				if (debug) console.log('ERROR', chapter.length);
				if (debug) console.log('ERROR', item);
				return false;
			}
			if (item.end > Math.round(time, -2)) 
			{ return false; }
			chapter = chapter
				.push(
					{
						'chapterName' : chapterName, 
						start: item.end, 
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
		this.setState({paused: false});
	}

	playIcon() {
		var playIcon = !this.state.paused ? 'pause' : 'play';
		return playIcon;
	}

	getNextChapter() {
		let currentChapterIndex = this.state.currentChapterIndex;
		if (debug) console.log('currentChapterIndex', currentChapterIndex);
		let nextChapterIndex = currentChapterIndex+1;
		let chapters = this.state.chapters;
		let nextChapter = chapters[nextChapterIndex];
		if (debug) console.log('chapters', chapters);
		if (debug) console.log('nextChapter', nextChapter);
		if (nextChapter === undefined) {
			return false;
		}
		this.startChapter(
			nextChapter.start, 
			nextChapter,
			nextChapterIndex,
		); 
	}

	getPrevChapter() {
		let currentChapterIndex = this.state.currentChapterIndex;
		if (debug) console.log('currentChapterIndex', currentChapterIndex);
		let nextChapterIndex = currentChapterIndex > 0 ? currentChapterIndex -1 : currentChapterIndex;
		let chapters = this.state.chapters;
		let nextChapter = chapters[nextChapterIndex];
		if (debug) console.log('chapters', chapters);
		if (debug) console.log('nextChapter', nextChapter);
		if (nextChapter === undefined) {
			return false;
		}
		this.startChapter(
			nextChapter.start, 
			nextChapter,
			nextChapterIndex,
		);
	}

	renderChapterControls() {
		const isChaptersAvailable = !(this.state.chapters.length === 0);
		const isChapterMoreThenTwo = this.state.chapters.length > 1;
		const { width, height } = this.props.layout;
		const playIcon = this.playIcon();
		return (
			<View style={{
				width: width * 0.9, top: height * 0.01, 
				backgroundColor: 'transparent',
				justifyContent: 'center', alignItems: 'center',
				flexDirection: 'row',
			}}>
				{isChapterMoreThenTwo && 
					<TouchableOpacity onPress={ () => { this.getPrevChapter(); }}>
						<Icon name='skip-backward' size={30} color='orange' style={{padding: 15}}/>
					</TouchableOpacity>
				}

				<TouchableOpacity onPress={() => {this.setState({currentChapter: null, paused: this.state.paused ? false : true})}}>
					<Icon name={playIcon} size={30} color='orange' style={{padding: 15}}/>
				</TouchableOpacity>

				<TouchableOpacity 
					style={{}} 
					onPress={ () => { 
						if (this.state.paused !== true) {
							this.createChapter(this.state.currentTime); 
						} else {
							AlertIOS.alert('You can\'t make a chapter on pause');
						}
					}}>
					<Icon name='ios-circle-filled' size={35} color='orange'
						style={{padding: 15}}
					/>
				</TouchableOpacity>
				
				{isChaptersAvailable && 
					<TouchableOpacity onPress={ () => { 
						if (this.state.currentChapter !== null) {
							this.startChapter(this.state.currentChapter.start, this.state.currentChapter); 
							this.setState({paused: false}) 
						} 
					}}>
						<Icon name='loop' size={30} color='orange' style={{padding: 15}}/>
					</TouchableOpacity>
				}
				{isChapterMoreThenTwo && 
					<TouchableOpacity onPress={ () => { this.getNextChapter(); }}>
						<Icon name='skip-forward' size={30} color='orange' style={{marginHorizontal: 10}}/>
					</TouchableOpacity>
				}
			</View>
		)
	}

	editStartTime(index) {
		let chapters = this.state.chapters;
		let chapter = chapters[index];
		if (debug) console.log('OLD CHAPTER', chapter);
		chapter.start = +chapter.start > 0.5 ? +chapter.start - 1 : 0;
		chapters[index] = chapter;
		this.setState({chapters});
		if (debug) console.log('NEW CHAPTER', chapter);
		if (debug) console.log('OLD CHAPTERS', chapters);	
	}

	editEndTime(index) {
		let chapters = this.state.chapters;
		let chapter = chapters[index];
		if (debug) console.log('OLD CHAPTER', chapter);
		chapter.end = +chapter.end ? +chapter.end + 1 : +chapter.end + 1;
		chapters[index] = chapter;
		this.setState({chapters});
		if (debug) console.log('NEW CHAPTER', chapter);
		if (debug) console.log('OLD CHAPTERS', chapters);
	}

	deleteChapter(index) {
		let chapters = this.state.chapters;
		chapters.splice(index, 1);
		this.setState({chapters});
		LayoutAnimation.easeInEaseOut();
	}

	startPractice(state) {
		/*
			1. Взять все отрезки из state.chapters
			2. Запустить каждый из них начиная с первого
			3. Повторять каждый отрезок на основании state.practiceScheme (количество повторов + паузы между повторами)
			
			@param currentTime : this.state.currentTime;
			@func startChapter : startChapter(startTime, chapter, index) {}
		*/
		this.setState({practice: state});
		
		if (state === false) return; // disable practice mode and return;
		
		let chapters = this.state.chapters;
		
		const repeatCounter = this.state.practiceScheme.repeating;
		let counter = 0;

		
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
				var text = i.start + ' : ' + i.end;
				return(
					<View key={i.start * Math.random() * 10} 
						style={{
							marginVertical: 10, 
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							width: width * 0.9
						}}>
						<TouchableOpacity style={{
								marginHorizontal: 10}} 
								onPress={ () => { this.editStartTime(index) }}>
							<Icon name='minus' size={30} color='orange'/>
						</TouchableOpacity>
						
						<TouchableOpacity 
							style={{
							paddingVertical: 5, 
							paddingHorizontal: 30, 
							borderRadius: 15,
							overflow: 'hidden',
							backgroundColor: '#34AADC'}} 

							onPress={() => { this.startChapter(i.start, i, index) }}>
							<Text style={{color: '#fff', fontSize: 16}}>{text}</Text>
						</TouchableOpacity>

						
						<View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
							<TouchableOpacity style={{
								marginHorizontal: 10}} 
								onPress={ () => { this.deleteChapter(index); }}>
								<Icon name='trash-a' size={30} color='orange'/>
							</TouchableOpacity>							

							<TouchableOpacity style={{
									marginHorizontal: 10}} 
									onPress={ () => { this.editEndTime(index); }}>
								<Icon name='plus' size={30} color='orange'/>
							</TouchableOpacity>
						</View>
					</View>
				)
			});
		}

		return (
			<View style={{justifyContent: 'flex-start', alignItems: 'center'}}>
				<View style={{
					width,
					alignItems: 'center', justifyContent: 'flex-start'
				}}>
					<Video
						ref={component => this._videoComponent = component}
						source={{uri: this.props.source}} // Can be a URL or a local file.
						rate={this.state.rate}
						paused={this.state.paused}
						volume={this.state.volume}
						muted={this.state.muted}
						resizeMode={this.state.resizeMode}
						onLoad={(data) => { this.onLoad(data) }}
						onProgress={(d) => { this.onProgress(d)}}
						onEnd={() => { /* repeat video */ }}
						repeat={true}
						style={[this.props.style, {height: height / 2.8}]}>
					</Video>
					<View style={[styles.trackingControls, {width: width}]}>
						<View style={[styles.progress, {width: width}]}>
							<View style={[styles.innerProgressCompleted, {flex: flexCompleted}]} />
							<View style={[styles.innerProgressRemaining, {flex: flexRemaining}]} />
						</View>
					</View>
				</View>
				{!this.state.practice && this.renderChapterControls()}

				{!chapters &&
			    	<View style={{paddingVertical: 50}}>
			    		<Text style={{color: '#888'}}>Press  <Icon name='ios-circle-filled' size={20} color='orange' style={{paddingHorizontal: 10}}/>  to make a chapter</Text>
			    	</View>
			    }
			    
			    {!this.state.practice && 
			    	<View style={{width, justifyContent: 'flex-start', alignItems: 'center'}}>
				    	<ScrollView
				    		showsVerticalScrollIndicator={true}
				    		horizontal={false}
				    		contentContainerStyle={{
				    			justifyContent: 'flex-start', 
				    			alignItems: 'center', width: width * 0.9, paddingBottom: 25}}
				    		style={{height: height * 0.45}}>
				    		{renderChapters}
				    	</ScrollView>
				    	
				    	{chapters && 
				    		<TouchableOpacity 
				    			onPress={() => { this.startPractice(true); }}
				    			style={{
					    		marginTop: 10, backgroundColor: 'orange', borderRadius: 5, overflow: 'hidden'}}>
					    		<Text style={{paddingVertical: 10, 
					    			paddingHorizontal: 20, 
					    			color: 'white', fontSize: 14,
					    			fontWeight: '700'
					    		}}>Start practice</Text>
					    	</TouchableOpacity>
				    	}

				    </View>
			    }
			    {this.state.practice &&
			    	<View style={{width: width * 0.9, paddingTop: 75, justifyContent: 'center', alignItems: 'center'}}>
			    		<View>
				    		<TouchableOpacity onPress={ () => { this.setState({paused: false, currentChapter: null}); }}>
				    			<Icon name={this.playIcon()} color='orange' size={50}/>
				    		</TouchableOpacity>
			    		</View>

			    		<TouchableOpacity 
			    			onPress={() => { this.setState({practice: false}); }}
			    			style={{
				    		marginTop: 50, backgroundColor: 'orange', borderRadius: 5, overflow: 'hidden'}}>
				    		<Text style={{paddingVertical: 10, 
				    			paddingHorizontal: 20, 
				    			color: 'white', fontSize: 14,
				    			fontWeight: '700'
				    		}}>Edit chapters</Text>
				    	</TouchableOpacity>
			    	</View>
			    }
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
    overflow: 'hidden',
  },
  innerProgressCompleted: {
    height: 5,
    backgroundColor: 'orange',
  },
  innerProgressRemaining: {
    height: 5,
    backgroundColor: '#f7f7f7',
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