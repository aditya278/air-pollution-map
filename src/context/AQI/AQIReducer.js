import * as types from '../types';

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    switch(action.type) {
        case types.ITEM_LOADED:
            return {
                ...state,
                itemLoaded : state.itemLoaded + 1
            }
        case types.RESET_ITEM_LOADED:
            return {
                ...state,
                itemLoaded : 0
            }
        case types.SET_LOADING:
            return {
                ...state,
                loading: true
            };
        case types.RESET_LOADING:
            return {
                ...state,
                loading: false
            };
        case types.SET_GEOGRAPHIES:
            return {
                ...state,
                geographies : action.payload,
                loading: false
            }
        case types.CLEAR_GEOGRAPHIES:
            return {
                ...state,
                geographies: [],
                loading : false,
            }
        case types.GET_SINGLE_STATE_POLLUTION_DATA:
        case types.GET_ALL_STATES_POLLUTION_DATA:
        case types.GET_LOCAL_POLLUTION_DATA:
        case types.RELOAD_ALL_STATES_POLLUTION_DATA:
            return {
                ...state,
                pollutionData : action.payload,
                loading: false
            }
        default:
            return state;
    }
}