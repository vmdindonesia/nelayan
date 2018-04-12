import React, { Component } from 'react'
import { ScrollView, View, Text, Image, TouchableNativeFeedback, FlatList, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment';
import numeral from 'numeral';
import axios from 'axios'
import { setUserToken } from '../actions'
import { BASE_URL, COLOR, REQUEST_TIME_OUT } from '../constants'
import { Card, CardSection, ContainerSection, Button } from '../components/common'

class ListAuction extends Component {
    static navigationOptions = {
        title: 'Riwayat Lelang',
        headerRight: <View />
    }

    constructor(props) {
        super(props)

        this.state = {
            listAuction: '',
            refresh: true,
            timeEnd: '',

            day: '',
            hour: '',
            minute: '',
            second: '',


            not: null,
            work: null,
            done: null
        }
    }

    componentWillMount() {
        return this.getData();
    }


    getData() {
        const token = this.props.user.token
        axios.get(`${BASE_URL}/supplier/auctions`, {
            headers: { token },
            timeout: REQUEST_TIME_OUT
        })
            .then(response => {
                this.setState({ listAuction: response.data.data, refresh: false })
                console.log(response.data.data, 'Data List Auction')
            })
            .catch(error => {
                console.log(error, 'Error');
                if (error.response) {
                    alert(error.response.data.message)
                }
                else {
                    alert('Koneksi internet bermasalah')
                }
                this.setState({ refresh: false })
            })
    }

    handleRefresh = () => {
        console.log('Refresh');
        this.setState({
            refresh: true
        }, () => {
            console.log('Fetch Again');
            this.getData();
        })
    }

    renderList = (item) => {
        return (
            <TouchableNativeFeedback
                key={item.id}
                onPress={() => {
                    const { navigate } = this.props.navigation
                    navigate('DetailAuctions', { idBos: item.id });
                }}
            >
                <View style={styles.card}>
                    <View style={styles.thumbnailContainerStyle}>
                        <Image
                            style={styles.image}
                            source={{ uri: `${BASE_URL}/images/${item.Fish.photo}` }}
                            resizeMode='contain'
                        />
                    </View>
                    <View style={styles.headerContentStyle}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 18, color: COLOR.secondary_a, flex: 1 }}>{item.Fish.name}</Text>
                            <Text style={{ marginTop: 4, flex: 1 }}>{moment(item.startDate).format('HH : mm : ss')}</Text>
                        </View>
                        <Text>Rp. {numeral(parseInt(item.openingPrice, 0)).format('0,0')}</Text>
                        <Text>{item.countBid} Tawaran</Text>
                    </View>
                </View>
            </TouchableNativeFeedback>
        );
    }


    render() {
        return (
            <View style={styles.containerStyle}>
                <FlatList
                    data={this.state.listAuction}
                    renderItem={({ item }) => this.renderList(item)}
                    keyExtractor={(item, index) => index}
                    refreshing={this.state.refresh}
                    onRefresh={() => this.handleRefresh()}
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
        flex: 1,
        margin: 13,
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    headerTextStyle: {
        marginTop: 14,
        fontSize: 14,
        fontWeight: 'bold',
    },
}

const mapStateToProps = state => {
    const { user } = state

    return { user }
}

export default connect(mapStateToProps, { setUserToken })(ListAuction)
