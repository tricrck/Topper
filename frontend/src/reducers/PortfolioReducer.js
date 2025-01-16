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

export const PortfolioReducer = (state = { portfolios: [] }, action) => {
    switch (action.type) {
        case PORTFOLIO_LIST_REQUEST:
            return { loading: true, portfolios: [] }

        case PORTFOLIO_LIST_SUCCESS:
            return {loading: false, 
                portfolios: action.payload}

        case PORTFOLIO_LIST_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
};

// Portfolio details reducer
export const portfolioDetailsReducer = (state = { portfolio: {} }, action) => {
    switch (action.type) {
        case PORTFOLIO_DETAILS_REQUEST:
            return { loading: true, portfolio: {} };
        case PORTFOLIO_DETAILS_SUCCESS:
            return { loading: false, portfolio: action.payload };
        case PORTFOLIO_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Portfolio create reducer
export const portfolioCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case PORTFOLIO_CREATE_REQUEST:
            return { loading: true };
        case PORTFOLIO_CREATE_SUCCESS:
            return { loading: false, success: true, portfolio: action.payload };
        case PORTFOLIO_CREATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Portfolio update reducer
export const portfolioUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case PORTFOLIO_UPDATE_REQUEST:
            return { loading: true };
        case PORTFOLIO_UPDATE_SUCCESS:
            return { loading: false, success: true, portfolio: action.payload };
        case PORTFOLIO_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Portfolio delete reducer
export const portfolioDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case PORTFOLIO_DELETE_REQUEST:
            return { loading: true };
        case PORTFOLIO_DELETE_SUCCESS:
            return { loading: false, success: true };
        case PORTFOLIO_DELETE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Portfolio search reducer
export const portfolioSearchReducer = (state = { portfolios: [] }, action) => {
    switch (action.type) {
        case PORTFOLIO_SEARCH_REQUEST:
            return { loading: true, portfolios: [] };
        case PORTFOLIO_SEARCH_SUCCESS:
            return { loading: false, portfolios: action.payload };
        case PORTFOLIO_SEARCH_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};