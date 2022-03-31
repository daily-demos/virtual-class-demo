import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useCallState } from './CallProvider';
import PropTypes from 'prop-types';
import { useDailyEvent, useRoom } from '@daily-co/daily-react-hooks';
import { useRouter } from 'next/router';

export const TranscriptionContext = createContext();

export const TranscriptionProvider = ({ children }) => {
  const router = useRouter();
  const { room: roomURL } = router.query;

  const { callObject } = useCallState();
  const [transcriptionHistory, setTranscriptionHistory] = useState([]);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const room = useRoom();

  const handleNewMessage = useCallback(e => {
    if (e.fromId === 'transcription' && e.data?.is_final) {
      setTranscriptionHistory(oldState => [
        ...oldState,
        `${e.data.user_name}: ${e.data.text}`,
      ]);
    }
  }, []);

  const handleTranscriptionStarted = useCallback(() => {
    console.log('💬 Transcription started');
    setIsTranscribing(true);
  }, []);

  const handleTranscriptionStopped = useCallback(() => {
    console.log('💬 Transcription stopped');
    setIsTranscribing(false);
  }, []);

  const handleTranscriptionError = useCallback(() => {
    console.log('❗ Transcription error!');
    setIsTranscribing(false);
  }, []);

  const toggleTranscription = useCallback(async () => {
    if (isTranscribing) await callObject.stopTranscription();
    else await callObject.startTranscription();
  }, [callObject, isTranscribing]);

  const isTranscriptionEnabled = useMemo(
    () => !!room?.domainConfig?.enable_transcription,
    [room?.domainConfig?.enable_transcription],
  );

  const handleJoinedMeeting = useCallback(() => {
    if (router.isReady && router.query?.trans && !isTranscribing) {
      toggleTranscription();
      router.replace(`/${roomURL}`);
    }
  }, [
    router.isReady,
    router.query?.trans,
    isTranscribing,
    toggleTranscription,
    roomURL,
  ]);

  useDailyEvent('joined-meeting', handleJoinedMeeting);
  useDailyEvent('app-message', handleNewMessage);
  useDailyEvent('transcription-started', handleTranscriptionStarted);
  useDailyEvent('transcription-stopped', handleTranscriptionStopped);
  useDailyEvent('transcription-error', handleTranscriptionError);

  return (
    <TranscriptionContext.Provider
      value={{
        isTranscribing,
        transcriptionHistory,
        toggleTranscription,
        isTranscriptionEnabled,
      }}
    >
      {children}
    </TranscriptionContext.Provider>
  );
};

TranscriptionProvider.propTypes = {
  children: PropTypes.node,
};

export const useTranscription = () => useContext(TranscriptionContext);
