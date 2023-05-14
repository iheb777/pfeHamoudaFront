import React from 'react'
import styled from 'styled-components';
import ReactImageFileToBase64 from "react-file-image-to-base64";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const Container = styled.div`
    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    align-items: center;
    border: 2px dashed  ${({ theme }) => theme.soft2+ "80"}};
    border-radius: 12px;
    color: ${({ theme }) => theme.soft2+ "80"};
    margin: 30px 20px 0px 20px;
`;

const Typo = styled.div`
    font-size: 14px;
    font-weight: 600;
`;

const TextBtn = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.primary};
    cursor: pointer;
`;


const FileSelector = ({ inputs, setInputs }) => {
    const handleOnCompleted = files => {
        console.log(files[0].base64_file);

        setInputs((prev) => {
            return { ...prev, file: files[0].base64_file };
        });
        console.log(inputs);
    };

    const CustomisedButton = ({ triggerInput }) => {
        return (
            <TextBtn onClick={triggerInput}>
                Browse PDF
            </TextBtn>
        );
    };
    return (
        <Container>
            {inputs.file!=="" ? <div><h1>Done</h1></div> : <>
            <CloudUploadIcon sx={{ fontSize: "50px" }} />
            <Typo>Drag & Drop PDF here</Typo>
            <div style={{ display: "flex", gap: '6px' }}>
                <Typo>or</Typo>
                <ReactImageFileToBase64
                    onCompleted={handleOnCompleted}
                    CustomisedButton={CustomisedButton}
                    multiple={false}
                />
            </div>
            </>
            }
        </Container>
    )
}

export default FileSelector
