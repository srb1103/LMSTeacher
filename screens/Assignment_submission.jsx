import React,{useState, useReducer, useCallback} from 'react'
import { View , Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Dimensions } from 'react-native'
import colors from '../colors'
import Header from '../components/Header'
import StatBox from '../components/StatBox'
import NotificationBlock from '../components/NotificationBlock'
import Style from '../Style'
import ButtonTabs from '../components/ButtonTabs'
import Alert1 from '../components/Alert'
import ButtonCombo from '../components/ButtonCombo'
import DateTimePicker from '@react-native-community/datetimepicker'
import BigCTA from '../components/BigCTA'
import { updateDoc,addDoc,doc,collection } from 'firebase/firestore'
import { db } from '../firebase-config/config'
import { useDispatch, useSelector } from 'react-redux'
import InputField from '../components/InputField'
import { submitAssignmentAction } from '../store/actions'

const UPDATE_STUDENT = 'UPDATE_STUDENT'
const SRCH = 'SRCH'

const resultReducer = (state, action)=>{
  switch (action.type){
    case UPDATE_STUDENT:
      let {id, date} = action;
      let student_a = state.remaining_students.filter(i=>i.id == id)
      let r = state.remaining_students
      let a = state.added_students
      let rem = state.rem_b
      r = r.filter(i=>i.id !== id)
      rem = rem.filter(i=>i.id !== id)
      let stu = student_a[0]
      stu.date = date
      a = a.concat(stu)
      let ad = state.added + 1
      let rm = state.remaining - 1
      return{
        ...state,
        remaining_students: r,
        added_students: a,
        rem_b: rem,
        add_b: a,
        added: ad,
        remaining:rm
      }
    case SRCH:
      const {value,of} = action
      let add = state.added_students
      let pen = state.remaining_students
      let {add_b,rem_b} = state
      if(of == 'r'){
        if(value == ''){
            pen = rem_b
        }else{
          pen = rem_b.filter(p=>p.rollNo.match(value))
        }
      }else{
        if(value == ''){
          add = add_b
        }else{
          add = add_b.filter(p=>p.rollNo.match(value))
        }
      }
      return{...state,added_students:add,remaining_students:pen}
  }
  return state
}
let {height} = Dimensions.get('window')
export default function Assignment_submission(props) {
  const {navigation, route} = props
  let u = useSelector(state=>state.user)
  let user = u.user
  let iid = user.iid
  let sesID = u.session.id
  const {id,title,students,submit} = route.params
  const [active, setActive] = useState(true)
  const [alert, setAlert] = useState(null)
  const [datePop, setDatePop] = useState(false)
  const [date, setDate] = useState(new Date())
  const [dateText, setDateText] = useState('Today')
  const [student, setStudent] = useState({name: null, roll: null, id: null})
  const [loading,setLoading] = useState(false)
  let [srch,setSrch] = useState(null)
  let [srch1,setSrch1] = useState(null)
  let st_data = []
  students.forEach(s=>{
    let obj = {id:s.id,rollNo:s.rollNo,name:s.name,date:''}
    st_data.push(obj)
  })
  const remaining_students = st_data
  const added_students = []
  
  const [state, dispatchState] = useReducer(resultReducer,{
    remaining_students: remaining_students,
    added_students: added_students,
    rem_b:remaining_students,
    add_b:[],
    total: remaining_students.length + added_students.length,
    added: added_students.length,
    remaining: remaining_students.length,
  })
  const updateStatus = useCallback((id, date)=>{
      dispatchState({
        type: UPDATE_STUDENT,
        id,
        date
      })
      
  },[dispatchState])
  function setDateFun(event, selectedDate){
    setDatePop(false)
    if(selectedDate){
        let currentDate = selectedDate
        const tmpDate = new Date(currentDate)
        setDate(currentDate)
        const fullDate = `${tmpDate.getDate()}-${tmpDate.getMonth()+1}-20${tmpDate.getYear()-100}`
        setDateText(fullDate)
        loadAlert(student.roll, student.name, fullDate, student.id)
    }
}
  const save = (d, id)=>{
    if(!d){setDatePop(true)}else{
      updateStatus(id, d)
      setAlert(null)
    }
  }
  const hideAlert = ()=>{
    setAlert(null)
  }
  const showAl = (id, rollNo, name, status, dt)=>{
    let dtTxt = dt;
    setDateText(dtTxt)
    setStudent({id, roll: rollNo, name})
    loadAlert(rollNo, name, dtTxt, id)
  }
  const loadAlert = (roll, name, dateText, id)=>{
    setAlert(<Alert1 text={roll} heading={name} overflow={true} css={{maxHeight: '40%'}}><View style={{padding: 10}}><View style={{paddingVertical: 10}}><Text style={Style.label}>Submitted on</Text><TouchableOpacity activeOpacity={.7} onPress={()=>{setDatePop(true)}}><Text style={Style.input}>{dateText}</Text></TouchableOpacity></View></View><ButtonCombo text1='Cancel' text2='Save' fun1={hideAlert} fun2={()=>save(dateText, id)}/></Alert1>)
  }
  function renderStudent(item, status){
    let {id, name, rollNo, date} = item.item
    return(
        <NotificationBlock head={name} text={`Roll No: ${rollNo}`} fun={()=>{showAl(id, rollNo, name, status, date)}}/>
    )
  }
  const dispatch = useDispatch()
  const finalSubmit = async()=>{
    setLoading(true)
    let att = JSON.stringify(state.added_students)
    let dt = new Date()
    let today = `${dt.getDate()}-${dt.getMonth()+1}-${dt.getFullYear()}`
    try{
      let res = await addDoc(collection(db,'assignment-submissions'),{
        instituteID:iid,assignmentID:id,students:att,date:today,session:sesID
      })
      let aid = res.id
      await updateDoc(doc(db,'assignments',id),{submitted:today})
      dispatch(submitAssignmentAction({id:aid,assignmentID:id,students:att,date:today}))
      submit(id)
      showAlert();
      setLoading(false)
    }catch(err){console.log(err);setLoading(false)}
  }
  const handleChange = useCallback((name, value)=>{
    let of = 'r'
    if(name == 'srch'){
      setSrch(value)
    }else if(name == 'srch1'){
      setSrch1(value)
      of = 'a'
    }
    dispatchState({type: SRCH, value,of})
  },[dispatchState])
  function submitAssignment(){
    Alert.alert('Save Submissions?','You won\'t be able to make any change.',[{text:'Cancel'},{text:'Submit',onPress:finalSubmit}])
  }
  function showAlert(){
    Alert.alert('Success!','Data saved successfully',[{text:'Okay',onPress:()=>{navigation.pop(2)}}])
  }
  return (
    <View style={Style.screen}>
      <Header icon="chevron-back-outline" heading={title} fun={()=>navigation.goBack()}/>
      {datePop  && <DateTimePicker
            testID = 'DateTimePicker'
            value={date}
            is24Hour = {false}
            display = 'default'
            onChange={setDateFun}
        />}
        {alert}
      <View style={Style.bodyContainer}>
        <View style={styles.sb_wrap}>
            <StatBox stat={state.total} heading="Total Students"/>
            <StatBox stat={state.added} heading="Submitted"/>
            <StatBox stat={state.remaining} heading="Remaining"/>
        </View>
        <ButtonTabs first='Remaining' second="Submitted" func={()=>{setActive(t=>!t)}}/>
        <View style={{height: height*.72, paddingBottom: 80}}>
        {active ? state.remaining > 0 ? <View><InputField name='srch' label="Search Student" onChangeFun={handleChange} placeholder="Enter Roll No..." value={srch}/><View style={{height: 5}}/><FlatList data={state.remaining_students} keyExtractor={(item, index)=>index.toString()} renderItem = {(item)=>renderStudent(item, 'r')} showsVerticalScrollIndicator={false} overScrollMode='never'/></View> : loading ? <View style={{marginTop:150,alignItems:'center',justifyContent:'center'}}><ActivityIndicator size="large" color={colors.black} /></View>:  <View style={{marginTop:150}}><BigCTA text="Save Submissions" fun={submitAssignment}/></View> : <View><InputField name='srch1' label="Search Student" onChangeFun={handleChange} placeholder="Enter Roll No..." value={srch1}/><View style={{height: 5}}/><FlatList data={state.added_students} keyExtractor={(item, index)=>index.toString()} renderItem = {(item)=>renderStudent(item, 'a')} showsVerticalScrollIndicator={false} overScrollMode='never'/></View>}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    sb_wrap:{flexDirection: 'row', width: '85%', alignSelf: 'center'},
    input_wrap:{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'},
    i_wrap:{width: '43%', margin: 4, paddingVertical: 40}
})
