import { useState, useEffect } from 'react';
import styled from 'styled-components';
import MermaidEditor from './components/MermaidEditor';
import MermaidViewer from './components/MermaidViewer';
import FileUploader from './components/FileUploader';
import './App.css';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #1e1e1e;
  color: white;
  position: relative;
  overflow: hidden;
  
  ${props => props.isFullscreen && `
    &::before {
      content: '';
      display: block;
      height: 10px;
    }
  `}
`;

const HeaderSensor = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 20px;
  z-index: 99;
  display: ${props => props.isFullscreen ? 'block' : 'none'};
  
  &:hover + header {
    top: 0;
  }
`;

const Header = styled.header`
  padding: 1rem;
  background-color: #2d2d2d;
  border-bottom: 1px solid #3e3e3e;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: ${props => props.isFullscreen ? 'fixed' : 'relative'};
  top: ${props => props.isFullscreen ? '-80px' : '0'};
  left: 0;
  right: 0;
  z-index: 100;
  transition: top 0.3s ease;
  height: 70px;

  /* ヘッダー自体がホバーされたときにも表示を維持 */
  &:hover {
    top: 0;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ToggleButton = styled.button`
  background-color: #4a4a4a;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #5a5a5a;
  }

  &:active {
    background-color: #3a3a3a;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  margin-top: ${props => props.isFullscreen ? '0' : '0'};
  height: ${props => props.isFullscreen ? 'calc(100vh - 20px)' : 'calc(100vh - 70px)'};
  position: relative;
  padding-top: ${props => props.isFullscreen ? '20px' : '0'};
`;

const EditorContainer = styled.div`
  flex: ${props => props.isFullscreen ? '0 0 0' : '1'};
  border-right: 1px solid #3e3e3e;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: ${props => props.isFullscreen ? '0' : 'auto'};
  transition: flex 0.3s ease, width 0.3s ease;
`;

const ViewerContainer = styled.div`
  flex: 1;
  overflow: auto;
  padding: 1rem;
  background-color: #2d2d2d;
  transition: flex 0.3s ease;
  padding-top: ${props => props.isFullscreen ? '1rem' : '1rem'};
  display: flex;
  flex-direction: column;
`;

// フルスクリーンアイコンのSVG
const FullscreenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
  </svg>
);

// 通常表示に戻すアイコンのSVG
const ExitFullscreenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

function App() {
  const [mermaidCode, setMermaidCode] = useState(`
graph TD
    Router --> VideoProvider
    VideoProvider --> AnalysisProvider
    AnalysisProvider --> Dashboard.js
    AnalysisProvider --> SingleVideoAnalysis.js
    AnalysisProvider --> VideoComparison.js
    AnalysisProvider --> Settings.js
    SingleVideoAnalysis.js --> SideBySideView.js
    VideoContext.js --- Dashboard.js
    VideoContext.js --- SingleVideoAnalysis.js
    VideoContext.js --- SideBySideView.js
    AnalysisContext.js --- Dashboard.js
  `);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // コンポーネントの初期マウント時の処理
    document.title = 'Mermaid Viewer';
  }, []);

  // ブラウザのリサイズ時に全画面表示の高さを調整
  useEffect(() => {
    const handleResize = () => {
      if (isFullscreen) {
        // ブラウザウィンドウの高さに合わせて調整
        const viewerContainer = document.querySelector('.viewer-container');
        if (viewerContainer) {
          viewerContainer.style.height = `${window.innerHeight - 20}px`;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);


  const handleCodeChange = (newCode) => {
    setMermaidCode(newCode);
  };

  const handleFileUpload = (content) => {
    setMermaidCode(content);
  };

  // 全画面表示切り替え時の処理
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    // スクロール位置をリセット
    window.scrollTo(0, 0);
    
    // 少し遅延させてからもう一度スクロール位置をリセット（アニメーション完了後）
    setTimeout(() => {
      window.scrollTo(0, 0);
      
      // ブラウザウィンドウの高さに合わせて調整
      const viewerContainer = document.querySelector('.viewer-container');
      if (viewerContainer) {
        viewerContainer.style.height = `${window.innerHeight - 20}px`;
      }
    }, 300);
  };

  return (
    <AppContainer isFullscreen={isFullscreen}>
      <HeaderSensor isFullscreen={isFullscreen} />
      <Header isFullscreen={isFullscreen}>
        <Title>Mermaid Diagram Viewer</Title>
        <ControlsContainer>
          <ToggleButton onClick={toggleFullscreen}>
            {isFullscreen ? <><ExitFullscreenIcon /> 編集モード</> : <><FullscreenIcon /> 全画面表示</>}
          </ToggleButton>
          <FileUploader onFileUpload={handleFileUpload} />
        </ControlsContainer>
      </Header>
      <MainContent isFullscreen={isFullscreen}>
        <EditorContainer isFullscreen={isFullscreen}>
          {!isFullscreen && <MermaidEditor code={mermaidCode} onChange={handleCodeChange} />}
        </EditorContainer>
        <ViewerContainer isFullscreen={isFullscreen}>
          <MermaidViewer code={mermaidCode} isFullscreen={isFullscreen} />
        </ViewerContainer>
      </MainContent>
    </AppContainer>
  );
}

export default App;