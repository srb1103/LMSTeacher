import React, {useCallback, useState} from 'react' 
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert} from 'react-native'
import colors from '../colors'
import Style from '../Style'
import NotificationBlock from '../components/NotificationBlock'
import Header from '../components/Header'
import BigCTA from '../components/BigCTA'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useSelector } from 'react-redux'


export default function AtttendanceList(props){
    const {navigation, route} = props
    let {students,iid} = route.params
    const user = useSelector(state=>state.user)
    let attendance = user.attendance
    const {title,id} = route.params.crc
    const [datePop, setDatePop] = useState(false)
    const [date, setDate] = useState(new Date())
    const [dateText, setDateText] = useState('Select Date')
    const [loading, setLoading] = useState(false)
    const [dateBlock, setDateBlock] = useState(null)
    function setDateFun(event, selectedDate){
        setDatePop(false)
        if(selectedDate && event.type == 'set'){
            let currentDate = selectedDate
            const tmpDate = new Date(currentDate)
            setDate(currentDate)
            const fullDate = `${tmpDate.getDate()}-${tmpDate.getMonth()+1}-20${tmpDate.getYear()-100}`
            setDateText(fullDate)
            setLoading(true)
            fetchAttendance(fullDate)
        }
    }
    const fetchAttendance = (date)=>{
        let res = attendance.find(e=>e.date == date && e.classID == id)
        if(res){
            setDateBlock(<NotificationBlock head={date} text="See Attendance" fun={()=>{navigation.navigate('attendance_previous',{date: dateText,res})}}/>)
        }else{Alert.alert('Not available.',`Attendance of ${date} is not available`,[{text:'Okay'},{text:'Mark Attendance',onPress:()=>{setTimeout(()=>{navigation.navigate('attendance_expanded',{date, mode:'write',students,iid,id})},200)}}])}
        setLoading(false)
        
    }
    const handleCTA = ()=>{
        let t = new Date()
        let today = `${t.getDate()}-${t.getMonth()+1}-20${t.getYear()-100}`
        let res = attendance.find(e=>e.date == today && e.classID == id)
        if(res){
            navigation.navigate('attendance_previous',{date: today,res})
        }else{
            navigation.navigate('attendance_expanded',{date: today, mode:'write',students,iid,id})
        }
    }
    return(
        <View style={{...Style.screen, position: 'relative'}}>
            <Header icon="chevron-back-outline" heading={title} fun={()=>navigation.goBack()}/>
            {datePop  && <DateTimePicker
                testID = 'DateTimePicker'
                value={date}
                is24Hour = {false}
                display = 'default'
                onChange={setDateFun}
                maximumDate={new Date()}
            />}
            <View style={Style.bodyContainer}>
                <View style={{paddingVertical: 10}}><Text style={Style.label}>See Previous Attendance</Text><TouchableOpacity activeOpacity={.7} onPress={()=>{setDatePop(true)}}><Text style={Style.input}>{dateText}</Text></TouchableOpacity></View>
                {loading && <View style={{alignItems: 'center', justifyContent: 'center'}}><ActivityIndicator size="large" color={colors.black}/></View>}
                {dateBlock}
            </View>
            <BigCTA text="Today's Attendance" fun={handleCTA}/>
        </View>
    )
}

const styles = StyleSheet.create({

})