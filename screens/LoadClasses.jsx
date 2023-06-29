import React from 'react'
import { View , Text, FlatList} from 'react-native'
import { useSelector } from 'react-redux'
import Header from '../components/Header'
import NotificationBlock from '../components/NotificationBlock'
import Style from '../Style'

export default function LoadClasses({navigation, route}) {
  const {nav, screen} = route.params
  let user = useSelector(state=>state.user)
  let classes = user.classes
  const renderClass = (item)=>{
    let cls = item.item
    return(
      <NotificationBlock head={cls.name} fun={()=>navigation.navigate(nav,{screen: screen, params:{class_id: cls.id,class_name: cls.name}})}/>
    )
  }
  return (
    <View style={Style.screen}>
      <Header icon="chevron-back-outline" heading="Select Class" fun={()=>navigation.goBack()}/>
      <View style={Style.bodyContainer}>
       <FlatList data={classes} keyExtractor={(item,index)=>index.toString()} renderItem={renderClass} overScrollMode='never' showsVerticalScrollIndicator={false}/>
      </View>
    </View>
  )
}
