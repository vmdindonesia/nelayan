import React, { Component } from 'react'
import { Text, View, TextInput, Image } from 'react-native'

class Input extends Component {
	constructor(props) {
		super(props)
		this.state = {
			underlineColor: '#ddd',
			isFocus: false
		}
	}

	onFocus = () => {
		this.setState({
			isFocus: true,
			underlineColor: '#30B2EC'
		})
	}

	onBlur = () => {
		this.setState({
			isFocus: false,
			underlineColor: '#ddd'
		})
	}

	imageIcon = (icon) => {
		switch (icon) {
			case 'ic_user':
				return require('../../../assets/ic_user.png')
			default:
				return require('../../../assets/ic_password.png')
		}
	}

	render() {
		const { label, value, onChangeText, placeholder, secureTextEntry, keyboardType, multiline, lines, editable, icon } = this.props
		const { inputStyle, labelStyle, containerStyle } = styles

		return (
			<View style={containerStyle}>
				{
					label ?
						<Text style={labelStyle}>{label}</Text>
					:
						<Text />
				}

				<View style={{...styles.formWrapper, ...((editable === false) ? styles.lockedForm : {}), ...((this.state.isFocus === true) ? styles.onFocus : {}) }}>
					{
						icon ? <Image source={this.imageIcon(icon)} style={{width: 24, height: 24}} /> : <View />
					}
					<TextInput 
						secureTextEntry={secureTextEntry}
						placeholder={placeholder}
						autoCorrect={false}
						value={value}
						onChangeText={onChangeText}
						style={inputStyle}
						keyboardType={keyboardType}
						multiline={multiline}
						editable={editable}
						onBlur={() => this.onBlur()}
						onFocus={() => this.onFocus()}
						underlineColorAndroid={'transparent'}
						numberOfLines={lines || 1}
					/>
				</View>
			</View>
		)
	}
}

const styles = {
	formWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#a9a9a9',
		borderRadius: 5,
		paddingLeft: 7
	},
	lockedForm: {
		opacity: 0.4
	},
	inputStyle: {
		fontSize: 16,
		flex: 1,
		padding: 8,
		fontFamily: 'Muli-Regular'
	},
	labelStyle: {
		color: '#2a2a2a',
		fontSize: 14,
		flex: 1,
		fontFamily: 'Muli-Regular'
	},
	onFocus: {
		borderColor: '#009ad3'
	},
	containerStyle: {
		flex: 1
	}
}

export { Input }
