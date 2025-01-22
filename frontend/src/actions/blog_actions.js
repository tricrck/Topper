import axios from 'axios'
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
    COMMENT_LIKE_REQUEST,
    COMMENT_LIKE_SUCCESS,
    COMMENT_LIKE_FAIL,
    COMMENT_UNLIKE_REQUEST,
    COMMENT_UNLIKE_SUCCESS,
    COMMENT_UNLIKE_FAIL,
 } from '../constants/blog'

 const url = process.env.REACT_APP_API_URL;
 console.log(url)
 export const listBlogs = () => async (dispatch) => {
    try {
        dispatch({ type: BLOG_LIST_REQUEST })

        const { data } = await axios.get(`${url}/blogs`)

        dispatch({
            type: BLOG_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: BLOG_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        })
    }
}

export const getBlogDetails = (id) => async (dispatch) => {
    try {
      dispatch({ type: BLOG_DETAILS_REQUEST });
  
      const { data } = await axios.get(`${url}/blogs/${id}`);
  
      dispatch({
        type: BLOG_DETAILS_SUCCESS,
        payload: data
      });
    } catch (error) {
      dispatch({
        type: BLOG_DETAILS_FAIL,
        payload: error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      });
    }
  }

  // Create Blog
export const createBlog = (blogData) => async (dispatch) => {
  try {
      dispatch({ type: BLOG_CREATE_REQUEST });

      const { data } = await axios.post(`${url}/blogs`, blogData);

      dispatch({
          type: BLOG_CREATE_SUCCESS,
          payload: data,
      });
  } catch (error) {
      dispatch({
          type: BLOG_CREATE_FAIL,
          payload: error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
      });
  }
};

// Update Blog
export const updateBlog = (id, blogData) => async (dispatch) => {
  try {
      dispatch({ type: BLOG_UPDATE_REQUEST });

      const { data } = await axios.put(`${url}/blogs/${id}`, blogData);

      dispatch({
          type: BLOG_UPDATE_SUCCESS,
          payload: data,
      });
  } catch (error) {
      dispatch({
          type: BLOG_UPDATE_FAIL,
          payload: error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
      });
  }
};

// Delete Blog
export const deleteBlog = (id) => async (dispatch) => {
  try {
      dispatch({ type: BLOG_DELETE_REQUEST });

      await axios.delete(`${url}/blogs/${id}`);

      dispatch({
          type: BLOG_DELETE_SUCCESS,
      });
  } catch (error) {
      dispatch({
          type: BLOG_DELETE_FAIL,
          payload: error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
      });
  }
};

// Create Comment
// Modified createComment action to handle replies
export const createComment = (blogId, commentData) => async (dispatch) => {
    try {
        dispatch({ type: COMMENT_CREATE_REQUEST });

        const { data } = await axios.post(`${url}/blogs/${blogId}/comments`, {
            ...commentData,
            parentComment: commentData.parentId || null // Adding support for nested replies
        });

        dispatch({
            type: COMMENT_CREATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: COMMENT_CREATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Get Comments for a Blog
export const listComments = (blogId) => async (dispatch) => {
    try {
        dispatch({ type: COMMENT_LIST_REQUEST });

        const { data } = await axios.get(`${url}/blogs/${blogId}/comments`);

        dispatch({
            type: COMMENT_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: COMMENT_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Update Comment
export const updateComment = (blogId, commentId, commentData) => async (dispatch) => {
    try {
        dispatch({ type: COMMENT_UPDATE_REQUEST });

        const { data } = await axios.put(
            `${url}/blogs/${blogId}/comments/${commentId}`, 
            commentData
        );

        dispatch({
            type: COMMENT_UPDATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: COMMENT_UPDATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Delete Comment
export const deleteComment = (blogId, commentId) => async (dispatch) => {
    try {
        dispatch({ type: COMMENT_DELETE_REQUEST });

        await axios.delete(`${url}/blogs/${blogId}/comments/${commentId}`);

        dispatch({
            type: COMMENT_DELETE_SUCCESS,
        });
    } catch (error) {
        dispatch({
            type: COMMENT_DELETE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

export const likeComment = (blogId, commentId, userId) => async (dispatch) => {
    try {
        dispatch({ type: COMMENT_LIKE_REQUEST });

        const { data } = await axios.post(
            `${url}/blogs/${blogId}/comments/${commentId}/like`,
            { userId }
        );

        dispatch({
            type: COMMENT_LIKE_SUCCESS,
            payload: {
                commentId,
                likes: data.likes,
                userId
            },
        });
    } catch (error) {
        dispatch({
            type: COMMENT_LIKE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Unlike Comment
export const unlikeComment = (blogId, commentId, userId) => async (dispatch) => {
    try {
        dispatch({ type: COMMENT_UNLIKE_REQUEST });

        const { data } = await axios.post(
            `${url}/blogs/${blogId}/comments/${commentId}/unlike`,
            { userId }
        );

        dispatch({
            type: COMMENT_UNLIKE_SUCCESS,
            payload: {
                commentId,
                likes: data.likes,
                userId
            },
        });
    } catch (error) {
        dispatch({
            type: COMMENT_UNLIKE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};
