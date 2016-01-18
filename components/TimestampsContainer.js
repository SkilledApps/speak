import React from 'react-native';
import EditableCaption from './EditableCaption';

const { View, Text, TouchableOpacity, Dimensions, ListView, TextInput, LayoutAnimation } = React;
import Icon from 'react-native-vector-icons/Ionicons';
const layout = Dimensions.get('window');

class TimestampControl extends React.Component {
  reformat(time) {
    time = Math.round(time);
    const pad = v => (new Array(3).join('0') + v).slice(-2);
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    return pad(minutes) + ':' + pad(seconds);
  }

  render() {
    const playedStyle = this.props.isPlayed ? {backgroundColor: '#F6FBC7'} : {};
    console.log(this.props.isSelected)
    const selectedStyle = this.props.isSelected ? { borderLeftColor: '#FF9500', borderLeftWidth: 10} : {};
    const progress = this.props.currentTime >= this.props.prevTime && this.props.currentTime < this.props.time &&
      ((this.props.currentTime - this.props.prevTime) / (this.props.time - this.props.prevTime));

    return (
      <TouchableOpacity style={[styles.timestampControl, playedStyle, selectedStyle]} onPress={this.props.onSelect}>
        <View style={{position: 'absolute', backgroundColor: '#FFF8CA', width: layout.width * progress, height: 53, top: 0, left: 0}} />

        <Text style={styles.timingText}>{this.reformat(this.props.prevTime)} - {this.reformat(this.props.time)}</Text>
        <View style={{width: 200}}>
          <EditableCaption editMode={!this.props.title} title={this.props.title} onTitleChange={this.props.onTitleChange}/>
        </View>
        <View style={{justifyContent: 'space-between', flexDirection: 'row', backgroundColor: 'transparent'}}>
          <TouchableOpacity style={styles.button2} onPress={ () => { }}>
            <Icon name='ios-arrow-down' size={30} color='#222'/>
          </TouchableOpacity>
        </View>

      </TouchableOpacity>
    )
  }
}

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class TimestampsContainer extends React.Component {
  constructor(props) {
    super();
    this.state = {
      dataSource: ds.cloneWithRows(props.timestamps)
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.timestamps.length !== nextProps.timestamps.length) {
      LayoutAnimation.spring();
    } else {
      LayoutAnimation.linear();
    }
    this.setState({dataSource: ds.cloneWithRows(nextProps.timestamps)})
  }
  renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <TimestampControl {...rowData}
        currentTime={this.props.currentTime}
        prevTime={rowID > 0 ? this.props.timestamps[parseInt(rowID, 10) - 1].time : 0}
        nextTime={rowID < this.props.timestamps.length - 1 ? this.props.timestamps[parseInt(rowID, 10) + 1].time : this.props.timestamps[this.props.timestamps.length - 1].time}
        isPlayed={this.props.currentTime + 0.1 > rowData.time}
        isSelected={this.props.selectedIndex === parseInt(rowID, 10) - 1}
        onSelect={() => this.props.onSelect(rowID) }
        onDelete={() => this.props.onDelete(rowID) }
        onTitleChange={title => this.props.onTitleChange(rowID, title)}
        onMove={(k, delta) => this.props.onMove(rowID, delta) }/>
    )
  }
  render() {

    return (
      <View style={{justifyContent: 'flex-start', alignItems: 'center'}}>
        <ListView
          dataSource={this.state.dataSource}
          showsVerticalScrollIndicator={true}
          horizontal={false}
          renderRow = {this.renderRow.bind(this)}
          contentContainerStyle={{justifyContent: 'flex-start',
            alignItems: 'center', paddingBottom: 25}}
            style={{height: 2 * layout.height / 3 - 50, width: layout.width}} />

        <TouchableOpacity
          onPress={() => this.props.startPractice() }
          style={{position: 'absolute', bottom: 13, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: layout.width, backgroundColor: '#F5D700'}}>
          <Icon name={'mic-a'} size={25} color={'#494000'}/>
          <Text style={{paddingVertical: 15,
            paddingHorizontal: 20,
            color: '#494000', fontSize: 20,
          }}>{this.props.inPractice ? 'Stop Practice' : 'Start Practice'}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
    timestampControl: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        width: layout.width,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        padding: 10,
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
        marginHorizontal: 10
    },
    timingText: { fontSize: 12, backgroundColor: 'transparent'},
    voiceButton: { position: 'absolute', left: layout.width * 0.2, }


}
