import React, { Component, Fragment } from "react";
import styled from 'styled-components';
import axios from "axios";

// MUI stuff
import SearchIcon from "@material-ui/icons/Search";
import MyButton from "./MyButton";

import noprofileimg from "../images/no-profile-image.png";

var usersList;

export default class Search extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isSearching: false,
      searchInput: "",
      matchingSearch: [],
      searchIsEmpty: false,
    }

    this.triggerDropdown = this.triggerDropdown.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleEscape = (event) => {
    if(event.keyCode === 27){
      this.triggerDropdown(event);
    }
  }

  //Search Functions
  handleOnChange = event => {
    this.setState({
      searchInput: event.target.value
    }, () => { // callback used to filter in realtime
      let matched = usersList.filter(user => user.username.substring(0, this.state.searchInput.length) == this.state.searchInput);
      this.setState({ matchingSearch: matched }, () => {
        this.state.matchingSearch.length != 0 ? this.setState({ searchIsEmpty: false }) : this.setState({ searchIsEmpty: true });
      });
    });
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

  onSearchClick(username) {
    const signedInAs = this.props.user.credentials.username;
    const searchUser = username;
    
    this.props.history.push(`/users/${signedInAs}/${searchUser}`);
    window.location.reload(false);
  }

  render () {
    const searchList = this.state.matchingSearch.map((user, index) => {
      return (
        <SearchItem key={index} onClick={() => this.onSearchClick(user.username)} >
          <SearchImage
            src={user.imageUrl}
            onError={(e) => {
              e.target.onerror = null 
              e.target.src = noprofileimg}
            } />
          <SearchUser>{user.username}</SearchUser>
        </SearchItem>
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
          autoComplete="off"
          onKeyDown={this.handleEscape} />
        <SearchButton isOpen={this.state.isSearching}>
          <MyButton
            tip="Search"
            onClick={this.triggerDropdown} >
            <SearchIcon />
          </MyButton>
        </SearchButton>
        <Dropdown isOpen={this.state.searchInput.length > 0 && this.state.isSearching}>
          <SearchList>
            {searchList.length == 0 ? <NoImage>no user found</NoImage> : searchList}
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

const SearchItem = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  cursor: pointer;

  :hover {
    background-color: #deeae5;
    color: white;
  }
`

const SearchImage = styled.img`
  border-radius: 50%;
  height: 30px;
  width: 30px;
  object-fit: cover;
`

const NoImage = styled.div`
  color: #bfbfbf;
  padding-left: 10px;
`

const SearchUser = styled.div`
  display: inline;
  padding-left: 10px;
`

const SearchList = styled.div`
  color: #3b3b3b;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-right: 8px;

  &::-webkit-scrollbar {
    width: 7px;
  }

  &::-webkit-scrollbar-track {
    background: #e8e8e8;
    border-radius: 7px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d1d1;
    border-radius: 7px;

    :hover {
      background: #a8a8a8;
    }
  }
`

const Dropdown = styled.div`
  max-height: ${props => props.isOpen ? '300px' : '0'};
  width: ${props => props.isOpen ? '219px' : '0'};
  z-index: -1;
  position: absolute;
  background: white;
  padding: ${props => props.isOpen ? '50px 0px 10px 0px' : '0'};
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