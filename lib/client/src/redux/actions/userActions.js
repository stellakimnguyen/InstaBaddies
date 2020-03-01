import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI } from '../types';

export const loginUser = (userData) => (dispatch) => {
  // dispatch handles asynchronous code
  dispatch({ type: LOADING_UI });
  axios.post('/login', userData)
    .then(res => {
      console.log(res.data);
      localStorage.setItem('FBIdToken', `Bearer ${res.data.token}`);
      this.setState({
        loading: false
      })
      // react's way of redirecting to a URL
      // url in this case is home page
      this.props.history.push('/');
    })
    .catch(err => {
      this.setState({
        errors: err.response.data,
        loading: false
      })
    })

}