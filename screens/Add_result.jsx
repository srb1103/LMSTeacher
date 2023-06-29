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
import BigCTA from '../components/BigCTA'
import { updateDoc,doc } from 'firebase/firestore'
import { db } from '../firebase-config/config'
import { useDispatch, useSelector } from 'react-redux'
import InputField from '../components/InputField'
import { addResultData } from '../store/actions'

const UPDATE_STUDENT = 'UPDATE_STUDENT'
const SRCH = 'SRCH'
const NUMBER = 'NUMBER'

const resultReducer = (state, action)=>{
  switch (action.type){
    case UPDATE_STUDENT:
      let {id,status} = action;
      let marks = state.marks
      let r = state.remaining_students
      let a = state.added_students
      let st = status == 'a' ? a.find(e=>e.id == id) : r.find(e=>e.id == id)
      let ind = status == 'a' ? a.findIndex(e=>e.id == id) : r.findIndex(e=>e.id == id)
      st.marks = marks ? marks : 'absent'
      status == 'a'?a[ind].marks = marks ? marks : 'absent' : r[ind].marks = marks ? marks : 'absent'
      let ad = state.added
      let rm = state.remaining
      if(status == 'r'){
        ad = state.added + 1
        rm = state.remaining - 1
        r = r.filter(e=>e.id !== id)
        a = a.concat(st)
      }
      return{
        ...state,
        remaining_students: r,
        added_students: a,
        rem_b: r,
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
    case NUMBER:
      let val = action.val
      return{...state,marks:val}
  }
  return state
}
let {height} = Dimensions.get('window')
export default function Add_result(props) {
  const {navigation, route} = props
  const {id,det,students,submit} = route.params
  let {title,marksType,maxMarks} = det
  const [active, setActive] = useState(true)
  const [alert, setAlert] = useState(null)
  const [student, setStudent] = useState({name: null, roll: null, id: null})
  const [loading,setLoading] = useState(false)
  let label = marksType == 'cgpa' ? `CGPA out of ${maxMarks}` : `Marks out of ${maxMarks}`
  let [srch,setSrch] = useState(null)
  let [srch1,setSrch1] = useState(null)
  let st_data = []
  students.forEach(s=>{
    let obj = {id:s.id,rollNo:s.rollNo,name:s.name,marks:''}
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
    marks:''
  })
  const updateStatus = useCallback((id,status)=>{
      dispatchState({
        type: UPDATE_STUDENT,
        id,status
      })
      
  },[dispatchState])
  
  const save = (id,status)=>{
    setAlert(null)
    updateStatus(id,status)
    updateMarks('marks',"")
  }
  const hideAlert = ()=>{
    setAlert(null)
  }
  const showAl = (id, rollNo, name,marks,status)=>{
    setStudent({id, roll: rollNo, name})
    loadAlert(rollNo, name, id,marks,status)
  }
  const updateMarks = useCallback((name,val)=>{
    dispatchState({type:NUMBER,val})
  },[dispatchState])
  const loadAlert = (roll, name, id,mr,status)=>{
    setAlert(<Alert1 text={roll} heading={name} overflow={true} css={{maxHeight: '40%'}}><View style={{padding: 10}}/><InputField name='marks' label={label} onChangeFun={updateMarks} placeholder={`Enter ${label}`} val={mr == 'absent' ? "" : mr} keyboard='number-pad' max={maxMarks}/><Text style={{fontSize:10,color:'grey',marginLeft:2}}>Note: Leave blank, if student was absent.</Text><View style={{padding: 10}}/><ButtonCombo text1='Cancel' text2='Save' fun1={hideAlert} fun2={()=>save(id,status)}/></Alert1>)
  }
  function renderStudent(item,status){
    let {id, name, rollNo, marks} = item.item
    let txt = `Roll No: ${rollNo}`
    if(status == 'a'){
      txt = marks !== 'absent' ? `Roll No: ${rollNo}, Marks: ${marks}` : `Roll No: ${rollNo}, Absent`
    }
    return(
        <NotificationBlock head={name} text={txt} fun={()=>{showAl(id, rollNo, name, marks,status)}}/>
    )
  }
  const dispatch = useDispatch()
  const finalSubmit = async()=>{
    setLoading(true)
    let att = JSON.stringify(state.added_students)
    let dt = new Date()
    let today = `${dt.getDate()}-${dt.getMonth()+1}-${dt.getFullYear()}`
    try{
      await updateDoc(doc(db,'results',id),{
        result:att,date:today
      })
      dispatch(addResultData({id,result:att,date:today}))
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
    Alert.alert('Save Result?','Students whose results have not been added will be marked absent and you won\'t be able to make any change.',[{text:'Cancel',style:'cancel'},{text:'Submit',onPress:finalSubmit}])
  }
  function showAlert(){
    Alert.alert('Success!','Data saved successfully',[{text:'Okay',onPress:()=>{navigation.pop(2)}}])
  }
  return (
    <View style={Style.screen}>
      <Header icon="chevron-back-outline" heading={title} fun={()=>navigation.goBack()}/>
      {alert}
      <View style={Style.bodyContainer}>
        <View style={styles.sb_wrap}>
            <StatBox stat={state.total} heading="Total Students"/>
            <StatBox stat={state.added} heading="Added"/>
            <StatBox stat={state.remaining} heading="Remaining"/>
        </View>
        <ButtonTabs first='Remaining' second="Added" func={()=>{setActive(t=>!t)}}/>
        <View style={{height: height*.85, paddingBottom: 180}}>
        {active ? state.remaining > 0 ? <View><InputField name='srch' label="Search Student" onChangeFun={handleChange} placeholder="Enter Roll No..." value={srch}/><View style={{height: 5}}/><FlatList data={state.remaining_students} keyExtractor={(item, index)=>index.toString()} renderItem = {(item)=>renderStudent(item, 'r')} showsVerticalScrollIndicator={false} overScrollMode='never'/></View> : loading ? <View style={{marginTop:150,alignItems:'center',justifyContent:'center'}}><ActivityIndicator size="large" color={colors.black} /></View>:  <View style={{marginTop:150}}><BigCTA text="Save Result" fun={submitAssignment}/></View> : <View><InputField name='srch1' label="Search Student" onChangeFun={handleChange} placeholder="Enter Roll No..." value={srch1}/><View style={{height: 5}}/><FlatList data={state.added_students} keyExtractor={(item, index)=>index.toString()} renderItem = {(item)=>renderStudent(item, 'a')} showsVerticalScrollIndicator={false} overScrollMode='never'/></View>}
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
