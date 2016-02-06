/* @flow */
import React from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import Cursor from './Cursor';

const { View, Dimensions, Text, TouchableWithoutFeedback, LayoutAnimation, TouchableOpacity, StyleSheet } = React;

const window = Dimensions.get('window'); // TODO: get rid of it
const VIDEO_HEIGHT = window.height / 3;

export default class VideoWrapper extends React.Component {
  constructor() {
		super();
		this.state = {
			rate: 1,
			volume: 1,
			muted: false,
			duration: 0.0,
      range: {
        start: 0,
        end: 0
      }
		};
	}

  onLoad(data: any) {
    if (data.duration > this.state.duration) {
      // TODO: simpilify
      this.setState({duration: parseFloat(data.duration), range: { start: 0, end: parseFloat(data.duration)}});
    }
  }

  componentDidMount() {
    setTimeout(() => {
      // check if video has been loaded
      console.log('check if video source is not obsolete', parseInt(this.state.duration) === 0)
      if (this.props.track.source && parseInt(this.state.duration) === 0) {
        this.props.selectTrack(true)
      }
    }, 1000)
  }

	onProgress(data: any) {

		// if (Math.round(data.currentTime, -2) % 0.05) {
      const progress = {
        currentTime: data.currentTime,
				duration: data.playableDuration,
      }

      if (this.props.timestamps && this.props.timestamps.length > 0) {
        // getSegment returns current selected segement
        const segment = this.getSegment(this.props);

        const delta = (segment.end - segment.start) / 2;
        // auto scale
        if (progress.currentTime + delta - 0.5 > this.state.range.end) {
          console.log('near the end!', progress.currentTime + delta, this.state.range.end)
          this.setState({
            range: {
              start: this.state.range.start,
              end: progress.currentTime + delta < this.state.duration ? progress.currentTime + delta : this.state.duration
            }
          })
        }

        if (this.state.range.start > 0 && progress.currentTime - delta < this.state.range.start) {
          console.log('near the start!', progress.currentTime - delta, this.state.range.start)
          this.setState({
            range: {
              start: progress.currentTime - delta < 0 ? 0 : progress.currentTime - delta,
              end: this.state.range.end
            }
          })
        }

      }

      // Закцикливаем текущий отрезок, если он дошел до конца
      if (!this.props.practice && this.props.currentTimestampIndex &&
        progress.currentTime + 0.150 > this.props.track.timestamps[this.props.currentTimestampIndex].time) {
          /*
           * Из-за того что наш таймер отрабатывает каждые 150 мс
           * мы можем не попасть в конец, поэтому нужно запустить таймер
           */
          console.log(progress.currentTime)
          //this.props.onProgress(progress);
          const timeWhenPauseAndReplay = this.props.track.timestamps[this.props.currentTimestampIndex].time - progress.currentTime;
          console.log('timeWhenPauseAndReplay', timeWhenPauseAndReplay)
          if (timeWhenPauseAndReplay > 0) {
            setTimeout(() => {
              this.props.onPlayPause()
              this.props.onProgress({currentTime: progress.currentTime + timeWhenPauseAndReplay - 0.01});
            }, timeWhenPauseAndReplay * 1000)

            setTimeout(() => {
              this.props.onPlayPause()
              this.props.onProgress({
                currentTime: parseInt(this.props.currentTimestampIndex, 0) === 0 ? 0 : this.props.track.timestamps[this.props.currentTimestampIndex - 1].time
              }, true)
            }, timeWhenPauseAndReplay * 1000 + 100)
          } else {
            this.props.onProgress({
              currentTime: parseInt(this.props.currentTimestampIndex, 0) === 0 ? 0 : this.props.track.timestamps[this.props.currentTimestampIndex - 1].time
            }, true)
          }


      } else {
        LayoutAnimation.configureNext({
          duration: 250,
          update: {
            type: LayoutAnimation.Types.linear,
          },
        });
        //console.log(progress.currentTime)
        this.props.onProgress(progress);
      }

	}

  seek(time) {
    this._videoComponent.seek(time);
  }
  getSegment(props) {
    return {
      start: parseInt(props.currentTimestampIndex,10) === 0 ? 0 : props.track.timestamps[props.currentTimestampIndex - 1].time,
      end: props.track.timestamps[props.currentTimestampIndex].time
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentTimestampIndex && nextProps.currentTimestampIndex !== this.props.currentTimestampIndex && nextProps.track) {
      const segment = this.getSegment(nextProps);
      this.setState({
        range: {
          start: segment.start === 0 ? 0 : segment.start - (segment.end - segment.start) / 2,
          end: segment.end + (segment.end - segment.start) / 2
        }
      });
    } else if (!nextProps.currentTimestampIndex && nextProps.currentTimestampIndex !== this.props.currentTimestampIndex) {
      this.setState({
        range: {
          start: 0,
          end: this.state.duration
        }
      });
    } else if (nextProps.currentTimestampIndex) {
      const segment = this.getSegment(nextProps);
      const delta = segment.end - segment.start;
      if (this.state.range.end - this.state.range.start > delta * 5 && delta > 0.3) {
        console.log('two segements getting too close:', this.state.range.end - this.state.range.start, delta * 5)
        this.setState({
          range: {
            start: segment.start === 0 ? 0 : segment.start - (segment.end - segment.start) / 2,
            end: segment.end + (segment.end - segment.start) / 2
          }
        });
      }
    }
  }

  reformat(time) {
    time = Math.floor(time);
    const pad = v => (new Array(3).join('0') + v).slice(-2);
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    return pad(minutes) + ':' + pad(seconds);
  }
  getPos(time) {
    return (time - this.state.range.start) / (this.state.range.end - this.state.range.start) * window.width;
  }
  getTime(pos) {
    const { range } = this.state;
    return (range.end - range.start) * pos / window.width + range.start;
  }

  render() {
    const { track, currentTimestampIndex, currentTime } = this.props;
    const { range } = this.state;
    // transform position to coordinates
    const completed = currentTime ? (currentTime - range.start) / (range.end - range.start)* 100: 0;

    const remaining = 100 - completed;
    // get time
  	const played = this.reformat(currentTime);
    const duration = this.reformat(this.state.duration);
    // if segment is selected then we animate
    const progressHeight = currentTimestampIndex ? 30 : 10;

    const seconds = Math.round(range.end - range.start);
    // |---1---1---|
    const secondsMarkers = [];
    if (currentTimestampIndex) {
      for (var j = Math.round(range.start); j < range.end; j+= (seconds < 7 ? 1 : 5)) {
        //console.log(j, progress.start, progress.end)
        const pos = this.getPos(j);
        secondsMarkers.push(<View key={j} style={{left: pos}}><View style={[ styles.divider]} />
            <Text style={styles.dividerText}>{this.reformat(j)}</Text>
          </View>)
      }
    }

    return (
      <View style={{
        alignItems: 'center', justifyContent: 'flex-start'
      }}>
        <TouchableWithoutFeedback onPress={() => this.props.onPlayPause()}>
          <Video
            ref={component => this._videoComponent = component}
            source={{uri: track.source}} // Can be a URL or a local file.
            rate={this.props.rate}
            paused={this.props.paused}
            volume={this.state.volume}
            muted={this.state.muted}
            resizeMode={'cover'}
            onVideoLoadStart={() => console.log('start loading...')}
            onLoad={(data) => { this.onLoad(data) }}
            onProgress={(d) => this.onProgress(d) }
            onEnd={() => console.log('load ended')}
            onError={(e) => console.error('video error:', e)}
            repeat={true}
            style={[this.props.style, {flex: 1, height: VIDEO_HEIGHT, width: window.width}]}>
          </Video>
        </TouchableWithoutFeedback>


        <Cursor
          position={this.getPos(currentTime)}
          progressHeight={progressHeight}
          color={'white'}
          onMove={x => this.props.onProgressChange(x / window.width * this.state.duration)} />


        {!!currentTimestampIndex && currentTimestampIndex > 0 &&
          <Cursor
            position={this.getPos(track.timestamps[currentTimestampIndex - 1].time)}
            progressHeight={progressHeight}
            color={'#F5D700'}
            onMove={x => this.props.moveTimestamp(currentTimestampIndex - 1, this.getTime(x))} />
        }

        {!!currentTimestampIndex &&
          <Cursor
            position={this.getPos(track.timestamps[currentTimestampIndex].time)}
            progressHeight={progressHeight}
            color={'#F5D700'}
            onMove={x => this.props.moveTimestamp(currentTimestampIndex, this.getTime(x))}  />
        }

        <View style={{position: 'absolute', top: window.height / 3 - (40 + progressHeight)}}>
          <View style={[styles.trackingControls, {width: window.width, opacity: 0.8, height: progressHeight}]}>
            <View style={[styles.progress]}>
              <View style={[styles.innerProgressCompleted, {flex: completed, height: progressHeight}]} />
              <View style={[styles.innerProgressRemaining, {flex: remaining, height: progressHeight}]} />
            </View>
            {!!currentTimestampIndex &&
              <View style={{flexDirection: 'row', backgroundColor: 'transparent'}}>
                {secondsMarkers}
              </View>
            }

          </View>
          <View style={styles.controls}>
            <TouchableOpacity onPress={() => this.props.onPlayPause() }>
              <Icon name={this.props.paused ? 'play' : 'pause'}
                size={28} color='#F5D700'
                style={{paddingVertical: 4, paddingHorizontal: 15}}/>
            </TouchableOpacity>
            <Text style={{color: '#F5D700'}}>{played} / {duration}</Text>
            <View style={{position: 'absolute', alignItems: 'center', right: 0, flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => this.props.onRateChanged(1) }
                style={[styles.rateButton, this.props.rate === 1 ? {backgroundColor: '#F5D700'} : {}]}>
                <Text style={{color:  this.props.rate === 1 ? 'black' : '#F5D700'}}>1.0x</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.onRateChanged(0.5) }
                style={[styles.rateButton, this.props.rate === 0.5 ? {backgroundColor: '#F5D700'} : {}]}>
                <Text style={{color:  this.props.rate === 1 ? '#F5D700' : 'black'}}>0.5x</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.addTimestamp() }>
              <Icon name={'scissors'}
                size={28} color='#F5D700'
                style={{paddingVertical: 4, paddingHorizontal: 25}}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  trackingControls: {
    flex: 1,
    height: 10,
    backgroundColor: '#f7f7f7'
  },
  progress: {
    flexDirection: 'row',
    flex: 1,
    //overflow: 'hidden',
  },
  innerProgressCompleted: {
    backgroundColor: '#FF9500',
  },
  innerProgressRemaining: {
    //top: -5,
    backgroundColor: '#f7f7f7',
  },
  repeatsIndicator: {
    width: 25, height: 25, borderRadius: 12.5, backgroundColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center',
    position: 'absolute', top: window.width * 0.05,
    right: window.width * 0.05,
  },
  rateButton: {marginLeft: 10, padding: 5, borderWidth: 1, borderColor: '#F5D700'},
  divider: {top: 0, height: 30, width: 2, backgroundColor: 'black'},
  dividerText: {fontSize: 14, fontFamily:'courier', position: 'absolute', left: -10, top: -18, color: 'white', textAlign: 'center'},
  controls: {height: 40, alignItems: 'center', width: window.width, flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: 'black', opacity: 0.7}
})
