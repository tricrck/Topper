import axios from 'axios'
import { 
    PORTFOLIO_LIST_REQUEST,
    PORTFOLIO_LIST_SUCCESS,
    PORTFOLIO_LIST_FAIL,
    PORTFOLIO_DETAILS_REQUEST,
    PORTFOLIO_DETAILS_SUCCESS,
    PORTFOLIO_DETAILS_FAIL,
    PORTFOLIO_CREATE_REQUEST,
    PORTFOLIO_CREATE_SUCCESS,
    PORTFOLIO_CREATE_FAIL,
    PORTFOLIO_UPDATE_REQUEST,
    PORTFOLIO_UPDATE_SUCCESS,
    PORTFOLIO_UPDATE_FAIL,
    PORTFOLIO_DELETE_REQUEST,
    PORTFOLIO_DELETE_SUCCESS,
    PORTFOLIO_DELETE_FAIL,
    PORTFOLIO_SEARCH_REQUEST,
    PORTFOLIO_SEARCH_SUCCESS,
    PORTFOLIO_SEARCH_FAIL,
 } from '../constants/portfolio'

 const url = 'https://topper.onrender.com/api'
 export const listPortfolios = () => async (dispatch) => {
    try {
        dispatch({ type: PORTFOLIO_LIST_REQUEST })

        const { data } = await axios.get(`${url}/portfolio`)

        dispatch({
            type: PORTFOLIO_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: PORTFOLIO_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        })
    }
};

// Get portfolio details
export const getPortfolioDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PORTFOLIO_DETAILS_REQUEST });

        const { data } = await axios.get(`${url}/portfolio/${id}`);

        dispatch({
            type: PORTFOLIO_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: PORTFOLIO_DETAILS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Create portfolio
export const createPortfolio = (portfolioData) => async (dispatch) => {
    try {
        dispatch({ type: PORTFOLIO_CREATE_REQUEST });

        const { data } = await axios.post(`${url}/portfolio`, portfolioData);

        dispatch({
            type: PORTFOLIO_CREATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: PORTFOLIO_CREATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Update portfolio
export const updatePortfolio = (id, portfolioData) => async (dispatch) => {
    try {
        dispatch({ type: PORTFOLIO_UPDATE_REQUEST });

        const { data } = await axios.put(`${url}/portfolio/${id}`, portfolioData);

        dispatch({
            type: PORTFOLIO_UPDATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: PORTFOLIO_UPDATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Delete portfolio
export const deletePortfolio = (id) => async (dispatch) => {
    try {
        dispatch({ type: PORTFOLIO_DELETE_REQUEST });

        await axios.delete(`${url}/portfolio/${id}`);

        dispatch({
            type: PORTFOLIO_DELETE_SUCCESS,
            payload: id,
        });
    } catch (error) {
        dispatch({
            type: PORTFOLIO_DELETE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Search portfolios
export const searchPortfolios = (query) => async (dispatch) => {
    try {
        dispatch({ type: PORTFOLIO_SEARCH_REQUEST });

        const { data } = await axios.get(`${url}/portfolio/search/${query}`);

        dispatch({
            type: PORTFOLIO_SEARCH_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: PORTFOLIO_SEARCH_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};