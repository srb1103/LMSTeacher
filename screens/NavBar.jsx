import React from 'react'
import {View, Text, StyleSheet, Image,ScrollView, Alert} from 'react-native'
import colors from '../colors'
import { RFValue } from 'react-native-responsive-fontsize'
import NavItem from '../components/NavItem'
import { useSelector } from 'react-redux'

export default function NavBar(props) {
    const {navigation} = props
    let user = useSelector(state=>state.user.user)
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} overScrollMode='never'>
            <View style={styles.topDiv}>
                <Image source={{uri: user.img}} style={{height: 70, width: 70, marginBottom: 8, borderRadius: 40}}/>
                <Text style={styles.studentName}>{user.name}</Text>
            </View>
            <View>
                <NavItem icon="home" text="Home" fun={()=>{navigation.navigate('home')}}/>
                <NavItem icon="bar-chart" text="Results" fun={()=>navigation.navigate('classes',{nav: 'results', screen: 'result_home'})}/>
                <NavItem icon="newspaper" text="Assignments" fun={()=>navigation.navigate('classes',{nav: 'assignments', screen: 'assignments_homepage'})}/>
                <NavItem icon="calendar-outline" text="Attendance" fun={()=>navigation.navigate('classes',{nav: 'attendance', screen: 'attendance_home'})}/>
                <NavItem icon="book" text="Courses" fun={()=>navigation.navigate('courses')}/>
                <NavItem icon="information-circle" text="Notifications" fun={()=>navigation.navigate('homepage',{screen:'notif_home'})}/>
                <NavItem icon="chatbox" text="Announcements" fun={()=>navigation.navigate('announcements')}/>
                <NavItem icon="people" text="Students" fun={()=>navigation.navigate('classes',{nav: 'students', screen: 'student_home'})}/>
                <NavItem icon="person" text="Profile" fun={()=>{navigation.navigate('profile')}}/>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    topDiv:{
        backgroundColor: colors.black,
        padding: 40,
        alignItems:'center',
        justifyContent:'center',
        height: 150,
        marginBottom: 30
    },
    userIcon:{
        fontSize: RFValue(45)
    },
    studentName:{
        color: colors.white,
        fontSize: RFValue(18),fontFamily:'p6'
    },
    
})
