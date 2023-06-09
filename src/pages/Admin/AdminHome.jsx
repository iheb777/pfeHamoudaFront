import React, { useEffect } from "react";
import { Fragment, useState, useRef } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
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
import { CircularProgress, IconButton } from "@mui/material";

import { useDispatch } from "react-redux";
import {adminDeleteProject, deleteProject, getAllProjects, userTasks, userWorks} from "../../api/index";
import WorkDetails from "../../components/WorkDetails";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import AdminProjectCards from "./components/AdminProjectCards";

const Container = styled.div`
  padding: 14px 14px;
  @media screen and (max-width: 480px) {
    padding: 10px 10px;
  }
`;

const Header = styled.div``;


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




const AdminHome = () => {
  const { id } = useParams();
  const [item, setItems] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invitePopup, setInvitePopup] = useState(false);
  const [works, setWorks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [created, setCreated] = useState(false);
  const [currentWork, setCurrentWork] = useState({});
  const [openWork, setOpenWork] = useState(false);

  const token = localStorage.getItem("token");
  const dispatch = useDispatch();


  const deleteP=async(workId)=> {
    console.log(workId)
    await adminDeleteProject(workId, token).then((res) => {
      getWorks()
      setWorks(res.data);
      setLoading(false);
      console.log(res.data);
      window.location.reload(false);

    }).catch((err) => {
      console.log("couldn't delete project because : " + err);
      setLoading(false);
    })
  }
  const getWorks = async () => {
   await  getAllProjects(token)
      .then((res) => {
        setWorks(res.data);
        setLoading(false);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getTasks = async () => {
    await userTasks(token)
      .then((res) => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };


  useEffect(() => {
    window.scrollTo(0, 0);
    getWorks();
    getTasks();
  }, []);

  const [alignment, setAlignment] = React.useState(true);

  return (
    <Container>
      {openWork && <WorkDetails setOpenWork={setOpenWork} work={currentWork} />}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '12px 0px', height: '300px' }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <Header></Header>
          <Body>
            <Work>
              <Allignment>
                <ToggleButton
                  alignment={alignment}
                  button={"col"}
                  onClick={() => setAlignment(true)}
                >
                  <AlignHorizontalLeft sx={{ fontSize: "18px" }} />
                </ToggleButton>
                <ToggleButton
                  alignment={alignment}
                  button={"row"}
                  onClick={() => setAlignment(false)}
                >
                  <AlignVerticalTop sx={{ fontSize: "18px" }} />
                </ToggleButton>
              </Allignment>
                <ItemWrapper>
                  <Top>
                    <Text>
                      <DonutLarge sx={{ color: "#1976D2", fontSize: "20px" }} />
                      All project
                      <Span>
                        ({" "}
                        {
                          works.length
                        }{" "}
                        )
                      </Span>
                    </Text>
                  </Top>
                  <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 2 }}>
                    <Masonry gutter="14px">
                      {works
                        .map((item) => (
                          <div>
                            <AdminProjectCards status="In Progress" work={item} deleteProject={deleteP} />
                          </div>
                        ))}
                    </Masonry>
                  </ResponsiveMasonry>
                </ItemWrapper>
            </Work>
          </Body>
        </>
      )}
    </Container>
  );
};

export default AdminHome;
