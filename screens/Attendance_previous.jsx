import React,{useState, useReducer, useCallback} from 'react'
import { View , Text, StyleSheet, FlatList, Dimensions } from 'react-native'
import colors from '../colors'
import Header from '../components/Header'
import StatBox from '../components/StatBox'
import NotificationBlock from '../components/NotificationBlock'
import Style from '../Style'
import ButtonTabs from '../components/ButtonTabs'
import InputField from '../components/InputField'
import { useEffect } from 'react'
import { setNum } from '../firebase-config/functions'

const FILTER = 'FILTER'
let {height}= Dimensions.get('window')
const resultReducer = (state, action)=>{
    switch (action.type){
      case FILTER:
        let {value,a,p,of} = action
        if(!value){
          return{...state,absent_students:a,present_students:p}
        }
        let pr = p
        let ac = a
        if(of == 'p' && value){
          pr = state.present_students.filter(el=>{
            return el.name.match(value)
        })
        }
        if(of == 'a' && value){
          ac = state.absent_students.filter(el=>{
            return el.name.match(value)
        })
        }
        return {...state,absent_students:ac,present_students:pr}
    }
    return state
}

export default function Assignment_previous(props) {
  const {navigation, route} = props
  const {date,res} = route.params
  const [head, setDate] = useState(date)
  const [active, setActive] = useState(true)
  let [srch,setSrch] = useState(null)
  let [srch1,setSrch1] = useState(null)
  let attn = JSON.parse(res.attendance)
  const absent_students = attn.filter(e=>e.attendance == 'absent')
  const present_students = attn.filter(e=>e.attendance == 'present')
  const [state, dispatchState] = useReducer(resultReducer,{
    absent_students: absent_students,
    present_students: present_students,
    total: absent_students.length + present_students.length,
    present: present_students.length,
    absent: absent_students.length,
  })
  
  function renderStudent(item){
    let {name, rollNo} = item.item
    return(
        <NotificationBlock head={name} text={`Roll No: ${rollNo}`}/>
    )
  }
  const handleChange = useCallback((name, value)=>{
    let of = 'p'
    if(name == 'srch'){
      setSrch(value)
    }else if(name == 'srch1'){
      setSrch1(value)
      of = 'a'
    }
    dispatchState({type: FILTER, value,a:absent_students,p:present_students,of})
  },[dispatchState])
  
  return (
    <View style={Style.screen}>
      <Header icon="chevron-back-outline" heading={setNum(head)} fun={()=>navigation.goBack()}/>
      <View style={Style.bodyContainer}>
        <View style={styles.sb_wrap}>
            <StatBox stat={state.total} heading="Total Students"/>
            <StatBox stat={state.present} heading="Present"/>
            <StatBox stat={state.absent} heading="Absent"/>
        </View>
        <ButtonTabs first='Present' second="Absent" func={()=>{setActive(t=>!t)}}/>
        <View style={{height: height*.72, paddingBottom: 80}}>
        {active ? <View><InputField name='srch' label="Search Present Student" onChangeFun={handleChange} placeholder="Enter Name..." value={srch}/><View style={{height: 5}}/><FlatList data={state.present_students} keyExtractor={(item, index)=>index.toString()} renderItem = {(item)=>renderStudent(item)} showsVerticalScrollIndicator={false} overScrollMode='never'/></View> :  <View><InputField name='srch1' label="Search Absent Student" onChangeFun={handleChange} placeholder="Enter Name..." value={srch1}/><View style={{height: 5}}/><FlatList data={state.absent_students} keyExtractor={(item, index)=>index.toString()} renderItem = {(item)=>renderStudent(item)} showsVerticalScrollIndicator={false} overScrollMode='never'/></View>}
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
