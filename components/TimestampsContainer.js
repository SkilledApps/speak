/* @flow */

import React from 'react-native';
import EditableCaption from './EditableCaption';

const { View, Text, TouchableOpacity, Dimensions, StyleSheet, ListView, TextInput, LayoutAnimation } = React;
import Icon from 'react-native-vector-icons/Ionicons';
const layout = Dimensions.get('window');

const reformat = (time) => {
  //console.log('reformat', time)
  const roundedTime = Math.floor(time);
  const pad = v => (new Array(3).join('0') + v).slice(-2);
  const minutes = Math.floor(roundedTime / 60);
  const seconds = roundedTime - minutes * 60;
  const milliseconds = time - roundedTime;
  return <Text>{pad(minutes) + ':' + pad(seconds)}<Text style={{color: '#888'}}>{':' + pad(milliseconds.toFixed(2))}</Text></Text>;
}

const Timings = (props) => {
  return <Text style={styles.timingText} numberOfLines={2}>{reformat(props.prevTime)} {reformat(props.time)}</Text>;
}

class TimestampControl extends React.Component {

  shouldComponentUpdate(nextProps) {
    //TODO: immutable?
    return (nextProps.isPlayed !== this.props.isPlayed ||
      nextProps.isSelected !== this.props.isSelected ||
      nextProps.isExpanded !== this.props.isExpanded ||
      nextProps.progress !== this.props.progress ||
      nextProps.time !== this.props.time ||
      nextProps.title !== this.props.title ||
      nextProps.isMuted !== this.props.isMuted)
  }

  render() {
    const playedStyle = this.props.isPlayed ? {backgroundColor: '#F6FBC7'} : {};
    const selectedStyle = this.props.isSelected ? { borderLeftColor: '#FF9500', borderLeftWidth: 10} : {};
    const mutedStyle = this.props.isMuted ? { opacity: 0.5} : {};
    return (
      <View style={[styles.row, mutedStyle]}>

        <TouchableOpacity style={[styles.timestampControl, playedStyle, selectedStyle]}
          onPress={this.props.onSelect} onLongPress={() => this.props.onExpand()}>
          <View style={[styles.progressBar,  {width: layout.width * this.props.progress}]} />
          <Timings prevTime={this.props.prevTime} time={this.props.time} />
          <View style={{width: 200}}>
            <EditableCaption
              editMode={!this.props.title || this.props.isExpanded}
              title={this.props.title}
              onTitleChange={this.props.onTitleChange} />
          </View>
          <TouchableOpacity style={styles.button2} onPress={ () => this.props.onExpand() }>
            <Icon name={this.props.isExpanded ? 'ios-arrow-up': 'ios-arrow-down'} size={30} color='#222'/>
          </TouchableOpacity>
        </TouchableOpacity>

      {this.props.isExpanded &&
        <View style={{flexDirection: 'row', flex: 1, marginVertical: 10, width: layout.width, justifyContent: 'space-around'}}>
          <TouchableOpacity style={styles.button2} onPress={ () => this.props.deleteTimestamp() }>
            <Icon name='ios-trash-outline' size={30} color='#222'/>
            <Text>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button2} onPress={ () => this.props.likeTimestamp() }>
            <Icon name='ios-star-outline' size={30} color='#222'/>
            <Text>Add to favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button2} onPress={ () => this.props.muteTimestamp() }>
            <Icon name={this.props.isMuted ? 'android-volume-up' : 'android-volume-off'} size={30} color='#222'/>
            <Text>{this.props.isMuted ? 'Unmute' : 'Mute'}</Text>
          </TouchableOpacity>
        </View>
      }
      </View>
    )
  }
}

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class TimestampsContainer extends React.Component {
  constructor(props) {
    super();
    this.state = {
      dataSource: ds.cloneWithRows(props.timestamps.map(this.fillRow.bind(this, props)))
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.timestamps.length !== nextProps.timestamps.length) {
      LayoutAnimation.spring();
      if (this.props.timestamps.length < nextProps.timestamps.length) {
        const currentTimestampIndex = nextProps.timestamps.length - nextProps.timestamps.filter(t => t.time > this.props.currentTime).length + 1;
        this.scrollTo(currentTimestampIndex, nextProps.timestamps.length);
      }
    }
    this.setState({
      dataSource: this.state.dataSource
        .cloneWithRows(nextProps.timestamps.map(this.fillRow.bind(this, nextProps)))
      })
  }
  fillRow(props, rowData, rowID) {
    const { timestamps, currentTime, selectedIndex } = props;
    const isPlayed = currentTime + 0.1 > rowData.time;
    const prevTime= rowID > 0 ? timestamps[parseInt(rowID, 10) - 1].time : 0
    const nextTime= rowID < timestamps.length - 1 ? timestamps[parseInt(rowID, 10) + 1].time : timestamps[timestamps.length - 1].time;
    const progress = currentTime >= prevTime && currentTime < rowData.time &&
      ((currentTime - prevTime) / (rowData.time - prevTime));
      // TODO: optimization
    rowData.currentTime = currentTime;
    rowData.prevTime= prevTime
    rowData.nextTime=nextTime
    rowData.progress=progress
    rowData.isPlayed=isPlayed
    rowData.isSelected=parseInt(selectedIndex, 10) === parseInt(rowID, 10)
    rowData.isExpanded=this.state && parseInt(this.state.expanded) === parseInt(rowID)
    return {...rowData};
  }

  expanded(rowID) {
    LayoutAnimation.easeInEaseOut();
    this.setState({
      expanded: this.state.expanded === rowID ? null : rowID,
      dataSource: this.state.dataSource.cloneWithRows(this.props.timestamps.map(this.fillRow.bind(this, this.props)))
    });
    this.props.onSelect(rowID)
  }

  renderRow(rowData, sectionID, rowID, highlightRow) {

    return (
      <TimestampControl {...rowData}
        key={rowID}
        {...rowData}
        onSelect={() => {
          LayoutAnimation.easeInEaseOut();
          this.scrollTo(parseInt(rowID) + 1, this.props.timestamps.length)
          if (rowData.isSelected && rowData.isExpanded) {
            this.expanded(rowID)
          }
          this.props.onSelect(rowData.isSelected ? null : rowID);
        } }
        deleteTimestamp={() => {
          this.expanded(rowID);
          this.props.deleteTimestamp(rowID);
        } }
        onTitleChange={title => this.props.onTitleChange(rowID, title)}
        onMove={(k, delta) => this.props.onMove(rowID, delta) }
        onExpand={() => this.expanded(rowID) }
        muteTimestamp={() => this.props.muteTimestamp(rowID)}
      />
    )
  }

  scrollTo(index, total) {
    if (index > 5) { // TODO:
      const scrollProperties = this.refs.listview.scrollProperties;
      const scrollOffset = scrollProperties.contentLength / total * (index + 1) - scrollProperties.visibleLength;
      // console.log('index=', index, 'total=', total,
      //   'perSegment=', scrollProperties.contentLength / total, 'absolute=',
      //   scrollProperties.contentLength / total * parseInt(index, 10), 'visiableLength=', scrollProperties.visibleLength);
      this.refs.listview.getScrollResponder().scrollTo(scrollOffset);
    }
  }

  render() {
    return (
        <ListView
          ref={'listview'}
          dataSource={this.state.dataSource}
          showsVerticalScrollIndicator={true}
          horizontal={false}
          initialListSize={1}
          pageSize={1}
          removeClippedSubviews={true}
          renderRow = {this.renderRow.bind(this)}
          style={{width: layout.width, height: 2 * layout.height / 3 - 118}} />

    );
  }
}

const styles = StyleSheet.create({
    row: { borderBottomColor: '#ccc', borderBottomWidth: 1, overflow: 'hidden'},
    timestampControl: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        width: layout.width,
        padding: 10,
        height: 53
    },
    caption: {
        paddingVertical: 5,
        paddingHorizontal: 30,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#34AADC',
        width: 200,
        padding: 5
    },
    hyperlink: {textDecorationLine: 'underline', color: '#494000', textDecorationStyle: 'dotted', fontSize: 16},
    button2: {
        //marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    timingText: { fontSize: 12, fontFamily: 'courier', width: 60, backgroundColor: 'transparent'},
    voiceButton: { position: 'absolute', left: layout.width * 0.2, },
    progressBar: {position: 'absolute', backgroundColor: '#FFF8CA',height: 53, top: 0, left: 0}

})
