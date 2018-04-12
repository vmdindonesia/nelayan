import React, { Component } from 'react'
import { Text, View, Picker } from 'react-native'
import { COLOR } from '../../constants'

class PickerCustom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isFocus: false
        }
    }

    onFocus = () => {
        this.setState({
            isFocus: true,
        })
    }

    onBlur = () => {
        this.setState({
            isFocus: false,
        })
    }


    render() {
        const { selectedValue, onValueChange } = this.props;
        const { label, value } = this.props.children.props
        const { containerStyle } = styles

        return (
            <View style={containerStyle}>
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={onValueChange}
                >
                    <Picker.Item label='--- Pilih ---' value='' />
                    <Picker.Item label={label} value={value} />
                </Picker>
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
        borderRadius: 4,
        paddingLeft: 7,
        backgroundColor: '#fff'
    },
    lockedForm: {
        opacity: 0.6
    },
    inputStyle: {
        fontSize: 14,
        flex: 1,
        padding: 8,
        fontFamily: 'Muli-Regular'
    },
    labelStyle: {
        color: '#5e5e5e',
        fontSize: 14,
        flex: 1,
        fontFamily: 'Muli-Regular',
        marginBottom: 10,
        marginTop: 10,
    },
    onFocus: {
        borderColor: COLOR.secondary_a
    },
    containerStyle: {
        flex: 1
    }
}

export { PickerCustom }
