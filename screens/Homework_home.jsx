import React from 'react'
import {View, FlatList} from 'react-native'
import Style from '../Style'
import Header from '../components/Header'
import NotificationBlock from '../components/NotificationBlock'
import { useSelector } from 'react-redux'

export default function HW_home(props){
    const {navigation, route} = props
    const {class_id} = route.params
    let user = useSelector(state=>state.user)
    let {subjects,students} = user
    let courses = subjects.filter(e=>e.class_id.includes(class_id))
    let st = students.filter(e=>e.classId == class_id)
    let tokens = []
    st.forEach(s=>{
        let t = s.pushToken
        if(t){
            tokens.push(t)
        }
    })
    const renderCourse = (s)=>{
        let {item} = s
        let {title} = item
        return(
            <NotificationBlock head={title} fun={()=>{navigation.navigate('hw_list',{item,tokens})}}/>
        )
    }
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading="Select Subject" fun={()=>navigation.goBack()}/>
            <View style={Style.bodyContainer}>
                <FlatList data={courses} showsVerticalScrollIndicator={false} overScrollMode='never' keyExtractor={(item, index)=>index.toString()} renderItem={renderCourse}/>
            </View>
        </View>
    )
}