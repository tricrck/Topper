import axios from 'axios'
import { 
    TESTIMONIAL_LIST_REQUEST,
    TESTIMONIAL_LIST_SUCCESS,
    TESTIMONIAL_LIST_FAIL,
    TESTIMONIAL_DETAILS_REQUEST,
    TESTIMONIAL_DETAILS_SUCCESS,
    TESTIMONIAL_DETAILS_FAIL,
    TESTIMONIAL_CREATE_REQUEST,
    TESTIMONIAL_CREATE_SUCCESS,
    TESTIMONIAL_CREATE_FAIL,
    TESTIMONIAL_UPDATE_REQUEST,
    TESTIMONIAL_UPDATE_SUCCESS,
    TESTIMONIAL_UPDATE_FAIL,
    TESTIMONIAL_DELETE_REQUEST,
    TESTIMONIAL_DELETE_SUCCESS,
    TESTIMONIAL_DELETE_FAIL,
 } from '../constants/testimonials'

 const url = 'https://topper.onrender.com/api'
 export const listTestimonials = () => async (dispatch) => {
    try {
        dispatch({ type: TESTIMONIAL_LIST_REQUEST })

        const { data } = await axios.get(`${url}/testimonials`)


        dispatch({
            type: TESTIMONIAL_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: TESTIMONIAL_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        })
    }
};

// Get testimonial details
export const getTestimonialDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: TESTIMONIAL_DETAILS_REQUEST });

        const { data } = await axios.get(`${url}/testimonials/${id}`);
        dispatch({ type: TESTIMONIAL_DETAILS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: TESTIMONIAL_DETAILS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};


// Create a testimonial
export const createTestimonial = (testimonial) => async (dispatch) => {
    try {
        dispatch({ type: TESTIMONIAL_CREATE_REQUEST });

        const { data } = await axios.post(`${url}/testimonials`, testimonial);
        dispatch({ type: TESTIMONIAL_CREATE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: TESTIMONIAL_CREATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Update a testimonial
export const updateTestimonial = (id, testimonial) => async (dispatch) => {
    try {
        dispatch({ type: TESTIMONIAL_UPDATE_REQUEST });

        const { data } = await axios.put(`${url}/testimonials/${id}`, testimonial);
        dispatch({ type: TESTIMONIAL_UPDATE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: TESTIMONIAL_UPDATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Delete a testimonial
export const deleteTestimonial = (id) => async (dispatch) => {
    try {
        dispatch({ type: TESTIMONIAL_DELETE_REQUEST });

        await axios.delete(`${url}/testimonials/${id}`);
        dispatch({ type: TESTIMONIAL_DELETE_SUCCESS });
    } catch (error) {
        dispatch({
            type: TESTIMONIAL_DELETE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};