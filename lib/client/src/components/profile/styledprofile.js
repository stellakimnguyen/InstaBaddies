import styled from "styled-components";
import MuiLink from "@material-ui/core/link"
import Chip from '@material-ui/core/Chip';

export const ProfileContainer = styled.div`
  border-radius: 12px;
  padding: 20px;
  background: white;
  box-shadow: 0px 0px 15px 1px rgba(0,0,0,0.1);
  position: sticky;
  top: 80px;
`

export const SquareCrop = styled.div`
  width: 100%;
  text-align: center;
  position: relative;
  padding-bottom: 100%;
  border-radius: 50%;
  overflow: hidden;
`

export const ProfileImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
`

export const ChangeImage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #F5D961;
  margin: 0;
  padding: 0;
  font-size: 1.5vw;
  background: rgba(254, 156, 136, 0);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: 250ms;

  :hover {
    background: rgba(254, 156, 136, 0.5);
    backdrop-filter: blur(2px);
    opacity: 1;
  }
`

export const UserDetails = styled.div`
  text-align: center;

  & > * {
    margin-top: 15px;
  }
`

export const ProfileUsername = styled(MuiLink)`
  font-weight: 600;
  letter-spacing: 0.05em;
  font-size: 20px;
  margin-top: 10px;
`

export const JoinedDate = styled.span`
  color: #bbb;
  font-size: 12px;
  text-transform: lowercase;
  display: block;
`

export const WebsiteChip = styled(Chip)`
  width: 70%;
`

export const Logout = styled.div`
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #bbb;
  transition: 250ms;
  text-align: center;
  padding-top: 20px;
  cursor: pointer;

  :hover {
    color: #000;
  }
`