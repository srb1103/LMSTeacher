import React from 'react'
import {View, Text, StyleSheet, FlatList, Dimensions} from 'react-native'
import Style from '../Style'
import colors from '../colors'
import Header from '../components/Header'
import NotificationBlock from '../components/NotificationBlock'
import { RFValue } from 'react-native-responsive-fontsize'
import { useSelector } from 'react-redux'

const {width} = Dimensions.get('window')
export default function Time_table(props){
    const {navigation} = props
    let user = useSelector(state=>state.user)
    const data = user.timetable
    let subjects = user.subjects
    const renderDay = (item)=>{
        let {day, subjects} = item.item
        return(
            <View style={{paddingTop: 5, position: 'relative'}}>
                <Text style={styles.day_name}>{day}</Text>
                <View style={styles.line}></View>
                { subjects.length > 0 && <FlatList data={subjects} keyExtractor={(item, index)=>index.toString()} showsVerticalScrollIndicator={false} renderItem={(item)=>renderClasses(item)} overScrollMode='never'/>}
            </View>
        )
    }
    const renderClasses = (item)=>{
        let course = item.item
        let sb = course.subjectID
        let t = subjects.find(e=>e.id == sb)
        let sub_name = t ? t.title : ''
        return(
            <View style={{width: width/1.2}}>
                <NotificationBlock head={`${course.period}. ${sub_name}`} text={`Time: ${course.time.from}-${course.time.to}, Substitute: ${course.substitute}`}/>
            </View>
        )
    }
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading='Time Table' fun={()=>navigation.goBack()}/>
            <View style={Style.bodyContainer}>
                <FlatList data={data} keyExtractor={(item, index)=>index.toString()} renderItem={(item)=>renderDay(item)} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} overScrollMode='never' horizontal/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    day_name:{paddingVertical: 6, backgroundColor: colors.black, color: colors.white, maxWidth: '28%', marginBottom: 8, marginLeft: 5, textAlign: 'center', fontFamily: 'p5', borderRadius: 10, fontSize: RFValue(12), position: 'relative', zIndex: 2},
    line:{position: 'absolute', height: 1, backgroundColor: colors.white, top: 21, width: '100%', left: 0, zIndex: 1}
})