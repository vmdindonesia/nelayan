import React, { Component } from 'react'
import { FlatList, View, Image, Text, TouchableNativeFeedback } from 'react-native'
import { connect } from 'react-redux'
import ActionButton from 'react-native-action-button'

import { membersFetch } from '../actions'
import { Card } from '../components/common'
import { BASE_URL, COLOR } from '../constants'

class MemberList extends Component {
    static navigationOptions = {
        title: 'Anggota',
        headerRight: <View />
    }

    componentWillMount() {
        this.props.membersFetch(this.props.user.token)
    }

    renderItem = (item) => {
        return (
            <Card>
                <TouchableNativeFeedback
                    onPress={() => this.props.navi.navigate('MemberEdit', { id: item.id })}
                >
                    <View style={styles.itemContainerStyle}>
                        <View style={styles.thumbnailContainerStyle}>
                            <Image
                                style={styles.thumbnailStyle}
                                source={{ uri: `${BASE_URL}/images/${item.photo}` }}
                            />
                        </View>
                        <View style={styles.headerContentStyle}>
                            <Text style={styles.hedaerTextStyle}>{item.name}</Text>
                            <Text>{item.address}</Text>
                            <Text>{item.phone}</Text>
                            <Text>No. KTP: {item.idNumber}</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>
            </Card>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={this.props.members.data}
                    renderItem={({ item }) => this.renderItem(item)}
                    keyExtractor={(item, index) => index}
                    onRefresh={() => this.props.membersFetch(this.props.user.token)}
                    refreshing={this.props.members.loading}
                />

                <ActionButton
                    buttonColor={COLOR.secondary_b}
                    onPress={() => {
                        this.props.navi.navigate('MemberCreate')
                    }
                }
                />
            </View>
        )
    }
}

const styles = {
    itemContainerStyle: {
        borderBottomWidth: 1,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderColor: '#ddd',
    },
    thumbnailContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    thumbnailStyle: {
        height: 100,
        width: 100,
        borderRadius: 50
    },
    headerContentStyle: {
        flex: 1,
        marginRight: 15,
        marginTop: 5,
        marginBottom: 10,
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    hedaerTextStyle: {
        fontSize: 20,
        color: COLOR.secondary_a
    }
}

const mapStateToProps = state => {
    const { members, user } = state

    return { members, user }
}

export default connect(mapStateToProps, { membersFetch })(MemberList)

