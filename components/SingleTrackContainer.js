/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

'use strict';

import React from 'react-native';
import { Map, List } from 'immutable';

import Slider from 'react-native-slider';
import Icon from 'react-native-vector-icons/Ionicons';
import VideoWrapper from './VideoWrapper';
import OnboardingTip from './OnboardingTip';
import TimestampsContainer from './TimestampsContainer';
import RecordingProgressIndicator from './RecordingProgressIndicator';
import * as AudioRecorder from './AudioRecorder';

const { Dimensions, StyleSheet, View, TouchableOpacity, LayoutAnimation, Text, ActivityIndicatorIOS} = React;

const layout = Dimensions.get('window');

export default class SingleTrackContainer extends React.Component {
	constructor(props) {
		super();
		this.state = {
			currentTime: 0.0,
			paused: true,
			rate: 1
		};
	}

	componentDidMount() {
		//requestAnimationFrame(() => this.setState({paused: false}))
		//setTimeout(() => this.setState({paused: false}), 1500)
	}

	getTrack() {
		if (!this.props.selectedIndex) {
			return false;
		}
		return this.props.selectedIndex.type === 'found' ?
			this.props.foundTracks[this.props.selectedIndex.index] :
			this.props.savedTracks[this.props.selectedIndex.index];
	}

	playTimestamp(index) {
		if (index === null) {
			return this.setState({currentTimestampIndex: null})
		}
		const track = this.getTrack();
		if (track.timestamps && index > track.timestamps.length - 1) {
			index = track.timestamps.length - 1;
		}
		this.playTime(parseInt(index, 10) === 0 ? 0 : track.timestamps[index - 1].time, index);
		// this.setState({paused: false}); TODO: should we played even we've already in the pause?
	}
	playTime(time, index) {
		this._videoComponent.seek(time);
		this.setState({currentTime: time, currentTimestampIndex: index})
	}

	/*
	 * Включаем и выключаем режим практики
	 */
	togglePractice() {
		this.setState({practice: !this.state.practice});
		if (this.state.practice) {
			const { settings } = this.props;
			const timestamps = this.getTrack().timestamps;
			const nextLoop = (repeatsDone, timestampIndex) => {
				/*
				 * Дополнительная проверка если вышли из режима практики
				 * Может быть сделать универсальную функцию которая будет очищать все таймеры
				 */
				if (!this.state.practice) {
					return;
				}
				/*
				 * Вычисляем следующую к текущей метку, если она равна текущей, значит конец
				 */
				const nextTimestampIndex = timestampIndex < timestamps.length - 1 ? timestampIndex + 1 : timestamps.length - 1;
				if (nextTimestampIndex === timestampIndex) {
					return; // конец, выходим
				}
				/*
				 * Пропускаем "заглушенные" участки
				 */
				if (timestamps[nextTimestampIndex].isMuted) {
					return nextLoop(repeatsDone, timestampIndex + 1);
				}

				/*
				 * Длина участка воспроизведения, в секундах, учитывая режим воспроизвдения
				 * (замедленный или обычный)
				 */
				const deltaTime = (timestampIndex === -1 ?
					timestamps[nextTimestampIndex].time :
					timestamps[nextTimestampIndex].time - timestamps[timestampIndex].time) / this.state.rate;
				const recordTime = deltaTime * settings.intervalRatio

				/*
				 * Перемещаем воспроизведение в начало отрезка (следующая от текущей метка)
				 */
				this.playTimestamp(nextTimestampIndex);

				/*
				 * Синхронизируем стейт, чтобы инициировать render().
				 * Запускаем плеер прежде всего.
				 */
				this.setState({
					paused: false,
					repeatsIndicator: repeatsDone + 1,
					recording: false,
					recordingProgress: 0
				});

				/*
				 *	Первый таймер отвечает за воспроизведение. Мы воспроизводим до момента
				 *	пока таймер не срабатывает.
				 *	После этого, нужно поставить на паузу после проигрывания этого участка и включить микрофон
				*/
				this.t1 = setTimeout(() => {
					this.setState({paused: true, recording: true});
					AudioRecorder.startRecording();
					const startDate = new Date();
					this.progressInterval = setInterval(() => this.setState({recordingProgress: (new Date() - startDate) / 1000*(recordTime-100) }) , 50);
				}, deltaTime * 1000 + 250);

				/*
				 *	Второй таймер отвечает за завершение записи звука и срабатывает позже
				 *  После остановки записи микрофона и сброса индикатора прогресса, рекурсивно включаем следующий этап
				*/
				this.t2 = setTimeout(() => {
					// приостанавливаем запись с микрофона
					AudioRecorder.pauseRecording();
					// останавливаем прогрессбар
					clearInterval(this.progressInterval);
					// всё ещё текущий отрезок, продолжаем повторять
					if (repeatsDone + 1 < this.props.settings.repeats) {
						nextLoop(repeatsDone + 1, timestampIndex);
					// повторили достаточное количество раз, прыгаем на следующий отрезок
					} else {
						nextLoop(0, nextTimestampIndex);
					}
				}, 1000 * (recordTime + deltaTime) );

			}

			/*
			 * Вычисляем по времени номер отрезка с которого мы начинаем режим практики
			 *
			 */
			const currentTimestampIndex = timestamps.length - timestamps.filter(t => t.time > this.state.currentTime).length - 1;

			/*
			 * Создаем звуковой файл и запоминаем его в привязке к треку
			 */
			this.props.startRecording(
				currentTimestampIndex < 0 ? 0 : timestamps[currentTimestampIndex].time,
				AudioRecorder.prepareRecording(this.getTrack().id.videoId)
			);

			/*
			 * ТОЧКА ВХОДА, первый запуск
			 */
			nextLoop(0, currentTimestampIndex);

		} else {
			// удалить таймауты чтобы корректно остановить режим тренировки
			this.setState({paused: true})
			clearTimeout(this.t1);
			clearTimeout(this.t2);
			clearInterval(this.progressInterval);
			// stop the recording
			AudioRecorder.stopRecording().then((args) => this.props.stopRecording(args[0], args[1])).catch(e => console.error(e));
		}
	}


	render() {
		const track = this.getTrack();
		if (track && track.source && track.source.length > 0) {
			return (
				<View style={{justifyContent: 'flex-start', alignItems: 'center'}}>
					{/* VideoWrapper для отображение видео (потом можно добавить например AudioWrapper) */}
					<VideoWrapper
						ref={component => this._videoComponent = component}
						track={track}
						{...this.state}
						onPlayPause={() => this.setState({paused: !this.state.paused})}
						onProgress={(s, seek) => seek ? this.playTime(s.currentTime, this.state.currentTimestampIndex) : this.setState(s)}
						onProgressChange={x => this.playTime(x, this.state.currentTimestampIndex)}
						onRateChanged={rate => this.setState({rate})}
						addTimestamp={() => this.props.addTimestamp(this.state.currentTime)}
						moveTimestamp={this.props.moveTimestamp}
						selectTrack={(forceUpdating) => this.props.selectTrack(track, forceUpdating)}
					/>

					{/* Если меток нет, то отображать приветствие */}
					{(!track.timestamps || track.timestamps.length === 0) && <OnboardingTip where={'Edit'} /> }

					{/* Если выбран не режим практики, а редактирования, то показать контейнер с метками */}
				  {(track.timestamps && track.timestamps.length > 0) &&
						<TimestampsContainer
							currentTime={ this.state.currentTime }
							paused={this.state.paused}
							timestamps={ track.timestamps }
							inPractice={ this.state.practice }
							selectedIndex={ this.state.currentTimestampIndex }
							onSelect={index => { this.setState({practice: false, repeatsIndicator: 0}); this.playTimestamp(index); } }
							onTitleChange={(index, title) => this.props.changeTitleForTimestamp(index, title)}
							deleteTimestamp={this.props.deleteTimestamp}
							muteTimestamp={this.props.muteTimestamp}
							likeTimestamp={this.props.likeTimestamp}

						/> }

					{(track.timestamps && track.timestamps.length > 0) &&
							<PracticeButton onPress={() => this.togglePractice() } inPractice={this.state.practice} />
					}
					{this.state.practice &&
							<View style={styles.practiceIndicators}>
								<RecordingProgressIndicator progress={this.state.recordingProgress} />
								{this.state.recordingT && <Icon name={'ios-volume-high'} size={100} color={'#222'}/> }
								{!this.state.recording && <Text style={styles.practiceText}>Listen </Text> }
								{this.state.recordingT && <Icon name={'mic-a'} size={100} color={'#222'} /> }
								{this.state.recording && <Text style={styles.practiceText}>Speak </Text> }
								<Text style={styles.practiceText}>{this.state.repeatsIndicator} / {this.props.settings.repeats}</Text>
							</View>
					 }
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

const PracticeButton = (props) => <TouchableOpacity
	onPress={props.onPress}
	style={styles.practiceButton}>
		<Icon name={'mic-a'} size={25} color={'#494000'}/>
		<Text style={styles.practiceButtonText}>{props.inPractice ? 'Stop Practice' : 'Start Practice'}</Text>
</TouchableOpacity>

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'black',
	},
	practiceText: {fontSize: 40, fontWeight: '200', color: '#222', textShadowOffset: {width: 0.5, height: 0.5}, textShadowRadius: 2, textShadowColor: 'white'},
	practiceIndicators: {
	//	backgroundColor: '#ddd',
	//	padding: 20,
		position: 'absolute', top: -10, flex: 1,
		width: layout.width, opacity: 0.8,
		alignItems: 'center',
		justifyContent: 'center', marginTop: 40},
	practiceButton: {alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: layout.width, backgroundColor: '#F5D700'},
	practiceButtonText: {paddingVertical: 15,
		paddingHorizontal: 20,
		color: '#494000', fontSize: 20,
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
