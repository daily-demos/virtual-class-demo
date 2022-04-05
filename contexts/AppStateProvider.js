import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDaily, useLocalParticipant } from '@daily-co/daily-react-hooks';
import PropTypes from 'prop-types';
import { useSharedState } from '../hooks/useSharedState';

const AppStateContext = createContext(null);

export const AppStateProvider = ({ children }) => {
  const [board, setBoard] = useState(null);
  const [isHandRaised, setIsHandRaised] = useState(false);

  const { sharedState, setSharedState } = useSharedState({
    initialValues: {
      isBoardActive: false,
      allowToTalk: true,
      boardId: null,
      handRaisedParticipants: [],
    },
  });

  const daily = useDaily();
  const localParticipant = useLocalParticipant();

  const onHandRaise = useCallback(
    raiseHand => {
      if (!localParticipant?.session_id) return;

      const sessionId = localParticipant.session_id;

      if (raiseHand) {
        setSharedState(sharedState => {
          return {
            ...sharedState,
            handRaisedParticipants: [
              ...new Set(sharedState.handRaisedParticipants).add(sessionId),
            ],
          };
        });
      } else {
        setSharedState(sharedState => {
          return {
            ...sharedState,
            handRaisedParticipants: [
              ...sharedState.handRaisedParticipants,
            ].filter(p => p !== sessionId),
          };
        });
      }
    },
    [localParticipant?.session_id],
  );

  const raiseHand = useCallback(() => {
    onHandRaise(!isHandRaised);
    setIsHandRaised(raise => !raise);
  }, [isHandRaised, localParticipant?.session_id]);

  const createBoard = useCallback(
    (boardId = null) => {
      const zwb = Zwibbler.create('#whiteboard');
      setBoard(zwb);

      if (!boardId) {
        const boardId = zwb.createSharedSession();
        setBoard(zwb);
        setSharedState(sharedState => {
          return {
            ...sharedState,
            isBoardActive: true,
            boardId,
          };
        });
      } else zwb.joinSharedSession(boardId);
    },
    [setSharedState],
  );

  const deleteBoard = useCallback(() => {
    setSharedState(sharedState => {
      return {
        ...sharedState,
        isBoardActive: false,
        boardId: null,
      };
    });
    board.destroy();
  }, [board, setSharedState]);

  const setAllowToTalk = useCallback(() => {
    setSharedState(sharedState => {
      return {
        ...sharedState,
        allowToTalk: !sharedState.allowToTalk,
      };
    });
  }, [setSharedState]);

  const isAllowedToTalk = useMemo(() => {
    return sharedState.allowToTalk || !!localParticipant?.owner;
  }, [localParticipant?.owner, sharedState.allowToTalk]);

  useEffect(() => {
    if (sharedState.allowToTalk) return;

    // just to mute all the participants when "allow to talk" is disabled.
    if (!isAllowedToTalk) {
      daily.setLocalAudio(false);
    }
  }, [daily, isAllowedToTalk, sharedState.allowToTalk]);

  useEffect(() => {
    if (!sharedState.isBoardActive) return;

    createBoard(sharedState.boardId);
  }, [createBoard, sharedState.boardId, sharedState.isBoardActive]);

  return (
    <AppStateContext.Provider
      value={{
        isBoardActive: sharedState.isBoardActive,
        createBoard,
        deleteBoard,
        isAllowedToTalk,
        allowToTalk: sharedState.allowToTalk,
        setAllowToTalk,
        isHandRaised,
        raiseHand,
        handRaisedParticipants: sharedState.handRaisedParticipants,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

AppStateProvider.propTypes = {
  children: PropTypes.node,
};

export const useAppState = () => useContext(AppStateContext);
