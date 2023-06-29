import {View, ActivityIndicator} from 'react-native'
import ReduxThunk from 'redux-thunk'
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers} from 'redux'
import { useFonts, Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold } from "@expo-google-fonts/poppins";
import user from './store/reducers'
import Nav, {LoginNavigation} from './navigation/Navigation'
import { createTable } from './helpers/sql';

createTable().then(()=>{
  console.log('created...')
}).catch(err=>{
  console.log(err)
})

const rootReducer = combineReducers({
  user: user
})
const store = createStore(rootReducer, applyMiddleware(ReduxThunk))
export default function App() {
  let [fontsLoaded] = useFonts({
    p3: Poppins_300Light,
    p4: Poppins_400Regular,
    p5: Poppins_500Medium,
    p6: Poppins_600SemiBold,
    p7: Poppins_700Bold,
    p8: Poppins_800ExtraBold,
  });
  if(!fontsLoaded){
    return(
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator color='black' size="large"/>
      </View>
    )
  }
  return (
    <Provider store={store}>
      <Nav/>
    </Provider>
  );
}




