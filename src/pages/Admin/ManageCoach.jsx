import React, { useEffect } from "react";
import { Fragment, useState, useRef } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import {
  Add,
  AlignHorizontalLeft,
  AlignVerticalTop,
  CheckCircleOutlineOutlined,
  DonutLarge,
  Edit,
  PersonAdd,
} from "@mui/icons-material";
import WorkCards from "../../components/WorkCards";
import { CircularProgress, IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import {adminDeleteProject, adminDeleteUser, adminGetAllCoach, userTasks, userWorks} from "../../api/index";
import WorkDetails from "../../components/WorkDetails";
import TaskCard from "../../components/TaskCard";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import AdminStudentCard from "./components/AdminStudentCards";
import AdminProfCard from "./components/AdminProfCards";
import Styled from "styled-components";

const Container = styled.div`
  padding: 14px 14px;
  @media screen and (max-width: 480px) {
    padding: 10px 10px;
  }
`;

const Header = styled.div``;

const Column = styled.div`
  display: flex;
  ${(props) =>
    props.alignment ? "flex-direction: column;" : "flex-direction: row;"}
  margin: 12px 0px;
  flex-wrap: wrap;
  align-items: stretch;
  @media screen and (max-width: 480px) {
    margin: 6px 0px;
    flex-direction: column;
  }
`;

const Title = styled.div`
  font-size: 24px;
  @media screen and (max-width: 480px) {
    font-size: 20px;
  }
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin-top: 6px;
  flex: 7;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
  line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Desc = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.soft2};
  margin-top: 6px;
  flex: 7;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
  line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 6px;
  margin-top: 14px;
`;

const Tag = styled.div`
  padding: 4px 10px;
  border-radius: 8px;
  color: ${({ tagColor, theme }) => tagColor + theme.lightAdd};
  background-color: ${({ tagColor, theme }) => tagColor + "10"};
  font-size: 12px;
  font-weight: 500;
`;

const Members = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 16px 0px;
`;

const AvatarGroup = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
`;

const InviteButton = styled.button`
  padding: 6px 14px;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  border-radius: 10px;
  transition: all 0.3s ease;
  margin: 0px 16px;
  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text};
  }
`;

const Hr = styled.hr`
  margin: 18px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft + "99"};
`;

const Body = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  @media screen and (max-width: 480px) {
    flex-direction: column;
  }
  gap: 20px;
`;

const Work = styled.div`
  flex: 1.6;
`;

const Allignment = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ToggleButton = styled.div`
  padding: 0px 16px;
  height: 26px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 2px solid ${({ theme }) => theme.soft2};
  color: ${({ theme }) => theme.soft2};
  border-radius: 5px;
  ${(props) => {
    if (props.button == "col") {
      return `border-radius: 5px 0px 0px 5px; border: 2px solid ${props.theme.soft2};`;
    }
    if (props.button == "row") {
      return `border-radius: 0px 5px 5px 0px; border: 2px solid ${props.theme.soft2};`;
    }
  }}
  ${(props) => {
    if (props.alignment && props.button == "col") {
      return `border-radius: 5px 0px 0px 5px; border: 2px solid ${props.theme.primary
        }; color: ${props.theme.primary}; background-color: ${props.theme.primary + "11"
        };`;
    }
    if (!props.alignment && props.button == "row") {
      return `border-radius: 0px 5px 5px 0px; border: 2px solid ${props.theme.primary
        }; color: ${props.theme.primary}; background-color: ${props.theme.primary + "11"
        };`;
    }
  }}
`;

const ItemWrapper = styled.div`
  width: 100%;
  height: 100%;

  @media screen and (max-width: 480px) {
    width: 94%;
  }
  padding: 4px 8px;
  text-align: left;
  margin: 2px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Top = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  margin-bottom: 4px;
`;

const Text = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Span = styled.span`
  color: ${({ theme }) => theme.soft2};
  font-weight: 400;
  margin-left: 8px;
`;

const Wrapper = styled.div`
  padding: 12px 0px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 12px;
  align-items: stretch;
`;

const AddNewButton = styled.div`
  padding: 5px;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.primary + "33"};
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
`;

const HrHor = styled.div`
  border: 0.5px solid ${({ theme }) => theme.soft + "99"};
`;

const IcoBtn = styled(IconButton)`
  color: ${({ theme }) => theme.textSoft} !important;
`;

const Extra = styled.div`
  flex: 1.2;
`;

const SubCards = styled.div`
  padding: 10px 12px 18px 12px;
  text-align: left;
  margin: 12px 0px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.card + "99"};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.09);
`;

const SubCardTop = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 3px 14px;
  color: ${({ theme }) => theme.text};
`;

const SubCardsTitle = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
  line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Tools = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 8px 8px;
`;

const Ideas = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 8px 8px;
`;

//tasks

const Table = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 6px 10px;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 10px;
  gap: 8px;
  border-radius: 8px 8px 0px 0px;
  border: 1.8px solid ${({ theme }) => theme.soft + "99"};
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  background-color: ${({ theme }) => theme.bgDark};
`;

const No = styled.div`
  width: 4%;
  font-size: 12px;
  text-overflow: ellipsis;
  font-weight: 500;
  color: ${({ theme }) => theme.soft2};
  display: -webkit-box;
  -webkit-line-clamp: 5; /* number of lines to show */
  line-clamp: 5;
  -webkit-box-orient: vertical;

  ${({ completed, theme }) =>
    completed === "Completed" &&
    `
    text-decoration: line-through;
    `}
`;

const Task = styled.div`
  width: 50%;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.soft2};
  display: -webkit-box;
  -webkit-line-clamp: 5; /* number of lines to show */
  line-clamp: 5;
  -webkit-box-orient: vertical;
  padding: 6px;

  ${({ completed, theme }) =>
    completed === "Completed" &&
    `
    text-decoration: line-through;
    `}
`;


const SectionTitle = Styled.div` 
  width: 100%;
  padding: 0px 12px;
  font-size: 22px;
  font-weight: 600;
  margin: 10px 0px 16px 0px;
  color: ${({ theme }) => theme.text};
`;

const Left = Styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 20px;
`;


const CreateButton = Styled.div`
  padding: 20px 30px;
  text-align: left;
  font-size: 16px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
  background: linear-gradient(76.35deg, #801AE6 15.89%, #A21AE6 89.75%);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.5s ease;
  &:hover {
    background: linear-gradient(76.35deg, #801AE6 15.89%, #A21AE6 89.75%);
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
  }
  gap: 14px;

  ${({ btn }) =>
    btn === "team" &&
    `
    background: linear-gradient(76.35deg, #FFC107 15.89%, #FFC107 89.75%);
    &:hover {
      background: linear-gradient(76.35deg, #FFC107 15.89%, #FFC107 89.75%);
      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
    }
  `}
`;

const Icon = Styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.text};
  color: ${({ theme }) => theme.primary};
  border-radius: 50%;
  padding: 4px;
`;

const ManageCoach = ({ setNewCoach }) => {
  const dispatch = useDispatch();
  const [coachs, setCoach] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const getCoach = async () => {
   await  adminGetAllCoach(token)
      .then((res) => {
        setCoach(res.data);
        setLoading(false);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const deleteCoach=async(workId)=> {
    console.log(workId)
    await adminDeleteUser(workId, token).then((res) => {
      window.location.reload(false);
      setLoading(false);
      console.log(res.data);
    }).catch((err) => {
      console.log("couldn't delete project because : " + err);
      setLoading(false);
    })
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    getCoach();
  }, []);


  return (
      <Container>
        {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '12px 0px', height: '300px' }}>
              <CircularProgress />
            </div>
        ) : (
            <Left>
                 <br></br>
              <CreateButton onClick={() => setNewCoach(true)}>
                <Icon>
                  <Add style={{ color: 'ActiveBorder' }} />
                </Icon>
                Create New coach
              </CreateButton>

              <SectionTitle>All coaches</SectionTitle>
              {
                coachs
                    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
                    .filter((item, index) => index < 6)
                    .map((prof, id) => (
                        <AdminProfCard
                            prof={prof} deleteUser={deleteCoach}
                        />
                    ))
              }
            </Left>


        )}
      </Container >
  );
};

export default ManageCoach;
