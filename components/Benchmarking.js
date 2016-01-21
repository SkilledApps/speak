/* @flow */
import React from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import Cursor from './Cursor';

const { View, Dimensions, Text, TouchableWithoutFeedback, TouchableOpacity, StyleSheet } = React;

const window = Dimensions.get('window'); // TODO: get rid of it
const VIDEO_HEIGHT = window.height / 3;


class ModeControls extends React.Component {
  render() {
    return (
      <View style={styles.controlsWrapper}>
        <TouchableOpacity onPress={() => this.setState({rate: 1}) }
          style={[styles.rateButton, this.props.rate === 1 ? {backgroundColor: '#F5D700'} : {}]}>
          <Text style={{color:  this.props.rate === 1 ? 'black' : '#F5D700'}}>1.0x</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.setState({rate: 0.5}) }
          style={[styles.rateButton, this.props.rate === 0.5 ? {backgroundColor: '#F5D700'} : {}]}>
          <Text style={{color:  this.props.rate === 1 ? '#F5D700' : 'black'}}>0.5x</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.addTimestamp() }>
        <Icon name={'scissors'}
          size={28} color='#F5D700'
          style={{paddingVertical: 4, paddingHorizontal: 25}}/>
        </TouchableOpacity>
      </View>
    )
  }
}
class ControlsWrapper extends React.Component {
  render() {
    const { currentTime, progress } = this.props;


    const completed = currentTime ? (currentTime - progress.start) / (progress.end - progress.start)* 100: 0;
    const remaining = 100 - completed;

    return (
      <View style={{position: 'absolute', top: window.height / 3 - (40 + this.props.height)}}>
        <View style={[styles.trackingControls, {width: window.width, opacity: 0.8, height: this.props.height}]}>
          <View style={[styles.progress]}>
            <View style={[styles.innerProgressCompleted, {flex: completed, height: this.props.height}]} />
            <View style={[styles.innerProgressRemaining, {flex: remaining, height: this.props.height}]} />
          </View>
        </View>
        {this.props.children}
      </View>
    )
  }
}
export default class Bench extends React.Component {
  constructor(props) {
		super();
		this.state = {
			rate: 1,
			volume: 1,
			muted: false,
			duration: 0.0,
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

    setInterval(() => {
      const progress = {
        currentTime: new Date() / 100,
				duration: '10.10',
      }
      this.props.onProgress(progress);
    }, 25)
  }

	onProgress(data: any) {

		// if (Math.round(data.currentTime, -2) % 0.05) {
      const progress = {
        currentTime: Math.round(data.currentTime * 100, 1) / 100,
				duration: data.playableDuration,
      }
      // if (progress.currentTime > this.state.progress.end) {
      //   this.setState({
      //     progress: {
      //       start: this.state.progress.start,
      //       end: progress.currentTime + 3 < this.state.duration ? progress.currentTime + 3 : this.state.duration
      //     }
      //   })
      // }
      // LayoutAnimation.linear();
			//this.props.onProgress(progress);
	}

  seek(time) {
    this._videoComponent.seek(time);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentTimestampIndex && nextProps.currentTimestampIndex !== this.props.currentTimestampIndex && nextProps.track) {
      //LayoutAnimation.spring();
      const segment = {
        start: parseInt(nextProps.currentTimestampIndex,10) === 0 ? 0 : nextProps.track.timestamps[nextProps.currentTimestampIndex - 1].time,
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
  getPos(time) {
    return (time - this.state.progress.start) / (this.state.progress.end - this.state.progress.start) * window.width;
  }
  getTime(pos) {
    const { progress } = this.state;
    return (progress.end - progress.start) * pos / window.width + progress.start;
    //return (time - this.state.progress.start) / (this.state.progress.end - this.state.progress.start) * window.width;
  }

  render() {
    if (!this.props.track) {
      return null;
    }
    const { track, currentTimestampIndex, currentTime } = this.props;

    return (
      <TouchableWithoutFeedback onPress={() => this.props.onPlayPause()}>
        <Video
          ref={component => this._videoComponent = component}
          source={{uri: track.source}} // Can be a URL or a local file.
          rate={this.state.rate}
          paused={false}
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
    )
  }

  render1() {
    if (!this.props.track) {
      return null;
    }
    const isRepeatIndicatorShow = +this.props.repeatsIndicator > 0;

    const { track, currentTimestampIndex, currentTime } = this.props;
    const { progress } = this.state;
    // transform position to coordinates

    // get time
  	const played = this.reformat(currentTime);
    const duration = this.reformat(this.state.duration);
    // if segment is selected then we animate
    const progressHeight = currentTimestampIndex ? 30 : 10;

    const seconds = Math.round(progress.end - progress.start);
    // |---1---1---|
    const secondsMarkers = [];
    if (currentTimestampIndex) {
      for (var j = Math.round(progress.start); j < progress.end; j+= (seconds < 7 ? 1 : 10)) {
        //console.log(j, progress.start, progress.end)
        const pos = this.getPos(j);
        secondsMarkers.push(<View key={j} style={{left: pos}}><View style={[ styles.divider]} />
            <Text style={styles.dividerText}>{this.reformat(j)}</Text>
          </View>)
      }
    }
    // const secondsMarkers = currentTimestampIndex &&
    //   Array.apply(null, Array(seconds))
    //     .map((_, i) => {
    //       const pos = (i*(progress.end - progress.start)/seconds) / (progress.end - progress.start) * window.width;
    //       console.log(progress, i, 'per second:', (progress.end - progress.start)/seconds, '', i*(progress.end - progress.start)/seconds, 'sec', pos)
    //       return <View style={[{left: pos}, styles.divider]} />
    //     });

    return (
      <View>
        <TouchableWithoutFeedback onPress={() => this.props.onPlayPause()}>
          <Video
            ref={component => this._videoComponent = component}
            source={{uri: track.source}} // Can be a URL or a local file.
            rate={this.state.rate}
            paused={false}
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

        <ControlsWrapper height={progressHeight}
          currentTime={this.props.currentTime}
          progress={this.state.progress}>

          <View style={styles.controls}>
            <TouchableOpacity onPress={() => this.props.onPlayPause() }>
              <Icon name={this.props.paused ? 'play' : 'pause'}
                size={28} color='#F5D700'
                style={{paddingVertical: 4, paddingHorizontal: 15}}/>
            </TouchableOpacity>
            <Text style={{color: '#F5D700'}}>{played}</Text>
            <Text style={{color: '#F5D700'}}>/ {duration}</Text>
            <ModeControls rate={this.state.rate} />

          </View>
        </ControlsWrapper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  controlsWrapper: {
    position: 'absolute', alignItems: 'center', right: 0, flexDirection: 'row'
  },
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
