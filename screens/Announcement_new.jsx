import React, { useState, useReducer, useCallback } from 'react'
import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native'
import Style from '../Style'
import Header from '../components/Header'
import colors from '../colors'
import { RFValue } from 'react-native-responsive-fontsize'
import ButtonCombo from '../components/ButtonCombo'
import InputField from '../components/InputField'
import MultiSelect from 'react-native-multiple-select'
import IonIcon from 'react-native-vector-icons/Ionicons'
import * as DocumentPicker from 'expo-document-picker';
import {ref,uploadBytesResumable,getStorage, getDownloadURL,uploadBytes} from 'firebase/storage'
import { useSelector } from 'react-redux'


const UPDATE_VALUE = 'UPDATE_VALUE'
const UPDATE_CLASS = 'UPDATE_CLASS'
const ADD_FILE = 'ADD_FILE'

const stateReducer = (state, action)=>{
    switch (action.type){
        case UPDATE_VALUE:
            let data = action.data
            const values = {
                ...state.values,
                [data.name]: data.value
            }
            return {
                ...state,
                values,
            }
        case UPDATE_CLASS:
            return{
                ...state,
                to: action.data
            }
        case ADD_FILE:
            let {file_url,file_name} = action
            console.log(file_url)
            let file = {name:file_name,url:file_url}
            let files = state.files.concat(file)
            return{...state,files}
    }
}
export default function Announcement(props){
    const {navigation, route} = props
    let {classes,fun} = route.params
    let u = useSelector(state=>state.user)
    let {id,iid} = u.user
    const [state, dispatchState] = useReducer(stateReducer,{
        values:{
            title: null,
            det: null
        },
        to: [],
        files:[]
    })
    const changeFun = useCallback((name, value)=>{
        dispatchState({
            type: UPDATE_VALUE,
            data:{
                name, 
                value
            }
        })
    },[dispatchState])
    function save(){
        let values = state.values
        if(!values.title || !values.det || state.to.length == 0){
            Alert.alert('Error','All fields are required',[{text: 'Okay'}])
        }else{
            let {to, values} = state
            let {det, title} = values
            fun(title, to, det);
            navigation.goBack()
        }
    }
    
    const onSelectedItemsChange = useCallback((selectedItems)=>{
        dispatchState({
            type:  UPDATE_CLASS,
            data: selectedItems
        })
    },[dispatchState])
    const selectFile = async ()=>{
        let file = await DocumentPicker.getDocumentAsync({
            type:'application/pdf'
        })
        let t = new Date()
        let time_string = `${t.getHours()}.${t.getMinutes()}.${t.getSeconds()}.${t.getMilliseconds()}`
        if(file.type == 'success'){
            let {name,size,uri} = file
            let im = name.split('.')
            let im_l = im.length - 1
            let img_name = `${time_string}_i_${iid}_u_${id}_${im[im_l-1].split('/').pop()}.${im[im_l]}`
            let storage = getStorage()
            let path = `/uploaded_files/${img_name}`
            const rf = ref(storage, path)
            const img = await fetch(uri)
            const bytes = await img.blob()
            await uploadBytes(rf, bytes)
            getDownloadURL(rf)
            .then(url=>addFileToArray(name,url))
        }
    }
    const addFileToArray = useCallback((file_name,file_url)=>{
        dispatchState({type: ADD_FILE,file_name,file_url})
    },[dispatchState])
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading='Add New Announcement' fun={()=>navigation.goBack()}/>
            <View style={{...Style.bodyContainer, padding: 25}}>
                <View style={styles.msWrap}>
                    <MultiSelect
                        items={classes}
                        uniqueKey='id'
                        selectedItems={state.to}
                        onSelectedItemsChange={onSelectedItemsChange}
                        selectText='Select Classes'
                        searchInputPlaceholderText='Search classes...'
                        tagBorderColor='#ccc'
                        tagRemoveIconColor={colors.lblack}
                        tagTextColor={colors.lblack}
                        displayKey='name'
                        searchInputStyle={Style.input}
                        submitButtonText='Done'
                        removeSelected
                    />
                </View>
                <InputField val={state.values.title} label="Title" name="title" onChangeFun={changeFun}></InputField>
                <InputField val={state.values.det} label="Announcement" name="det" multiline={true} onChangeFun={changeFun} nol={9}></InputField>
                {/* <View style={{height: 10}}/> */}
                {/* <Text style={Style.label}>Add attachment</Text>
                <TouchableOpacity activeOpacity={.5} onPress={selectFile}>
                    <IonIcon name="document-attach-outline" style={styles.file_icon}/>
                </TouchableOpacity> */}
                <View style={{height: 50}}/>
                <ButtonCombo text1='Cancel' text2='Save' fun1={()=>{navigation.goBack()}} fun2={save}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    msWrap:{padding: 3, marginVertical: 5},
    file_icon:{color:'red'}
})