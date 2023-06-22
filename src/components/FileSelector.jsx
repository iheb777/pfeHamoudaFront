import React, {useState} from 'react'
import styled from 'styled-components';
import FileBase64 from 'react-file-base64';

const Container = styled.div`
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  border-radius: 12px;
  color: ${({theme}) => theme.soft2 + "80"};
  margin: 30px 20px 0px 20px;
  align-items: center;

  border: 2px dashed ${({theme}) => theme.soft2 + "80"}
}

;

`;

const Typo = styled.div`
  font-size: 14px;
  font-weight: 600;
`;



const FileSelector = ({inputs, setInputs}) => {
    return (
        <Container>
            {inputs.file !== "" ? <div><h1>Done</h1></div> : <>
                <Typo>Select PDF here</Typo>
                <div style={{display: "flex", gap: '6px'}}>
                    <div>
                        <FileBase64
                            multiple={false}
                            onDone={({base64}) => {
                                console.log(base64);

                                setInputs((prev) => {
                                    return {...prev, file: base64};
                                });
                            }
                            }
                        />
                        <br/>
                    </div>
                </div>
            </>
            }
        </Container>
    )
}

export default FileSelector
