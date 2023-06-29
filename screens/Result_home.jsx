import React,{useEffect, useReducer, useState} from 'react'
import { View , Text, StyleSheet, FlatList, ActivityIndicator, Dimensions, TouchableOpacity} from 'react-native'
import colors from '../colors'
import Header from '../components/Header'
import NotificationBlock from '../components/NotificationBlock'
import Style from '../Style'
import ButtonTabs from '../components/ButtonTabs'
import { Button1 } from '../components/Button'
import CTABtn from '../components/CTABtn'
import { useDispatch, useSelector } from 'react-redux'
import {addDoc,updateDoc,doc,collection, deleteDoc} from 'firebase/firestore'
import { useCallback } from 'react'
import { db } from '../firebase-config/config'
import { addExam, removeExam } from '../store/actions'
import { setNum,makeDate } from '../firebase-config/functions'
import { RFValue } from 'react-native-responsive-fontsize'

let {height} = Dimensions.get('window')

const ADD = 'ADD'
const UPDATE = 'UPDATE'
const DELETE = 'DELETE'
const SUBMIT = 'SUBMIT'
const SET = 'SET'
const stateReducer = (state,action)=>{
  switch(action.type){
    case ADD:
      let data = action.data
      let c = state.current_exam.concat(data)
      c.sort(function(a,b){
        let d1 = a.examDate
        let d2 = b.examDate
        d1 = makeDate(d1)
        d2 = makeDate(d2)
        return d2 - d1;
      })
      return{...state,current_exam:c}
    case DELETE:
      let id = action.id
      c = state.current_exam.filter(e=>e.id !== id)
      return{...state,current_exam:c}
    case UPDATE:
      id = action.data.id
      let {title,type,marksType,maxMarks,examDate,subjectID} = action.data
      c = state.current_exam
      let ind = c.findIndex(e=>e.id == id)
      c[ind].title = title
      c[ind].type = type
      c[ind].marksType = marksType
      c[ind].maxMarks = maxMarks
      c[ind].examDate = examDate
      c[ind].subjectID = subjectID
      return{...state,current_exam:c}
    case SUBMIT:
      id = action.id
      c = state.current_exam
      let ex = c.find(e=>e.id == id)
      c = c.filter(e=>e.id !== id)
      let p = state.prev_exam.concat(ex)
      return{...state,current_exam:c,prev_exam:p}
    case SET:
      let {name,value} = action
      return {...state,[name]:value}
  }
  return state
}
export default function Result_home(props) {
  const {navigation, route} = props
  const {class_id, class_name} = route.params
  const [active, setActive] = useState(true)
  const [loading,setLoading] = useState(false)
  let user = useSelector(state=>state.user)
  let iid = user.user.iid
  let sesID = user.session.id
  let results = user.result
  let {subjects} = user
  results.sort(function(a,b){
    let d1 = a.examDate
    let d2 = b.examDate
    d1 = makeDate(d1)
    d2 = makeDate(d2)
    return d2 - d1;
  })
  let subject_options = []
  subjects.forEach(s=>{
    let sID = s.id
    let ind = subject_options.findIndex(a=>a.id == sID)
    if(ind == -1){
      let cls = s.class_id
      let i1 = cls.findIndex(e=>e == class_id)
      if(i1>-1){
        let obj = {key:s.id,value:s.title}
        subject_options.push(obj)
      }
    }
  })
  let dispatch = useDispatch()
  const [state,dispatchState] = useReducer(stateReducer,{
    current_exam:results.filter(e=>e.result == null),
    prev_exam:results.filter(e=>e.result !== null),
    filtered_tests:[],test_type:'class_test'
  })
  let handleSet = useCallback((name,value)=>{
    dispatchState({type:SET,name,value})
  },[dispatchState])
  function renderExam(item,status){
    let exam = item.item
    const {title, examDate, subjectID} = exam
    let s = subjects.find(e=>e.id === subjectID)
    let subject_name = s ? s.title : ''

    return(
      <NotificationBlock head={title} text={`Date: ${setNum(examDate)}`} text2={`Subject: ${subject_name}`} fun={()=>{navigation.navigate('exam_detail',{exam,status,subject_options,fun:{remove,update,submit}})}}/>
    )
  }
  const submit = useCallback(id=>{
    dispatchState({type:SUBMIT,id})
  },[dispatchState])
  const update = useCallback(obj=>{
    let data = obj.data
    dispatchState({type:UPDATE,data})
  },[dispatchState])
  const remove = useCallback(async id=>{
    setLoading(true)
    try{
      await deleteDoc(doc(db,'results',id))
      dispatch(removeExam(id))
      dispatchState({type:DELETE,id})
      setLoading(false)
    }catch(err){console.log(err);setLoading(false)}
  },[dispatchState])
  let addNewExam = useCallback(async data=>{
    setLoading(true)
    let dt = data
    let send_data = {...dt,result:null,instituteID:iid,session:sesID}
    try{
      let res = await addDoc(collection(db,'results'),send_data)
      let id = res.id
      let data = {...dt,id}
      dispatch(addExam(data))
      dispatchState({type:ADD,data})
      setLoading(false)
    }catch(err){console.log(err);setLoading(false)}
  },[dispatchState])
  const examTypes = [
    {key:'class_test',value:'Class Test'},
    {key:'house_test',value:'House Test'},
    {key:'mid_term',value:'Mid Term'},
    {key:'term_end',value:'Term End'},
  ]
  function renderTest(test){
    let {item} = test
    let {key,value} = item
    let {test_type} = state
    return <TouchableOpacity activeOpacity={.5} onPress={()=>handleSet('test_type',key)} style={{...styles.chip,backgroundColor:test_type == key ? colors.black : colors.white}}><Text style={{...styles.chip_text,color:test_type == key ? colors.white : colors.black}}>{value}</Text></TouchableOpacity>
  }
  return (
    <View style={Style.screen}>
      <Header icon="chevron-back-outline" heading={class_name} fun={()=>navigation.goBack()}/>
      {loading ? <View style={Style.ai_screen}><ActivityIndicator size="large" color={colors.black}/></View>: <View style={Style.bodyContainer}>
        <ButtonTabs first='Current' second="Previous" func={()=>setActive(tab=>!tab)}/>
        <View style={{maxHeight:height*.82}}>
        {active ? <FlatList data={state.current_exam} keyExtractor={(item, index)=>index.toString()} renderItem = {(item)=>renderExam(item, 'c')} showsVerticalScrollIndicator={false} overScrollMode='never'/> : <>
        <FlatList data={examTypes} horizontal showsHorizontalScrollIndicator={false} overScrollMode='never' renderItem={renderTest} keyExtractor={(item,index)=>index.toString()}/><View style={{height:20}}/>
        <FlatList data={state.prev_exam.filter(e=>e.type == state.test_type)} keyExtractor={(item, index)=>index.toString()} renderItem = {(item)=>renderExam(item, 'p')} showsVerticalScrollIndicator={false} overScrollMode='never'/></>}
        </View>
      </View>}
      {!loading && active && state.current_exam.length == 0 && <View style={Style.ai_screen}><Text style={Style.label}>You haven't created any exam.</Text><Button1 text="Create Exam" fun={()=>{navigation.navigate('add_exam',{mode:'add',subject_options,fun:addNewExam})}}/></View>}
      {!loading && state.current_exam.length > 0 && active && <CTABtn icon='add' fun={()=>{navigation.navigate('add_exam',{mode:'add',subject_options,fun:addNewExam})}}/>}
    </View>
  )
}

const styles = StyleSheet.create({
  chip:{color:colors.black,backgroundColor:colors.white,paddingVertical:RFValue(6),paddingHorizontal:RFValue(15),borderRadius:10,marginLeft:5},
  chip_text:{color:colors.white,fontFamily:'p5'}
})
