import React from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const {
	Text,
	TextInput,
	Navigator,
	View,
	LayoutAnimation,
	Dimensions,
} = React;


export default class SearchInput extends React.Component {
	constructor() {
		super();
		this.state = {width: 150, color: '#FFE94A'}
	}
	componentWillUpdate() {
		LayoutAnimation.easeInEaseOut();
	}
  render() {
    return(
      <View style={{flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', top: 5, height: 28, left: 5, flex: 1, marginHorizontal: 10, justifyContent: 'center'}}>
        <Icon name={'ios-search'} size={28} />
        <TextInput
          placeholder={'Search...'}
  				autoCapitalize={'none'}
  				autoCorrect={false}
          clearButtonMode={'always'}
          style={{height: 28, width: this.state.width, marginLeft: 5, paddingHorizontal: 5, backgroundColor: this.state.color}}
  				onFocus={() => this.setState({width: 250, color: 'white'})}
  				onBlur={() => this.setState({width: 150, color: '#FFE94A'})}
          onChangeText={query => {
            if (query.length === 0) {
              this.props.onStopSearching();
            }
  					if (query.length < 3) {
  						return;
  					}
						if (this.t) {
							clearTimeout(this.t);
						}
						this.t = setTimeout(() => this.props.onSearch(query), 500);
  			}} />
      </View>
    )
  }
}

module.exports = SearchInput;
