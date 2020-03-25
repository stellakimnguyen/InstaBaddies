import React, { Component, Fragment } from "react";
import styled from 'styled-components';
import axios from "axios";

// MUI stuff
import SearchIcon from "@material-ui/icons/Search";
import MyButton from "./MyButton";

var usersList;

export default class Search extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isSearching: false,
      searchInput: "",
      matchingSearch: [],
    }

    this.triggerDropdown = this.triggerDropdown.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.imageError = this.imageError.bind(this);
  }

  //Listen to where user clicks
  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);

    axios
      .get(`/users`)
      .then(res => {
        usersList = res.data;
      })
      .catch(err => {
        console.log(err);
    });
  }
  
  componentWillUnmount() {    
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  //Dropdown Functions
  handleClick = (e) => {
    if(this.node.contains(e.target)) {
      //click is on search component, continue
      return;
    }

    this.setState({ isSearching: false });
  }

  triggerDropdown(e) {
    e.stopPropagation();
    this.setState(prevState => ({
      isSearching: !prevState.isSearching
    }), () => { //using callback to read the immediate state change
      if (this.state.isSearching) {
        document.getElementById("dropdown").select();
      }
    });
  }

  //Search Functions
  handleOnChange = event => {
    this.setState({
      searchInput: event.target.value
    });

    let matched = usersList.filter(user => user.username.substring(0, this.state.searchInput.length) == this.state.searchInput);
    this.setState({ matchingSearch: matched });

    // axios
    //   .get(`/users`)
    //   .then(res => {
    //     this.setState({
    //       usersList: res.data,
    //       showAlert: false
    //     }, () => {
    //       console.log(this.state.usersList);
    //     });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }

  handleSubmit(e) {
    e.preventDefault(); //avoids default page reload
    
    const searchUser = this.state.searchInput.trim(); //removes white space
    const signedInAs = this.props.user.credentials.username;

    axios
      .get(`/user/${searchUser}`)
      .then(res => {
        console.log(res.data);
        this.setState({
          results: res.data,
          showAlert: false
        });
        console.log("user exists: ", this.state.results);
        this.props.history.push(`/users/${signedInAs}/${searchUser}`);
        //window.location.reload(false);
      })
      .catch(err => {
        this.setState({
          showAlert: true
        });
        console.log("user does not exist ", this.state.results);
        console.log(err);
      });
  }

  imageError(image) {
    console.log('invalid picture');
    image.onerror = null;
    image.src = "https://fertilitynetworkuk.org/wp-content/uploads/2017/01/Facebook-no-profile-picture-icon-620x389.jpg";
    return true;
  }

  render () {
    const searchList = this.state.matchingSearch.map((user, index) => {
      return (
        <span key={index}>
          <SearchImage
            src={user.imageUrl}
            onerror={(event) => { this.onerror=null; this.src="https://fertilitynetworkuk.org/wp-content/uploads/2017/01/Facebook-no-profile-picture-icon-620x389.jpg" }} />
          <div>{user.username}</div>
        </span>
      );
    });

    return (
      <SearchComponent
        ref={node => this.node = node}
        isOpen={this.state.isSearching}
        onSubmit={this.handleSubmit} >
        <ExtendedInput
          isOpen={this.state.isSearching}
          placeholder="search"
          id="dropdown"
          onChange={this.handleOnChange}
          autoComplete="off" />
        <SearchButton isOpen={this.state.isSearching}>
          <MyButton
            tip="Search"
            onClick={this.triggerDropdown} >
            <SearchIcon />
          </MyButton>
        </SearchButton>
        <Dropdown isOpen={this.state.searchInput.length > 0 && this.state.isSearching}>
          <SearchList>
            {searchList}
          </SearchList>
        </Dropdown>
      </SearchComponent>
    )
  }
}

//STYLED-COMPONENTS
const SearchComponent = styled.form`
 position: relative;
 display: flex;
 align-items: center;
`

const ExtendedInput = styled.input`
  padding: ${props => props.isOpen ? '12px 40px 12px 12px' : '0px'};
  width: ${props => props.isOpen ? '155px' : '0'};
  transition: 250ms;
  border: 0px;
  border-radius: 8px;
  opacity: 0.5;
  position: absolute;
  z-index: 0;
  background: #AEC4BB;

  :focus {
    outline-width: 0;
  }
`

const SearchButton = styled.div`
  position: absolute;
  left: ${props => props.isOpen ? '160px' : '0'};
  transition: 400ms;
`

const SearchImage = styled.img`
  border-radius: 50%;
  height: 30px;
  width: 30px;
`

const SearchList = styled.div`
  color: black;
`

const Dropdown = styled.div`
  max-height: ${props => props.isOpen ? '300px' : '0'};
  width: ${props => props.isOpen ? '200px' : '0'};
  z-index: -1;
  position: absolute;
  background: white;
  padding: ${props => props.isOpen ? '41px 10px 10px 10px' : '0'};
  opacity: 0.9;
  border-radius: 8px;
  top: -25px;
  left: -6px;
  transition: 250ms;
  backdrop-filter: blur(10px);
  box-shadow: 0px 0px 15px 1px rgba(0,0,0,0.1);
  overflow-y: hidden;

  div:first-child {
    display: ${props => props.isOpen ? '' : 'none'};
  }
`