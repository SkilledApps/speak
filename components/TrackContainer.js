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
import TimestampsAPI from '../timestampsAPI';

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

export default class TrackContainer extends React.Component {
	constructor() {
		super();
		this.state = {
			currentTime: 0.0,
			timestamps: [],
			paused: false,
			playIcon: 'pause',
			modeChapterDelete: false,
			practice: false,
			practiceScheme: {
				repeats: 3, 	// repeat chapter 3 times
				intervalRatio: 2.5, 	// ratio between repeatings, 1 sec become 2.5 sec
			}
		};
	}

	componentWillMount() {
		TimestampsAPI
			.restore(this.props.source) // TODO: use hash or path (now bundled video)
			.then(raw => JSON.parse(raw))
			.then(timestamps => this.setState({timestamps}))
	}

	componentWillReceiveProps(nextProps) {
		// if (this.state.practice === true) {
		// 	this.startPractice();
		// }
	}

	componentWillUpdate(nextProps, nextState) {
		// TODO: immutable js or dirty flag
		if (this.state.timestamps && nextState.timestamps && nextState.timestamps !== this.state.timestamps) {
			LayoutAnimation.easeInEaseOut();
			TimestampsAPI.persist(this.props.source, nextState.timestamps);
		}
	}

	playTimestamp(index) {
		if (index < 0) {
			index = 0;
		}
		if (this.state.timestamps && index > this.state.timestamps.length - 1) {
			index = this.state.timestamps.length - 1;
		}
		this.setState({currentTimestampIndex: index, currentTime: this.state.timestamps[index].time});
		this._videoComponent.seek(this.state.timestamps[index].time);
		// this.setState({paused: false}); TODO: should we played even we've already in the pause?
	}

	deleteTimestamp(index) {
		this.setState({timestamps: TimestampsAPI.deleteTimestamp(this.state.timestamps, index)});
	}

	moveTimestamp(index, delta) {
		this.setState({timestamps: TimestampsAPI.moveTimestamp(this.state.timestamps, index, delta)});
	}

	playIcon() {
		return !this.state.paused ? 'pause' : 'play';
	}

	renderChapterControls() {
		
		const isChaptersAvailable = this.state.timestamps ? !(this.state.timestamps.length === 0) : false;
		const isChapterMoreThenTwo = this.state.timestamps ? this.state.timestamps.length > 1 : false;
		const width = 100, height = 100; // TODO: remove?
		const playIcon = this.playIcon();
		return (
			<View style={{
				width: width * 0.9, top: height * 0.01,
				backgroundColor: 'transparent',
				justifyContent: 'center', alignItems: 'center',
				flexDirection: 'row',
			}}>
				{isChapterMoreThenTwo &&
					<TouchableOpacity
						onPress={ () => this.playTimestamp(TimestampsAPI.getIndexByTime(this.state.timestamps, this.state.currentTime) + 1) }>
						<Icon name='skip-backward' size={30} color='orange' style={{padding: 15}}/>
					</TouchableOpacity>
				}

				<TouchableOpacity onPress={() => {this.setState({currentChapter: null, paused: this.state.paused ? false : true})}}>
					<Icon name={playIcon} size={30} color='orange' style={{padding: 15}}/>
				</TouchableOpacity>

				<TouchableOpacity
					style={{}}
					onPress={ () => this.setState({timestamps: TimestampsAPI.addTimestamp(this.state.timestamps, this.state.currentTime)}) }>
					<Icon name='ios-circle-filled' size={35} color='orange'
						style={{padding: 15}}
					/>
				</TouchableOpacity>

				{/*isChaptersAvailable &&
					<TouchableOpacity onPress={ () => {
						if (this.state.currentChapter !== null) {
							this.startChapter(this.state.currentChapter.start, this.state.currentChapter);
							this.setState({paused: false})
						}
					}}>
						<Icon name='loop' size={30} color='orange' style={{padding: 15}}/>
					</TouchableOpacity>*/
				}
				{isChapterMoreThenTwo &&
					<TouchableOpacity
						onPress={() => this.playTimestamp(TimestampsAPI.getIndexByTime(this.state.timestamps, this.state.currentTime) - 1) }>
						<Icon name='skip-forward' size={30} color='orange' style={{marginHorizontal: 10}}/>
					</TouchableOpacity>
				}
			</View>
		)
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
				const nextTimestampIndex = timestamp > 0 ? timestamp - 1 : 0;
				if (nextTimestampIndex === timestamp) { // конец
					return;
				} else {
					const deltaTime = this.state.timestamps[nextTimestampIndex].time - this.state.timestamps[timestamp].time;
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

		return (
			<View style={{justifyContent: 'flex-start', alignItems: 'center'}}>

				{/* VideoWrapper для отображение видео (потом можно добавить AudioWrapper или YoutubeWrapper) */}
				<VideoWrapper
					ref={component => this._videoComponent = component}
					onProgress={s => this.setState(s)}
					source={this.props.source}
					paused={this.state.paused}
				/>

				{/* Управление видео или аудио */}
				{this.renderChapterControls()}

				{/* Если меток нет, то отображать приветствие */}
				{!this.state.timestamps && <OnboardingTip where={'Edit'} /> }

				{/* Если выбран не режим практики, а редактирования, то показать контейнер с метками */}
			  {this.state.timestamps &&
					<TimestampsContainer
						currentTime={ this.state.currentTime }
						timestamps={ this.state.timestamps }
						inPractice={ this.state.practice }
						selectedIndex={ this.state.currentTimestampIndex }
						onSelect={ index => { this.togglePractice(); this.playTimestamp(index) } }
						onDelete={ index => this.deleteTimestamp(index) }
						startPractice={ () => this.togglePractice() }
						onMove={(index, delta) => this.moveTimestamp(index, delta) }
					/> }

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
