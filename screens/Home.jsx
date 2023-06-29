import React,{useEffect,useState,useCallback} from 'react'
import { View , Text, StyleSheet, ScrollView, StatusBar,ActivityIndicator,RefreshControl,Button} from 'react-native'
import colors from '../colors'
import Style from '../Style'
import { RFValue } from 'react-native-responsive-fontsize'
import Header from '../components/Header'
import Category from '../components/Category'
import { useSelector,useDispatch } from 'react-redux'
import { newStudentInquiry, setData,addNotif } from '../store/actions'
import { db } from '../firebase-config/config'
import { doc, updateDoc } from 'firebase/firestore'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device';


export default function Home({navigation}) {
  let t = useSelector(state=>state.user)
  let {user,type,inquiries,notifications,teacher_attendance} = t
  let {iid,id} = user
  let num = null
  if(inquiries){
    num = inquiries.filter(e=>e.status == 'pending').length
  }
  const [loading,setLoading] = useState(true)
  const [refreshing,setRefreshing] = useState(false)
  let now = new Date()
  let dispatch = useDispatch()
  async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert('Must use physical device for Push Notifications');
    }
    return token;
  }
  useEffect(()=>{
    dispatch(setData(iid)).then(()=>{
      registerForPushNotificationsAsync().then((token)=>{
        updateDoc(doc(db,'teachers',id),{last_login:now,pushToken:token}).then(()=>{
          setLoading(false)
        }).catch(err=>console.log(err))
      }).catch(err=>console.log(err))
    }).catch(err=>console.warn(err))
  },[])
  // useEffect(()=>{
  //   const subscription = Notifications.addNotificationResponseReceivedListener(res=>{
  //     let response = res.notification.request.trigger.remoteMessage.data.body
  //       response = JSON.parse(response)
  //       let {data,nav,type,screen} = response
  //       if(type == 'student_inquiry'){
  //         let {id} = data
  //         let isThere = inquiries.find(e=>e.id == id)
  //         if(isThere){
  //           navigation.navigate(nav,{screen,params:{id}})
  //         }else{
  //           dispatch(newStudentInquiry(data)).then(()=>{
  //             navigation.navigate(nav,{screen,params:{id}})
  //           }).catch(err=>console.log(err))
  //         }
  //       }else if(type ==  'announcement'){
  //         let {id,title,text,date} = data
  //         let notif = {id,title,text,date}
  //         let isThere = notifications.find(e=>e.id == id)
  //         if(isThere){
  //           navigation.navigate(nav,{screen,params:{notice:{title,text,date}}})
  //         }else{
  //           dispatch(addNotif(notif)).then(()=>{
  //             navigation.navigate(nav,{screen,params:{notice:{title,text,date}}})
  //           }).catch(err=>console.log(err))
  //         }
  //     }
  //   })
  //   return ()=>{
  //     subscription.remove()
  //   }
  // },[])
  const onRefresh = useCallback(()=>{
        setRefreshing(true)
        dispatch(setData(iid)).then(()=>{setRefreshing(false)}).catch(err=>console.warn(err))
    },[])
  if(loading){
    return(
      <View style={Style.ai_screen}>
        <StatusBar hidden={false} animated={true} backgroundColor={colors.bg} barStyle="dark-content"/>
        <ActivityIndicator size="large" color={colors.black}/>
        <Text style={{...Style.label,marginTop:5,fontSize:RFValue(14)}}>Please wait...</Text>
      </View>
    )
  }
  if(refreshing){
    return(
      <View style={Style.screen}>
        <StatusBar hidden={false} animated={true} backgroundColor={colors.white} barStyle="dark-content"/>
        <Header icon="menu-outline" heading={user.iname} fun={()=>{}}/>
        <View style={{height:50}}/>
        <ActivityIndicator size="large" color={colors.black}/>
      </View>
    )
  }
  return (
      <View style={Style.screen}>
      <StatusBar hidden={false} backgroundColor={colors.white} barStyle="dark-content"/>
        <Header icon="menu-outline" heading={user.iname} fun={()=>navigation.toggleDrawer()}/>
        <ScrollView showsVerticalScrollIndicator={false} overScrollMode='never' refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Text style={styles.home_head}>Hi, {user.name}</Text>
        <View style={styles.div}>
          <Text style={styles.div_head}>Categories</Text>
          <View style={styles.category_wrap}>
            <Category text="Results" fun={()=>navigation.navigate('classes',{nav: 'results', screen: 'result_home'})} icon='bar-chart-outline'/>
            <Category text="Assignments" fun={()=>navigation.navigate('classes',{nav: 'assignments', screen: 'assignments_homepage'})} icon='newspaper-outline'/>
            <Category text="Attendance" fun={()=>navigation.navigate('classes',{nav: 'attendance', screen: 'attendance_home'})} icon='calendar-outline'/>
            <Category text="Courses" fun={()=>navigation.navigate('courses')} icon='book-outline'/>
            <Category text="Announcements" fun={()=>navigation.navigate('announcements')} icon='chatbox-outline'/>
            <Category text="Notifications" fun={()=>navigation.navigate('homepage',{screen:'notif_home'})} icon='information-circle-outline'/>
            <Category text="Students" fun={()=>navigation.navigate('classes',{nav: 'students', screen: 'student_home'})} icon='people-outline'/>
            <Category text="Time Table" fun={()=>navigation.navigate('timetable')} icon='time-outline'/>
            {type == 'school' && <Category text="Send Homework" fun={()=>navigation.navigate('classes',{nav: 'homework', screen: 'hw_home'})} icon='document-outline'/>}
            <Category text="Student Inquiry" fun={()=>navigation.navigate('inquiries')} icon='information-circle-outline' num={num ? num : null}/>
          </View>
        </View>
        </ScrollView>
      </View>
  )
}

const styles = StyleSheet.create({
  home_head:{fontSize: RFValue(25), fontFamily: 'p6', color: colors.black, marginVertical: 25, marginHorizontal: 15},
  div:{padding: 15},
  div_head:{fontFamily:'p5', fontSize: RFValue(15), color: colors.black},
  category_wrap:{flexDirection:'row', flexWrap:'wrap', marginTop: 10},
})
