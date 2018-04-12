import React, { Component } from 'react';
import { View, Picker, ScrollView, Text, ToastAndroid } from 'react-native';
import { connect } from 'react-redux'
import axios from 'axios'
import { NavigationActions } from 'react-navigation'
import { BASE_URL } from '../constants'
import { setUserToken } from '../actions'
import { ContainerSection, Input, Spinner, Button } from '../components/common'

class CreatePeralatan extends Component {
    static navigationOptions = {
        title: 'Peralatan',
        headerRight: <View />
    }

    constructor(props) {
        super(props)
        this.state = {
            loader: null,
            gearsId: '',
            name: '',
            size: '',
            FishingGearId: ''
        }
    }

    componentWillMount() {
        console.log(this.props.user.token, 'Token');
    }

    onChangeInput = (name, v) => {
        this.setState({ [name]: v }, () => {
            console.log(this.state.gearsId, 'Value');
        });
    }

    checkSecurity() {
        const { gearsId, name, size, FishingGearId } = this.state;
        if (gearsId === '1') {
            switch (gearsId) {
                case '':
                    return ToastAndroid.show('Alat tangkap tidak boleh kosong', ToastAndroid.SHORT);
                default:
                    console.log('GearsId Lolos');
                    switch (name) {
                        case '':
                            return ToastAndroid.show('Nama kapal tidak boleh kosong', ToastAndroid.SHORT);
                        default:
                            console.log('Name Lolos')
                            switch (size) {
                                case '':
                                    return ToastAndroid.show('Size kapal tidak boleh kosong', ToastAndroid.SHORT);
                                default:
                                    console.log('Size Lolos')
                                    this.saveForgeShips();
                            }
                    }
            }
        } else if (gearsId === '2') {
            switch (gearsId) {
                case '':
                    return ToastAndroid.show('Alat tangkap tidak boleh kosong', ToastAndroid.SHORT);
                default:
                    console.log('GearsId Lolos');
                    switch (FishingGearId) {
                        case '':
                            return ToastAndroid.show('Alat tangkap tidak boleh kosong', ToastAndroid.SHORT);
                        default:
                            console.log('Fishing Lolos');
                            this.saveForgeGears();
                    }
            }
        }
    }

    saveForgeShips() {
        this.setState({ loader: true })
        const { name, size } = this.state;
        let token = this.props.user.token;

        axios.post(`${BASE_URL}/supplier/my-ships`, {
            name,
            size
        }, {
                headers: { token },
            })
            .then(response => {
                console.log(response)
                this.setState({ loader: false })
                ToastAndroid.show('Sukses', ToastAndroid.SHORT)
                const resetAction = NavigationActions.reset({
                    index: 1,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Home' }),
                        NavigationActions.navigate({ routeName: 'MemberList' })
                    ]
                })
                this.props.navigation.dispatch(resetAction)
            })
            .catch(error => {
                if (error.response) {
                    alert(error.response.data.message)
                }
                else {
                    alert('Koneksi internet bermasalah')
                }
                this.setState({ loader: false })
            })
    }

    saveForgeGears() {
        this.setState({ loader: true })
        const { FishingGearId } = this.state;
        let token = this.props.user.token;

        axios.post(`${BASE_URL}/supplier/my-fishing-gears`, {
            FishingGearId
        }, {
                headers: { token },
            })
            .then(response => {
                console.log(response)
                this.setState({ loader: false })
                ToastAndroid.show('Sukses', ToastAndroid.SHORT)
                const resetAction = NavigationActions.reset({
                    index: 1,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Home' }),
                        NavigationActions.navigate({ routeName: 'MemberList' })
                    ]
                })
                this.props.navigation.dispatch(resetAction)
            })
            .catch(error => {
                if (error.response) {
                    alert(error.response.data.message)
                }
                else {
                    alert('Koneksi internet bermasalah')
                }
                this.setState({ loader: false })
            })
    }


    render() {
        const { gearsId, name, size, loader, FishingGearId } = this.state;
        return (
            <View style={styles.container}>
                <ScrollView>
                    <ContainerSection>
                        <View style={{ flexDirection: 'column', width: '100%', padding: 5 }}>
                            <Text>Pilih Peralatan</Text>
                            <View style={{ flex: 1, borderColor: '#a9a9a9', borderWidth: 1, height: 47 }}>
                                <Picker
                                    selectedValue={gearsId}
                                    onValueChange={v => this.onChangeInput('gearsId', v)}
                                >
                                    <Picker.Item label='--Pilih--' value='' />
                                    <Picker.Item label='Kapal' value='1' />
                                    <Picker.Item label='Alat Tangkap' value='2' />
                                </Picker>
                            </View>
                        </View>
                    </ContainerSection>
                    {
                        gearsId === '1' ?
                            <View>
                                <ContainerSection>
                                    <View style={{ padding: 5, width: '100%' }}>
                                        <Input
                                            label='Nama'
                                            placeholder="Nama"
                                            value={name}
                                            onChangeText={v => this.onChangeInput('name', v)}
                                        />
                                    </View>
                                </ContainerSection>
                                <ContainerSection>
                                    <View style={{ flexDirection: 'column', width: '100%', padding: 5 }}>
                                        <Text>Ukuran</Text>
                                        <View style={{ flex: 1, borderColor: '#a9a9a9', borderRadius: 5, borderWidth: 1, height: 47 }}>
                                            <Picker
                                                selectedValue={size}
                                                onValueChange={v => this.onChangeInput('size', v)}
                                            >
                                                <Picker.Item label='Pilih Ukuran' value='' />
                                                <Picker.Item label='Kecil (<10 Meter)' value='1' />
                                                <Picker.Item label='Sedang (<20 Meter)' value='2' />
                                                <Picker.Item label='Besar (>20 Meter)' value='3' />
                                            </Picker>
                                        </View>
                                    </View>
                                </ContainerSection>
                            </View>
                            :
                            <View>
                                {
                                    gearsId === '2' ?
                                        <ContainerSection>
                                            <View style={{ flexDirection: 'column', width: '100%', padding: 5 }}>
                                                <Text>Pilih alat tangkap</Text>
                                                <View style={{ flex: 1, borderColor: '#a9a9a9', borderRadius: 5, borderWidth: 1, height: 47 }}>
                                                    <Picker
                                                        selectedValue={FishingGearId}
                                                        onValueChange={v => this.onChangeInput('FishingGearId', v)}
                                                    >
                                                        <Picker.Item label='--Pilih--' value='' />
                                                        <Picker.Item label='Jala Kecil' value='1' />
                                                        <Picker.Item label='Jala Sedang' value='2' />
                                                        <Picker.Item label='Jala Besar' value='3' />
                                                    </Picker>
                                                </View>
                                            </View>
                                        </ContainerSection>
                                        :
                                        <View />
                                }
                            </View>
                    }
                </ScrollView>
                <ContainerSection>
                    {
                        loader ?
                            <View style={{ flex: 1 }}>
                                <Spinner size='small' />
                            </View>
                            :
                            <Button
                                onPress={() => {
                                    this.checkSecurity();
                                }}
                            >
                                Selesai
									</Button>
                    }
                </ContainerSection>
            </View>
        )
    }
}


const styles = {
    container: {
        flex: 1,
        marginTop: 20
    }
}


const mapStateToProps = state => {
    const { user } = state

    return { user }
}

export default connect(mapStateToProps, { setUserToken })(CreatePeralatan)
