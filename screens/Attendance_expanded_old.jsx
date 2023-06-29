import React,{useState, useReducer, useCallback} from 'react'
import { View , Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Dimensions } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import colors from '../colors'
import Header from '../components/Header'
import StatBox from '../components/StatBox'
import NotificationBlock from '../components/NotificationBlock'
import Style from '../Style'
import ButtonTabs from '../components/ButtonTabs'
import Alertt from '../components/Alert'
import ButtonCombo from '../components/ButtonCombo'
import RadioButtonRN from 'radio-buttons-react-native'
import BigCTA from '../components/BigCTA'
import { addDoc,collection } from 'firebase/firestore'
import { db } from '../firebase-config/config'
import { useDispatch, useSelector } from 'react-redux'
import { addAttendace } from '../store/actions'

const MARK = 'MARK'
const ATTN = 'ATTN'

const resultReducer = (state, action)=>{
  switch (action.type){
    case MARK:
      let {id, attendance, status} = action;
      let not_marked = state.remaining_students
      let marked = state.added_students
      let obj = null
      if(status == 'm'){
        obj = marked.findIndex(e=>e.id == id)
        marked[obj].attendance = attendance
      }else if(status == 'r'){
        obj = not_marked.findIndex(e=>e.id == id)
        not_marked[obj].attendance = attendance
      }
      return{
        ...state,
        remaining_students: not_marked,
        added_students: marked,
      }
      
    case ATTN:
      const {sid} = action
      let adn = state.added + 1
      let rmn = state.remaining - 1
      let add = state.added_students
      let pen = state.remaining_students
      let st_arr = pen.filter(p=>p.id == sid)
      pen = pen.filter(p=>p.id !== sid)
      let st_obj = st_arr[0]
      // st_obj.attendance = stt
      add = add.concat(st_obj)
      return{
        remaining_students: pen,
        added_students: add,
        added: adn,
        remaining:rmn,
        total: adn+rmn
      }
  }
  return state
}
let {height} = Dimensions.get('window')
export default function Assignment_expanded(props) {
  const {navigation, route} = props
  const {date,students,iid,id} = route.params
  const [head, setDate] = useState(date)
  const [loading,setLoading] = useState(false)
  let u = useSelector(state=>state.user)
  let sesID = u.session.id
  if(head == null){
    let nd = new Date();
    setDate(`${nd.getDate()}-${nd.getMonth()+1}-${nd.getFullYear()}`)
  }
  let st = [];
  students.forEach(s=>{
    st.push({id:s.id,rollNo:s.rollNo,attendance:'',name:s.name})
  })
  const [active, setActive] = useState(true)
  const [alert, setAlert] = useState(null)
  const remaining_students = st
  const added_students = []
  const options = [
    {label: 'Absent', value:'absent'},
    {label: 'Present', value:'present'},
  ]
  let dispatch = useDispatch()
  const [state, dispatchState] = useReducer(resultReducer,{
    remaining_students: remaining_students,
    added_students: added_students,
    total: remaining_students.length + added_students.length,
    added: added_students.length,
    remaining: remaining_students.length,
  })
  const save = useCallback((id, st)=>{
    if(st == 'r'){
      dispatchState({
        type: ATTN,
        sid: id,
      })
    }else{
      console.log('do something.')
    }
      
    setAlert(null);

  },[dispatchState])
  const hideAlert = ()=>{
    setAlert(null)
  }
  const updateAtt = useCallback((e, id, status)=>{
    dispatchState({
      type: MARK,
      id,
      status,
      attendance: e
    })
  })
  const loadAlert = (id, roll, name, status, attendance)=>{
    let initial = 2
    if(attendance !== ''){
      attendance == 'absent' ? initial = 1 : initial = 2
    }
    setAlert(<Alertt text={roll} heading={name} overflow={true} css={{maxHeight: '48%'}}><View style={{padding: 10}}></View><RadioButtonRN 
      data={options} 
      selectedBtn={(e) => updateAtt(e.value, id, status)} 
      initial={initial} 
      activeColor={colors.black}
  /><View style={{padding: 17}}></View><ButtonCombo text1='Cancel' text2='Save' fun1={hideAlert} fun2={()=>save(id, status)}/></Alertt>)
  }
  function renderStudent(item, status){
    let {id, name, rollNo, attendance} = item.item
    return(
        <NotificationBlock head={name} text={`Roll No: ${rollNo}`} fun={()=>{loadAlert(id, rollNo, name, status, attendance)}}/>
    )
  }
  const finalSubmit = async()=>{
    let att = JSON.stringify(state.added_students)
    setLoading(true)
    try{
      await addDoc(collection(db,'attendance'),{
        instituteID:iid,classID:id,attendance:att,date:head,session:sesID
      })
      dispatch(addAttendace(id,att,head))
      showAlert();
      setLoading(false)
    }catch(err){console.log(err);setLoading(false)}
  }
  function submitAttendance(){
    Alert.alert('Submit Attendance?','You won\'t be able to make any change.',[{text:'Cancel'},{text:'Submit',onPress:finalSubmit}])
  }
  function showAlert(){
    Alert.alert('Success!','Attendance submitted successfully',[{text:'Okay',onPress:()=>{navigation.goBack()}}])
  }
  return (
    <View style={Style.screen}>
      <Header icon="chevron-back-outline" heading={head} fun={()=>navigation.goBack()}/>
      
        {alert}
      <View style={Style.bodyContainer}>
        <View style={styles.sb_wrap}>
            <StatBox stat={state.total} heading="Total Students"/>
            <StatBox stat={state.added} heading="Marked"/>
            <StatBox stat={state.remaining} heading="Remaining"/>
        </View>
        
        <ButtonTabs first='Remaining' second="Marked" func={()=>{setActive(t=>!t)}}/>
        <View style={{paddingBottom: 80,maxHeight:height*.6,marginBottom:25}}>
        {active ? state.remaining > 0 ? <FlatList data={state.remaining_students} keyExtractor={(item, index)=>index.toString()} renderItem = {(item)=>renderStudent(item, 'r')} showsVerticalScrollIndicator={false} overScrollMode='never'/> : loading ? <View style={{marginTop:150,alignItems:'center',justifyContent:'center'}}><ActivityIndicator size="large" color={colors.black} /></View>:  <View style={{marginTop:150}}><BigCTA text="Submit Attendance" fun={submitAttendance}/></View> : <FlatList data={state.added_students} keyExtractor={(item, index)=>index.toString()} renderItem = {(item)=>renderStudent(item, 'm')} showsVerticalScrollIndicator={false} overScrollMode='never'/>}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    sb_wrap:{flexDirection: 'row', width: '85%', alignSelf: 'center'},
    input_wrap:{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'},
    i_wrap:{width: '43%', margin: 4, paddingVertical: 40},
    checkBoxWrap:{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 3, backgroundColor: colors.white, borderRadius: 10},
    btn_out:{paddingVertical: 10, width: '50%'},
    btnT:{textAlign: 'center'}
})
