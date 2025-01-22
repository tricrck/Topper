import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  LOGOUT,
  FETCH_USERS_FAIL,
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USER_DETAILS_REQUEST,
  FETCH_USER_DETAILS_FAIL
} from "../constants/user";
import { checkIsAdmin } from '../utils/auth';

// Auth reducer initial state
const authInitialState = {
  user: null,
  token: null,
  error: null,
  isAdmin: false,
};

// Users reducer initial state
const usersInitialState = {
  users: [],
  userDetails: {},
  loading: false,
  error: null,
  userDetailsLoading: false,
  userDetailsError: null
};

// Auth reducer
export const authReducer = (state = authInitialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case SIGNUP_SUCCESS:
      const user = action.payload.user;
      const isAdmin = checkIsAdmin(user?.email);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAdmin,
        error: null,
      };
      
    case LOGIN_FAIL:
    case SIGNUP_FAIL:
      return {
        ...state,
        user: null,
        token: null,
        isAdmin: false,
        error: action.payload,
      };
      
    case LOGOUT:
      return authInitialState;
      
    default:
      return state;
  }
};

// Users reducer
export const usersReducer = (state = usersInitialState, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
        error: null
      };
    
    case FETCH_USERS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case FETCH_USER_DETAILS_REQUEST:
      return {
        ...state,
        userDetailsLoading: true,
        userDetailsError: null
      };
    
      case 'FETCH_USER_DETAILS_SUCCESS':
        return {
            ...state,
            loading: false,
            userDetails: {
                ...state.userDetails,
                [action.payload.uid]: action.payload, // Add/Update user details
            },
        };
    
    case FETCH_USER_DETAILS_FAIL:
      return {
        ...state,
        userDetailsLoading: false,
        userDetailsError: action.payload
      };
      
    case LOGOUT:
      return usersInitialState;

    default:
      return state;
  }
};