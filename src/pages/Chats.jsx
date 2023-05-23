import React, {useEffect, useState} from 'react'
import ChatContainer from '../components/ChatContainer'
import ChatContact from '../components/ChatContact'
import styled from 'styled-components'
import {addChat, addComment, getChat, getComments} from "../api";
import {openSnackbar} from "../redux/snackbarSlice";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {Avatar, CircularProgress, IconButton} from "@mui/material";
import {ArrowBack, AttachFile, DoneAll, Telegram} from "@mui/icons-material";
import CommentCard from "./Coach/components/CommentCard";
import {tagColors} from "../data/data";


const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  margin: 20px 0px 20px ;
  flex-direction: column;
  background-color: ${({theme}) => theme.card};
`

const TopBar = styled.div`
  height: 70px;
  border-bottom: 1px solid ${({theme}) => theme.soft};
  display: flex;
  align-items: center;
  padding: 0px 16px;
  @media (max-width: 800px) {
    height: 60px;
    padding: 0px 16px 0px 6px;
  }
`

const Chat = styled.div`
  flex: 1;
  overflow-y: scroll;
  padding: 20px 6px;
  background-color: ${({theme}) => theme.chat_background};
  @media (max-width: 800px) {
    padding: 20px 0;
  }

`

const RecievedMessage = styled.p`
  margin: 16px 16px 0 16px;
  padding: 12px 16px;
  background-color: ${({theme}) => theme.recieve_message};
  border-radius: 12px;
  color: ${({theme}) => theme.text};
  font-size: 14px;
  max-width: 70%;
  width: fit-content;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
  position: relative;

  &:after {
    content: '';
    position: absolute;
    visibility: visible;
    top: 0px;
    left: -10px;
    border: 10px solid transparent;
    border-top: 10px solid ${({theme}) => theme.recieve_message};
    clear: both;
  }
`

const SentMessage = styled.p`
  margin: 16px 16px 0 auto;
  padding: 12px 16px;
  background-color: ${({theme}) => theme.send_message};
  border-radius: 12px 0px 12px 12px;
  color: ${({theme}) => theme.send_message_text_color};
  font-size: 14px;
  max-width: 70%;
  width: fit-content;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
  position: relative;

  &:after {
    content: '';
    position: absolute;
    visibility: visible;
    top: 0px;
    right: -10px;
    border: 10px solid transparent;
    border-top: 10px solid ${({theme}) => theme.send_message};
    clear: both;
  }
`

const Time = styled.span`
  font-size: 12px;
  padding: 10px 16px;
  color: ${({theme}) => theme.soft2};
  margin: 0 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  ${({message}) => message === 'recieved' && `
        justify-content: flex-start;
    `}
`

const SendMessage = styled.div`
  min-height: 70px;
  margin: 10px;
  border-top: 1px solid ${({theme}) => theme.soft};
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 10px;
  @media (max-width: 800px) {
    position: fixed;
    background-color: ${({theme}) => theme.card};
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    gap: 6px;
    padding: 0 2px;
  }
`

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  gap: 4px;
`
const Name = styled.span`
  font-weight: 600;
  font-size: 16px;
  color: ${({theme}) => theme.text};
`
const Status = styled.span`
  font-size: 12px;
  color: ${({theme}) => theme.text};
`

const MessageBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: ${({theme}) => theme.bg};
  border-radius: 12px;
  padding: 16px 8px;
`


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
  margin: 10px;
  padding: 0px 10px;
`;


const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 85vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 12px 0px;
  @media (max-width: 800px) {
    height: 82vh;
    border-radius: 0px;
    height: 87vh;
  }
`

const TextArea = styled.textarea`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  margin: 10px 10px;
  background-color: transparent;
  outline: none;
  font-family: "Poppins", sans-serif;
  padding: 8px 0px;
  color: ${({theme}) => theme.textSoft};
`;

const Tag = styled.div`
  padding: 10px 20px;
  margin: 10px 200px;
  border-radius: 8px;
  color: ${({ tagColor, theme }) => tagColor + theme.lightAdd};
  background-color: ${({ tagColor, theme }) => tagColor + "10"};
  font-size: 12px;
  font-weight: 200;
`;



const Chats = () => {
    //get the window size and hide the chat container for mobile and dislay it for desktop
    const {id} = useParams();
    const [width, setWidth] = React.useState(window.innerWidth)
    const breakpoint = 768

    useEffect(() => {
        const handleWindowResize = () => setWidth(window.innerWidth)
        window.addEventListener("resize", handleWindowResize)
        return () => window.removeEventListener("resize", handleWindowResize)
    }, [])

    const [showChat, setShowChat] = React.useState(false)
    const token = localStorage.getItem("token");
    const [chats, setChats] = useState([]);
    const dispatch = useDispatch();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const {currentUser} = useSelector((state) => state.user);
    const [projectDetails, setProjectDetails] = useState([]);

    const addMessage = () => {
        //check if all the fields are filled
        if (!message) {
            alert("Please fill all the fields");
            return;
        } else {
            setLoading(true);
            addChat(id, {text: message, userId: currentUser._id}, token)
                .then((res) => {
                    setLoading(false);
                    setChats(res.data)
                    console.log(chats)
                    emptyForm();
                    window.location.reload(false);
                    dispatch(
                        openSnackbar({
                            message: "Message sent Successfully",
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
        }
    };
    const getProjectChat = async (id) => {
        await getChat(id, token)
            .then((res) => {
                setChats(res.data.chats);
                setProjectDetails(res.data.details)
                setLoading(false)
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
    useEffect(() => {
        window.scrollTo(0, 0);
        console.log(id)
        getProjectChat(id);
    }, []);

    const emptyForm = () => {
        setMessage("");
    };
    return (
        <Container>
            <Wrapper>
                {loading ?
                    (
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
                    )
                    : (
                        <>
                            <Container>
                                <TopBar>
                                    {width < breakpoint &&
                                        <IconButton style={{color: 'inherit'}} onClick={() => setShowChat(false)}>
                                            <ArrowBack sx={{width: "24px", height: '24px'}}/>
                                        </IconButton>}
                                    <Avatar sx={{width: "46px", height: '46px'}}/>
                                    <Profile>
                                        <Name>{projectDetails.title}</Name>
                                        <Status>Onlie</Status>
                                    </Profile>
                                </TopBar>
                                <Chat>
                                    {chats.map((item) =>
                                        (

                                            <div>
                                                <RecievedMessage>{item.text}</RecievedMessage>
                                                {/*<Avatar sx={{marginRight: '-12px', width: '34px', height: '34px'}}  src={item.userId.img} >{item.userId.name}</Avatar>*/}

                                                <Tag
                                                    tagColor={
                                                        tagColors[Math.floor(Math.random() * tagColors.length)]
                                                    }
                                                >
                                                    {item.userId.name}
                                                </Tag>
                                                <Time message="sent">{item.createdAt}<DoneAll/></Time>


                                            </div>


                                        ))
                                    }

                                    {/*<SentMessage>hola fghtdfhhhhhhhhhhhhhhhh trw twr twrtrw44t rwerewty*/}
                                    {/*    rewyetryetyetyetryery ertyetyertyertyetry e5ty5et444444444444y 5y54ey5yy*/}
                                    {/*    y53y5e4ye45</SentMessage>*/}

                                    {/*<div ref={messagesEndRef} />*/}
                                </Chat>
                                <SendMessage>
                                    <MessageBox>
                                        <TextArea
                                            placeholder="Send message "
                                            name="message"
                                            rows={1}
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                        />
                                    </MessageBox>
                                    <IconButton style={{color: 'inherit', marginBottom: '6px'}}>
                                        <OutlinedBox
                                            button
                                            activeButton
                                            style={{marginTop: "14px"}}
                                            onClick={() => addMessage()
                                            }
                                        >
                                            Send
                                        </OutlinedBox>

                                    </IconButton>
                                </SendMessage>
                            </Container>
                        </>
                    )}
            </Wrapper>
        </Container>
    )
}

export default Chats
