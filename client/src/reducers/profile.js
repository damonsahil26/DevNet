/* eslint-disable import/no-anonymous-default-export */
import { GET_PROFILE, PROFILE_ERROR } from "../actions/types";
const initialState={
    profile:null,
    profiles:[],
    repos:[],
    loading:true,
    error:{}
};

export default function(state=initialState,action){
    const {type,paylaod}=action;

    switch(type){

        case GET_PROFILE:
            return {
                ...state,
                profile:paylaod,
                loading:false
            };
            case PROFILE_ERROR:
                return {
                    ...state,
                    error:paylaod,
                    loading:false
                };
                default:
                    return state;
        
    }


}