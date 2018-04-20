import React, { Component } from 'react';
import { View, Picker, ScrollView, Text, ToastAndroid } from 'react-native';
import { connect } from 'react-redux'
import axios from 'axios'
import { NavigationActions } from 'react-navigation'

import { BASE_URL, COLOR } from '../constants'
import { setUserToken } from '../actions'
import { Container, ContainerSection, Input, Spinner, Button } from '../components/common'

class PeralatanCreate extends Component {
  static navigationOptions = {
    title: 'Tambah Peralatan',
    headerRight: <View />
  }

  constructor(props) {
    super(props)
    this.state = {
      loader: null,
      gearsId: '',
      name: '',
      size: '',
      FishingGearId: '',    
      data: {},
      type: ''
    }
  }

  componentWillMount() {
    this.getAlat()
    console.log(this.props.user.token, 'Token');
  }

  onChangeInput = (name, v) => {
    this.setState({ [name]: v }, () => {
      console.log(this.state.gearsId, 'Value');
    });
  }

  onChangeInputShip = (name, v) => {
    this.setState({[name]: v})
  }
  
  onChangeInputForge = (name, v) => {
    this.setState({[name]: v})
  }

  getAlat = () => {
    this.setState({ loading: true })
    let token = this.props.user.token
  
    axios.get(`${BASE_URL}/supplier/fishing-gears`, {
    headers: { token },
    })
    .then(response => {
      this.setState({ data: response.data.data })
      this.setState({ loading: false })
    })
    .catch(error => {
      if (error.response) {
      alert(error.response.data.message)
      }
      else {
      alert('Koneksi internet bermasalah')
      }
      this.setState({ loading: false })
    })
  }

  saveForgeShips() {
    // form validation
    if (this.state.type === '') {
      ToastAndroid.show('Pilih tipe ukuran kapal dahulu', ToastAndroid.SHORT)
    }
    else if (this.state.type !== '<=1 GT' && this.state.size.length > 5) {
      ToastAndroid.show('Ukuran kapal maksimal 5 digit angka tanpa titik/koma', ToastAndroid.SHORT)
    }
    else if (this.state.name === '') {
      ToastAndroid.show('Isi nama kapal dahulu', ToastAndroid.SHORT)
    }
    else {
      this.setState({ loader: true })
      let token = this.props.user.token;

      axios.post(`${BASE_URL}/supplier/my-ships`, {
        name: this.state.name,
        size: (this.state.type === '<=1 GT' ? 'kecil' : this.state.size),
        type: this.state.type
      }, {
        headers: { token },
      })
      .then(response => {
        console.log(response)
        this.setState({ loader: false })
        ToastAndroid.show('Sukses Menambah Kapal', ToastAndroid.SHORT)
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
  }

  saveForgeGears() {
    // form validation
    if (this.state.gearsId === '') {
      ToastAndroid.show('Pilih peralatan dahulu', ToastAndroid.SHORT)
    }
    else {
      this.setState({ loader: true })
      const { FishingGearId } = this.state;
      let token = this.props.user.token;

      if (FishingGearId.length === '') {
        ToastAndroid.show('Pilih alat tangkap dahulu', ToastAndroid.SHORT)
        this.setState({ loader: false })
      }
      else {
        axios.post(`${BASE_URL}/supplier/my-fishing-gears`, {
          FishingGearId
        }, {
          headers: { token },
        })
        .then(response => {
          console.log(response)
          this.setState({ loader: false })
          ToastAndroid.show('Sukses Menambah Alat Tangkap', ToastAndroid.SHORT)
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
    }
  }


  render() {
    const { 
      gearsId, 
      name, 
      size, 
      loader, 
  
      FishingGearId,
      data,

      type
    } = this.state;
    
    return (
      <ScrollView keyboardShouldPersistTaps="always">
        <Container>
          <ContainerSection>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerTextStyle}>Pilih Peralatan</Text>
              <View style={styles.pickerStyle}>
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
                  <View style={styles.pickerContainer}>
                    <Text style={styles.pickerTextStyle}>Pilih Tipe Ukuran Kapal</Text>
                    <View style={styles.pickerStyle}>
                      <Picker
                        selectedValue={type}
                        onValueChange={v => this.onChangeInputShip('type', v)}
                      >
                        <Picker.Item label='--- Pilih ---' value='' />
                        <Picker.Item label='<= 1 GT' value='<=1 GT' />
                        <Picker.Item label='>1 GT' value='>1 GT' />
                      </Picker>
                    </View>
                  </View>
                </ContainerSection>
                {
                  this.state.type === '<=1 GT' ? 
                    <ContainerSection>
                      <Input
                        label='Nama Kapal'
                        placeholder="Nama Kapal"
                        value={name}
                        onChangeText={v => this.onChangeInputShip('name', v)}
                      />
                    </ContainerSection>
                  :
                    <View>
                      <ContainerSection>
                        <Input
                          label="Ukuran Kapal (GT)"
                          placeholder="Ukuran Kapal (GT)"
                          value={size}
                          keyboardType="numeric"
                          onChangeText={v => this.onChangeInputShip('size', v)}
                        />
                      </ContainerSection>
                      <ContainerSection>
                        <Input
                          label='Nama Kapal'
                          placeholder="Nama Kapal"
                          value={name}
                          onChangeText={v => this.onChangeInputShip('name', v)}
                        />
                      </ContainerSection>
                    </View>
                }
              </View>
            :
              <View>
                {gearsId === '2' &&
                  <ContainerSection>
                    <View style={styles.pickerContainer}>
                      <Text style={styles.pickerTextStyle}>Pilih Alat Tangkap</Text>
                      <View style={styles.pickerStyle}>
                        <Picker
                          selectedValue={FishingGearId}
                          onValueChange={v => this.onChangeInputForge('FishingGearId', v)}
                        >
                          <Picker.Item label='--- Pilih ---' value='' />
                          {
                            data !== undefined && data.map(item =>
                              <Picker.Item key={item.id} label={item.name} value={item.id} />
                            )
                          }
                        </Picker>
                      </View>
                    </View>
                  </ContainerSection>
                }
              </View>
          }
          <View style={{ marginTop: 20, marginBottom: 20 }}>
            <ContainerSection>
              {
                loader ?
                  <View style={{ flex: 1 }}>
                    <Spinner size='small' />
                  </View>
                :
                  <Button
                    onPress={() => {
                      if (gearsId === '1') {
                        this.saveForgeShips()
                      }
                      else {
                        this.saveForgeGears()
                      }
                    }}
                  >
                    Selesai
                  </Button>
              }
            </ContainerSection>
          </View>
        </Container>
      </ScrollView>
    )
  }
}

const styles = {
  headerStyle: {
    color: COLOR.secondary_a,
    fontSize: 18,
  },
  pickerContainer: {
    flex: 1,
    marginBottom: 5,
  },
  pickerStyle: {
    borderColor: '#a9a9a9',
    borderRadius: 5,
    paddingLeft: 7,
    borderWidth: 1,
    backgroundColor: '#fff'
  },
  pickerTextStyle: {
    color: '#5e5e5e',
    fontSize: 14,
    flex: 1,
    marginTop: 10,
    marginBottom: 10
  },
}

const mapStateToProps = state => {
  const { user } = state

  return { user }
}

export default connect(mapStateToProps, { setUserToken })(PeralatanCreate)
