
import React from 'react-native';
import Video from 'react-native-video';

const { View, Dimensions, Text } = React;

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
    this.setState({duration: data.duration});
  }


	onProgress(data) {
		// if (Math.round(data.currentTime, -2) % 0.05) {
      const progress = {
        currentTime: Math.round(data.currentTime * 100, 1) / 100,
				duration: data.playableDuration,
      }
      this.setState({currentTime: progress.currentTime, duration: progress.duration});
			this.props.onProgress(progress);
		// }
	}

  seek(time) {
    this._videoComponent.seek(time);
  }

  render() {
    const isRepeatIndicatorShow = +this.props.repeatsIndicator > 0;
    const completed = this.state.currentTime ? parseFloat(this.state.currentTime) / parseFloat(this.state.duration) * 100: 0;
    const remaining = 100 - completed;
	const paused  = this.props.paused ? 1 : 0;
    return (
      <View style={{
        alignItems: 'center', justifyContent: 'flex-start'
      }}>
        <Video
          ref={component => this._videoComponent = component}
          source={{uri: this.props.source}} // Can be a URL or a local file.
          rate={this.state.rate}
          paused={paused}
          volume={this.state.volume}
          muted={this.state.muted}
          resizeMode={this.state.resizeMode}
          onLoad={(data) => { this.onLoad(data) }}
          onProgress={(d) => this.onProgress.bind(this)(d) }
          onEnd={() => { /* repeat video */ }}
          repeat={true}
          style={[this.props.style, {flex: 1, height: window.height / 3, width: window.width}]}>
        </Video>
        {isRepeatIndicatorShow && 
          <View style={styles.repeatsIndicator}>
            <Text style={{color: '#000', fontSize: 13}}>{this.props.repeatsIndicator}</Text>
          </View>
        }
        <View style={[styles.repeatsIndicator, {top: window.height * 0.28, right: window.width * 0.02, width: 80}]}>
          <Text style={{color: '#000', fontSize: 13, textAlign: 'right'}}>{this.state.currentTime}s.</Text>
        </View>
        <View style={[styles.trackingControls, {width: window.width}]}>
          <View style={[styles.progress]}>
            <View style={[styles.innerProgressCompleted, {flex: completed}]} />
            <View style={[styles.innerProgressRemaining, {flex: remaining}]} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  trackingControls: {
    flex: 1,
    height: 5,
    backgroundColor: '#f7f7f7'
  },
  progress: {
    flexDirection: 'row',
    flex: 1,
    overflow: 'hidden',
  },
  innerProgressCompleted: {
    height: 5,
    backgroundColor: '#FF9500',
  },
  innerProgressRemaining: {
    top: -5,
    height: 5,
    backgroundColor: '#f7f7f7',
  },
  repeatsIndicator: {
    width: 25, height: 25, borderRadius: 12.5, backgroundColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center',
    position: 'absolute', top: window.width * 0.05,
    right: window.width * 0.05,
  }
}
