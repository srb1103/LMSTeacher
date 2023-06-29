import colors from "./colors";
import { RFValue } from "react-native-responsive-fontsize";
import { Dimensions } from "react-native";
let {height,width} = Dimensions.get('window')

export default {
    ovrvw:{color: colors.black, fontSize: RFValue(14), marginVertical: 1},
    det_wrap:{padding: 12, backgroundColor: colors.white, borderRadius: 10, paddingVertical: 15},
    screen:{flex: 1},
    ai_screen:{flex:1,alignItems:'center',justifyContent:'center',padding:15,position:'relative'},
    bodyContainer:{padding: 10, backgroundColor: colors.bg},
    label:{marginBottom: 3,fontSize: RFValue(12),marginLeft: 5,fontFamily: 'p5', color: colors.black},
    input:{padding: 15,color: colors.black,fontSize: RFValue(13),backgroundColor: 'white',borderRadius: 15,borderWidth: 1,fontFamily: 'p5', borderColor: '#e9e9e9'},
    btnText:{color: colors.white, backgroundColor: colors.black, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5, width: RFValue(80), textAlign: 'center', fontSize: RFValue(15), marginTop: 5},
    tiny_btns:{flexDirection: 'row', marginTop: 20},
    tiny_btntxt:{borderWidth: 1, borderColor: colors.black, paddingVertical: 6, paddingHorizontal: 15, borderRadius: 5, color: colors.black, fontSize: RFValue(14)},
    overlay:{flex:1,height,width,position:'fixed',zIndex:2,top:0,left:0,backgroundColor:'rgba(0,0,0,.2)'},
    bs_wrap:{position:'fixed',backgroundColor:colors.white,width,borderTopRightRadius:20,borderTopLeftRadius:20,left:0}
}