import styled from 'styled-components';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export const Container = styled.div`
  display: table;
  height: calc(100vh - 95px);
  text-align: center;
  margin-left: auto;
  margin-right: auto;
`

export const Content = styled.div`
  display: table-cell;
  vertical-align: middle;
`

export const PageTitle = styled.div`
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 10px;
`

export const LoginForm = styled.form`
  display: block;
`

export const InfoInput = styled(TextField)`
  background: white;
`

export const LoginButton = styled(Button)`
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  position: relative;
  background: linear-gradient(45deg, #F5D961 30%, #FE9C88 90%);
  color: white;
  font-weight: 600;
  border: 0;
  border-radius: 10px;
`