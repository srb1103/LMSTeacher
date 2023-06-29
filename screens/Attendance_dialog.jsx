import React,{useState, useReducer, useCallback,useEffect} from 'react'
import { View , Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Dimensions } from 'react-native'
import Style from '../Style'
import { Dialog } from 'react-native-simple-dialogs'
import Header from '../components/Header'

const MARK = 'MARK'
const stateReducer = (state, action)=>{
  switch (action.type){
    case MARK:
        
  }
  return state
}
let {height} = Dimensions.get('window')
export default function Attendance_dialog(props) {
  const {navigation, route} = props
  const {date,students,iid,id} = route.params
  let [alert,setAlert] = useState(null)
  let [state,dispatchState] = useReducer(stateReducer,{
    not_marked: students,
    marked:[]
  })
  useEffect(()=>{
    check_list()
  },[])
  function check_list(){
    let l = state.not_marked.length
    if(l>0){
        setAlert(<Dialog visible={true}>
            <View>
                <Text>Hello</Text>
            </View>
        </Dialog>)
    }
  }
  return (
    <View style={Style.screen}>
      <Header icon="chevron-back-outline" heading='Mark Attendance' fun={()=>navigation.goBack()}/>
      <View style={Style.bodyContainer}>
        {alert}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    
})
