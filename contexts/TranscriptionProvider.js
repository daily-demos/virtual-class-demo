import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useCallState } from './CallProvider';
import PropTypes from 'prop-types';

export const TranscriptionContext = createContext();

export const TranscriptionProvider = ({ children }) => {
  const { callObject } = useCallState();
  const [transcriptionHistory, setTranscriptionHistory] = useState([]);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const handleNewMessage = useCallback(
    (e) => {
      if (e.fromId === 'transcription' && e.data?.is_final) {
        setTranscriptionHistory((oldState) => [
          ...oldState,
          `${e.data.user_name}: ${e.data.text}`,
        ]);
      }
    },
    []
  );

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

  useEffect(() => {
    if (!callObject) {
      return false;
    }

    console.log(`💬 Transcription provider listening for app messages`);

    callObject.on('app-message', handleNewMessage);

    callObject.on('transcription-started', handleTranscriptionStarted);
    callObject.on('transcription-stopped', handleTranscriptionStopped);
    callObject.on('transcription-error', handleTranscriptionError);

    return () => callObject.off('app-message', handleNewMessage);
  }, [
    callObject,
    handleNewMessage,
    handleTranscriptionStarted,
    handleTranscriptionStopped,
    handleTranscriptionError
  ]);

  return (
    <TranscriptionContext.Provider
      value={{
        isTranscribing,
        transcriptionHistory,
        toggleTranscription,
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