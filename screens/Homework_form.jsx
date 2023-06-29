import React,{useState,useCallback,useReducer} from "react"
import { View,Alert,ActivityIndicator } from "react-native"
import Header from "../components/Header"
import InputField from "../components/InputField"
import ButtonCombo from '../components/ButtonCombo'
import Style from "../Style"
import { updateDoc,doc,addDoc,collection } from "firebase/firestore"
import { db } from "../firebase-config/config"
import { useDispatch, useSelector } from "react-redux"
import { addHWAction, updateHWAction } from "../store/actions"
import colors from "../colors"

const UPDATE = 'UPDATE'
const formReducer = (state,action)=>{
    switch(action.type){
        case UPDATE:
            let {name,value} = action
            return{...state,[name]:value}
    }
    return state
}

export default function HW_form(props){
    let {navigation,route} = props
    let {mode,id,title,description,subjectID,fun,tokens,sub} = route.params
    let {main} = fun
    let u = useSelector(state=>state.user)
    let iid = u.user.iid
    let sesID = u.session.id
    const [loading,setLoading] = useState(false)
    const [state,dispatchState] = useReducer(formReducer,{
        title: mode == 'edit' ? title : '',
        description: mode == 'edit' ? description : '',
    })
    let dispatch = useDispatch()
    const changeFun = useCallback((name,value)=>{
        dispatchState({type:UPDATE,name,value})
    },[dispatchState])
    const sendNotif = async(data)=>{
        let {title} = data
        await fetch('https://exp.host/--/api/v2/push/send',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: tokens,
                title: `Homework of ${sub}`,
                body: `${title}`,
                data:{type:'homework',nav:'homework',screen:'hw_view',data}
            }),
        })
    }
    const handleSave = async()=>{
        let {title,description} = state
        if(!title||!description){Alert.alert('Error','Title and description are required',[{text:'Okay'}]);return}
        if(title && description){
            setLoading(true)
            try{
                if(mode == 'edit'){
                    let obj = {id,title,description}
                    await updateDoc(doc(db,'homework',id),{title,description})
                    dispatch(updateHWAction(obj))
                    main(obj)
                    navigation.goBack()
                }else if(mode == 'add'){
                    let d = new Date()
                    let date = `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`
                    let res = await addDoc(collection(db,'homework'),{title,description,session:sesID,date,subjectID,instituteID:iid})
                    let id = res.id
                    await sendNotif({id,title,description,session:sesID,date,subjectID,instituteID:iid})
                    let obj = {id,title,description,date}
                    dispatch(addHWAction({id,title,description,date,subjectID}))
                    main(obj)
                    navigation.goBack()
                }
            }catch(err){console.log(err);setLoading(false)}
        }
    }
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading='Homework' fun={()=>navigation.goBack()}/>
            <View style={{...Style.bodyContainer, padding: 25}}>
                <InputField val={state.title} label="Title" name="title" onChangeFun={changeFun}></InputField>
                <InputField val={state.description} label="Description" name="description" multiline={true} onChangeFun={changeFun} nol={9}></InputField>
                <View style={{height: 50}}/>
                {loading ? <ActivityIndicator size='large' color={colors.black}/>: <ButtonCombo text1="Cancel" text2={mode == 'edit'?'Update':'Send'} fun1={()=>navigation.goBack()} fun2={handleSave}/>}
            </View>
        </View>
    )
}