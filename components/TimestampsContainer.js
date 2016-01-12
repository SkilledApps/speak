import React from 'react-native';

const { View, Text, TouchableOpacity, Dimensions, ScrollView } = React;
import Icon from 'react-native-vector-icons/Ionicons';
const layout = Dimensions.get('window');

class TimestampControl extends React.Component {
  render() {
    const playedStyle = this.props.isPlayed ? {backgroundColor: 'rgba(0,0,0,0.5)'} : {};
    const selectedStyle = this.props.isSelected ? { borderColor: '#FF9500', borderWidth: 2} : {};
    return (
      <View style={[styles.timestampControl]}>
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
          <TouchableOpacity style={styles.button2}
                            onPress={ () => { this.props.onMove(this.props.key, -0.2) }}>
            <Icon name='minus' size={30} color='#FF9500'/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button2}
                            onPress={ () => { this.props.onMove(this.props.key, 0.2); }}>
            <Icon name='plus' size={30} color='#FF9500'/>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.caption, selectedStyle, playedStyle]}
          onPress={() => { this.props.onSelect(this.props.key) }}>
          <Text style={styles.captionText}>{this.props.title} {this.props.time} s.</Text>
        </TouchableOpacity>

        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <TouchableOpacity style={styles.button2}
                            onPress={ () => { this.props.onDelete(this.props.key); }}>
            <Icon name='trash-a' size={30} color='#FF9500'/>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default class TimestampsContainer extends React.Component {
  render() {
    const timestamps = this.props.timestamps.map ((t, i) =>
      <TimestampControl {...t} key={t.time}
        isPlayed={this.props.currentTime > t.time}
        isSelected={this.props.selectedIndex === i}
        onSelect={() => this.props.onSelect(i) }
        onDelete={() => this.props.onDelete(i) }
        onMove={(k, delta) => this.props.onMove(i, delta) }/>);

    return (
      <View style={{justifyContent: 'flex-start', alignItems: 'center'}}>
        <TouchableOpacity onPress={this.props.speakVoice} style={styles.voiceButton}>
          <Icon name='volume-medium' size={40} color='#4A4A4A'/>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.startPractice() }
          style={{
            marginBottom: 5, backgroundColor: '#FF9500', borderRadius: 5, overflow: 'hidden'}}>
          <Text style={{paddingVertical: 10,
            paddingHorizontal: 20,
            color: 'white', fontSize: 14,
            fontWeight: '700'
          }}>{this.props.inPractice ? 'Stop Practice' : 'Start Practice'}</Text>
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={true}
          horizontal={false}
          contentContainerStyle={{
            justifyContent: 'flex-start',
            alignItems: 'center', paddingBottom: 25}}
            style={{height: layout.height / 2, width: layout.width}}
        >
          {timestamps}
        </ScrollView>

      </View>
    );
  }
}

const styles = {
    timestampControl: {
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flex: 1,
        width: layout.width * 0.9
    },
    caption: {
        paddingVertical: 5,
        paddingHorizontal: 30,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#34AADC'
    },
    button2: {
        marginHorizontal: 10
    },
    captionText: { color: '#fff', fontSize: 16 },
    voiceButton: { position: 'absolute', left: layout.width * 0.2, }


}