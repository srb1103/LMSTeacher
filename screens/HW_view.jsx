import React, {useCallback, useReducer,useState} from 'react'
import {View,StyleSheet,Text,TouchableOpacity,Alert, ActivityIndicator} from 'react-native'
import Header from '../components/Header'
import colors from '../colors'
import Style from '../Style'
import { RFValue } from 'react-native-responsive-fontsize'
import { deleteDoc,doc } from 'firebase/firestore'
import { db } from '../firebase-config/config'
import { removeHWAction } from '../store/actions'
import { useDispatch } from 'react-redux'
import { setNum } from '../firebase-config/functions'

const UPDATE = 'UPDATE'
const formReducer = (state, action)=>{
    switch (action.type){
        case UPDATE:
            let {title, description} = action.data
            return {
                ...state,
                title,
                description,
            }
        
    }
}
export default function HW_view(props){
    const {route, navigation} = props
    const {title, id, status,date,description} = route.params.detail
    const {edit, remove} = route.params.fun
    const [loading,setLoading] = useState(false)
    let dispatch = useDispatch()
    const [state, dispatchState] = useReducer(formReducer,{
        title: title,
        description,
    })
    let st = (status == 't') ? true : false
    const updateValues = useCallback((data)=>{
        dispatchState({
            type: UPDATE,
            data
        })
        edit({...data, id})
    },[dispatchState])
    async function delFun(){
        setLoading(true)
        try{
            await deleteDoc(doc(db,'homework',id))
            dispatch(removeHWAction(id))
            remove(id)
            navigation.goBack()
        }catch(err){console.log(err);setLoading(false)}
        
    }
    function dltAlert(){
        Alert.alert('Are you sure?','Do you really want to delete this homework?',[{text:'Cancel'},{text:'Delete',onPress:delFun}])
    }
    return(
        <View style={{...Style.screen, position: 'relative'}}>
            <Header icon="chevron-back-outline" heading={state.title} fun={()=>navigation.goBack()}/>
            <View style={Style.bodyContainer}>
                <View style={Style.det_wrap}>
                    <Text style={Style.ovrvw}>{state.description}</Text>
                    <Text style={Style.ovrvw}><Text style={{color: colors.lblack}}>Date: </Text>{setNum(date)}</Text>
                    {loading ? <View style={{alignItems:'center',justifyContent:'center',paddingVertical:10}}>
                        <ActivityIndicator size="large" color={colors.black} />
                    </View>:
                    <View style={Style.tiny_btns}>
                        {st && <TouchableOpacity activeOpacity={.5} onPress={()=>{dltAlert()}}><Text style={Style.tiny_btntxt}>Delete</Text></TouchableOpacity> }
                        {st && <TouchableOpacity activeOpacity={.5} onPress={()=>navigation.navigate('hw_form',{mode:'edit',id,title,description,fun:{main:updateValues}})}><Text style={{...Style.tiny_btntxt, backgroundColor: colors.black, color: colors.white, marginHorizontal: 5}}>Edit</Text></TouchableOpacity>}
                    </View>}
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    icon:{fontSize: RFValue(16)},
    ico:{fontSize: RFValue(17), paddingRight: 15},
})