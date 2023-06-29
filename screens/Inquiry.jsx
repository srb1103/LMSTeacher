import React,{useCallback,useReducer,useState} from 'react'
import {View,Text,StyleSheet,Alert,ActivityIndicator} from 'react-native'
import Header from '../components/Header'
import Style from '../Style'
import colors from '../colors'
import InputField from "../components/InputField"
import ButtonCombo from '../components/ButtonCombo'
import { RFValue } from 'react-native-responsive-fontsize'
import {useSelector,useDispatch} from 'react-redux'
import { updateDoc,doc } from 'firebase/firestore'
import { db } from '../firebase-config/config'
import { respondInquiry } from '../store/actions'

const UPDATE = 'UPDATE'
const reducer = (state,action)=>{
    switch(action.type){
        case UPDATE:
            let note = action.note
            return {...state,note}
    }
    return state
}

export default function Inquiry(props){
    let {navigation,route} = props
    let u = useSelector(state=>state.user)
    const [loading,setLoading] = useState(false)
    let {inquiries,students,subjects,classes} = u
    let t = u.user.id
    let teacher_name = u.user.name
    let {id,fun} = route.params
    let inq = inquiries.find(e=>e.id == id)
    let {title,date,status,subjectID,inquiry,studentID,response} = inq
    let student = students.find(e=>e.id == studentID)
    let {pushToken,classId,rollNo,name} = student
    let studentName = name
    let subjectName = subjects.find(e=>e.id == subjectID).name
    let className = classes.find(e=>e.id == classId).name
    let [state,dispatchState] = useReducer(reducer,{
        note:''
    })
    let dispatch = useDispatch()
    const sendNotif = async(message)=>{
        await fetch('https://exp.host/--/api/v2/push/send',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: pushToken,
                title: `Reply of ${title} from ${teacher_name}`,
                body: `${message}`,
                data:{type:'query_response',nav:"inq",screen:'inquiry',data:{id,title,message}}
            }),
        })
    }
    const sendResponse = async(note)=>{
        setLoading(true)
        try{
            sendNotif(note).then(()=>{
                updateDoc(doc(db,'inquiries',id),{status:'responded',response:note,sender:t}).then(()=>{
                    dispatch(respondInquiry(id,note))
                    setLoading(false)
                }).catch(err=>console.log(err))
            }).catch(err=>console.log(err))
        }catch(err){console.log(err);setLoading(false)}
    }
    
    const changeFun = useCallback((name,value)=>{
        dispatchState({type:UPDATE,note:value})
    },[dispatchState])
    const handleSave = ()=>{
        let {note} = state
        if(note){
            sendResponse(note).then(()=>{
                if(fun){
                    fun(id,note)
                }
                navigation.goBack()
            })
        }else{
            Alert.alert('Error','Response is required',[{text:'Okay'}])
        }
    }
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading={title} fun={()=>navigation.goBack()}/>
            <View style={Style.bodyContainer}>
                <View style={Style.det_wrap}>
                    <Text style={{color: colors.black, fontSize: RFValue(15), fontFamily: 'p6', marginBottom: -4,lineHeight:RFValue(18),width:'85%'}}>{inquiry}</Text>
                    <View style={{height:50}}/>
                    <Text style={Style.ovrvw}>{`${studentName}`}</Text>
                    <Text style={{...styles.overview,color:colors.black}}><Text style={{color: colors.lblack}}>Subject: </Text>{subjectName}</Text>
                    <Text style={styles.overview}><Text style={{color: colors.lblack}}>{`${className} (Roll no: ${rollNo})`}</Text></Text>
                    <Text style={styles.overview}><Text style={{color: colors.lblack}}>{date}</Text></Text>
                {response !== "" && <View style={{marginTop:40}}><Text style={{color: colors.black, fontSize: RFValue(15), fontFamily: 'p6', marginBottom: -4,lineHeight:RFValue(18)}}>"{response}"</Text></View>}
                </View>
                {status == 'pending' && 
                    <View style={{marginTop:-15}}>
                        <InputField val={state.note} name="note" multiline={true} onChangeFun={changeFun} nol={8} placeholder="Write response..."/>
                        {loading ? 
                        <ActivityIndicator size="large" color={colors.black}/>:
                        <ButtonCombo text1='Cancel' text2='Send Response' fun1={()=>{navigation.goBack()}} fun2={handleSave}/>}
                    </View>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    overview:{color:colors.lblack,fontSize:RFValue(12)}
})