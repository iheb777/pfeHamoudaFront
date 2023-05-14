import React, { useEffect } from "react";
import styled from "styled-components";
import {
  MoreVert,
  TimelapseRounded,
  StarsRounded
} from "@mui/icons-material";
import { format } from "timeago.js";
import { Button, IconButton} from "@mui/material";

const Container = styled.div`
  padding: 14px;
  text-align: left;
  margin: 2px 0px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
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
  color: ${({ theme }) => theme.textSoft};
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
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.soft2};
  margin-top: 4px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5; /* number of lines to show */
  line-clamp: 5;
  -webkit-box-orient: vertical;
`;


const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 4px;
  margin-top: 8px;
`;



const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0px 14px 0px;
`;

const Time = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.soft2 + "99"};
`;

const IcoBtn = styled(IconButton)`
  color: ${({ theme }) => theme.textSoft} !important;
`;

const AdminStudentCard = ({  student ,deleteStudent}) => {


  //check the no of tasks completed in the work and set the progress
  useEffect(() => {
  }, []);

  //get the members of the work from all the tasks and add it in members array withb the image and name



  return (
    <Container>
      <Top>
        <Title>{student.name}</Title>
        {student.priority === "Low" &&
          <StarsRounded sx={{ 'font-size': '18px' }} style={{ 'color': '#E67E22' }} />}
        <IcoBtn>
          <MoreVert style={{ flex: "1", fontSize: '20px' }} />
        </IcoBtn>
      </Top>
      <Desc>{student.desc}</Desc>
      <Tags>
        {student.email}
      </Tags>
      <Bottom>
        <Time>
          <TimelapseRounded sx={{ fontSize: "22px" }} /> Updated{" "}
          {format(student.updatedAt)}
        </Time>
        <div>
            <Button variant="outlined" color="error" onClick={()=>deleteStudent(student._id)}>
                Delete
            </Button>
        </div>
      </Bottom>
    </Container>
  );
};

export default AdminStudentCard;
