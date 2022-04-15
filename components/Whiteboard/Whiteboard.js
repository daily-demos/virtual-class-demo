import React, { useState } from 'react';
import { useAppState } from '../../contexts/AppStateProvider';
import Button from '../Button';
import { ReactComponent as IconUndo } from '../../icons/undo-sm.svg';
import { ReactComponent as IconRedo } from '../../icons/redo-sm.svg';
import { ReactComponent as IconSelect } from '../../icons/select-icon-sm.svg';
import { ReactComponent as IconBrush } from '../../icons/brush-icon-sm.svg';
import { ReactComponent as IconSquare } from '../../icons/square-icon-sm.svg';
import { ReactComponent as IconCircle } from '../../icons/circle-icon-sm.svg';
import { ReactComponent as IconLine } from '../../icons/line-icon-sm.svg';
import { ReactComponent as IconArrow } from '../../icons/arrow-icon-sm.svg';
import { useLocalParticipant } from '@daily-co/daily-react-hooks';

export const Whiteboard = () => {
  const localParticipant = useLocalParticipant();
  const { isBoardActive, board } = useAppState();
  const [tool, setTool] = useState('pick');

  const onClick = tool => {
    switch (tool) {
      case 'pick':
        setTool('pick');
        board.usePickTool();
        break;
      case 'brush':
        setTool('brush');
        board.useBrushTool();
        break;
      case 'square':
        setTool('square');
        board.useSquareTool();
        break;
      case 'circle':
        setTool('circle');
        board.useCircleTool();
        break;
      case 'line':
        setTool('line');
        board.useLineTool();
        break;
      case 'arrow':
        setTool('arrow');
        board.useArrowTool();
        break;
      default:
        break;
    }
  };

  const style = (toolName) => {
    return {
      color: tool === toolName ? '#1BEBB9': '#2b3f56',
      background: tool === toolName ? '#D1FBF1': '#FFFFFF',
    }
  };

  return (
    <>
      {isBoardActive && localParticipant.owner && (
        <div className="toolbar">
          <div className="toolbar-buttons">
            <Button
              size="medium-square"
              variant="whiteboard-toolbar"
              onClick={() => onClick('pick')}
              style={style('pick')}
            >
              <IconSelect />
            </Button>
            <Button
              size="medium-square"
              variant="whiteboard-toolbar"
              onClick={() => onClick('brush')}
              style={style('brush')}
            >
              <IconBrush />
            </Button>
            <Button
              size="medium-square"
              variant="whiteboard-toolbar"
              onClick={() => onClick('square')}
              style={style('square')}
            >
              <IconSquare />
            </Button>
            <Button
              size="medium-square"
              variant="whiteboard-toolbar"
              onClick={() => onClick('circle')}
              style={style('circle')}
            >
              <IconCircle />
            </Button>
            <Button
              size="medium-square"
              variant="whiteboard-toolbar"
              onClick={() => onClick('line')}
              style={style('line')}
            >
              <IconLine />
            </Button>
            <Button
              size="medium-square"
              variant="whiteboard-toolbar"
              onClick={() => onClick('arrow')}
              style={style('arrow')}
            >
              <IconArrow />
            </Button>
          </div>
          <Button
            variant="whiteboard"
            onClick={() => board.undo()}
            IconBefore={IconUndo}
          >
            UNDO
          </Button>
          <Button
            variant="whiteboard"
            onClick={() => board.redo()}
            IconBefore={IconRedo}
          >
            REDO
          </Button>
        </div>
      )}
      <div id="whiteboard" style={{ display: !isBoardActive ? 'none' : '' }} />
      <style jsx>{`
        .toolbar {
          position: absolute;
          display: flex;
          gap: 10px;
          z-index: 100;
          padding: 1vh;
        }
        .toolbar .toolbar-buttons {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xxs);
          background: #f7f9fa;
          border: 1px solid #e6eaef;
          box-sizing: border-box;
          box-shadow: 0 2px 3px rgba(0, 0, 0, 0.05);
          border-radius: 4px;
          justify-content: center;
          align-items: center;
          padding: var(--spacing-xxs);
        }
        #whiteboard {
          height: 100%;
          width: 100%;
          background: #fff;
        }
      `}</style>
    </>
  );
};

export default Whiteboard;
