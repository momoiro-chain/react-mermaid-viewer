import { useRef, useState } from 'react';
import styled from 'styled-components';

const UploaderContainer = styled.div`
  display: flex;
  align-items: center;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  background-color: #4a4a4a;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5a5a5a;
  }

  &:active {
    background-color: #3a3a3a;
  }
`;

const FileName = styled.span`
  margin-left: 1rem;
  font-size: 0.9rem;
  color: #aaa;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  margin-left: 1rem;
  font-size: 0.9rem;
`;

const FileUploader = ({ onFileUpload }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);

    // ファイル拡張子の確認
    if (!file.name.endsWith('.mermaid') && !file.name.endsWith('.mmd')) {
      setError('ファイル形式は .mermaid または .mmd である必要があります');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        onFileUpload(content);
      } catch (err) {
        setError('ファイルの読み込みに失敗しました: ' + err.message);
      }
    };

    reader.onerror = () => {
      setError('ファイルの読み込み中にエラーが発生しました');
    };

    reader.readAsText(file);
  };

  return (
    <UploaderContainer>
      <FileInput
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".mermaid,.mmd"
      />
      <UploadButton onClick={handleButtonClick}>
        Mermaidファイルをアップロード
      </UploadButton>
      {fileName && !error && <FileName>{fileName}</FileName>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </UploaderContainer>
  );
};

export default FileUploader;