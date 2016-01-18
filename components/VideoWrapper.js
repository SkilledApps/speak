/* @flow */
import React from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';

const { View, Dimensions, Text, TouchableWithoutFeedback, TouchableOpacity } = React;

const window = Dimensions.get('window'); // TODO: get rid of it

export default class VideoWrapper extends React.Component {
  constructor() {
		super();
		this.state = {
			rate: 1,
			volume: 1,
			muted: false,
			resizeMode: 'cover',
			duration: 0.0,
			//currentTime: 0.0,
			chapters: [],
			currentChapter: null,
			paused: true,
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
    if (data.duration > this.state.duration) {
      this.setState({duration: data.duration});
    }
  }

  componentDidMount() {
    setTimeout(() => {
      // check if video has been loaded
      console.log('check if video source is not oblsolete', this.state.duration)
      if (this.props.source && (this.state.duration === '0.0' || this.state.duration === 0)) {
        this.props.selectTrack()
      }
    }, 1000)
  }

	onProgress(data) {
		// if (Math.round(data.currentTime, -2) % 0.05) {
      const progress = {
        currentTime: Math.round(data.currentTime * 100, 1) / 100,
				duration: data.playableDuration,
      }
      //this.setState({duration: progress.duration});
			this.props.onProgress(progress);
		// }
	}

  seek(time) {
    this._videoComponent.seek(time);
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
    const completed = this.props.currentTime ? parseFloat(this.props.currentTime) / parseFloat(this.state.duration) * 100: 0;
    const remaining = 100 - completed;
  	const played = this.reformat(this.props.currentTime);
    const duration = this.reformat(this.state.duration);

    return (
      <View style={{
        alignItems: 'center', justifyContent: 'flex-start'
      }}>
        <TouchableWithoutFeedback onPress={() => this.props.onPlayPause()}>
          <Video
            ref={component => this._videoComponent = component}
            source={{uri: this.props.source}} // Can be a URL or a local file.
            rate={this.state.rate}
            paused={this.props.paused}
            volume={this.state.volume}
            muted={this.state.muted}
            resizeMode={this.state.resizeMode}
            onLoad={(data) => { this.onLoad(data) }}
            onProgress={(d) => this.onProgress.bind(this)(d) }
            onEnd={() => console.log('ended')}
            onError={(e) => console.log(e)}
            repeat={true}
            style={[this.props.style, {flex: 1, height: window.height / 3, width: window.width}]}>
          </Video>
        </TouchableWithoutFeedback>
        <View style={{position: 'absolute', top: window.height / 3 - 50}}>
          <View style={[styles.trackingControls, {width: window.width, opacity: 0.5}]}>
            <View style={[styles.progress]}>
              <View style={[styles.innerProgressCompleted, {flex: completed}]} />
              <View style={[styles.innerProgressRemaining, {flex: remaining}]} />
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
    height: 25,
    backgroundColor: '#FF9500',
  },
  innerProgressRemaining: {
    top: -5,
    height: 25,
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
