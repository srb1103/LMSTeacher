import React from 'react'
import {View, Text, StyleSheet, FlatList} from 'react-native'
import colors from '../colors'
import Style from '../Style'
import Header from '../components/Header'
import NotificationBlock from '../components/NotificationBlock'
import { useSelector } from 'react-redux'

export default function Attendance_home(props){
    const {route, navigation} = props
    const {class_id} = route.params
    let user = useSelector(state=>state.user)
    let iid = user.user.iid
    let {students,subjects} = user
    let courses = subjects
    let st = students.filter(e=>e.classId == class_id)
    let ts = st.length
    const renderCourse = (item)=>{
        let crc = item.item
        return(
            <NotificationBlock head={crc.title} text={`${ts} students`} fun={()=>{navigation.navigate('attendance_list',{crc,students:st,iid})}}/>
        )
    }
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading='Select Subject' fun={()=>navigation.goBack()}/>
            <View style={Style.bodyContainer}>
                <FlatList data={courses} keyExtractor={(item, index)=>index.toString()} renderItem={(item)=>renderCourse(item)} showsVerticalScrollIndicator={false} overScrollMode='never'/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

})