import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import mermaid from 'mermaid';

const ViewerContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  padding-bottom: ${props => props.isFullscreen ? '2rem' : '0'};
  position: relative;
  max-height: ${props => props.isFullscreen ? 'calc(100vh - 30px)' : '100%'};
  
  &.viewer-container {
    /* クラス名を追加して、JavaScriptから直接アクセスできるようにする */
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  background-color: #2d2d2d;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-family: monospace;
  white-space: pre-wrap;
`;

const DiagramContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow: auto;
  padding-top: ${props => props.isFullscreen ? '50px' : '10px'};
  padding-bottom: ${props => props.isFullscreen ? '50px' : '10px'};
  
  & svg {
    max-width: 100%;
    height: auto;
    background-color: #2d2d2d;
    ${props => props.isFullscreen && 'transform: scale(0.95); transform-origin: top center;'}
  }
  
  /* ダークテーマを適用 */
  & .node rect,
  & .node circle,
  & .node ellipse,
  & .node polygon,
  & .node path {
    fill: #2d2d2d;
    stroke: #aeaeae;
  }
  
  & .edgePath .path {
    stroke: #aeaeae;
  }
  
  & .edgeLabel {
    background-color: #2d2d2d;
    color: #ddd;
  }
  
  & .cluster rect {
    fill: #2d2d2d;
    stroke: #aeaeae;
  }
  
  & text {
    fill: #ddd;
  }
  
  /* Japanese text support */
  & text {
    font-family: 'Hiragino Kaku Gothic Pro', 'ヒラギノ角ゴ Pro W3', Meiryo, 'メイリオ', sans-serif;
  }
`;

const MermaidViewer = ({ code, isFullscreen }) => {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 全画面表示の切り替え時にスクロール位置をリセットと少し上部に余白を作る
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      
      // 全画面表示時は、図が中央よりやや上に表示されるように調整
      if (isFullscreen && containerRef.current.firstChild) {
        setTimeout(() => {
          const svgHeight = containerRef.current.firstChild.clientHeight;
          const containerHeight = containerRef.current.clientHeight;
          // 上から20%の位置に表示するように調整
          if (svgHeight > containerHeight) {
            containerRef.current.scrollTop = 0;
          }
        }, 100);
      }
    }
  }, [isFullscreen]);

  useEffect(() => {
    // Mermaidの設定
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'Hiragino Kaku Gothic Pro, ヒラギノ角ゴ Pro W3, Meiryo, メイリオ, sans-serif',
      themeVariables: {
        primaryColor: '#3e3e3e',
        primaryTextColor: '#ddd',
        primaryBorderColor: '#aeaeae',
        lineColor: '#aeaeae',
        secondaryColor: '#2d2d2d',
        tertiaryColor: '#2d2d2d'
      }
    });

    // コードが空でなければ描画を試みる
    if (code && containerRef.current) {
      try {
        containerRef.current.innerHTML = '';
        setError(null);
        
        // mermaid.render を Promise内で非同期に実行
        const renderDiagram = async () => {
          try {
            const { svg } = await mermaid.render('mermaid-diagram', code.trim());
            containerRef.current.innerHTML = svg;
          } catch (err) {
            console.error('Mermaid rendering error:', err);
            setError(`${err.name}: ${err.message}`);
          }
        };
        
        renderDiagram();
      } catch (err) {
        console.error('Error in mermaid diagram:', err);
        setError(`${err.name}: ${err.message}`);
      }
    }
  }, [code]);

  return (
    <ViewerContainer isFullscreen={isFullscreen} className="viewer-container">
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <DiagramContainer ref={containerRef} isFullscreen={isFullscreen} />
    </ViewerContainer>
  );
};

export default MermaidViewer;