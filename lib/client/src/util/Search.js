import React, { Component, Fragment } from "react";
import styled from 'styled-components';

// MUI stuff
import SearchIcon from "@material-ui/icons/Search";
import MyButton from "./MyButton";

export default class Search extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dropdownIsOpen: false,
    }

    this.triggerDropdown = this.triggerDropdown.bind(this);
  }

  triggerDropdown(e) {
    //e.stopPropagation();
    this.setState(prevState => ({
      dropdownIsOpen: !prevState.dropdownIsOpen
    }), () => { //using callback to read the immediate state change
      if (this.state.dropdownIsOpen) {
        document.getElementById("dropdown").select();
      }
    });
  }

  render () {
    return (
      <SearchComponent isOpen={this.state.dropdownIsOpen}>
        <ExtendedInput
          isOpen={this.state.dropdownIsOpen}
          placeholder="search"
          id="dropdown" />
        <SearchButton
          tip="Search"
          onClick={this.triggerDropdown}
          isOpen={this.state.dropdownIsOpen} >
          <SearchIcon />
        </SearchButton>
        <Dropdown isOpen={this.state.dropdownIsOpen} />
      </SearchComponent>
    )
  }
}

//STYLED-COMPONENTS
const SearchComponent = styled.div`
 position: relative;
 display: flex;
 align-items: center;
`

const ExtendedInput = styled.input`
  padding: ${props => props.isOpen ? '12px 12px 12px 45px' : '0px'};
  width: ${props => props.isOpen ? '150px' : '0'};
  transition: 250ms;
  border: 0px;
  border-radius: 8px;
  opacity: 0.5;
  position: absolute;
  z-index: 1;
  background: #AEC4BB;
`

const SearchButton = styled(MyButton)`
  position: absolute;
  z-index: 10;
  transition: 250ms;
`

const Dropdown = styled.div`
  height: 300px;
  width: 220px;
  z-index: 0;
  position: absolute;
  background: white;
  display: ${props => props.isOpen ? '' : 'none'};
  opacity: 0.9;
  border-radius: 8px;
  top: -3px;
  left: -6px;
  transition: 250ms;
`