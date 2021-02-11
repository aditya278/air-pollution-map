import React, { useReducer } from 'react';
import axios from "axios";
import AQIContext from './AQIContext';
import AQIReducer from './AQIReducer';
import * as types from '../types';
import { feature } from "topojson-client";

import config from '../../config.json';

const AQIActions = (props) => {
    const initialState = {
        geographies : [],
        loading : false,
        pollutionData : {},
        itemLoaded : 0
    }

    const [state, dispatch] = useReducer(AQIReducer, initialState);

    const itemLoaded = () => dispatch({type : types.ITEM_LOADED});
    const resetItemLoaded = () => dispatch({type : types.RESET_ITEM_LOADED});
    const setLoading = () => dispatch({type : types.SET_LOADING});
    const resetLoading = () => dispatch({type : types.RESET_LOADING});

    const setGeographies = (stateJson) => {
        setLoading();
        const stateFeatureData = feature(stateJson, stateJson.objects.polygons).features;
        dispatch({
            type : types.SET_GEOGRAPHIES,
            payload : stateFeatureData
        })
    }

    const reloadAllStatesPollutionData = async () => {
        try {
            setLoading();
            let localPollutionData =  {};
            resetItemLoaded();
            for(let i=0; i<state.geographies.length; i++) {
                const res = await axios.get(`/aqi?lat=${state.geographies[i].properties.lat}&lon=${state.geographies[i].properties.lon}&APPID=${config.API_KEY}`);
                // const res = await axios.get(`/nearest_city?lat=${state.geographies[i].properties.lat}&lon=${state.geographies[i].properties.lon}&key=${config.API_KEY}`);
                localPollutionData[i] = res.data.data;
                itemLoaded();
            }
            localStorage.setItem("pollutionData", JSON.stringify(localPollutionData));
            dispatch({
                type : types.GET_ALL_STATES_POLLUTION_DATA,
                payload : localPollutionData,
            })
            localStorage.setItem("lastFetchTime", Date.now());
        }
        catch(err) {
            console.log(err.message);
        }
    }

    const getAllStatesPollutionData = async () => {
        try {
            setLoading();
            const time = localStorage.getItem("lastFetchTime");
            if(time + (1 * 60 * 60 * 1000) > Date.now()) {
                return;
            }
            let localPollutionData = JSON.parse(localStorage.getItem("pollutionData"));
            if(localPollutionData) {
                getLocalPollutionData();
                return;
            }
            localPollutionData =  {};
            resetItemLoaded();
            for(let i=0; i<state.geographies.length; i++) {
                const res = await axios.get(`/aqi?lat=${state.geographies[i].properties.lat}&lon=${state.geographies[i].properties.lon}&APPID=${config.API_KEY}`);
                localPollutionData[i] = res.data.data;
                itemLoaded();
            }
            localStorage.setItem("pollutionData", JSON.stringify(localPollutionData));
            dispatch({
                type : types.GET_ALL_STATES_POLLUTION_DATA,
                payload : localPollutionData,
            });
            localStorage.setItem("lastFetchTime", Date.now());
        }
        catch(err) {
            console.log(err.message);
        }
    }

    const getSingleStatePollutionData = async (id) => {
        const stateData = state.geographies[id];
        if(!stateData)
            return;
        setLoading();
        try {
            let localPollutionData = JSON.parse(localStorage.getItem("pollutionData"));
            if(localPollutionData && (id in localPollutionData)) {
                resetLoading();
                return;
            }

            const res = await axios.get(`/aqi?lat=${stateData.properties.lat}&lon=${stateData.properties.lon}&APPID=${config.API_KEY}`);

            localPollutionData = {
                ...state.pollutionData,
                [id] : res.data.data
            };
            localStorage.setItem("pollutionData", JSON.stringify(localPollutionData));
            dispatch({
                type : types.RELOAD_ALL_STATES_POLLUTION_DATA,
                payload : localPollutionData,
            })
        }
        catch(err) {
            console.log(err.message);
        }
    }

    const getLocalPollutionData = () => {
        let localPollutionData = JSON.parse(localStorage.getItem("pollutionData"));
        if(localPollutionData) {
            dispatch({
                type : types.GET_LOCAL_POLLUTION_DATA,
                payload: localPollutionData
            })
        }
    }

    return (
        <AQIContext.Provider
            value={{
                geographies : state.geographies,
                loading: state.loading,
                pollutionData : state.pollutionData,
                setGeographies,
                getSingleStatePollutionData,
                getLocalPollutionData,
                getAllStatesPollutionData,
                itemLoaded,
                reloadAllStatesPollutionData
            }}
        >
            {props.children}
        </AQIContext.Provider>
    )
}

export default AQIActions;