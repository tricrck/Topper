import { createStore, combineReducers, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { PortfolioReducer,
    portfolioCreateReducer,
    portfolioDeleteReducer,
    portfolioUpdateReducer,
    portfolioSearchReducer,
    portfolioDetailsReducer
 } from './reducers/PortfolioReducer'
import { TestimonialReducer,
    testimonialCreateReducer,
    testimonialUpdateReducer,
    testimonialDeleteReducer,
    testimonialDetailsReducer
 } from './reducers/TestimonialReducer'
import { BlogReducer, blogDetailsReducer, blogCreateReducer, blogDeleteReducer, blogUpdateReducer,
    commentCreateReducer,
    commentListReducer,
    commentUpdateReducer,
    commentDeleteReducer,
    commentLikeReducer,
    commentUnlikeReducer,
 } from './reducers/BlogReducer'

 import {
    authReducer,
    usersReducer,
  } from './reducers/UserReducer';


const reducer = combineReducers({
    // Portfolio reducers
    portfolioList: PortfolioReducer,
    portfolioCreate: portfolioCreateReducer,
    portfolioUpdate: portfolioUpdateReducer,
    portfolioDelete: portfolioDeleteReducer,
    portfolioSearch: portfolioSearchReducer,
    portfolioDetails: portfolioDetailsReducer,

    // Testimonial reducers
    testimonialsList: TestimonialReducer,
    testimonialCreate: testimonialCreateReducer,
    testimonialUpdate: testimonialUpdateReducer,
    testimonialDelete: testimonialDeleteReducer,
    testimonialDetails: testimonialDetailsReducer,

    // Blog reducers
    blogList: BlogReducer,
    blogDetails: blogDetailsReducer,
    blogCreate: blogCreateReducer,
    blogUpdate: blogUpdateReducer,
    blogDelete: blogDeleteReducer,
    commentCreate: commentCreateReducer,
    commentList: commentListReducer,
    commentUpdate: commentUpdateReducer,
    commentDelete: commentDeleteReducer,
    commentLike: commentLikeReducer,
    commentUnlike: commentUnlikeReducer,

    // User Reducers
    auth: authReducer,
    users: usersReducer,


})

const TestimoniesFromStorage = localStorage.getItem('testimonialsList') ?
    JSON.parse(localStorage.getItem('testimonialsList')) : []

const authFromStorage = localStorage.getItem('auth') ?
    JSON.parse(localStorage.getItem('auth')) : []


const initialState = {
    testimonialsList: TestimoniesFromStorage,
    auth: authFromStorage,
}
    

const middleware = [thunk]

const store = createStore(reducer, initialState,
    composeWithDevTools(applyMiddleware(...middleware)))

export default store