import React, { useCallback, useReducer,useState } from 'react'
import {View,Alert,ScrollView, ActivityIndicator} from 'react-native'
import { useSelector } from 'react-redux'
import Header from '../components/Header'
import Style from '../Style'
import ButtonCombo from '../components/ButtonCombo'
import colors from '../colors'
import { doc,updateDoc } from 'firebase/firestore'
import { db } from '../firebase-config/config'
import { fetch_data } from '../firebase-config/functions'
import InputField from '../components/InputField'


const UPDATE = 'UPDATE'
const formReducer = (state,action)=>{
    switch (action.type){
        case UPDATE:
            let {name,value} = action
            return{...state,[name]:value}
    }
    return state
}
export default function Change_password(props){
    let {navigation} = props
    let u = useSelector(state=>state.user)
    const [loading,setLoading] = useState(false)
    let id = u.user.id
    const [state,dispatchState] = useReducer(formReducer,{
        old:'',
        newP:''
    })
    const handleChange = useCallback((name,value)=>{
        dispatchState({type:UPDATE,name,value})
    },[dispatchState])
    const handleSubmit = async()=>{
        let {old,newP} = state
        if(!old||!newP){Alert.alert('Error','Please enter old and new passwords',[{text:'Okay'}]); return}
        if(old && newP){
            setLoading(true)
            try{
                let t = await fetch_data('teachers')
                let arr = t.find(e=>e.id == id)
                let pas = arr.password
                if(old == pas){
                    await updateDoc(doc(db,'teachers',id),{password:newP})
                    Alert.alert('Success','Your password has been changed.',[{text:'Okay'}])
                    setTimeout(()=>{
                        navigation.goBack()
                    },2000)
                }else{
                    Alert.alert('Error','Current password does not match.',[{text:'Okay'}])
                    setLoading(false)
                }
            }catch(err){console.log(err);setLoading(false)}
        }
    }
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading="Change Password" fun={()=>navigation.goBack()}/>
            <ScrollView style={{...Style.bodyContainer, padding: 25}} showsVerticalScrollIndicator={false} overScrollMode='never'>
                <InputField val='' placeholder='Enter Current Password' label='Current Password' name='old' password onChangeFun={handleChange} iseye/>
                <InputField val='' placeholder='Enter New Password' label='New Password' name='newP' password onChangeFun={handleChange} iseye/>
                <View style={{height: 20}}/>
                {loading ? <ActivityIndicator size='large' color={colors.black}/>: <ButtonCombo text1='Cancel' text2='Change' fun1={()=>{navigation.goBack()}} fun2={handleSubmit}/>}
                <View style={{height: 40}}/>
            </ScrollView>
        </View>
    )
}