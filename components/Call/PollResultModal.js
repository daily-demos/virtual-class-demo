import React, { useMemo } from 'react';
import Modal from '../Modal';
import { useUIState } from '../../contexts/UIStateProvider';
import { usePoll } from '../../contexts/PollProvider';
import { useParticipants } from '../../contexts/ParticipantsProvider';
import Button from '../Button';
import { useLocalParticipant } from '@daily-co/daily-react-hooks';

export const POLL_RESULT_MODAL = 'poll-result';

const PollOptionResult = ({ option }) => {
  const { results } = usePoll();
  const { nonOwnerParticipantsCount } = useParticipants();

  return useMemo(
    () => (
      <div className="poll-option">
        <div className="option">
          {option} ({results[option].length})
        </div>
        <p className="option-users">
          {results[option].length > 0
            ? results[option].join(', ')
            : 'No one selected'}
        </p>
        {results[option].length > 0 && (
          <div
            className="range-slider"
            style={{
              width: `${
                (results[option].length / nonOwnerParticipantsCount) * 100
              }%`,
            }}
          />
        )}
        <style jsx>{`
          .poll-option {
            justify-content: center;
            align-items: center;
            margin-bottom: var(--spacing-xs);
          }
          .poll-option .option {
            color: var(--text-default);
            font-weight: var(--weight-regular);
            font-size: 16px;
            line-height: 100%;
          }
          .poll-option .option-users {
            font-weight: var(--weight-regular);
            line-height: 100%;
            font-size: 12px;
            color: #6b7785;
          }
          .poll-option .range-slider {
            background-color: #00c9df;
            width: 100%;
            height: 6px;
            border-radius: 6px;
            margin: 8px 0px;
          }
        `}</style>
      </div>
    ),
    [results],
  );
};

export const PollModal = () => {
  const { currentModals, closeModal } = useUIState();
  const { question, options, concludePoll } = usePoll();
  const localParticipant = useLocalParticipant();

  return (
    <Modal
      title="Poll Results"
      isOpen={currentModals[POLL_RESULT_MODAL]}
      onClose={() => closeModal(POLL_RESULT_MODAL)}
    >
      <div className="poll">
        <h3>{question}</h3>
        {options.map((option, index) => (
          <PollOptionResult option={option} key={index} />
        ))}
      </div>

      {localParticipant?.owner && (
        <>
          <div className="divider" />
          <Button onClick={concludePoll}>Conclude Poll</Button>
        </>
      )}

      <style jsx>{`
        .divider {
          border: 1px solid #e6eaef;
          height: 1px;
          margin-bottom: var(--spacing-xs);
        }
      `}</style>
    </Modal>
  );
};

export default PollModal;
