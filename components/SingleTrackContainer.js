/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

'use strict';

import React from 'react-native';

import Slider from 'react-native-slider';
import Icon from 'react-native-vector-icons/Ionicons';
import VideoWrapper from './VideoWrapper';
import OnboardingTip from './OnboardingTip';
import TimestampsContainer from './TimestampsContainer';
// import TimestampsAPI from '../timestampsAPI';
// import { getCaptions } from '../API/youtubeAPI'


const debug = false;

const { Dimensions, StyleSheet, View, TouchableOpacity, LayoutAnimation, Modal, SliderIOS, ActivityIndicatorIOS} = React;

const layout = Dimensions.get('window');

export default class SingleTrackContainer extends React.Component {
	constructor() {
		super();
		this.state = {
			currentTime: 0.0,
			paused: false,
			modeChapterDelete: false,
			practice: false,
			repeatsIndicator: 0,
			titlePrepMode: 'Prep Mode',
			titlePracticeMode: 'Practice Mode',
			practiceScheme: {
				repeats: 3, 	// repeat chapter 3 times
				intervalRatio: 3, 	// ratio between repeatings, 1 sec become 2.5 sec
			}
		};
	}

	getTrack() {
		if (!this.props.selectedIndex) {
			return false;
		}
		return this.props.selectedIndex.type === 'found' ?
			this.props.foundTracks[this.props.selectedIndex.index] :
			this.props.savedTracks[this.props.selectedIndex.index];
	}

	componentWillReceiveProps(nextProps) {
		LayoutAnimation.easeInEaseOut();
	}

	componentWillUpdate(nextProps, nextState) {
		// TODO: immutable js or dirty flag
		if (this.state.timestamps && nextState.timestamps && nextState.timestamps !== this.state.timestamps) {
			LayoutAnimation.easeInEaseOut();
			//TimestampsAPI.persist(this.props.meta.id.videoId, nextState.timestamps);
		}
	}

	playTimestamp(index) {
		const track = this.getTrack();
		if (index < 0) {
			index = 0;
		}
		if (track.timestamps && index > track.timestamps.length - 1) {
			index = track.timestamps.length - 1;
		}
		this.setState({currentTimestampIndex: index, currentTime: track.timestamps[index].time});
		this._videoComponent.seek(track.timestamps[index].time);
		// this.setState({paused: false}); TODO: should we played even we've already in the pause?
	}

	deleteTimestamp(index) {
		this.setState({timestamps: TimestampsAPI.deleteTimestamp(this.state.timestamps, index)});
	}

	moveTimestamp(index, delta) {
		this.setState({timestamps: TimestampsAPI.moveTimestamp(this.state.timestamps, index, delta)});
	}

	togglePractice() {
		/*
			Начинаем играть с текущего времени в режиме повтора каждого участка

			@param currentTime : this.state.currentTime;
			@func startChapter : startChapter(startTime, chapter, index) {}
		*/
		this.setState({practice: !this.state.practice});
		if (this.state.practice) {
			const nextLoop = (repeats, timestamp) => {
				const nextTimestampIndex = timestamp >= 0 ? timestamp - 1 : 0;
				if (nextTimestampIndex === timestamp) { // конец
					return;
				} else {
					if (this.state.timestamps[nextTimestampIndex] === undefined) { return; }
					const deltaTime = this.state.timestamps[nextTimestampIndex].time ? this.state.timestamps[nextTimestampIndex].time - this.state.timestamps[timestamp].time : 1;
					this.playTimestamp(timestamp);
					this.setState({paused: false});
					// поставить на паузу после проигрывания этого участка
					this.t1 = setTimeout(() => this.setState({paused: true}), deltaTime * 1000);
					if (repeats < this.state.practiceScheme.repeats) {
						// текущий урок, продолжаем повторять
						this.t2 = setTimeout(() => nextLoop(repeats + 1, timestamp), deltaTime * 1000 * this.state.practiceScheme.intervalRatio);
					} else {
						// следующий урок (минус один потому что порядок обратный)
						this.t2 = setTimeout(() => nextLoop(0, timestamp - 1), deltaTime * 1000 * this.state.practiceScheme.intervalRatio);
					}
					this.setState({repeatsIndicator: repeats + 1});
				}
			}

			const currentTimestampIndex = TimestampsAPI.getIndexByTime(this.state.timestamps, this.state.currentTime);
			nextLoop(0, currentTimestampIndex < this.state.timestamps ? currentChapterIndex : currentTimestampIndex - 1);

		} else {
			// удалить таймауты чтобы корректно остановить режим тренировки
			clearTimeout(this.t1);
			clearTimeout(this.t2);
		}
	}


	render() {
		const track = this.getTrack();
		if (track && track.source && track.source.length > 0) {
			return (
				<View style={{justifyContent: 'flex-start', alignItems: 'center'}}>
					{/* VideoWrapper для отображение видео (потом можно добавить AudioWrapper или YoutubeWrapper) */}
					<VideoWrapper
						ref={component => this._videoComponent = component}
						onProgress={s => this.setState(s)}
						source={track.source}
						selectTrack={() => this.props.selectTrack(track)}
						paused={this.state.paused}
						currentTime={ this.state.currentTime }
						onPlayPause={() => this.setState({paused: !this.state.paused})}
						repeatsIndicator={this.state.repeatsIndicator}
						addTimestamp={() => this.props.addTimestamp(this.state.currentTime)}
					/>

					{/* Если меток нет, то отображать приветствие */}
					{(!track.timestamps || track.timestamps.length === 0) && <OnboardingTip where={'Edit'} /> }

					{/* Если выбран не режим практики, а редактирования, то показать контейнер с метками */}
				  {(track.timestamps && track.timestamps.length > 0) &&
						<TimestampsContainer
							currentTime={ this.state.currentTime }
							timestamps={ track.timestamps }
							inPractice={ this.state.practice }
							selectedIndex={ this.state.currentTimestampIndex }
							onSelect={ index => { this.setState({practice: false, repeatsIndicator: 0}); this.playTimestamp(index); } }
							onDelete={ index => this.deleteTimestamp(index) }
							startPractice={ () => this.togglePractice() }
							onMove={(index, delta) => this.moveTimestamp(index, delta) }
						/> }

				</View>
			)
		}
		else {
			return (
				<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
					<ActivityIndicatorIOS size={'large'} />
				</View>
			)
		}

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
