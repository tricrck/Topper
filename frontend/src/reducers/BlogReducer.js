import { 
    BLOG_LIST_REQUEST,
    BLOG_LIST_SUCCESS,
    BLOG_LIST_FAIL,
    BLOG_DETAILS_REQUEST, 
    BLOG_DETAILS_SUCCESS, 
    BLOG_DETAILS_FAIL,
    BLOG_CREATE_REQUEST,
    BLOG_CREATE_SUCCESS,
    BLOG_CREATE_FAIL,
    BLOG_UPDATE_REQUEST,
    BLOG_UPDATE_SUCCESS,
    BLOG_UPDATE_FAIL,
    BLOG_DELETE_REQUEST,
    BLOG_DELETE_SUCCESS,
    BLOG_DELETE_FAIL,
    COMMENT_CREATE_REQUEST,
    COMMENT_CREATE_SUCCESS,
    COMMENT_CREATE_FAIL,
    COMMENT_LIST_REQUEST,
    COMMENT_LIST_SUCCESS,
    COMMENT_LIST_FAIL,
    COMMENT_UPDATE_REQUEST,
    COMMENT_UPDATE_SUCCESS,
    COMMENT_UPDATE_FAIL,
    COMMENT_DELETE_REQUEST,
    COMMENT_DELETE_SUCCESS,
    COMMENT_DELETE_FAIL,
 } from '../constants/blog'

export const BlogReducer = (state = { blogs: [] }, action) => {
    switch (action.type) {
        case BLOG_LIST_REQUEST:
            return { loading: true, blogs: [] }

        case BLOG_LIST_SUCCESS:
            return {loading: false, 
                blogs: action.payload}

        case BLOG_LIST_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}

export const blogDetailsReducer = (state = { blog: {} }, action) => {
    switch (action.type) {
        case BLOG_DETAILS_REQUEST:
            return { loading: true, ...state };

        case BLOG_DETAILS_SUCCESS:
            return { loading: false, blog: action.payload };

        case BLOG_DETAILS_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

// Blog Create Reducer
export const blogCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case BLOG_CREATE_REQUEST:
            return { loading: true };
        case BLOG_CREATE_SUCCESS:
            return { loading: false, success: true, blog: action.payload };
        case BLOG_CREATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Blog Update Reducer
export const blogUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case BLOG_UPDATE_REQUEST:
            return { loading: true };
        case BLOG_UPDATE_SUCCESS:
            return { loading: false, success: true, blog: action.payload };
        case BLOG_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Blog Delete Reducer
export const blogDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case BLOG_DELETE_REQUEST:
            return { loading: true };
        case BLOG_DELETE_SUCCESS:
            return { loading: false, success: true };
        case BLOG_DELETE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Comment Create Reducer
export const commentCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case COMMENT_CREATE_REQUEST:
            return { loading: true };
        case COMMENT_CREATE_SUCCESS:
            return { loading: false, success: true, comment: action.payload };
        case COMMENT_CREATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Comment List Reducer
export const commentListReducer = (state = { comments: [] }, action) => {
    switch (action.type) {
        case COMMENT_LIST_REQUEST:
            return { loading: true, comments: [] };
        case COMMENT_LIST_SUCCESS:
            return { loading: false, comments: action.payload };
        case COMMENT_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Comment Update Reducer
export const commentUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case COMMENT_UPDATE_REQUEST:
            return { loading: true };
        case COMMENT_UPDATE_SUCCESS:
            return { loading: false, success: true, comment: action.payload };
        case COMMENT_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Comment Delete Reducer
export const commentDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case COMMENT_DELETE_REQUEST:
            return { loading: true };
        case COMMENT_DELETE_SUCCESS:
            return { loading: false, success: true };
        case COMMENT_DELETE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};