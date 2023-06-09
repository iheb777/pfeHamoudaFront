import React, { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import { Link } from "react-router-dom";
import {
  Add,
  Dashboard,
  CloseRounded,
  Groups2Rounded,
  HubRounded,
  Logout,
  StreamRounded,
  WorkspacesRounded,
  Public,
  AccountTreeRounded,
  DashboardRounded,
  AddTaskRounded, AccessibilityNew,
} from "@mui/icons-material";
import { tagColors } from "../../../data/data";
import LogoIcon from "../../../Images/Logo.svg";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/userSlice";
import { openSnackbar } from "../../../redux/snackbarSlice";
import axios from "axios";
import { useSelector } from "react-redux";
import { getUsers, notifications } from "../../../api/index";
import { useNavigate } from 'react-router-dom';
import { Avatar, CircularProgress } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

const Container = styled.div`
  flex: 1.3;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 100vh;
  border-top-right-radius: 14px;
  border-bottom-right-radius: 14px;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  position: sticky;
  top: 0;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.04);
  transition: 0.3s ease-in-out;
  @media (max-width: 1100px) {
    position: fixed;
    z-index: 100;
    width: 100%;
    max-width: 250px;
    left: ${({ setMenuOpen }) => (setMenuOpen ? "0" : "-100%")};
    transition: 0.3s ease-in-out;
  }
`;
const ContainerWrapper = styled.div`
  height: 90%;
  overflow-y: scroll !important;
  margin-top: 0px;
`;
const Space = styled.div`
  height: 50px;
`;
const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px;
`;

const Logo = styled.div`
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 2px;
  font-weight: bold;
  font-size: 20px;
`;

const Close = styled.div`
  display: none;
  @media (max-width: 1100px) {
    display: block;
  }
`;

const Image = styled.img`
  height: 22px;
`;

const Item = styled.div`
  display: flex;
  color: ${({ theme }) => theme.itemText};
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 7.5px 26px;
  &:hover {
    background-color: ${({ theme }) => theme.itemHover};
  }
`;

const Hr = styled.hr`
  margin: 15px 15px 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Title = styled.h2`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSoft + "99"};
  margin-bottom: 4px;
  padding: 0px 26px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TeamIcon = styled(WorkspacesRounded)`
  color: ${({ tagColor }) => tagColor};
  font-size: 18px;
  margin-left: 2px;
`;

const AdminMenu = ({ darkMode, setDarkMode, setMenuOpen, setNewTeam }) => {
  const [teamsLoading, setTeamsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutUser = () => {
    dispatch(logout());
    navigate(`/`);
  };

  const [team, setTeams] = useState([]);
  const { currentUser } = useSelector(state => state.user);

  const getteams = async () => {
    setTeamsLoading(true);
   await getUsers(token)
      .then((res) => {
        setTeams(res.data.teams);
        setTeamsLoading(false);
      })
      .catch((err) => {
        dispatch(openSnackbar({ message: err.message, type: "error" }));
        if (err.response.status === 401 || err.response.status === 402) logoutUser();
      });
  };


  useEffect(() => {
    getteams();
  }, [currentUser]);

  return (
    <Container setMenuOpen={setMenuOpen}>
      <Flex>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Logo>
            <Image src={LogoIcon} />
               Coach
          </Logo>
        </Link>
        <Close>
          <CloseRounded onClick={() => setMenuOpen(false)} />
        </Close>
      </Flex>
      <ContainerWrapper>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Item>
            <DashboardRounded />
            Dashboard
          </Item>
        </Link>
        <Hr />
        <Item onClick={() => setDarkMode(!darkMode)}>
          <SettingsBrightnessOutlinedIcon />
          {darkMode ? "Light" : "Dark"} Mode
        </Item>
        <Item onClick={() => logoutUser()}>
          <Logout />
          Logout
        </Item>
        <Space />
      </ContainerWrapper>
    </Container >
  );
};

export default AdminMenu;
