import React from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchBar from 'react-native-search-bar';

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
		return (
			<View style={[styles]}>
				<SearchBar
					ref={(ref) => this._ref = ref}
			    placeholder='Search'
					hideBackground={true}
					showsCancelButton={true}
			    onChangeText={query => {
							this.props.onFirstTabActive();
	            if (query.length === 0) {
								this._ref.blur();
	              this.props.onStopSearching();
	            }
	  					if (query.length < 3) {
	  						return;
	  					}
							if (this.t) {
								clearTimeout(this.t);
							}
							this.setState({query})
							this.t = setTimeout(() => this.props.onSearch(query), 500);}
					}
			    onSearchButtonPress={() => {
						this._ref.blur();
						this.props.onSearch(this.state.query)
					}}
			    onCancelButtonPress={() => {
						this._ref.blur();
						this.props.onStopSearching()
					}}
			    />
			</View>
		) //;
	}
}

const styles = {
	// flexDirection: 'row',
	// alignSelf: 'flex-start',
	// alignItems: 'center',
	top: 10,
	// height: 28,
	left: 5,
	width: 250,
	// flex: 1,
	marginHorizontal: 10,
	backgroundColor: 'transparent',
	// justifyContent: 'center'
}
module.exports = SearchInput;
