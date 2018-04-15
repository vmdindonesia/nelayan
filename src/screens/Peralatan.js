import React, { Component } from 'react'
import { FlatList, View, Image, Text, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux'
import ActionButton from 'react-native-action-button'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { COLOR } from '../constants'
import { alatFetch, kapalFetch } from '../actions'
import { ContainerSection } from '../components/common'


class Peralatan extends Component {
  static navigationOptions = {
    title: 'Peralatan',
    headerRight: <View />
  }

  constructor(props) {
    super(props)

    this.state = {
      alat_1: '',
      tabActive: 0
    }
  }

  componentWillMount() {
    this.props.alatFetch(this.props.user.token)
    this.props.kapalFetch(this.props.user.token)

    console.log(this.props.alatFetch)
    console.log(this.props.kapalFetch, 'kapalfetch')
  }

  toggleTab = (index) => {
    if (index === this.state.tabActive) {
      this.setState({tabActive: 0})
    }
    else {
      this.setState({tabActive: index})
    }
  }

  renderAlat = (item) => {
    return (
      <TouchableNativeFeedback 
        onPress={() => this.props.navi.navigate('PeralatanEdit', { id: item.id })}
      >
        <View style={styles.itemContainerStyle}>
          <View style={styles.thumbnailContainerStyle}>
            <Image 
              style={styles.thumbnailStyle}
              source={require('../../assets/alat-tangkap.png')}

            />
          </View>
          <View style={styles.headerContentStyle}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{flex: 1}}>{item.FishingGear.name}</Text>
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

  renderKapal = (item) => {
    return (
      <TouchableNativeFeedback 
        onPress={() => this.props.navi.navigate('PeralatanEdit', { id: item.id })}
      >
        <View style={styles.itemContainerStyle}>
          <View style={styles.thumbnailContainerStyle}>
            <Image 
              style={styles.thumbnailStyle}
              source={require('../../assets/kapal.png')}
            />
          </View>
          <View style={styles.headerContentStyle}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text>{item.name}</Text>
              <Text>Ukuran: {item.size}</Text>
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }


  render() {
    const { tabActive } = this.state

    return (
      <View style={{ flex: 1, padding: 10 }}>
        <ContainerSection>
          <TouchableWithoutFeedback onPress={() => this.toggleTab(2)}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Text style={{fontSize: 20}}>Kapal</Text>
              <View style={{flex: 1}}>
                <Ionicons size={30} style={{alignSelf: 'flex-end'}} name={tabActive === 2 ? 'ios-arrow-up' : 'ios-arrow-down'} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ContainerSection>
        {
          tabActive === 2 &&
            <View style={{flex: 1}}>
              <FlatList
                data={this.props.kapal.data}
                renderItem={({item}) => this.renderKapal(item)}
                keyExtractor={(item, index) => index}
                numColumns={1}
                onRefresh={() => this.props.alatFetch(this.props.user.token)}
                refreshing={this.props.kapal.loading}
              />
            </View>
        }

        <ContainerSection>
          <TouchableWithoutFeedback onPress={() => this.toggleTab(1)}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Text style={{fontSize: 20}}>Alat Tangkap</Text>
              <View style={{flex: 1}}>
                <Ionicons size={30} style={{alignSelf: 'flex-end'}} name={tabActive === 1 ? 'ios-arrow-up' : 'ios-arrow-down'} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ContainerSection>
        {
          tabActive === 1 &&
            <View style={{flex: 1}}>
              <FlatList
                data={this.props.alat.data}
                renderItem={({item}) => this.renderAlat(item)}
                keyExtractor={(item, index) => index}
                numColumns={1}
                onRefresh={() => this.props.alatFetch(this.props.user.token)}
                refreshing={this.props.alat.loading}
              />
            </View>
        }

        <ActionButton
          buttonColor={COLOR.secondary_b}
          onPress={() => 
            this.props.navi.navigate('CreateForge')
          }
        />
      </View>
    )
  }
}

const styles = {
  itemContainerStyle: {
    flex: 2,
    margin: 5,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    elevation: 1,
    backgroundColor: '#fff'
  },
  thumbnailContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  thumbnailStyle: {
    height: 30,
    width: 30,
    borderRadius: 5
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
  },
  card: {
    borderTopWidth: 1,
    borderColor: '#eaeaea',
    padding: 5
  },
}

const mapStateToProps = state => {
  const { alat, kapal, user } = state

  return { alat, kapal, user }
}

export default connect(mapStateToProps, { alatFetch, kapalFetch })(Peralatan)

