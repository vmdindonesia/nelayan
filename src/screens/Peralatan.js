import React, { Component } from 'react';
import { Text, View } from 'react-native';
import ActionButton from 'react-native-action-button';
import { COLOR } from './../constants';

class Peralatan extends Component {
    static navigationOptions = {
        title: 'Peralatan',
        headerRight: <View />
    }


    constructor(props) {
        super(props)

        this.state = {
            alat_1: ''
        }
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>
                    Coming Soon
				</Text>

                <ActionButton
                    buttonColor={COLOR.secondary_b}
                    onPress={() => 
                        this.props.navi.navigate('CreateForge')
                    }
                />
            </View>
        )
    }
}

export default Peralatan
