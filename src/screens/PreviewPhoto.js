import React, { Component } from 'react'
import { ScrollView, View, Text, Image, TouchableWithoutFeedback, FlatList, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import axios from 'axios'
import { setUserToken } from '../actions'
import { BASE_URL, COLOR, REQUEST_TIME_OUT } from '../constants'
import { Card, CardSection, ContainerSection, Button } from '../components/common'

class PreviewPhoto extends Component {
    static navigationOptions = {
        title: 'Preview Poto',
        headerRight: <View />
    }

    constructor(props) {
        super(props)

        this.state = {
            refresh: true,
            photo: null
        }
    }

    componentWillMount() {
        const { params } = this.props.navigation.state;
        this.setState({ photo: params.dataPhoto.uri })
        console.log(params, 'Parsing Data Poto');
    }


    render() {
        const { photo } = this.state;
        return (
            <View style={styles.containerStyle}>
                <View style={styles.card}>
                    <View style={styles.profileImageContainer}>
                        <Image
                            style={styles.profileImage}
                            source={{ uri: photo }}
                        />
                    </View>
                    <View style={{ marginTop: '10%', marginBottom: '10%', alignSelf: 'center', height: 45, width: '80%' }}>
                        <Button
                            onPress={() => {
                                console.log('Done');
                                const resetAction = NavigationActions.reset({
                                    index: 0,
                                    actions: [
                                        NavigationActions.navigate(
                                            {
                                                routeName: 'Auction',
                                                params:
                                                    { photox: photo }
                                            }
                                        )
                                    ]
                                })
                                this.props.navigation.dispatch(resetAction)
                            }}
                        >
                            Done
                    </Button>
                    </View>
                    <View />
                </View>
            </View >
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1
    },
    card: {
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        marginBottom: '30%',
        backgroundColor: '#FFF'
    },
    containerFlatList: {
        flex: 1,
        marginLeft: -3,
        paddingRight: 13,
        marginTop: 20
    },
    profileImageContainer: {
        marginTop: 20,
        height: 150,
        width: 150,
        alignSelf: 'center',
    },
    profileImage: {
        height: 150,
        width: 150,
        borderRadius: 100,
    },
}

const mapStateToProps = state => {
    const { user } = state

    return { user }
}

export default connect(mapStateToProps, { setUserToken })(PreviewPhoto)
