import React, { Component } from 'react'
import { FlatList, View, Image, Text, TouchableNativeFeedback } from 'react-native'
import { connect } from 'react-redux'
import ActionButton from 'react-native-action-button'

import { membersFetch } from '../actions'
import { Card } from '../components/common'
import { BASE_URL, COLOR } from '../constants'

class MemberList extends Component {
  static navigationOptions = {
    title: 'Anggota',
    headerRight: <View />
  }

  componentWillMount() {
    this.props.membersFetch(this.props.user.token)
  }

  renderItem = (item) => {
    return (
      <Card>
        <TouchableNativeFeedback
          onPress={() => this.props.navi.navigate('MemberEdit', { id: item.id })}
        >
          <View style={styles.itemContainerStyle}>
            <View style={styles.thumbnailContainerStyle}>
              <Image
                style={styles.thumbnailStyle}
                source={{ uri: `${BASE_URL}/images/${item.photo}` }}
              />
            </View>
            <View style={styles.headerContentStyle}>
              <Text style={styles.hedaerTextStyle}>{item.name}</Text>
              <Text>{item.address}</Text>
              <Text style={{fontWeight: 'bold'}}>{item.phone}</Text>
              <Text style={{fontSize: 11}}>No. KTP: {item.idNumber}</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
      </Card>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {
          this.props.members.data.length > 0 ?
            <FlatList
              data={this.props.members.data}
              renderItem={({ item }) => this.renderItem(item)}
              keyExtractor={(item, index) => index}
              onRefresh={() => this.props.membersFetch(this.props.user.token)}
              refreshing={this.props.members.loading}
            />
          :
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Image 
                source={require('../../assets/Asset-8.png')} 
              />
              <Text style={{textAlign: 'center'}}>{'Anda belum\r\nmempunyai anggota'}</Text>
            </View>
        }
        
        <ActionButton
          buttonColor={COLOR.element_b4}
          onPress={() => {
            this.props.navi.navigate('MemberCreate')
          }
        }
        />
      </View>
    )
  }
}

const styles = {
  itemContainerStyle: {
    borderBottomWidth: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
  },
  thumbnailContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  thumbnailStyle: {
    height: 80,
    width: 80,
    borderRadius: 50
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
    color: COLOR.secondary_a,
    fontFamily: 'Muli-Bold'
  }
}

const mapStateToProps = state => {
  const { members, user } = state

  return { members, user }
}

export default connect(mapStateToProps, { membersFetch })(MemberList)

