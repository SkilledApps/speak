"use strict";

import React from 'react-native';
import { AllHtmlEntities } from 'html-entities';

const entitiesDecoder = new AllHtmlEntities();
const { View, Text, TextInput, } = React;


export default class EditableCaption extends React.Component {
  constructor(props) {
    super();
    this.state = {
      title: props.title
    }
  }
	render() {
    if (!this.props.editMode) {
      return  <Text
        style={styles.captionText}
        numberOfLines={2}>{entitiesDecoder.decode(this.props.title)}</Text>
    } else {
      return <TextInput
        style={styles.captionInput}
        placeholder={'Add caption'}
        autoCapitalize={'none'}
        onChangeText={title => this.setState({title})}
        value={this.state.title}
        onEndEditing={() => this.props.onTitleChange(this.state.title)} />
    }
	}
}

const styles = {
  captionText: { overflow: 'hidden', fontWeight: '200', fontSize: 16 , backgroundColor: 'transparent'},
  captionInput: {width: 200, height: 26},
}
