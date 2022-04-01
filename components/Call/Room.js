import React, { useMemo, useRef } from 'react';
import ParticipantBar from '../ParticipantBar/ParticipantBar';
import VideoContainer from '../VideoContainer/VideoContainer';
import { useAppState } from '../../contexts/AppStateProvider';
import { useParticipants } from '../../contexts/ParticipantsProvider';
import { useTranscription } from '../../contexts/TranscriptionProvider';
import { Screens } from '../SpeakerView';
import { SpeakerTile } from '../SpeakerTile';
import { Container } from './Container';
import Header from './Header';
import VideoGrid from './VideoGrid';

const SIDEBAR_WIDTH = 186;

export const Room = () => {
  const { currentSpeakerId, localParticipant, screens, orderedParticipantIds } =
    useParticipants();
  const { isBoardActive } = useAppState();
  const { isTranscribing, transcriptionHistory } = useTranscription();
  const activeRef = useRef();

  const hasScreenshares = useMemo(() => screens.length > 0, [screens]);

  const showSidebar = useMemo(
    () => orderedParticipantIds.length > 0 || hasScreenshares || isBoardActive,
    [hasScreenshares, isBoardActive, orderedParticipantIds.length],
  );

  const fixedItems = useMemo(() => {
    const items = [];
    items.push(localParticipant?.session_id);
    if (hasScreenshares && orderedParticipantIds.length > 0) {
      items.push(orderedParticipantIds[0]);
    }
    return items;
  }, [hasScreenshares, localParticipant, orderedParticipantIds]);

  const otherItems = useMemo(() => {
    if (orderedParticipantIds.length > 1 || isBoardActive) {
      return orderedParticipantIds.slice(hasScreenshares ? 1 : 0);
    }
    return [];
  }, [hasScreenshares, orderedParticipantIds, isBoardActive]);

  const isActiveSpeakerView = useMemo(() => {
    return hasScreenshares || !localParticipant?.owner || isBoardActive;
  }, [hasScreenshares, isBoardActive, localParticipant?.owner]);

  return (
    <div className="speaker-view">
      <Container>
        <Header />
        <VideoContainer>
          <div
            id="whiteboard"
            style={{ display: !isBoardActive ? 'none' : '' }}
          />
          {!isBoardActive && (
            <>
              {isActiveSpeakerView ? (
                <div ref={activeRef} className="active">
                  {screens.length > 0 ? (
                    <Screens />
                  ) : (
                    <SpeakerTile
                      screenRef={activeRef}
                      sessionId={currentSpeakerId}
                    />
                  )}
                </div>
              ) : (
                <VideoGrid />
              )}
            </>
          )}
          {isTranscribing && transcriptionHistory.length > 0 && (
            <div className="transcriptions">
              {transcriptionHistory[transcriptionHistory.length - 1]}
            </div>
          )}
        </VideoContainer>
      </Container>
      {isActiveSpeakerView && showSidebar && (
        <ParticipantBar
          fixed={fixedItems}
          others={otherItems}
          width={SIDEBAR_WIDTH}
        />
      )}

      <style jsx>{`
        .speaker-view {
          display: flex;
          height: 100%;
          width: 100%;
          position: relative;
        }
        .active {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
        }
        #whiteboard {
          height: 100%;
          width: 100%;
          background: #fff;
        }
        .transcriptions {
          position: absolute;
          z-index: 100;
          font-weight: 700;
          background: rgba(0, 0, 0, 0.5);
          bottom: 20px;
          height: 34px;
          width: auto;
          padding: 8px;
          left: 50%;
          transform: translateX(-50%);
        }
      `}</style>
    </div>
  );
};

export default Room;
