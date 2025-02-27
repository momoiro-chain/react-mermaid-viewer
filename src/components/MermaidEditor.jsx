import React from 'react';
import AceEditor from 'react-ace';
import styled from 'styled-components';

// Aceエディタの必要なモジュールをインポート
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const EditorHeader = styled.div`
  padding: 0.5rem 1rem;
  background-color: #2d2d2d;
  border-bottom: 1px solid #3e3e3e;
`;

const EditorTitle = styled.h2`
  margin: 0;
  font-size: 1rem;
  color: #ddd;
`;

const StyledAceEditor = styled(AceEditor)`
  flex: 1;
`;

const MermaidEditor = ({ code, onChange }) => {
  return (
    <EditorContainer>
      <EditorHeader>
        <EditorTitle>Mermaid コードエディタ</EditorTitle>
      </EditorHeader>
      <StyledAceEditor
        mode="markdown"
        theme="monokai"
        onChange={onChange}
        value={code}
        fontSize={14}
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={true}
        width="100%"
        height="100%"
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
    </EditorContainer>
  );
};

export default MermaidEditor;