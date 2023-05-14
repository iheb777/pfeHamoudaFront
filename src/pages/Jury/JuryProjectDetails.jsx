import React, {useEffect} from "react";
import {Fragment, useState, useRef} from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {useParams} from "react-router-dom";
import {
    Add,
    AlignHorizontalLeft,
    AlignVerticalTop,
    CheckCircleOutlineOutlined,
    Delete,
    DonutLarge,
    Edit,
    PersonAdd,
} from "@mui/icons-material";
import {tagColors} from "../../data/data";
import WorkCards from "../../components/WorkCards";
import MemberCard from "../../components/MemberCard";
import {CircularProgress, IconButton, Rating} from "@mui/material";
import ToolsCard from "../../components/ToolsCard";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import {openSnackbar} from "../../redux/snackbarSlice";
import {useDispatch, useSelector} from "react-redux";
import {addComment, addScore, getComments, getProjectDetails, getScore, getWorks} from "../../api/index";
import InviteMembers from "../../components/InviteMembers";
import AddWork from "../../components/AddWork";
import WorkDetails from "../../components/WorkDetails";
import UpdateProject from "../../components/UpdateProject";
import DeletePopup from "../../components/DeletePopup";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import AddComment from "./components/AddComment";
import CommentCard from "./components/CommentCard";
import commentCard from "./components/CommentCard";

const Container = styled.div`
  padding: 14px 14px;
  @media screen and (max-width: 480px) {
    padding: 10px 10px;
  }
`;

const Header = styled.div``;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin: 12px 0px;
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
  color: ${({theme}) => theme.text};
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
  color: ${({theme}) => theme.soft2};
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
  color: ${({tagColor, theme}) => tagColor + theme.lightAdd};
  background-color: ${({tagColor, theme}) => tagColor + "10"};
  font-size: 12px;
  font-weight: 500;
`;

const Members = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 8px 0px 0px 0px;
`;

const AvatarGroup = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
`;

const InviteButton = styled.button`
  padding: 6px 14px;
  background-color: transparent;
  border: 1px solid ${({theme}) => theme.primary};
  color: ${({theme}) => theme.primary};
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
    background-color: ${({theme}) => theme.primary};
    color: ${({theme}) => theme.text};
  }
`;

const Hr = styled.hr`
  margin: 18px 0px;
  border: 0.5px solid ${({theme}) => theme.soft + "99"};
`;


const TextArea = styled.textarea`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  font-family: "Poppins", sans-serif;
  padding: 8px 0px;
  color: ${({theme}) => theme.textSoft};
`;
const OutlinedBox = styled.div`
  min-height: 34px;
  border-radius: 8px;
  border: 1px solid ${({theme}) => theme.soft2};
  color: ${({theme}) => theme.soft2};
  ${({button, theme}) =>
          button &&
          `
    user-select: none; 
  border: none;
  font-weight: 600;
  height: 38px;
    background: ${theme.soft};
    color:'${theme.soft2}';`}
  ${({activeButton, theme}) =>
          activeButton &&
          `
    user-select: none; 
  border: none;
  height: 38px;
    background: ${theme.primary};
    color: white;`}
  margin: 6px 0px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  padding: 0px 10px;
`;


const Body = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  @media screen and (max-width: 1000px) {
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
  border: 2px solid ${({theme}) => theme.soft2};
  color: ${({theme}) => theme.soft2};
  border-radius: 5px;
  ${(props) => {
    if (props.button == "row") {
      return `border-radius: 5px 0px 0px 5px; border: 2px solid ${props.theme.soft2};`;
    }
    if (props.button == "col") {
      return `border-radius: 0px 5px 5px 0px; border: 2px solid ${props.theme.soft2};`;
    }
  }}
  ${(props) => {
    if (props.alignment && props.button == "row") {
      return `border-radius: 5px 0px 0px 5px; border: 2px solid ${props.theme.primary
      }; color: ${props.theme.primary}; background-color: ${props.theme.primary + "11"
      };`;
    }
    if (!props.alignment && props.button == "col") {
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
  color: ${({theme}) => theme.text};
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
  color: ${({theme}) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Span = styled.span`
  color: ${({theme}) => theme.soft2};
  font-weight: 400;
  margin-left: 8px;
`;

const Wrapper = styled.div`
  padding: 12px 0px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 12px;
`;

const AddNewButton = styled.div`
  padding: 5px;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: ${({theme}) => theme.primary + "33"};
  color: ${({theme}) => theme.primary};
  cursor: pointer;
`;

const HrHor = styled.div`
  border: 0.5px solid ${({theme}) => theme.soft + "99"};
`;

const IcoBtn = styled(IconButton)`
  color: ${({theme}) => theme.textSoft} !important;
`;

const Extra = styled.div`
  flex: 1;
`;

const SubCards = styled.div`
  padding: 10px 12px 18px 12px;
  text-align: left;
  margin: 12px 0px;
  border-radius: 10px;
  background-color: ${({theme}) => theme.card + "99"};
  color: ${({theme}) => theme.text};
  cursor: pointer;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.09);
`;

const SubCardTop = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 3px 4px;
  color: ${({theme}) => theme.text};
`;

const SubCardsTitle = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: ${({theme}) => theme.text};
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

const JuryProjectDetails = () => {
    const {id} = useParams();
    const [item, setItems] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [invitePopup, setInvitePopup] = useState(false);
    const [works, setWorks] = useState([]);
    const [created, setCreated] = useState(false);
    const [currentWork, setCurrentWork] = useState({});

    const [openWork, setOpenWork] = useState(false);
    const [comments, setComments] = useState([]);

    const token = localStorage.getItem("token");

    const [openUpdate, setOpenUpdate] = useState({state: false, type: "all", data: item});

    const [openDelete, setOpenDelete] = useState({state: false, type: "Project", data: item, token: token});

    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);

    const [score, setScore] = useState(0);
    const [bcm1, setBcm1] = useState(0);
    const [bcm2, setBcm2] = useState(0);


    const getproject = async () => {
        await getProjectDetails(id, token)
            .then((res) => {
                setItems(res.data);
                setMembers(res.data.members);
                getProjectComment(id)
                getProjectScore(id)
            })
            .then(() => {
                setLoading(false);
            })
            .catch((err) => {
                dispatch(
                    openSnackbar({
                        message: err.response.data.message,
                        severity: "error",
                    })
                );
            });
    };

    const goToAddScore = () => {
        setLoading(true);
        addScore(id, {userId: currentUser._id, score : score, bcm1: bcm1, bcm2: bcm2}, token)
            .then((res) => {
                setLoading(false);
                // window.location.reload(false);
               // setCreated(true);
                dispatch(
                    openSnackbar({
                        message: "Rated Successfully",
                        severity: "success",
                    })
                );
            })
            .catch((err) => {
                console.log(err);
                dispatch(
                    openSnackbar({
                        message: err.message,
                        severity: "error",
                    })
                );
                setLoading(false);
            });

    };


    const getProjectComment = async (id) => {
        await getComments(id, token)
            .then((res) => {
                setComments(res.data);
            })
            .catch((err) => {
                dispatch(
                    openSnackbar({
                        message: err.response.data.message,
                        severity: "error",
                    })
                );
            });
    };

    const getProjectScore = async (id) => {
        await getScore(id, token)
            .then((res) => {
                let myData=res.data[0];
                setScore(myData.score);
                setBcm1(myData.bcm1);
                setBcm2(myData.bcm2);
                console.log("---------------");
                console.log(res.data[0]);
            })
            .catch((err) => {
                dispatch(
                    openSnackbar({
                        message: err.response.data.message,
                        severity: "error",
                    })
                );
            });
    };


    const getProjectWorks = async (id) => {
        await getWorks(id, token)
            .then((res) => {
                setWorks(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                dispatch(
                    openSnackbar({
                        message: err.response.data.message,
                        severity: "error",
                    })
                );
            });
    };

    const openWorkDetails = (work) => {
        setCurrentWork(work);
        setOpenWork(true);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        getproject();
    }, [openWork, openUpdate]);

    useEffect(() => {
        getProjectWorks(id);
    }, [created]);

    const [alignment, setAlignment] = React.useState(true);


    return (
        <Container>
            {openWork && <WorkDetails setOpenWork={setOpenWork} work={currentWork}/>}
            {openUpdate.state &&
                <UpdateProject openUpdate={openUpdate} setOpenUpdate={setOpenUpdate} type={openUpdate.type}/>}
            {openDelete.state && <DeletePopup openDelete={openDelete} setOpenDelete={setOpenDelete}/>}
            {loading ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '12px 0px',
                    height: '300px'
                }}>
                    <CircularProgress/>
                </div>
            ) : (
                <>
                    <Header>
                        <Title>{item.title}</Title>
                        <Desc>{item.desc}</Desc>
                        <Tags>
                            {item.tags.map((tag) => (
                                <Tag
                                    tagColor={
                                        tagColors[Math.floor(Math.random() * tagColors.length)]
                                    }
                                >
                                    {tag}
                                </Tag>
                            ))}
                        </Tags>
                        <Members>
                            <AvatarGroup>
                                {members.map((member) => (
                                    <Avatar
                                        sx={{marginRight: "-12px", width: "38px", height: "38px"}}
                                        src={member.id.img}
                                    >
                                        {member.id.name.charAt(0)}
                                    </Avatar>
                                ))}
                            </AvatarGroup>
                            <InviteButton onClick={() => setInvitePopup(true)}>
                                <PersonAdd sx={{fontSize: "12px"}}/>
                                Invite
                            </InviteButton>
                        </Members>

                        <Hr/>
                        {invitePopup && (
                            <InviteMembers
                                setInvitePopup={setInvitePopup}
                                id={id}
                                teamInvite={false}
                            />
                        )}
                    </Header>
                    <Body>
                        <Work>
                            <Allignment>
                                <ToggleButton
                                    alignment={alignment}
                                    button={"row"}
                                    onClick={() => setAlignment(true)}
                                >
                                    <AlignVerticalTop sx={{fontSize: "18px"}}/>
                                </ToggleButton>
                                <ToggleButton
                                    alignment={alignment}
                                    button={"col"}
                                    onClick={() => setAlignment(false)}
                                >
                                    <AlignHorizontalLeft sx={{fontSize: "18px"}}/>
                                </ToggleButton>
                            </Allignment>
                            <Column alignment={alignment}>
                                <ItemWrapper>
                                    <Top>
                                        <Text>
                                            <DonutLarge sx={{color: "#1976D2", fontSize: "20px"}}/>
                                            In Progress
                                            <Span>(
                                                {
                                                    works.filter(
                                                        (item) => item.status === "Working"
                                                    ).length
                                                }
                                                )</Span>
                                        </Text>
                                    </Top>
                                    <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 2}}>
                                        <Masonry gutter="14px">
                                            {works.filter((item) => item.status === "Working")
                                                .map((item) => (
                                                    <div onClick={() => openWorkDetails(item)}>
                                                        <WorkCards
                                                            status="In Progress"
                                                            work={item}
                                                        />
                                                    </div>
                                                ))}
                                        </Masonry>
                                    </ResponsiveMasonry>
                                </ItemWrapper>
                                <ItemWrapper>
                                    <Top>
                                        <Text>
                                            <CheckCircleOutlineOutlined
                                                sx={{color: "#67BC6D", fontSize: "20px"}}
                                            />
                                            Completed

                                            <Span>(
                                                {
                                                    works
                                                        .filter(
                                                            (item) => item.status === "Completed"
                                                        ).length
                                                }
                                                )</Span>
                                        </Text>
                                    </Top>
                                    <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 2}}>
                                        <Masonry gutter="14px">
                                            {works.filter((item) => item.status === "Completed")
                                                .map((item) => (
                                                    <div onClick={() => openWorkDetails(item)}>
                                                        <WorkCards
                                                            status="Completed"
                                                            work={item}
                                                        />
                                                    </div>
                                                ))}
                                        </Masonry>
                                    </ResponsiveMasonry>
                                </ItemWrapper>
                            </Column>
                        </Work>
                        <HrHor/>
                        <Extra>
                            <SubCards>
                                <SubCardTop>
                                    <SubCardsTitle>Members</SubCardsTitle>
                                    <IcoBtn onClick={() => setOpenUpdate({state: true, type: 'member', data: item})}>
                                        <Edit sx={{fontSize: "16px"}}/>
                                    </IcoBtn>
                                </SubCardTop>
                                {members.map((member) => (
                                    <MemberCard member={member}/>
                                ))}
                            </SubCards>
                            <SubCards>
                                <SubCardTop>
                                    <SubCardsTitle>Score</SubCardsTitle>
                                         <Rating
                                            value={score}
                                            onChange={(event, newValue) => {
                                                setScore(newValue);
                                            }}
                                        ></Rating>
                                        <OutlinedBox
                                            button
                                            activeButton
                                            style={{marginTop: "14px"}}
                                            onClick={() => goToAddScore()}
                                        >
                                            Update
                                        </OutlinedBox>
                                 </SubCardTop>
                                <SubCardTop>
                                    <SubCardsTitle>BCM1</SubCardsTitle>

                                        <OutlinedBox>
                                            <TextArea
                                                placeholder={bcm1}
                                                name="bcm1"
                                                rows={1}
                                                value={bcm1}
                                                onChange={(e) => setBcm1(e.target.value)}
                                            />
                                        </OutlinedBox>
                                        <OutlinedBox
                                            button
                                            activeButton
                                            style={{marginTop: "14px"}}
                                            onClick={() => goToAddScore()}
                                        >
                                            Update
                                        </OutlinedBox>

                                </SubCardTop>
                                <SubCardTop>
                                    <SubCardsTitle>BCM2</SubCardsTitle>

                                        <OutlinedBox>
                                            <TextArea
                                                placeholder={bcm2}
                                                name="bcm2"
                                                rows={1}
                                                value={bcm2}
                                                onChange={(e) => setBcm2(e.target.value)}
                                            />
                                        </OutlinedBox>
                                        <OutlinedBox
                                            button
                                            activeButton
                                            style={{marginTop: "14px"}}
                                            onClick={() => goToAddScore()}
                                        >
                                            Update
                                        </OutlinedBox>

                                </SubCardTop>
                            </SubCards>
                        </Extra>
                    </Body>
                </>
            )}

            <SubCards>
                <SubCardTop>
                    <SubCardsTitle>Comments</SubCardsTitle>
                </SubCardTop>
                {comments.map((item) => (
                    <CommentCard member={item}/>
                ))}
            </SubCards>
            <AddComment
                ProjectMembers={members}
                ProjectId={id}
                setCreated={setCreated}
            />

        </Container>
    );
};

export default JuryProjectDetails;
