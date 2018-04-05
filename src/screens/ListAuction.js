import React, { Component } from 'react'
import { ScrollView, View, Text, Image, TouchableWithoutFeedback, FlatList, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import TimerCountdown from 'react-native-timer-countdown'
import moment from 'moment';
import numeral from 'numeral';
import axios from 'axios'
import { setUserToken } from '../actions'
import { BASE_URL, COLOR, REQUEST_TIME_OUT } from '../constants'
import { Card, CardSection, ContainerSection, Button } from '../components/common'

class ListAuction extends Component {
    static navigationOptions = {
        title: 'Daftar Lelang',
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


    // tick(data) {
    //     const eventTime = moment(data, 'DD-MM-YYYY HH:mm:ss').unix();
    //     const currentTime = moment().unix();
    //     const diffTime = currentTime - eventTime;
    //     console.log(diffTime, 'Perbedaan')
    //     const durations = moment.duration(diffTime * 1000, 'milliseconds');
    //     const interval = 1000;

    //     if (diffTime > 0) {
    //         setInterval(() => {
    //             const duration = moment.duration(durations.asMilliseconds() - interval, 'milliseconds');
    //             const d = moment.duration(duration).days();
    //             const h = moment.duration(duration).hours();
    //             const m = moment.duration(duration).minutes();
    //             const s = moment.duration(duration).seconds();

    //             const days = d.trim().length === 1 ? `0 + ${d}` : d;
    //             const hours = h.trim().length === 1 ? `0 + ${h}` : h;
    //             const minutes = m.trim().length === 1 ? `0 + ${m}` : m;
    //             const seconds = s.trim().length === 1 ? `0 + ${s}` : s;
    //             this.setState({
    //                 day: days,
    //                 hour: hours,
    //                 minute: minutes,
    //                 second: seconds
    //             })
    //         }, interval);
    //     }
    // }

    renderList = (item) => {
        // this.tick(item.endDate);
        // const status = item.Status.id;
        // switch (status) {
        //     case 55:
        //         this.setState({ work: true, not: false })
        //         break;
        //     case 56:
        //         this.setState({ done: true, work: false })
        //         break;
        //     default:
        //         this.setState({ not: true })
        // }
        return (
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
                        {
                            this.state.not ?
                                <Text style={{ marginTop: 4, flex: 1 }}>{moment(item.startDate).format('DD MMMM YYYY')}</Text>
                                :
                                <View />
                        }
                        {
                            this.state.work ?
                                // <TimerCountdown
                                //     initialSecondsRemaining={360}
                                //     onTick={secondsRemaining => console.log('tick', secondsRemaining)}
                                //     onTimeElapsed={() => console.log('complete')}
                                //     allowFontScaling
                                //     style={{ fontSize: 20 }}
                                // />
                                <Text style={{ marginTop: 4, flex: 1 }}>{this.state.day}</Text>
                                // <Text style={{ marginTop: 4, flex: 1 }}>{moment(item.startDate).format('DD MMMM YYYY')}</Text>
                                :
                                <View />
                        }
                        {
                            this.state.done ?
                                <Text style={{ marginTop: 4, flex: 1 }}>{moment(item.startDate).format('DD MMMM YYYY')}</Text>
                                :
                                <View />
                        }
                    </View>
                    <Text>Rp. {numeral(parseInt(item.openingPrice, 0)).format('0,0')}</Text>
                </View>
            </View>
        );
    }


    render() {
        return (
            <View style={styles.containerStyle}>
                <View style={{ marginTop: '3%' }}>
                    <FlatList
                        data={this.state.listAuction}
                        renderItem={({ item }) => this.renderList(item)}
                        keyExtractor={(item, index) => index}
                        refreshing={this.state.refresh}
                        onRefresh={() => this.handleRefresh()}
                    />
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

export default connect(mapStateToProps, { setUserToken })(ListAuction)
