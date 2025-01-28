import axios from 'axios'
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
  FETCH_USER_DETAILS_SUCCESS,
  FETCH_USER_DETAILS_FAIL
} from "../constants/user";
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "@firebase/auth";
import { auth, googleProvider } from "../firebase";

const API_URL = "https://topper.onrender.com/api"
// Google Signup
export const googleSignup = () => async (dispatch) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();

    // Send user data to the backend
    await axios.post(`${API_URL}/users`, {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
    });

    dispatch({
      type: SIGNUP_SUCCESS,
      payload: { user: result.user, token },
    });

    // Save auth details in localStorage
    localStorage.setItem(
      "auth",
      JSON.stringify({ user: result.user, token })
    );
    
  } catch (error) {
    dispatch({
      type: SIGNUP_FAIL,
      payload: error.message,
    });
  }
};

// Google Login
export const googleLogin = () => async (dispatch) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();

    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user: result.user, token },
    });
    
    // Save auth details in localStorage
    localStorage.setItem(
      "auth",
      JSON.stringify({ user: result.user, token })
    );

  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.message,
    });
  }
};

// Email Signup
export const emailSignup = (email, password) => async (dispatch) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const token = await result.user.getIdToken();

    await axios.post(`${API_URL}/users`, {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
    });

    dispatch({
      type: SIGNUP_SUCCESS,
      payload: { user: result.user, token },
    });

    // Save auth details in localStorage
    localStorage.setItem(
      "auth",
      JSON.stringify({ user: result.user, token })
    );

  } catch (error) {
    dispatch({
      type: SIGNUP_FAIL,
      payload: error.message,
    });
  }
};

// email Login
export const emailLogin = (email, password) => async (dispatch) => {
  try {
    // Attempt to log the user in
    const result = await signInWithEmailAndPassword(auth, email, password);
    const token = await result.user.getIdToken();

    // Dispatch the success action
    dispatch({ type: "LOGIN_SUCCESS", payload: { user: result.user, token } });

     // Save auth details in localStorage
     localStorage.setItem(
      "auth",
      JSON.stringify({ user: result.user, token })
    );

    console.log("Login successful:", result.user);
  } catch (error) {
    // Dispatch the failure action
    dispatch({ type: "LOGIN_FAIL", payload: error.message });

    console.error("Error logging in:", error.message);
  }
};

// Fetch all users
export const fetchUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_USERS_REQUEST });

    const { data } = await axios.get(`${API_URL}/users`);
    
    dispatch({ 
      type: FETCH_USERS_SUCCESS, 
      payload: data 
    });
  } catch (error) {
    dispatch({ 
      type: FETCH_USERS_FAIL, 
      payload: error.response?.data?.message || error.message 
    });
    console.error('Error fetching users:', error);
  }
};

// Fetch single user details
export const fetchUserDetails = (uid) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_USER_DETAILS_REQUEST });
    
    const { data } = await axios.get(`${API_URL}/users/${uid}`);
    
    dispatch({ 
      type: FETCH_USER_DETAILS_SUCCESS, 
      payload: data 
    });
    
  } catch (error) {
    console.error('Error fetching user details:', error);
    dispatch({ 
      type: FETCH_USER_DETAILS_FAIL, 
      payload: error.response?.data?.message || error.message 
    });
  }
};
// Logout
export const logout = () => (dispatch) => {
  auth.signOut().then(() => {
    dispatch({ type: LOGOUT });
    // Remove user data from localStorage
    localStorage.removeItem("auth");

    console.log("User successfully logged out");
  });
};