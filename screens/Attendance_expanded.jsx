import React,{useState, useReducer, useCallback,useEffect} from 'react'
import { View , Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Dimensions } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import colors from '../colors'
import Header from '../components/Header'
import StatBox from '../components/StatBox'
import NotificationBlock from '../components/NotificationBlock'
import Style from '../Style'
import ButtonTabs from '../components/ButtonTabs'
import ButtonCombo from '../components/ButtonCombo'
import BigCTA from '../components/BigCTA'
import { addDoc,collection } from 'firebase/firestore'
import { db } from '../firebase-config/config'
import { useDispatch, useSelector } from 'react-redux'
import { addAttendace } from '../store/actions'
import { setNum } from '../firebase-config/functions'
import { MotiView } from 'moti'

const MARK = 'MARK'
const SORT = 'SORT'
const resultReducer = (state, action)=>{
  switch (action.type){
    case MARK:
        let {id,status} = action
        let {students} = state
        let ind = students.findIndex(e=>e.id == id)
        students[ind].attendance = status
        let rem = students.filter(e=>e.attendance == '').length
        let add = students.filter(e=>e.attendance !== '').length
        return{...state,students,remaining:rem,added:add}
    case SORT:
        id = action.id
        let added_students = state.added_students
        let remaining_students = state.remaining_students
        let st = remaining_students.find(e=>e.id == id)
        rem = remaining_students.filter(e=>e.id !== id)
        add = added_students.concat(st)
        return{...state,remaining_students:rem,added_students:add}
  }
  return state
}
let {height,width} = Dimensions.get('window')
export default function Assignment_expanded(props) {
  const {navigation, route} = props
  const {date,students,iid,id} = route.params
  const [head, setDate] = useState(date)
  const [alert,setAlert] = useState(null)
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
  let dispatch = useDispatch()
  const [state, dispatchState] = useReducer(resultReducer,{
    students:st,
    added_students:[],
    remaining_students:st,
    total:st.length,
    remaining:st.length,
    added:'0'
  })
  function check_list(){
    let l = state.remaining_students.length
    if(l>0){
      let obj = state.remaining_students[0]
      let {id, name, rollNo} = obj
      setAlert(<View style={{flex:1,position:'absolute',top:0,left:0,height:height*1.2,width,backgroundColor:'rgba(0,0,0,.3)',alignItems:'center',justifyContent:'center',zIndex:2}}>
        <MotiView style={{width:width*.8,backgroundColor:colors.white,borderRadius:20,alignItems:'center',justifyContent:'center',minHeight:height*.5,marginTop:-RFValue(100)}} from={{opacity:0,marginRight:-100}} animate={{opacity:1,marginRight:0}} transition={{type:'timing'}}>
          <Text style={{color:colors.lblack,fontSize:RFValue(14),marginBottom:10}}>Roll No</Text>
          <Text style={{color:colors.black,fontSize:RFValue(60),fontFamily:'p6',marginVertical:-20}}>{rollNo}</Text>
          <Text style={{color:colors.black,fontSize:RFValue(20)}}>{name}</Text>
          <View style={{flexDirection:'row',marginTop:RFValue(20)}}>
            <TouchableOpacity activeOpacity={.7} style={{...styles.btn_wrap,backgroundColor:'red'}} onPress={()=>handleClick(id,'absent')}>
              <Text style={styles.btnText}>A</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={.7} style={{...styles.btn_wrap,backgroundColor:'green',marginLeft:5}} onPress={()=>handleClick(id,'present')}>
              <Text style={styles.btnText}>P</Text>
            </TouchableOpacity>
          </View>
        </MotiView>
      </View>)
    }
  }
  const sortData = useCallback((id)=>{
    dispatchState({type:SORT,id})
  },[dispatchState])
  
  const markAttn = useCallback((id, status)=>{
    if(!loading){
      dispatchState({
        type: MARK,
        id,
        status,
      })
    }
  },[dispatchState])
  const handleClick = (id,status)=>{
    setAlert(null)
    sortData(id)
    markAttn(id,status)
  }
  useEffect(()=>{
    check_list()
  },[state])
  useEffect(()=>{
    setAlert(null)
  },[])
  function renderStudent(item){
    let {id, name, rollNo, attendance} = item.item
    return(
        <View style={styles.student_card}>
            <Text style={styles.rollNo}>{rollNo}</Text>
            <Text style={styles.name}>{name}</Text>
            <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between'}}>
                <TouchableOpacity onPress={()=>{loading ? null : markAttn(id,'absent')}} style={{...styles.statusBtn,backgroundColor:attendance == 'absent'?'red' : '#bbb',borderTopRightRadius:15}} activeOpacity={.7}><Text style={styles.btnTxt}>A</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>{loading ? null : markAttn(id,'present')}} style={{...styles.statusBtn,backgroundColor:attendance == 'present'?'green' : '#bbb',borderTopLeftRadius:15}} activeOpacity={.7}><Text style={styles.btnTxt}>P</Text></TouchableOpacity>
            </View>
        </View>
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
      {alert}
      {state.remaining == '0' && <MotiView from={{opacity:0,bottom:-100}} animate={{opacity:1,bottom:0}} transition={{type:'timing'}} style={{position:'absolute',bottom:0,left:0,zIndex:3,paddingVertical:10,backgroundColor:colors.white,width,height:height*.15,borderTopColor:'#eee',borderTopWidth:1,borderRadius:RFValue(20),alignItems:'center',justifyContent:'center'}}>{loading ? <ActivityIndicator color={colors.black} size="large"/>: <BigCTA text="Submit Attendance" fun={submitAttendance}/>}</MotiView>}
      <Header icon="chevron-back-outline" heading={setNum(head)} fun={()=>navigation.goBack()}/>
      <View style={Style.bodyContainer}>
        <View style={styles.sb_wrap}>
            <StatBox stat={state.total} heading="Total Students"/>
            <StatBox stat={state.added} heading="Marked"/>
            <StatBox stat={state.remaining} heading="Remaining"/>
        </View>
        <View style={{paddingBottom: 80,maxHeight:height*.95,marginTop:15}}>
            {state.remaining == '0' && <FlatList data={state.students} renderItem={renderStudent} keyExtractor={(item,index)=>index.toString()} showsVerticalScrollIndicator={false} overScrollMode='never' numColumns={3}/>}
            {state.added == '0' && <View style={{marginTop:150}}><BigCTA text="Start Marking" fun={()=>check_list()}/></View>}
            {state.remaining == '0' && <View style={{height:RFValue(100)}}/>}
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
    btnT:{textAlign: 'center'},
    student_card:{backgroundColor:colors.white,borderRadius:15,width:'31.7%',alignItems:'center',justifyContent:'center',margin:3,paddingTop:20,overflow:'hidden',marginBottom:10},
    rollNo:{fontFamily:'p6',fontSize:RFValue(25)},
    statusBtn:{width:'49%',paddingVertical:10},
    btnTxt:{textAlign:'center',fontFamily:'p6',fontSize:RFValue(14),color:colors.white},
    name:{fontSize:RFValue(12),marginBottom:15,color:colors.lblack},
    btn_wrap:{paddingVertical:10,paddingHorizontal:40,borderRadius:20,alignItems:'center',justifyContent:'center'},
    btnText:{fontFamily:'p6',fontSize:RFValue(20),color:colors.white}
})
