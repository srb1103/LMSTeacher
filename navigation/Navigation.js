import React,{useState,useEffect} from 'react'
import {View, ActivityIndicator,StatusBar,Text} from 'react-native'
import Style from '../Style'
import { useDispatch, useSelector } from 'react-redux'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Home from '../screens/Home'
import Classes from '../screens/LoadClasses'
import Result_home from '../screens/Result_home'
import Add_result from '../screens/Add_result'
import { NavigationContainer } from '@react-navigation/native'
import Login from '../screens/Login'
import ForgotPasword from '../screens/ForgotPassword'
import NavBar from '../screens/NavBar'
import Assignments_home from '../screens/Assignments_home'
import Attendance_home from '../screens/Attendance_home'
import Courses_home from '../screens/Courses_home'
import Announcements_home from '../screens/Announcements_home'
import Notifications_home from '../screens/Notifications_home'
import Result_semester from '../screens/Result_semester'
import Assignment_detail from '../screens/Assignment_detail'
import Announcement from '../screens/Announcement'
import Announcement_new from '../screens/Announcement_new'
import Notification from '../screens/Notification'
import Students_home from '../screens/Students_home'
import Student from '../screens/Student'
import Course from '../screens/Course_view'
import New_Topic from '../screens/New_Topic'
import Topic from '../screens/Topic'
import Result_form from '../screens/Result_form'
import Result_previous from '../screens/Result_previous'
import Result_view from '../screens/Result_view'
import Assignment_edit from '../screens/Assignment_edit'
import Assignment_submission from '../screens/Assignment_submission'
import AttendanceList from '../screens/AttendanceList'
import Attendance_expanded from '../screens/Attendance_expanded'
import Attendance_previous from '../screens/Attendance_previous'
import Assignment_new from '../screens/Assignment_new'
import Assignments from '../screens/Assignments'
import Time_table from '../screens/Time_table'
import Exam_detail from '../screens/Exam_detail'
import Profile from '../screens/Profile'
import Add_exam from '../screens/Add_exam'
import Change_password from '../screens/Change_password'
import colors from '../colors'
import { setUID } from '../store/actions'
import { findUserID } from '../helpers/sql'
import { usrCr } from '../firebase-config/config'
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import HW_home from '../screens/Homework_home'
import HW_list from '../screens/Homework_list'
import HW_view from '../screens/HW_view'
import HW_form from '../screens/Homework_form'
import { RFValue } from 'react-native-responsive-fontsize'
import Attendance_dialog from '../screens/Attendance_dialog'
import Inquiries from '../screens/Inquiries'
import Inquiry from '../screens/Inquiry'
import { fetch_data } from '../firebase-config/functions'
import MyAttendance from '../screens/MyAttendance'
import Chapter_form from '../screens/Chapter_form'
import Chapter from '../screens/Chapter'

const HomeStack = createStackNavigator()
const LoginStack = createStackNavigator()
const ResultStack = createStackNavigator()
const AssignmentsStack = createStackNavigator()
const AttendanceStack = createStackNavigator()
const CourseStack = createStackNavigator()
const NotifStack = createStackNavigator()
const ProfileStack = createStackNavigator()
const AnnouncementStack = createStackNavigator()
const StudentStack = createStackNavigator()
const HWStack = createStackNavigator()
const InqStack = createStackNavigator()
const DrawerNavigator = createDrawerNavigator()

const HWNav = ()=>(
    <HWStack.Navigator
        screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}   
    >
        <HWStack.Screen name='hw_home' component={HW_home} options={()=>({headerShown: false})}/>
        <HWStack.Screen name='hw_list' component={HW_list} options={()=>({headerShown: false})}/>
        <HWStack.Screen name='hw' component={HW_view} options={()=>({headerShown: false})}/>
        <HWStack.Screen name='hw_form' component={HW_form} options={()=>({headerShown: false})}/>
    </HWStack.Navigator>
)
const InqNav = ()=>(
    <InqStack.Navigator
        screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}   
    >
        <InqStack.Screen name='inq_home' component={Inquiries} options={()=>({headerShown: false})}/>
        <InqStack.Screen name='inquiry' component={Inquiry} options={()=>({headerShown: false})}/>
    </InqStack.Navigator>
)
const ProfileNav = ()=>(
    <ProfileStack.Navigator
        screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}   
    >
        <ProfileStack.Screen name='profile-home' component={Profile} options={()=>({headerShown: false})}/>
        <ProfileStack.Screen name='change-password' component={Change_password} options={()=>({headerShown: false})}/>
        <ProfileStack.Screen name='my-attendance' component={MyAttendance} options={()=>({headerShown: false})}/>
    </ProfileStack.Navigator>
)
const StudentNav = ()=>(
    <StudentStack.Navigator
        screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}   
    >
        <StudentStack.Screen name='student_home' component={Students_home} options={()=>({headerShown: false})}/>
        <StudentStack.Screen name='student' component={Student} options={()=>({headerShown: false})}/>
    </StudentStack.Navigator>
)
const CourseNav = ()=>(
    <CourseStack.Navigator
        screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}
    >
        <CourseStack.Screen name="course_home" component={Courses_home} options={()=>({headerShown: false})}/>
        <CourseStack.Screen name="course" component={Course} options={()=>({headerShown: false})}/>
        <CourseStack.Screen name="new_topic" component={New_Topic} options={()=>({headerShown: false})}/>
        <CourseStack.Screen name="topic" component={Topic} options={()=>({headerShown: false})}/>
        <CourseStack.Screen name="chapter_form" component={Chapter_form} options={()=>({headerShown: false})}/>
        <CourseStack.Screen name="chapter" component={Chapter} options={()=>({headerShown: false})}/>
    </CourseStack.Navigator>
)
const NotifNav = ()=>(
    <NotifStack.Navigator
        screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}
    >
        <NotifStack.Screen name="notif_home" component={Notifications_home} options={()=>({headerShown: false})}/>
        <NotifStack.Screen name="notification" component={Notification} options={()=>({headerShown: false})}/>
    </NotifStack.Navigator>
)
const AnnouncementNav = ()=>(
    <AnnouncementStack.Navigator
        screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}
    >
        <AnnouncementStack.Screen name="announcement_home" component={Announcements_home} options={()=>({headerShown: false})}/>
        <AnnouncementStack.Screen name="announcement" component={Announcement} options={()=>({headerShown: false})}/>
        <AnnouncementStack.Screen name="new_announcement" component={Announcement_new} options={()=>({headerShown: false})}/>
    </AnnouncementStack.Navigator>
)
const LoginNav = ()=>(
    <LoginStack.Navigator
        screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}
    >
        <LoginStack.Screen name='login' component={Login} options={()=>({headerShown: false})}/>
        <LoginStack.Screen name='fp' component={ForgotPasword} options={()=>({headerShown: false})}/>
    </LoginStack.Navigator>
)
const AttnNav = ()=>(
    <AttendanceStack.Navigator
        screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}
    >
        <AttendanceStack.Screen name="attendance_home" component={Attendance_home} options={()=>({headerShown: false})}/>
        <AttendanceStack.Screen name="attendance_list" component={AttendanceList} options={()=>({headerShown: false})}/>
        <AttendanceStack.Screen name="attendance_expanded" component={Attendance_expanded} options={()=>({headerShown: false})}/>
        <AttendanceStack.Screen name="attendance_previous" component={Attendance_previous} options={()=>({headerShown: false})}/>
        <AttendanceStack.Screen name="attendance_dialog" component={Attendance_dialog} options={()=>({headerShown: false})}/>
    </AttendanceStack.Navigator>
)
const AssnNav = ()=>(
    <AssignmentsStack.Navigator
        screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}   
    >
        <AssignmentsStack.Screen name='assignments_homepage' component={Assignments} options={()=>({headerShown: false})}/>
        <AssignmentsStack.Screen name='assignments_home' component={Assignments_home} options={()=>({headerShown: false})}/>
        <AssignmentsStack.Screen name='assignment' component={Assignment_detail} options={()=>({headerShown: false})}/>
        <AssignmentsStack.Screen name='assignment_edit' component={Assignment_edit} options={()=>({headerShown: false})}/>
        <AssignmentsStack.Screen name='assignment_submit' component={Assignment_submission} options={()=>({headerShown: false})}/>
        <AssignmentsStack.Screen name='assignment_new' component={Assignment_new} options={()=>({headerShown: false})}/>
    </AssignmentsStack.Navigator>
)
const ResultNav = ()=>(
    <ResultStack.Navigator
        screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}
    > 
        <ResultStack.Screen name="result_home" component={Result_home} options={()=>({headerShown: false})}/>
        <ResultStack.Screen name="add_exam" component={Add_exam} options={()=>({headerShown: false})}/>
        <ResultStack.Screen name="exam_detail" component={Exam_detail} options={()=>({headerShown: false})}/>
        <ResultStack.Screen name="add_result" component={Add_result} options={()=>({headerShown: false})}/>
        <ResultStack.Screen name="sem" component={Result_semester} options={()=>({headerShown: false})}/>
        <ResultStack.Screen name="res_form" component={Result_form} options={()=>({headerShown: false})}/>
        <ResultStack.Screen name="prev" component={Result_previous} options={()=>({headerShown: false})}/>
        <ResultStack.Screen name="r_view" component={Result_view} options={()=>({headerShown: false})}/>
    </ResultStack.Navigator>
)
const HomeNav = ()=>(
    <HomeStack.Navigator
        screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS 
        }}
    >
        <HomeStack.Screen name='home_page' component={Home} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='classes' component={Classes} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name="results" component={ResultNav} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name="assignments" component={AssnNav} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name="attendance" component={AttnNav} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name="courses" component={CourseNav} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name="homepage" component={NotifNav} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name="announcements" component={AnnouncementNav} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name="students" component={StudentNav} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name="timetable" component={Time_table} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name="profile" component={ProfileNav} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name="homework" component={HWNav} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name="inquiries" component={InqNav} options={()=>({headerShown: false})}/>
    </HomeStack.Navigator>
)
const PrimaryNav = ()=>(
    <DrawerNavigator.Navigator drawerContent={props => <NavBar {...props}/>}>
        <DrawerNavigator.Screen name='home' component={HomeNav} options={()=>({headerShown: false})}/>
    </DrawerNavigator.Navigator>
)

export default function Nav(){
    let [loading,setLoading] = useState(true)
    let dispatch = useDispatch()
    let {Email,Password} = usrCr
    const auth = getAuth();
    const authenticate = async ()=>{
        await signInWithEmailAndPassword(auth, Email, Password)
    }
    const updateStore = (id)=>{
        dispatch(setUID(id)).then(()=>setLoading(false)).catch(err=>console.log(err))
    }
    const check_user = async ()=>{
        try{
        let uid = await findUserID()
        auth.onAuthStateChanged(user=>{
            if(!user){
                authenticate();
            }
        })
        if(uid.rows.length > 0){
            let data = uid.rows._array[0]
            if(data.userID){
                let id = data.userID
                let isTh = await fetch_data('teachers')
                let isThere = isTh.find(e=>e.id == id)
                if(isThere){
                    updateStore(data.userID)
                }else{
                    setLoading(false)
                    console.log('no teacher in the database')
                }
            }
        }else{setLoading(false)}}catch(err){console.warn(err);setLoading(false)}
    }
    const UID = useSelector(state=>state.user.user.id)
    useEffect(()=>{
        check_user();
    },[])
    if (loading){
        return(
            <View style={Style.screen}>
                <StatusBar backgroundColor='white' hidden={false}/>
                <View style={Style.ai_screen}>
                    <ActivityIndicator size="large" color={colors.black}/>
                    <Text style={{...Style.label,marginTop:5,fontSize:RFValue(14)}}>Please wait...</Text>
                </View>
            </View>
        )
    }
    return (
        <NavigationContainer>
            {UID ? <PrimaryNav/> : <Login/>}
        </NavigationContainer>
    )
}
export function LoginNavigation(){
    return(
        <NavigationContainer>
            <LoginNav/>
        </NavigationContainer>
    )
}