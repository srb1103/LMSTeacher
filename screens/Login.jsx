import React, { useCallback, useReducer, useState } from 'react'
import {View, Text, StyleSheet, Dimensions, Alert, Image, StatusBar, ActivityIndicator, ScrollView} from 'react-native'
import colors from '../colors'
import InputField from '../components/InputField'
import {RFValue} from 'react-native-responsive-fontsize'
import Button from '../components/Button'
import { fetch_data } from '../firebase-config/functions'
const {height} = Dimensions.get('window')
import { setTeacher } from '../helpers/sql'
import { useDispatch } from 'react-redux'
import { setUID } from '../store/actions'
const stateReducer = (state, action)=>{
    return{
        ...state, [action.name]:action.text
    }
}
export default function Login() {
    const [state, dispatchState] = useReducer(stateReducer,{
        username: '',
        password: ''
    })
    const [loading,setLoading] = useState(false)
    let dispatch = useDispatch()
    const addItem = useCallback((name, text)=>{
        dispatchState({
            name,
            text
        })
    },[dispatchState])
    function submitForm(){
        let{username,password} = state
        if(!username || !password){
            Alert.alert('Error',`Please enter your username and password`,[{text:'Okay'}])
            return
        }else{
            login()
        }
        
    }
    const login = async ()=>{
        setLoading(true)
        try{
            let allteachers = await fetch_data('teachers');
            let inst = await fetch_data('institutions');
            let{username,password} = state
            let teacher = allteachers.find(e=>(e.email == username))
            if(teacher){
                if(password == teacher.password){
                    let i = inst.find(e=>e.iid == teacher.instituteID)
                    let iname = i.Name
                    await setTeacher({...teacher,iname})
                    dispatch(setUID(teacher.id))
                }else{
                    Alert.alert('Error','Password incorrect. Please enter valid password',[{text:'Okay'}])
                    setLoading(false)
                }
            }else{
                Alert.alert('Error','Username not found.',[{text:'Okay'}])
                setLoading(false)
            }
        }catch(err){
            console.warn(err)
        }
    }
 
  return (
    <ScrollView style={styles.screen}>
        <StatusBar hidden={false} backgroundColor={colors.black}/>
        <View style={styles.top}>
            <Image source={require('../assets/icon.png')} style={styles.logo}/>
            <Text style={styles.emezy}>emezy</Text>
        </View>
        <View style={styles.main_view}>
            <Text style={styles.form_head}>Login</Text>
            <InputField val='' placeholder='Enter Username' label='Username' name='username' onChangeFun={addItem}/>
            <InputField val='' placeholder='Enter Password' label='Password' name='password' password onChangeFun={addItem} iseye/>
            {/* <TouchableOpacity activeOpacity={.5} onPress={()=>{}}><Text style={styles.fp_link}>forgot password?</Text></TouchableOpacity> */}
            <View style={{height:50}}/>
            {loading ? <ActivityIndicator size="large" color={colors.black}/>:<Button text='Login' fun={submitForm}/>}
        </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    screen:{flex: 1, backgroundColor: colors.black},
    top:{height: height * .4, alignItems:'center', justifyContent:'center'},
    main_view:{backgroundColor: colors.white, padding: 35, borderTopLeftRadius: 40, borderTopRightRadius: 40, flex: 1, marginTop: -60, height: height * .8},
    topHead:{fontSize: RFValue(35), color: colors.white, fontFamily: 'p6'},
    form_head:{fontSize: RFValue(20), color:colors.black, fontFamily: 'p5', marginBottom: 20, textAlign: 'center'},
    fp_link:{marginTop: 10, textAlign: 'right', color: colors.black, fontSize: RFValue(15), marginBottom: 40},
    logo:{height:RFValue(90),width:RFValue(90),borderRadius:15},
    emezy:{color:colors.white,fontFamily:'p6',fontSize:RFValue(15),marginTop:5}
})
