import styled from 'styled-components';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ForumIcon from '@mui/icons-material/Forum';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HeroBgAnimation from '../components/HeroBgAnimation'
import Diversity3Icon from '@mui/icons-material/Diversity3';
import {getProjects, getTop, getTopProject, getWorks} from "../../../api";
import {openSnackbar} from "../../../redux/snackbarSlice";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {tagColors} from "../../../data/data";
import {CircularProgress} from "@mui/material";

const FeaturesWrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #181622;
  padding-bottom: 150px;
  margin-top: -90px;
  @media (max-width: 768px) {
    padding-bottom: 100px;
    margin-top: -50px;
  }
  background: linear-gradient(343.07deg, rgba(132, 59, 206, 0.06) 5.71%, rgba(132, 59, 206, 0) 64.83%);
`;


const Number = styled.div`
width: 70px;
height: 70px;
  font-size: 36px;
  font-weight: 800;
  color: #854CE6;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #854CE616;
  border: 6px solid #854CE6;
  margin-bottom: 20px;
  @media (max-width: 768px) {

width: 50px;
height: 50px;
  font-size: 32px;
  }
`;


const FeaturesTitle = styled.div`
  font-size: 52px;
  text-align: center;
  font-weight: 800;
  margin-top: 20px;
    color: #854CE6;
    @media (max-width: 768px) {
        margin-top: 12px;
        font-size: 36px;
    }
`;


const FeatureDescription = styled.p`
  font-size: 20px;
  line-height: 1.5;
  font-weight:600px;
  width: 100%;
  max-width: 700px;
  text-align: center;
  color: hsl(246,  6%, 65%);
  margin-bottom: 80px;
  @media (max-width: 768px) {
    width: 90%;
      font-size: 16px;
      margin-bottom: 60px;
  }
`;

const Content = styled.div`
position: relative;
`;

const FeatureCard = styled.div`
  width: 600px;
  height: 350px;
  position: relative;
  background-color: hsl(250, 24%, 9%);
  border: 0.1px solid #6de64c;
  border-radius: 16px;
   box-shadow: rgba(23, 92, 230, 0.15) 0px 4px 24px;
  transition: transform 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  color:  #854CE6;
  position: absolute;
  bottom: 0px;
  right: 0px;
  flex-shrink: 0;
  border-top-right-radius: 40%;
  border-top-left-radius: 60%;
  border-bottom-left-radius: 40%;
  border-bottom-right-radius: 16px;
  border: 2px solid hsl(220, 80%, 75%,30%);
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 925px) {
    width: 80px;
    height: 80px;
    }
`;

const FeatureTitle = styled.div`
  font-size: 20px;
  color: #854CE6;
  margin-bottom: 10px;
  margin-top: 16px;
  font-weight: 600;
`;

const FeatureCardDescription = styled.div`
  font-size: 16px;
  line-height: 1.5;
  color: hsl(246,  6%, 65%);
`;


const BgImage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @media (max-width: 768px) {
    display: none;
  }
`;
const Tag = styled.div`
  padding: 10px 20px;
  margin: 10px 20px;
  border-radius: 8px;
  color: ${({ tagColor, theme }) => tagColor + theme.lightAdd};
  background-color: ${({ tagColor, theme }) => tagColor + "10"};
  font-size: 12px;
  font-weight: 500;
`;


const BestProject = () => {
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const getTop = async () => {
        await getTopProject(token)
            .then((res) => {
                setData(res.data);
                console.log(res.data)
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
        getTop();
        window.scrollTo(0, 0);
    }, []);


    return (
        <FeaturesWrapper id="top">
             <FeaturesTitle>Best project</FeaturesTitle>
            <FeatureDescription>This is the best project for the last season.</FeatureDescription>
            {
                loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '12px 0px',height: '300px' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <Content>
                        <FeatureCard>
                            <div>
                                <FeatureTitle>{data[0].projectId.title}</FeatureTitle>
                                <FeatureCardDescription>{data[0].projectId.desc}</FeatureCardDescription>
                                <Tag
                                    tagColor={
                                        tagColors[Math.floor(Math.random() * tagColors.length)]
                                    }
                                >
                                    Score : {data[0].score}
                                </Tag>
                                <Tag
                                    tagColor={
                                        tagColors[Math.floor(Math.random() * tagColors.length)]
                                    }
                                >
                                    BCM1 : {data[0].bcm1}
                                </Tag>
                                <Tag
                                    tagColor={
                                        tagColors[Math.floor(Math.random() * tagColors.length)]
                                    }
                                >
                                    BCM2 : {data[0].bcm2}
                                </Tag>
                                <FeatureCardDescription>Started at : {data[0].projectId.createdAt}</FeatureCardDescription>
                            </div>
                            <FeatureIcon>
                                <TrendingUpIcon />
                            </FeatureIcon>
                        </FeatureCard>

                    </Content>
                )
            }
        </FeaturesWrapper>
    );
};

export default BestProject;
