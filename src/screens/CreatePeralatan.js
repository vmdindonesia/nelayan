import React, { Component } from 'react';
import { View, Picker, ScrollView, Text, ToastAndroid, TouchableOpacity } from 'react-native';
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
      FishingGearId: '',

      statusComboShip: true,
      ShipId: [],
      textInputShipDropDown: [],
      textInputShip: [],
      plusShip: false,
      ShipNameMin: [],
      ShipSizeMin: [],
      ShipNameMax: [],
      ShipSizeMax: [],
      tempShipNameMin: '',
      tempShipSizeMin: '',
      tempShipNameMax: '',
      tempShipSizeMax: '',
    
      statusComboForge: true,
      forgeName: [],
      nameForge: '',
      textInputForge: [],
      plusForge: false,
      data: {},
    }
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
    const newShipId = this.state.ShipId
    newShipId[this.state.ShipId.length] = v;
    this.setState({
    statusComboShip: false,
    plusShip: true,
    ShipId: newShipId
    }, () => {
    this.addTextInputShipDropDown(this.state.textInputShipDropDown.length, v);
    });
  }
  
  onChangeInputForge = (name, v) => {
    console.log(v, 'V nya')

    this.setState({
      statusComboForge: false,
      plusForge: true
    }, () => {
    this.addTextInputForge(this.state.textInputForge.length, v);
    });
  }
  
  onChangeInputShipNameMin = (name, v, key) => {
    console.log(name, 'Name');
    console.log(v, 'Value');
    console.log(key, 'Key');
    this.setState({ [name]: v }, () => {
    const newShipNameMin = this.state.ShipNameMin;
    newShipNameMin[key] = v;
    this.setState({ ShipNameMin: newShipNameMin }, () => {
      console.log(this.state.ShipNameMin, 'Ship Name Min');
    });
    });
  }
  
  onChangeInputShipNameMax = (name, v, key) => {
    console.log(name, 'Name');
    console.log(v, 'Value');
    console.log(key, 'Key');
    this.setState({ [name]: v }, () => {
    const newShipNameMax = this.state.ShipNameMax;
    newShipNameMax[key] = v;
    this.setState({ ShipNameMax: newShipNameMax }, () => {
      console.log(this.state.ShipNameMax, 'Ship Name Max');
    });
    });
  }
  
  onChangeInputShipSize = (name, v, key, value) => {
    console.log(name, 'Name');
    console.log(v, 'Value');
    console.log(key, 'Key');
    this.setState({ [name]: v }, () => {
    const newShipSizeMax = this.state.ShipSizeMax;
    newShipSizeMax[key] = v;
    this.setState({ ShipSizeMax: newShipSizeMax }, () => {
      console.log(this.state.ShipSizeMax, 'Ship Size Min');
    });
    });
  }

/*     checkSecurity() {

    const { 
      gearsId, 
      name, 
      size, 
      FishingGearId,
      ShipNameMin,
      ShipSizeMin,
      ShipNameMax,
      ShipSizeMax,
      tempShipNameMin, 
      tempShipNameMax, 
      tempShipSizeMin,
      tempShipSizeMax,

      forgeName,
      nameForge

    } = this.state;
    if (gearsId === '1') {
      if(!gearsId){
      return ToastAndroid.show('Alat tangkap tidak boleh kosong', ToastAndroid.SHORT)
      }else if(!tempShipNameMin){
      return ToastAndroid.show('Nama kapal tidak boleh kosong', ToastAndroid.SHORT)
      }else{
      this.saveForgeShips()
      }

    } else if (gearsId === '2') {
      switch (gearsId) {
        case '':
          return ToastAndroid.show('Alat tangkap tidak boleh kosong', ToastAndroid.SHORT)
        default:
          console.log('GearsId Lolos')
          switch (FishingGearId) {
            case '':
              return ToastAndroid.show('Alat tangkap tidak boleh kosong', ToastAndroid.SHORT)
            default:
              console.log('Fishing Lolos')
              this.saveForgeGears()
          }
      }
    }
  } */

  addShipComboBox = () => {
    this.setState({
    statusComboShip: true,
    plusShip: false
    });
  }
  
  addForgeComboBox = () => {
    this.setState({
    statusComboForge: true,
    plusForge: false
    });
  }

 
  addTextInputShipDropDown = (key, value) => {
    // Dropdown
    const textInputShipDropDown = this.state.textInputShipDropDown;
    this.setState({ textInputShipDropDown });
    const sizeShip = value;
  
    // TextInput
    const { tempShipNameMin, tempShipNameMax, tempShipSizeMax } = this.state;
    const textInputShip = this.state.textInputShip;
    this.setState({ textInputShip })
  
    if (value === '<=1 GT') {
    textInputShipDropDown.push(
      <View key={key}>
      <ContainerSection>
        <View style={{ padding: 5, width: '100%' }}>
        <Input
          label="Ukuran Kapal"
          placeholder="Ukuran Kapal"
          value={sizeShip}
          editable={false}
        />
        </View> 
      </ContainerSection>
      <ContainerSection>
        <View style={{ padding: 5, width: '100%' }}>
        <Input
          label='Nama Kapal'
          placeholder="Nama Kapal"
          value={tempShipNameMin[key]}
          onChangeText={v => this.onChangeInputShipNameMin(`tempShipNameMin${key}`, v, key)}
        />
        </View>
      </ContainerSection>
      </View>
    );
    } else if (value === '>1 GT') {
    textInputShipDropDown.push(
      <View key={key}>
      <ContainerSection>
        <View style={{ padding: 5, width: '100%' }}>
        <Input
          label="Ukuran Kapal"
          placeholder="Ukuran Kapal"
          value={sizeShip}
          editable={false}
        />
        </View>
      </ContainerSection>
      <ContainerSection>
        <View style={{ padding: 5, width: '100%' }}>
        <Input
          label='Nama Kapal'
          placeholder="Nama Kapal"
          value={tempShipNameMax[key]}
          onChangeText={v => this.onChangeInputShipNameMax(`tempShipNameMax${key}`, v, key)}
        />
        </View>
      </ContainerSection>
  
      <ContainerSection>
        <View style={{ padding: 5, width: '100%' }}>
        <Input
          label='Ukuran Kapal'
          placeholder="Ukuran Kapal"
          keyboardType="numeric"
          value={tempShipSizeMax[key]}
          onChangeText={v => this.onChangeInputShipSize(`tempShipSizeMax${key}`, v, key)}
        />
        </View>
      </ContainerSection>
      </View>
    );
    }
  }
  
  
  addTextInputForge = (key, value) => {
    //Alat TextInput
    console.log(value, 'VALUE FORGE');

    const textInputForge = this.state.textInputForge;
    this.setState({ textInputForge });
  
    textInputForge.push(
    <View key={key}>
      <ContainerSection>
      <Input
        label="Alat Tangkap"
        placeholder="Alat Tangkap"
        value={value.name}
        editable={false}
      />
      </ContainerSection>
    </View>
    );
  
    // Push Value
    const newforgeName = this.state.forgeName
    newforgeName[key] = value
    this.setState({ forgeName: newforgeName });
  }

  saveForgeShips() {
    this.setState({ loader: true })
    const { tempShipNameMin, tempShipNameMax } = this.state;
    let token = this.props.user.token;

    axios.post(`${BASE_URL}/supplier/my-ships`, {
      tempShipNameMin,
      tempShipNameMax
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
    // form validation
    if (this.state.gearsId === '') {
      ToastAndroid.show('Pilih peralatan dahulu', ToastAndroid.SHORT)
    }
    else {
      this.setState({ loader: true })
      const { forgeName } = this.state;
      let token = this.props.user.token;

      console.log(forgeName, '---forgename')
      if (forgeName.length < 1) {
        ToastAndroid.show('Pilih alat tangkap dahulu', ToastAndroid.SHORT)
        this.setState({ loader: false })
      }
      else {
        axios.post(`${BASE_URL}/supplier/my-fishing-gears`, {
          FishingGearId: forgeName[0].id
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
    }
  }


  render() {
    const { 
      gearsId, 
      name, 
      size, 
      loader, 
      FishingGearId,

      statusComboShip,
      textInputShipDropDown,
      textInputShip,
      ShipSize,
      plusShip,
  
  
      statusComboForge,
      forgeName,
      nameForge,
      textInputForge,
      plusForge,
      ShipId,
      data,

      ship
    } = this.state;
    
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
              {
                statusComboShip ?
                  <ContainerSection>
                  <View style={{ flexDirection: 'column', width: '100%', padding: 5 }}>
                    <Text style={{ flex: 1 }}>Pilih Ukuran Kapal</Text>
                    <View style={{ flex: 1, borderColor: '#a9a9a9', borderWidth: 1, height: 47 }}>
                    <Picker
                      selectedValue={ShipSize}
                      onValueChange={v => this.onChangeInputShip('ShipSize', v)}
                    >
                      <Picker.Item label='--- Pilih ---' value='' />
                      <Picker.Item label='<= 1 GT' value='<=1 GT' />
                      <Picker.Item label='>1 GT' value='>1 GT' />
                    </Picker>
                    </View>
                  </View>
                  </ContainerSection>
                :
                <View />
              }

              {
                // plusShip ?
                // <View>
                //   <TouchableOpacity
                //   onPress={() => {
                //     console.log('Tambah Kapal');
                //     this.setState({
                //     plusShip: false
                //     }, () => {
                //     this.addShipComboBox();
                //     });
                //   }}
                //   >
                //   <Text style={{ marginLeft: '65%' }}>Tambah Kapal +</Text>
                //   </TouchableOpacity>
                // </View>
                // :
                // <View />
              }

              {
                textInputShipDropDown && textInputShipDropDown.map((item) =>
                item
                )
                }
            </View>
            :
          <View>
            {
            gearsId === '2' ? 
            <View>
            {
              statusComboForge ?
              <ContainerSection>
                <View style={{ flexDirection: 'column', width: '100%', padding: 5 }}>
                  <Text style={{ flex: 1 }}>Pilih Alat Tangkap</Text>
                  <View style={{ flex: 1, borderColor: '#a9a9a9', borderWidth: 1, height: 47 }}>
                  <Picker
                    selectedValue={nameForge}
                    onValueChange={v => this.onChangeInputForge('nameForge', v)}
                  >
                    <Picker.Item label='--- Pilih ---' value='' />
                   {
                    data !== undefined && data.map(item =>
                      <Picker.Item key={item.id} label={item.name} value={item} />
                    )
                    
                    }
                  </Picker>
                  </View>
                </View>
              </ContainerSection>
              :
              <View />
            }

            {
              // plusForge ?
              // <View style={{ flex: 1 }}>
              //   <TouchableOpacity
              //   onPress={() => {
              //     console.log('Tambah Alat Mas');
              //     this.setState({
              //     plusForge: false
              //     }, () => {
              //     this.addForgeComboBox();
              //     });
              //   }}
              //   >
              //   <Text style={{ marginLeft: '70%' }}>Tambah Alat +</Text>
              //   </TouchableOpacity>
              // </View>
              // :
              // <View />
            }

            {
              textInputForge && textInputForge.map((item) =>
              item
              )
            }
            </View>
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
