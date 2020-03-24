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
    }));
  }

  render () {
    return (
      <div>
        <ExtendedDropdown isOpen={this.state.dropdownIsOpen} />
        <MyButton tip="Search" onClick={this.triggerDropdown}>
          <SearchIcon />
        </MyButton>
      </div>
    )
  }
}

const ExtendedDropdown = styled.input`
  height: 30px;
  width: ${props => props.isOpen ? '100px' : '0px'};
  transition: 250ms;
`