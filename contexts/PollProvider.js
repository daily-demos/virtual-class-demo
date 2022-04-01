import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  useAppMessage,
  useLocalParticipant,
} from '@daily-co/daily-react-hooks';
import { useUIState } from './UIStateProvider';
import { POLL_MODAL } from '../components/Call/PollModal';
import { CREATE_POLL_MODAL } from '../components/Call/CreatePollModal';
import { POLL_RESULT_MODAL } from '../components/Call/PollResultModal';

const getResultsObject = array => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item]: [],
    };
  }, initialValue);
};

export const PollContext = createContext();

export const PollProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [results, setResults] = useState({});
  const [selected, setSelected] = useState(null);

  const { openModal, closeModal } = useUIState();
  const localParticipant = useLocalParticipant();

  const [showPoll, setShowPoll] = useState(false);

  useEffect(
    () => setShowPoll(localParticipant?.owner),
    [localParticipant?.owner],
  );

  const resetValues = useCallback(() => {
    setIsActive(false);
    setQuestion('');
    setOptions(['', '']);
    setResults({});
    setSelected(null);
    if (!localParticipant?.owner) setShowPoll(false);
  }, [localParticipant?.owner]);

  const sendAppMessage = useAppMessage({
    onAppMessage: useCallback(
      ev => {
        const msg = ev?.data?.message;
        const msgType = msg?.type;
        if (!msgType) return;

        switch (msgType) {
          case 'poll':
            setResults(getResultsObject(msg.options));
            setIsActive(true);
            setQuestion(msg.question);
            setOptions(msg.options);
            openModal(localParticipant.owner ? POLL_RESULT_MODAL : POLL_MODAL);
            setShowPoll(true);
            break;
          case 'selected-answer-poll':
            const newResults = results;
            newResults[msg.answer] = [...newResults[msg.answer], msg.name];
            setResults({ ...newResults });
            break;
          case 'conclude-poll':
            closeModal(POLL_RESULT_MODAL);
            resetValues();
            break;
          default:
            break;
        }
      },
      [results, localParticipant?.owner],
    ),
  });

  const startPoll = useCallback(() => {
    setIsActive(true);
    closeModal(CREATE_POLL_MODAL);
    sendAppMessage({ message: { type: 'poll', question, options } });
    setResults(getResultsObject(options));
    openModal(localParticipant.owner ? POLL_RESULT_MODAL : POLL_MODAL);
  }, [question, options, localParticipant?.owner]);

  const selectOption = useCallback(
    option => {
      setSelected(option);
      sendAppMessage({
        message: {
          type: 'selected-answer-poll',
          answer: option,
          name: localParticipant?.user_name,
        },
      });

      const newResults = results;
      newResults[option] = [...newResults[option], localParticipant?.user_name];
      setResults({ ...newResults });

      openModal(POLL_RESULT_MODAL);
    },
    [localParticipant?.user_name, results],
  );

  const concludePoll = () => {
    sendAppMessage({ message: { type: 'conclude-poll' } });
    closeModal(POLL_RESULT_MODAL);
    openModal(CREATE_POLL_MODAL);
    resetValues();
  };

  return (
    <PollContext.Provider
      value={{
        showPoll,
        isActive,
        selected,
        question,
        setQuestion,
        options,
        setOptions,
        startPoll,
        selectOption,
        results,
        concludePoll,
      }}
    >
      {children}
    </PollContext.Provider>
  );
};

PollProvider.propTypes = {
  children: PropTypes.node,
};

export const usePoll = () => useContext(PollContext);
