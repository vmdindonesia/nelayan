import React, { Component } from 'react'
import { ScrollView, View, Text, Image, TouchableNativeFeedback, FlatList, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment';
import numeral from 'numeral';
import axios from 'axios'
import { setUserToken } from '../actions'
import { BASE_URL, COLOR, REQUEST_TIME_OUT } from '../constants'
import { Card, CardSection, ContainerSection, Button } from '../components/common'

class ListMemberAuction extends Component {
    static navigationOptions = {
        title: 'Riwayat Lelang',
        headerRight: <View />
    }

    constructor(props) {
        super(props)

        this.state = {
            listMemberAuction: '',
            refresh: true,
        }
    }

    componentWillMount() {
        console.log(this.props.navigation.state.params.dataMember, 'Member');
        this.setState({
            listMemberAuction: this.props.navigation.state.params.dataMember.AuctionHistories
        }, () => {
            console.log(this.state.listMemberAuction, 'Data Member');
        })
    }

    renderList = (item) => {
        console.log(item, 'ITEM BOS');
        console.log(item.Buyer.organizationType, 'ASDASDASDASD');
        return (
            <View style={styles.card}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.thumbnailContainerStyle}>
                        <Image
                            style={styles.imageBuyer}
                            source={{ uri: `${BASE_URL}/images/${item.Buyer.photo}` }}
                        />
                    </View>
                    <View style={styles.headerContentStyle}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ marginTop: 4, flex: 1, color: COLOR.secondary_a, fontSize: 15 }}>{item.Buyer.organizationType + item.Buyer.organization}</Text>
                        </View>
                        <View style={{ flexDirection: 'column', paddingTop: 5 }}>
                            <Text>Rp. {numeral(parseInt(item.bidAmount, 0)).format('0,0')}</Text>
                            <Text>{moment(item.createdAt).format('DD/MM/YYYY')}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }


    render() {
        const { listMemberAuction } = this.state;
        console.log(listMemberAuction, 'AWAL DATA');
        return (
            <View style={styles.containerStyle}>
                <FlatList
                    data={listMemberAuction}
                    renderItem={({ item }) => this.renderList(item)}
                    keyExtractor={(item, index) => index}
                />
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        paddingTop: '3%'
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
        marginBottom: '2%',
        backgroundColor: '#FFF',
        flexDirection: 'row',
    },
    thumbnailContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
    },
    image: {
        alignSelf: 'stretch',
        height: 100,
        width: 100,
        resizeMode: 'cover',
        borderRadius: 4
    },
    headerContentStyle: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    headerTextStyle: {
        marginTop: 14,
        fontSize: 14,
        fontWeight: 'bold',
    },
    imageBuyer: {
        height: 100,
        width: 100,
        borderRadius: 50,
    },
}

const mapStateToProps = state => {
    const { user } = state

    return { user }
}

export default connect(mapStateToProps, { setUserToken })(ListMemberAuction)
