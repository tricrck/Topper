import { 
    TESTIMONIAL_LIST_REQUEST,
    TESTIMONIAL_LIST_SUCCESS,
    TESTIMONIAL_LIST_FAIL,
    TESTIMONIAL_CREATE_REQUEST,
    TESTIMONIAL_CREATE_SUCCESS,
    TESTIMONIAL_CREATE_FAIL,
    TESTIMONIAL_UPDATE_REQUEST,
    TESTIMONIAL_UPDATE_SUCCESS,
    TESTIMONIAL_UPDATE_FAIL,
    TESTIMONIAL_DELETE_REQUEST,
    TESTIMONIAL_DELETE_SUCCESS,
    TESTIMONIAL_DELETE_FAIL,
    TESTIMONIAL_DETAILS_REQUEST,
    TESTIMONIAL_DETAILS_SUCCESS,
    TESTIMONIAL_DETAILS_FAIL,
 } from '../constants/testimonials'

export const TestimonialReducer = (state = { testimonials: [] }, action) => {
    switch (action.type) {
        case TESTIMONIAL_LIST_REQUEST:
            return { loading: true, testimonials: [] }

        case TESTIMONIAL_LIST_SUCCESS:
            return {loading: false, 
                testimonials: action.payload}

        case TESTIMONIAL_LIST_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}

// Get testimonial details
export const testimonialDetailsReducer = (state = { testimonial: {} }, action) => {
    switch (action.type) {
        case TESTIMONIAL_DETAILS_REQUEST:
            return { loading: true, ...state };
        case TESTIMONIAL_DETAILS_SUCCESS:
            return { loading: false, testimonial: action.payload };
        case TESTIMONIAL_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Create a testimonial
export const testimonialCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case TESTIMONIAL_CREATE_REQUEST:
            return { loading: true };
        case TESTIMONIAL_CREATE_SUCCESS:
            return { loading: false, success: true, testimonial: action.payload };
        case TESTIMONIAL_CREATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Update a testimonial
export const testimonialUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case TESTIMONIAL_UPDATE_REQUEST:
            return { loading: true };
        case TESTIMONIAL_UPDATE_SUCCESS:
            return { loading: false, success: true, testimonial: action.payload };
        case TESTIMONIAL_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Delete a testimonial
export const testimonialDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case TESTIMONIAL_DELETE_REQUEST:
            return { loading: true };
        case TESTIMONIAL_DELETE_SUCCESS:
            return { loading: false, success: true };
        case TESTIMONIAL_DELETE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};