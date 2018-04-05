import React, { Component } from 'react'
import { ScrollView, View, Text, Image, TouchableWithoutFeedback, FlatList, TouchableOpacity, RefreshControl, ToastAndroid } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import Icon from 'react-native-vector-icons/Ionicons'
import { setUserToken } from '../actions'
import { BASE_URL, COLOR, REQUEST_TIME_OUT } from '../constants'
import { Card, CardSection, ContainerSection, Button } from '../components/common'

class OfficialStore extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Official Store',
        headerRight:
            <TouchableOpacity
                onPress={() => {
                    console.log(navigation, 'Tes');
                    const { navigate } = navigation
                    navigate('ListAuctions');
                }}
            >
                <View>
                    <Icon style={{ color: '#fff', alignSelf: 'flex-end' }} st name="md-list" size={24} />
                </View>
            </TouchableOpacity>
    })

    constructor(props) {
        super(props)

        this.state = {
            productFavorit: '',
            data: '',
            refresh: true,
            isOfficial: ''
        }
    }

    componentWillMount() {
        return this.getData();
    }


    getData() {
        const token = this.props.user.token
        axios.get(`${BASE_URL}/profile`, {
            headers: { token },
            timeout: REQUEST_TIME_OUT
        })
            .then(response => {
                this.setState({
                    productFavorit: response.data.user.Products,
                    data: response.data,
                    isOfficial: response.data.user.officialStore,
                    refresh: false,
                })
                console.log(response.data, 'Data Official')
            })
            .catch(error => {
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

    keyExtractor = (item) => item.id;


    renderProductItem = (itemProduct) => {
        const number = parseInt(itemProduct.index, 0) + 1;
        console.log(itemProduct, 'Item Favorit')
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    if (this.state.data.myAuction === 0) {
                        const { navigate } = this.props.navigation
                        navigate('Auction', { datax: itemProduct.item });
                    } else {
                        ToastAndroid.show('Anda masih mempunyai lelang yang berjalan', ToastAndroid.SHORT);
                    }
                }}
            >
                <View style={styles.card}>
                    <Image
                        style={styles.image}
                        source={{ uri: `${BASE_URL}/images/${itemProduct.item.Fish.photo}` }}
                        resizeMode='contain'
                    />
                    <Text style={{ textAlign: 'center', backgroundColor: '#FFF' }}>
                        {
                            itemProduct.item.Fish.name.length >= 12 ? `${number}. ${itemProduct.item.Fish.name.substring(0, 12)}...` : `${number}. ${itemProduct.item.Fish.name}`
                        }
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }


    render() {
        const { data, productFavorit, isOfficial } = this.state;
        console.log(productFavorit, 'Data Favorit');
        return (
            <View style={styles.containerStyle}>
                <Image
                    style={styles.imageAds}
                    source={require('../../assets/ads-auction.png')}
                />

                {
                    isOfficial === null || isOfficial === undefined ?
                        <View style={{ paddingTop: 50 }}>
                            <Text style={{ fontSize: '20', textAlign: 'center' }}>Maaf, Anda belum terpilih menjadi Official Store.</Text>
                        </View>
                        :
                        <View style={{ flex: 1 }}>
                            <View style={{ paddingTop: 50, paddingLeft: 15, height: '50%', backgroundColor: '#F4F4F4' }}>
                                <View style={styles.containerFlatList}>
                                    {
                                        productFavorit ?
                                            <FlatList
                                                data={productFavorit}
                                                horizontal
                                                keyExtractor={this.keyExtractor}
                                                renderItem={this.renderProductItem.bind(this)}
                                                showsHorizontalScrollIndicator={false}
                                            />
                                            :
                                            <View />
                                    }
                                </View>
                            </View>

                            <View style={{ height: '30%', padding: '5%', paddingTop: '7%' }}>
                                <Button
                                    onPress={() => {
                                        if (data.myAuction === 0) {
                                            const { navigate } = this.props.navigation
                                            navigate('Auction');
                                        } else {
                                            ToastAndroid.show('Anda masih mempunyai lelang yang berjalan', ToastAndroid.SHORT);
                                        }
                                    }}
                                >
                                    Lelang Produk Anda
                                </Button>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 7 }}>
                                <Text style={{ textAlign: 'center' }}>
                                    Pertanyaan mengenai Official Store?
                                </Text>
                            </View>

                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
                                <Text style={{ textAlign: 'center', marginTop: 10, color: COLOR.secondary_a }}>
                                    Hubungi Aruna
                                </Text>
                            </TouchableOpacity>
                        </View>
                }
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1
    },
    containerFlatList: {
        flex: 1,
        marginLeft: -3,
        paddingRight: 13,
        marginTop: -20
    },
    card: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#DDD',
        shadowColor: '#000',
        shadowOffset: { width: 10, height: 20 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        backgroundColor: '#FFF',
        paddingRight: '2%'
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
    imageAds: {
        alignSelf: 'stretch',
        height: 200,
        width: '100%',
        resizeMode: 'cover'
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

export default connect(mapStateToProps, { setUserToken })(OfficialStore)
