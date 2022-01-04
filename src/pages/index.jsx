import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { ROUTES, USER_TYPE } from "../constants/app";
import { history } from "../router/history";

const WelcomePage = ()=>{
    const userInfo = useSelector(state => state.user.userInfo);
    useEffect(()=>{
        if(userInfo){
            if(userInfo.type === USER_TYPE.VOICE){
                history.push(ROUTES.VOICE_MATCH_DEMO);
            }else{
                history.push(ROUTES.FACE_COMPARE_DEMO);
            }
        }
    },[userInfo]);
    return (
        <div></div>
    )
}
export default WelcomePage;