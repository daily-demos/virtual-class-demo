import React from 'react';
import Modal from '../Modal';
import { useUIState } from '../../contexts/UIStateProvider';
import { usePoll } from '../../contexts/PollProvider';
import { ReactComponent as IconArrow } from '../../icons/arrow-right-md.svg';
import { defaultTheme } from '../../styles/defaultTheme';

export const POLL_MODAL = 'poll';

const PollModalOption = ({ option }) => {
  const { closeModal } = useUIState();
  const { selectOption } = usePoll();

  const onClick = () => {
    selectOption(option);
    closeModal(POLL_MODAL);
  };

  return (
    <div className="poll-option" onClick={onClick}>
      <div className="option">{option}</div>
      <IconArrow style={{ color: defaultTheme.primary.default }} />
      <style jsx>{`
        .poll-option {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 16px 20px;
          border: 1px solid #c8d1dc;
          box-sizing: border-box;
          border-radius: 9px;
          margin-bottom: var(--spacing-xxs);
          cursor: pointer;
        }
        .poll-option .option {
          flex-grow: 2;
        }
      `}</style>
    </div>
  );
};

export const PollModal = () => {
  const { currentModals, closeModal } = useUIState();
  const { question, options } = usePoll();

  return (
    <Modal
      title={question}
      isOpen={currentModals[POLL_MODAL]}
      onClose={() => closeModal(POLL_MODAL)}
    >
      <div className="poll">
        {options.map((option, index) => (
          <PollModalOption option={option} key={index} />
        ))}
      </div>
    </Modal>
  );
};

export default PollModal;
