import React, {useEffect} from "react";
import {Fragment, useState, useRef} from "react";
import styled from "styled-components";
import {CloseRounded} from "@mui/icons-material";
import {IconButton} from "@mui/material";
import {Avatar} from "@mui/material";
import {Modal} from "@mui/material";
import {addComment, addWorks} from "../../../api";
import CircularProgress from "@mui/material/CircularProgress";
import {useDispatch, useSelector} from "react-redux";
import {openSnackbar} from "../../../redux/snackbarSlice";

const Container = styled.div`
  padding: 12px 14px;
  text-align: left;
  margin: 2px 0px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 10px;
  background-color: ${({theme}) => theme.card};
  color: ${({theme}) => theme.text};
  cursor: pointer;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.09);

  &:hover {
    transition: all 0.6s ease-in-out;
    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.5);
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({theme}) => theme.textSoft};
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
  font-size: 14px;
  font-weight: 400;
  color: ${({theme}) => theme.soft2};
  margin-top: 4px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5; /* number of lines to show */
  line-clamp: 5;
  -webkit-box-orient: vertical;
`;

const Task = styled.div`
  margin: 12px 0px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2px 0px;
`;

const Members = styled.div`
  display: flex;
  flex: 1;
  justify-content: start;
  align-items: center;
  gap: 2px;
  flex-wrap: wrap;
`;
const MemberGroup = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({theme}) => theme.soft};
  padding: 4px 4px;
  gap: 1px;
  border-radius: 100px;
`;

const IcoButton = styled(IconButton)`
  color: ${({theme}) => theme.textSoft} !important;
`;

const TextBtn = styled.div`
  flex: 0.6;
  font-size: 12px;
  font-weight: 500;
  color: #0094ea;

  &:hover {
    color: #0094ea99;
  }
`;

const TextInput = styled.input`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  color: ${({theme}) => theme.textSoft};
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


const AddComment = ({ProjectMembers, ProjectId, setCreated}) => {
    const dispatch = useDispatch();
    //hooks for different steps of the work card
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectMember, setSelectMember] = useState(false);
    //the work card hook
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const { currentUser } = useSelector((state) => state.user);

    const token = localStorage.getItem("token");
    console.log(currentUser._id)
    const goToAddComment = () => {
        //check if all the fields are filled
        if (!desc) {
            alert("Please fill all the fields");
            return;
        } else {
            setLoading(true);
            addComment(ProjectId, {text :desc , userId:currentUser._id}, token)
                .then((res) => {
                    setLoading(false);
                    emptyForm();
                    window.location.reload(false);

                    setCreated(true);
                    dispatch(
                        openSnackbar({
                            message: "Commented Successfully",
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


    const emptyForm = () => {
        setDesc("");
    };

    return (
        <Container className={"item"}>
            {(
                <>
                    <Top>
                        <Title>Create new comment</Title>
                    </Top>
                    <OutlinedBox>
                        <TextArea
                            placeholder="What is your mind?"
                            name="desc"
                            rows={4}
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                    </OutlinedBox>
                    <OutlinedBox
                        button
                        activeButton
                        style={{marginTop: "14px"}}
                        onClick={() => goToAddComment()
                    }
                    >
                        Next
                    </OutlinedBox>
                </>
            )}
        </Container>
    );
};

export default AddComment;
