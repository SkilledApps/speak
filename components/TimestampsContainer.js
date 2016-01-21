/* @flow */

import React from 'react-native';
import EditableCaption from './EditableCaption';

const { View, Text, TouchableOpacity, Dimensions, StyleSheet, ListView, TextInput, LayoutAnimation } = React;
import Icon from 'react-native-vector-icons/Ionicons';
const layout = Dimensions.get('window');

const reformat = (time) => {
  console.log(time, 'reformat')
  const roundedTime = Math.round(time);
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
    return (nextProps.isPlayed !== this.props.isPlayed ||
      nextProps.isSelected !== this.props.isSelected ||
      nextProps.isExpanded !== this.props.isExpanded ||
      (nextProps.progress !== this.props.progress))
  }
  componentWillUpdate() {
    console.log('update component for', this.props.time)
  }


  render() {
    const playedStyle = this.props.isPlayed ? {backgroundColor: '#F6FBC7'} : {};
    const selectedStyle = this.props.isSelected ? { borderLeftColor: '#FF9500', borderLeftWidth: 10} : {};


    return (
      <View style={styles.row}>
        <TouchableOpacity style={[styles.timestampControl, playedStyle, selectedStyle]} onPress={this.props.onSelect} onLongPress={() => console.log('long press')}>
          <View style={[styles.progressBar,  {width: layout.width * this.props.progress}]} />
          <Timings prevTime={this.props.prevTime} time={this.props.time} />
          <View style={{width: 200}}>
            <EditableCaption editMode={!this.props.title} title={this.props.title} onTitleChange={this.props.onTitleChange} />
          </View>
          <View style={{justifyContent: 'space-between', flexDirection: 'row', backgroundColor: 'transparent'}}>
            <TouchableOpacity style={styles.button2} onPress={ () => this.props.onExpand() }>
              <Icon name={this.props.isExpanded ? 'ios-arrow-up': 'ios-arrow-down'} size={30} color='#222'/>
            </TouchableOpacity>
          </View>
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
            <Icon name='android-microphone-off' size={30} color='#222'/>
            <Text>Mute</Text>
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
    console.log('====================================================')
    if (this.props.timestamps.length !== nextProps.timestamps.length) {
      LayoutAnimation.spring();
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
    rowData.currentTime = currentTime;
    rowData.prevTime= prevTime
    rowData.nextTime=nextTime
    rowData.progress=progress
    rowData.isPlayed=isPlayed
    rowData.isSelected=parseInt(selectedIndex, 10) === parseInt(rowID, 10)
    rowData.isExpanded=this.state && this.state.expanded === rowID
    return {...rowData};
  }

  expanded(rowID) {
    LayoutAnimation.easeInEaseOut();
    if (this.state.expanded) {
      this.setState({expanded: null}); this.props.onSelect(null)
    } else {
      this.setState({expanded: rowID}); this.props.onSelect(rowID)
    }
  }

  renderRow(rowData, sectionID, rowID, highlightRow) {

    return (
      <TimestampControl {...rowData}
        key={rowID}
        {...rowData}
        onSelect={() => {
          LayoutAnimation.easeInEaseOut();
          this.props.onSelect(rowID);
        } }
        deleteTimestamp={() => {
          this.expanded(rowID);
          this.props.deleteTimestamp(rowID);
        } }
        onTitleChange={title => this.props.onTitleChange(rowID, title)}
        onMove={(k, delta) => this.props.onMove(rowID, delta) }
        onExpand={() => this.expanded(rowID) } />
    )
  }

  renderRow1(rowData, sectionID, rowID, highlightRow) {
    const { timestamps, currentTime, selectedIndex } = this.props;
    const isPlayed = currentTime + 0.1 > rowData.time;
    const prevTime= rowID > 0 ? timestamps[parseInt(rowID, 10) - 1].time : 0
    const nextTime= rowID < timestamps.length - 1 ? timestamps[parseInt(rowID, 10) + 1].time : timestamps[timestamps.length - 1].time;

    const progress = currentTime >= prevTime && currentTime < rowData.time &&
      ((currentTime - prevTime) / (rowData.time - prevTime));

    return (
      <TimestampControl {...rowData}
        currentTime={currentTime}
        prevTime={prevTime}
        nextTime={nextTime}
        progress={progress}
        isPlayed={isPlayed}
        key={rowID}
        isSelected={parseInt(selectedIndex, 10) === parseInt(rowID, 10)}
        isExpanded={this.state.expanded === rowID}
        onSelect={() => {
          LayoutAnimation.easeInEaseOut();
          this.props.onSelect(rowID);
        } }
        deleteTimestamp={() => {
          this.expanded(rowID);
          this.props.deleteTimestamp(rowID);
        } }
        onTitleChange={title => this.props.onTitleChange(rowID, title)}
        onMove={(k, delta) => this.props.onMove(rowID, delta) }
        onExpand={() => this.expanded(rowID) } />
    )
  }
  render1() {
    const rows = this.props.timestamps.map((row, index) =>this.renderRow(row, null, index))
    return <React.ScrollView removeClippedSubviews={true} style={{width: layout.width, height: 2 * layout.height / 3 - 118}} >
      {rows}
    </React.ScrollView>;
  }
  render() {

    return (

        <ListView
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
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    timingText: { fontSize: 12, fontFamily: 'courier', width: 60, backgroundColor: 'transparent'},
    voiceButton: { position: 'absolute', left: layout.width * 0.2, },
    progressBar: {position: 'absolute', backgroundColor: '#FFF8CA',height: 53, top: 0, left: 0}

})
