import React from "react";
import {useState, useEffect} from "react";
import ProjectCard from "../../components/Card";
import Styled, {useTheme} from "styled-components";
import ProjectStatCard from "../../components/ProjectStatCard";
import {Add} from "@mui/icons-material";
import CircularProgress, {
    CircularProgressProps,
} from '@mui/material/CircularProgress';
import {useSelector} from "react-redux";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {LinearProgress} from "@mui/material";
import {statuses, data, tagColors} from "../../data/data";
import {useDispatch} from "react-redux";
import {openSnackbar} from "../../redux/snackbarSlice";
import {adminDeleteUser, adminGetAllStudents, getProjects, userTasks} from "../../api";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import AdminStudentCard from "./components/AdminStudentCards";

const Container = Styled.div`
@media screen and (max-width: 480px) {
  padding: 10px 10px;
}
`;

const Section = Styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
`;

const Left = Styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 20px;
`;

const Right = Styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 20px;
`;


const RecentProjects = Styled.div`
  width: 100%;
  height: 100%;
  text-align: left;
  margin: 2px;
  font-size: 18px;
  font-weight: 500;
  color: ${({theme}) => theme.text};
  border-radius: 12px;
`;

const SectionTitle = Styled.div` 
  width: 100%;
  padding: 0px 12px;
  font-size: 22px;
  font-weight: 600;
  margin: 10px 0px 16px 0px;
  color: ${({theme}) => theme.text};
`;


function CircularProgressWithLabel(props
) {
    const theme = useTheme();
    return (
        <Box sx={{position: 'relative', display: 'inline-flex'}}>
            <CircularProgress variant="determinate" {...props} thickness={6} size="60px"
                              style={{color: theme.primary}}/>
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    color="inherit"
                >{`${Math.round(props.value)}`}</Typography>
            </Box>
        </Box>
    );
}

// backgroundColor: 'lightyellow',
// '& .MuiLinearProgress-bar': {
//   backgroundColor: 'orange'
// }

const ManageStudent = () => {

    const dispatch = useDispatch();
    const [students, setStudents] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);


    const token = localStorage.getItem("token");


    const deleteStudent = async (workId) => {
        await adminDeleteUser(workId, token).then((res) => {
            setLoading(false);
            console.log(res.data);
            getStudents()
        }).catch((err) => {
            console.log("couldn't delete project because : " + err);
            setLoading(false);
        })
    }

    const getStudents = async () => {
        setLoading(true);
        await adminGetAllStudents(token)
            .then((res) => {
                setStudents(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                dispatch(
                    openSnackbar({
                        message: err.response.data.message,
                        severity: "error",
                    })
                );
            });
    };


    useEffect(() => {
        getStudents();
        window.scrollTo(0, 0);
    }, []);


    return (
        <Container>
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

                <Left>

                    <SectionTitle>All students</SectionTitle>
                    {
                        students
                            .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
                            .filter((item, index) => index < 6)
                            .map((student, id) => (
                                <AdminStudentCard
                                    student={student} deleteStudent={deleteStudent}
                                />
                            ))
                    }

                </Left>


            )}
        </Container>
    );
};

export default ManageStudent;
