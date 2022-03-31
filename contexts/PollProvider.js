import React, { createContext, useContext, useState, useCallback } from 'react';
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
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [results, setResults] = useState({});

  const { openModal, closeModal } = useUIState();
  const localParticipant = useLocalParticipant();

  const sendAppMessage = useAppMessage({
    onAppMessage: useCallback(
      ev => {
        const msg = ev?.data?.message
        const msgType = msg?.type;
        if (!msgType) return;

        switch (msgType) {
          case 'poll':
            setQuestion(msg.question);
            setOptions(msg.options);
            openModal(localParticipant.owner ? POLL_RESULT_MODAL : POLL_MODAL);
            break;
          case 'selected-answer-poll':
            const newResults = results;
            newResults[msg.answer] = [
              ...newResults[msg.answer],
              msg.name,
            ];
            setResults({ ...newResults });
            break;
          default:
            break;
        }
      },
      [results, localParticipant?.owner],
    ),
  });

  const startPoll = useCallback(() => {
    closeModal(CREATE_POLL_MODAL);
    sendAppMessage({ message: { type: 'poll', question, options } });
    setResults(getResultsObject(options));
    openModal(localParticipant.owner ? POLL_RESULT_MODAL : POLL_MODAL);
  }, [question, options, localParticipant?.owner]);

  const selectOption = useCallback(
    option => {
      sendAppMessage({
        message: {
          type: 'selected-answer-poll',
          answer: option,
          name: localParticipant?.user_name,
        },
      });
    },
    [localParticipant?.user_name],
  );

  return (
    <PollContext.Provider
      value={{
        question,
        setQuestion,
        options,
        setOptions,
        startPoll,
        selectOption,
        results,
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
