/* @flow */
import React from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import Cursor from './Cursor';

const { View, Dimensions, Text, TouchableWithoutFeedback, LayoutAnimation, TouchableOpacity } = React;

const window = Dimensions.get('window'); // TODO: get rid of it
const VIDEO_HEIGHT = window.height / 3;

export default class VideoWrapper extends React.Component {
  constructor(props) {
		super();
		this.state = {
			rate: 1,
			volume: 1,
			muted: false,
			duration: 0.0,
			paused: true,
      progress: {
        start: 0,
        end: 0
      }
		};
	}

  onLoad(data: any) {
    if (data.duration > this.state.duration) {
      // TODO: simpilify
      this.setState({duration: parseFloat(data.duration), progress: { start: 0, end: parseFloat(data.duration)}});
    }
  }

  componentDidMount() {
    setTimeout(() => {
      // check if video has been loaded
      console.log('check if video source is not obsolete', this.state.duration)
      if (this.props.source && parseInt(this.state.duration) === 0) {
        this.props.selectTrack(true)
      }
    }, 1000)
  }

	onProgress(data: any) {

		// if (Math.round(data.currentTime, -2) % 0.05) {
      const progress = {
        currentTime: Math.round(data.currentTime * 100, 1) / 100,
				duration: data.playableDuration,
      }
      if (progress.currentTime > this.state.progress.end) {
        this.setState({
          progress: {
            start: this.state.progress.start,
            end: progress.currentTime + 3 < this.state.duration ? progress.currentTime + 3 : this.state.duration
          }
        })
      }
      //this.setState({duration: progress.duration});
			this.props.onProgress(progress);
		// }
	}

  seek(time) {
    this._videoComponent.seek(time);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentTimestampIndex !== this.props.currentTimestampIndex && nextProps.track) {
      //LayoutAnimation.spring();
      const segment = {
        start: nextProps.currentTimestampIndex === 0 ? 0 : nextProps.track.timestamps[nextProps.currentTimestampIndex - 1].time,
        end: nextProps.track.timestamps[nextProps.currentTimestampIndex].time
      };

      this.setState({
        progress: {
          start: segment.start === 0 ? 0 : segment.start - (segment.end - segment.start),
          end: segment.end + (segment.end - segment.start)
        }
      });
    }
  }

  reformat(time) {
    time = Math.round(time);
    const pad = v => (new Array(3).join('0') + v).slice(-2);
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    return pad(minutes) + ':' + pad(seconds);
  }

  render() {
    const isRepeatIndicatorShow = +this.props.repeatsIndicator > 0;

    const { track, currentTimestampIndex, currentTime } = this.props;
    const { progress } = this.state;
    // transform position to coordinates
    const completed = currentTime ? (currentTime - progress.start) / (progress.end - progress.start)* 100: 0;
    const remaining = 100 - completed;
    // get time
  	const played = this.reformat(currentTime);
    const duration = this.reformat(this.state.duration);
    // if segment is selected then we animate
    const progressHeight = currentTimestampIndex ? 30 : 10;

    const secondsMarkers = currentTimestampIndex &&
      Array.apply(null, Array(Math.round(progress.end - progress.start))).map((_, i) => i);

    // if (currentTimestampIndex) {
    //   console.log('secondsMarkers',
    //     Math.round(progress.end - progress.start),
    //     progress.end,
    //     track.timestamps[currentTimestampIndex - 1].time,
    //     (track.timestamps[currentTimestampIndex - 1].time - progress.start) / (progress.end - progress.start))
    // }

    return (
      <View style={{
        alignItems: 'center', justifyContent: 'flex-start'
      }}>
        <TouchableWithoutFeedback onPress={() => this.props.onPlayPause()}>
          <Video
            ref={component => this._videoComponent = component}
            source={{uri: track.source}} // Can be a URL or a local file.
            rate={this.state.rate}
            paused={this.props.paused}
            volume={this.state.volume}
            muted={this.state.muted}
            resizeMode={'cover'}
            onVideoLoadStart={() => console.log('start loading...')}
            onLoad={(data) => { this.onLoad(data) }}
            onProgress={(d) => this.onProgress(d) }
            onEnd={() => console.log('ended')}
            onError={(e) => console.error('video error:', e)}
            repeat={true}
            style={[this.props.style, {flex: 1, height: VIDEO_HEIGHT, width: window.width}]}>
          </Video>
        </TouchableWithoutFeedback>

        {!currentTimestampIndex &&
          <Cursor
            position={completed * window.width / 100 - 15}
            progressHeight={progressHeight}
            color={'white'}
            onMove={x => this.props.onProgressChange(x / window.width * this.state.duration)} />
        }

        {!!currentTimestampIndex && currentTimestampIndex > 0 &&
          <Cursor
            position={((track.timestamps[currentTimestampIndex - 1].time - progress.start) / (progress.end - progress.start)) * window.width - 15}
            progressHeight={progressHeight}
            color={'#F5D700'}
            onMove={x => this.props.moveTimestamp(currentTimestampIndex - 1, x / window.width * (progress.end - progress.start))} />
        }

        {!!currentTimestampIndex &&
          <Cursor
            position={((track.timestamps[currentTimestampIndex].time - progress.start) / (progress.end - progress.start)) * window.width - 15}
            progressHeight={progressHeight}
            color={'#F5D700'}
            onMove={x => this.props.moveTimestamp(currentTimestampIndex, x / window.width * (progress.end - progress.start))}  />
        }

        <View style={{position: 'absolute', top: window.height / 3 - (40 + progressHeight)}}>
          <View style={[styles.trackingControls, {width: window.width, opacity: 0.5, height: progressHeight}]}>
            <View style={[styles.progress]}>
              <View style={[styles.innerProgressCompleted, {flex: completed, height: progressHeight}]} />
              <View style={[styles.innerProgressRemaining, {flex: remaining, height: progressHeight}]} />
            </View>
          </View>
          <View style={styles.controls}>
            <TouchableOpacity onPress={() => this.props.onPlayPause() }>
              <Icon name={this.props.paused ? 'play' : 'pause'}
                size={28} color='#F5D700'
                style={{paddingVertical: 4, paddingHorizontal: 15}}/>
            </TouchableOpacity>
            <Text style={{color: '#F5D700'}}>{played} / {duration}</Text>
            <View style={{position: 'absolute', alignItems: 'center', right: 0, flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => this.setState({rate: 1}) }
                style={[styles.rateButton, this.state.rate === 1 ? {backgroundColor: '#F5D700'} : {}]}>
                <Text style={{color:  this.state.rate === 1 ? 'black' : '#F5D700'}}>1.0x</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({rate: 0.5}) }
                style={[styles.rateButton, this.state.rate === 0.5 ? {backgroundColor: '#F5D700'} : {}]}>
                <Text style={{color:  this.state.rate === 1 ? '#F5D700' : 'black'}}>0.5x</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.addTimestamp() }>
              <Icon name={'scissors'}
                size={28} color='#F5D700'
                style={{paddingVertical: 4, paddingHorizontal: 25}}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {isRepeatIndicatorShow &&
          <View style={styles.repeatsIndicator}>
            <Text style={{color: '#000', fontSize: 13}}>{this.props.repeatsIndicator}</Text>
          </View>
        }
      </View>
    );
  }
}

const styles = {
  trackingControls: {
    flex: 1,
    height: 10,
    backgroundColor: '#f7f7f7'
  },
  progress: {
    flexDirection: 'row',
    flex: 1,
    overflow: 'hidden',
  },
  innerProgressCompleted: {
    backgroundColor: '#FF9500',
  },
  innerProgressRemaining: {
    top: -5,
    backgroundColor: '#f7f7f7',
  },
  repeatsIndicator: {
    width: 25, height: 25, borderRadius: 12.5, backgroundColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center',
    position: 'absolute', top: window.width * 0.05,
    right: window.width * 0.05,
  },
  rateButton: {marginLeft: 10, padding: 5, borderWidth: 1, borderColor: '#F5D700'},
  controls: {height: 40, alignItems: 'center', width: window.width, flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: 'black', opacity: 0.7}
}
