import React, { Component } from 'react'
import { ScrollView, View, Text, Image, TouchableWithoutFeedback, FlatList, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import { setUserToken } from '../actions'
import { BASE_URL, COLOR, REQUEST_TIME_OUT } from '../constants'
import { Card, CardSection, ContainerSection, Button } from '../components/common'

class OfficialStore extends Component {
    static navigationOptions = {
        title: 'Official Store',
        headerRight: <View />
    }

    constructor(props) {
        super(props)

        this.state = {
            productFavorit: '',
            refresh: true
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
                this.setState({ productFavorit: response.data.user, refresh: false })
                console.log(response.data.user, 'Data Official')
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


    renderFavorit = (item) => {
        console.log(item, 'Item Favorit');
        // return (
        //     <View style={{ marginLeft: -1 }}>
        //         <View style={styles.card}>
        //             <Image
        //                 style={styles.image}
        //                 source={{ uri: `${BASE_URL}/images/${itemFavorit.Fish.photo}` }}
        //                 resizeMode='contain'
        //             />
        //             <Text style={{ textAlign: 'center', backgroundColor: '#FFF' }}>
        //                 {
        //                     itemFavorit.Fish.name.length >= 12 ? `${number}. ${itemFavorit.Fish.name.substring(0, 12)}...` : `${number}. ${itemFavorit.Fish.name}`
        //                 }
        //             </Text>
        //         </View>
        //     </View>
        // );
    }


    render() {
        return (
            <View style={styles.containerStyle}>
                <View style={styles.containerFlatList}>
                    {/* <FlatList
                        data={this.state.productFavorit}
                        renderItem={({ item }) => this.renderFavorit(item)}
                        keyExtractor={(item, index) => index}
                        refreshing={this.state.refresh}
                        onRefresh={() => this.handleRefresh()}
                    /> */}
                    <ContainerSection>
                        <Button
                            onPress={() => {
                                const { navigate } = this.props.navigation
                                navigate('Auction');
                            }}
                        >
                            Lelang Produk Anda
                        </Button>
                    </ContainerSection>
                    <ContainerSection>
                        <Button
                            onPress={() => {
                                const { navigate } = this.props.navigation
                                navigate('ListAuctions');
                            }}
                        >
                            List Semua Lelang
                        </Button>
                    </ContainerSection>
                </View>
            </View>
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

export default connect(mapStateToProps, { setUserToken })(OfficialStore)
