import React from 'react'
import {View, FlatList} from 'react-native'
import Style from '../Style'
import Header from '../components/Header'
import NotificationBlock from '../components/NotificationBlock'
import { useSelector } from 'react-redux'

export default function Assignments(props){
    const {navigation, route} = props
    const {class_id} = route.params
    let user = useSelector(state=>state.user)
    let courses = user.subjects.filter(e=>e.class_id.includes(class_id))
    let students = user.students.filter(e=>e.classId == class_id)
    const renderCourse = (item)=>{
        let itm = item.item
        return(
            <NotificationBlock head={itm.title} fun={()=>{navigation.navigate('assignments_home',{itm,students})}}/>
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