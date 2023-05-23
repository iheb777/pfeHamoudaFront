import React, {useState} from 'react'
import styled from 'styled-components';
import FileBase64 from 'react-file-base64';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useFilePicker } from 'use-file-picker';

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
            <Typo>Select PDF here</Typo>
            <div style={{ display: "flex", gap: '6px' }}>
                <div>
                    <FileBase64
                        multiple={ false }
                        onDone={({base64}) => {
                            console.log(base64);

                            setInputs((prev) => {
                                return { ...prev, file: base64 };
                            });
                        }
                    }
                        />
                    <br />
                    {/*{filesContent.map((file, index) => (*/}
                    {/*    <div>*/}
                    {/*        <h2>{file.name}</h2>*/}
                    {/*        <div key={index}>{file.content}</div>*/}
                    {/*        <br />*/}
                    {/*    </div>*/}
                    {/*))}*/}
                </div>
            </div>
            </>
            }
        </Container>
    )
}

export default FileSelector
