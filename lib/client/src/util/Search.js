import React, { Component, Fragment } from "react";
import styled from 'styled-components';
import axios from "axios";

// MUI stuff
import SearchIcon from "@material-ui/icons/Search";
import MyButton from "./MyButton";

export default class Search extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dropdownIsOpen: false,
      searchInput: "",
    }

    this.triggerDropdown = this.triggerDropdown.bind(this);
  }

  //Listen to where user clicks
  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);
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

    this.setState({ dropdownIsOpen: false });
  }

  triggerDropdown(e) {
    e.stopPropagation();
    this.setState(prevState => ({
      dropdownIsOpen: !prevState.dropdownIsOpen
    }), () => { //using callback to read the immediate state change
      if (this.state.dropdownIsOpen) {
        document.getElementById("dropdown").select();
      }
    });
  }

  //Search Functions
  handleOnChange = event => {
    this.setState({
      searchInput: event.target.value
    }, () => { //ASYNC callback (for immediate response)
      console.log(this.state.searchInput);
    });

    axios
      .get(`/users`)
      .then(res => {
        console.log(res.data);
        this.setState({
          results: res.data,
          showAlert: false
        });
      })
      .catch(err => {
        this.setState({
          showAlert: true
        });
        console.log("user does not exist ", this.state.results);
        console.log(err);
      });
  }

  handleSubmit(e) {
    e.preventDefaul(); //avoids default page reload
    console.log("input has submitted!");
  }

  render () {
    return (
      <SearchComponent
        ref={node => this.node = node}
        isOpen={this.state.dropdownIsOpen}
        onSubmit={this.handleSubmit} >
        <ExtendedInput
          isOpen={this.state.dropdownIsOpen}
          placeholder="search"
          id="dropdown"
          onChange={this.handleOnChange}/>
        <SearchButton isOpen={this.state.dropdownIsOpen}>
          <MyButton
            tip="Search"
            onClick={this.triggerDropdown} >
            <SearchIcon />
          </MyButton>
        </SearchButton>
        <Dropdown isOpen={this.state.searchInput.length > 0 && this.state.dropdownIsOpen} />
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
  padding: ${props => props.isOpen ? '12px' : '0px'};
  width: ${props => props.isOpen ? '184px' : '0'};
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
  transition: 250ms;
`

const Dropdown = styled.div`
  height: ${props => props.isOpen ? '300px' : '0'};
  width: ${props => props.isOpen ? '220px' : '0'};
  z-index: -1;
  position: absolute;
  background: white;
  ${'' /* display: ${props => props.isOpen ? '' : 'none'}; */}
  opacity: 0.9;
  border-radius: 8px;
  top: -25px;
  left: -6px;
  transition: 250ms;
  backdrop-filter: blur(10px);
  box-shadow: 0px 0px 15px 1px rgba(0,0,0,0.1);
`