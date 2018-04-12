import React, { Component } from 'react';
import { Text, View, TouchableNativeFeedback, Image, ToastAndroid, ScrollView, RefreshControl, FlatList, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import numeral from 'numeral'
import moment from 'moment'
import { setUserToken } from '../actions'
import { ContainerSection, Button, Spinner, InputNumber } from '../components/common'
import { BASE_URL, COLOR, REQUEST_TIME_OUT } from '../constants'

class DetailAuction extends Component {
    static navigationOptions = {
        title: 'Lelang',
        headerRight: <View />
    }

    constructor(props) {
        super(props)
        this.state = {
            refreshing: true,
            dataAuction: '',
            idAuction: '',
            listAuction: ''
        }
    }

    componentDidMount() {
        console.log(this.props.navigation.state.params.idBos, 'BOSBOSBOS');
        this.setState({
            idAuction: this.props.navigation.state.params.idBos
        }, () => {
            return this.getData();
        })
    }

    getData() {
        const token = this.props.user.token
        axios.get(`${BASE_URL}/supplier/auctions/${this.state.idAuction}`, {
            headers: {
                token
            }
        })
            .then(response => {
                const res = response.data.data;
                console.log(res, 'Data Auction');
                this.setState({ dataAuction: res, refreshing: false });
            })
            .catch(error => {
                this.setState({ refreshing: false });
                ToastAndroid.show('Internet Bermasalah', ToastAndroid.SHORT);
                console.log('ERROR', error.response);
            });
    }

    handleRefresh() {
        this.setState({
            refreshing: true
        }, () => {
            this.getData();
        });
    }


    renderList = (item) => {
        console.log(item, 'Item')
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
                            <Text style={{ marginTop: 4, flex: 1, color: COLOR.secondary_a, fontSize: 15 }}>{item.Buyer.organizationType} {item.Buyer.organization}</Text>
                        </View>
                        <View style={{ flexDirection: 'column', paddingTop: 24 }}>
                            <Text>Rp. {numeral(parseInt(item.bidAmount, 0)).format('0,0')}</Text>
                            <Text>{moment(item.createdAt).format('DD/MM/YYYY')}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        const { dataAuction } = this.state;
        console.log(dataAuction, 'Datanya');
        return (
            <View>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.handleRefresh.bind(this)}
                        />
                    }
                >
                    <View style={styles.card}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.thumbnailContainerStyle}>
                                <Image
                                    style={styles.image}
                                    source={{ uri: `${BASE_URL}/images/${dataAuction.photo === undefined ? '' : dataAuction.photo}` }}
                                    resizeMode='contain'
                                />
                            </View>
                            <View style={styles.headerContentStyle}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 18, color: COLOR.secondary_a, flex: 1 }}>{dataAuction.Fish === undefined ? 'Ikan Apa ya ?' : dataAuction.Fish.name}</Text>
                                    <Text style={{ fontSize: 18, color: COLOR.secondary_a, flex: 1 }}>{dataAuction.Fish === undefined ? 'Berapa Ton Ya ?' : dataAuction.quantity} Ton</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ flex: 1 }}>Harga Pembuka</Text>
                                    <Text style={{ flex: 1 }}>Rp. {dataAuction.openingPrice === undefined ? '0' : numeral(parseInt(dataAuction.openingPrice, 0)).format('0,0')}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ flex: 1 }}>Kelipatan</Text>
                                    <Text style={{ flex: 1 }}>Rp. {dataAuction.minIncrement === undefined ? '0' : numeral(parseInt(dataAuction.minIncrement, 0)).format('0,0')}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ flex: 1 }}>Tawaran Tertinggi</Text>
                                    <Text style={{ flex: 1 }}>Rp. {dataAuction.TopBid === null ? '0' : numeral(parseInt(dataAuction.TopBid, 0)).format('0,0')}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.card, { backgroundColor: 'red' }]}>
                        <Text style={{ textAlign: 'center', fontSize: 25, padding: 10 }}>{moment(dataAuction.startDate).format('HH : mm : ss')}</Text>
                    </View>

                    {
                        dataAuction.AuctionHistories === undefined ?
                            <View />
                            :
                            <View>
                                {
                                    dataAuction.AuctionHistories.length <= 0 ?
                                        <View style={{ paddingTop: 70 }}>
                                            <Text style={{ textAlign: 'center', padding: 10 }}>Belum ada partisipasi.</Text>
                                        </View>
                                        :
                                        <View style={{ paddingTop: 45 }}>
                                            <FlatList
                                                data={dataAuction.AuctionHistories}
                                                renderItem={({ item }) => this.renderList(item)}
                                                keyExtractor={(item, index) => index}
                                            />
                                            <View style={{ paddingTop: 15 }}>
                                                <TouchableOpacity onPress={() => this.props.navigation.navigate('ListMemberAuctions', { dataMember: dataAuction })}>
                                                    <Text style={{ textAlign: 'center', color: COLOR.secondary_a }}>Lihat Semua</Text>
                                                </TouchableOpacity>
                                                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                                                    <Text style={{ textAlign: 'center' }}>
                                                        Pertanyaan mengenai Official Store?
                                                    </Text>
                                                </View>

                                                <TouchableOpacity onPress={() => console.log('Hubungi Aruna')}>
                                                    <Text style={{ textAlign: 'center', color: COLOR.secondary_a }}>
                                                        Hubungi Aruna
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                }
                            </View>
                    }
                </ScrollView>
            </View>
        )
    }
}

const styles = {
    container: {
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
        marginBottom: '2%',
        marginTop: '2%',
        backgroundColor: '#FFF',
        flexDirection: 'column',
    },
    thumbnailContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
    },
    imageBuyer: {
        height: 100,
        width: 100,
        borderRadius: 50,
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
        flexDirection: 'column'
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

export default connect(mapStateToProps, { setUserToken })(DetailAuction)
