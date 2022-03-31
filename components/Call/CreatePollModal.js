import React, { useCallback, useMemo } from 'react';
import { TextInput } from '../Input';
import Modal from '../Modal';
import { useUIState } from '../../contexts/UIStateProvider';
import Field from '../Field';
import { usePoll } from '../../contexts/PollProvider';
import Button from '../Button';
import { ReactComponent as IconPlus } from '../../icons/plus-sm.svg';
import { ReactComponent as IconMinus } from '../../icons/minus-sm.svg';

export const CREATE_POLL_MODAL = 'create-poll';

const PollOption = ({ option, index }) => {
  const { options, setOptions } = usePoll();

  const isLast = useMemo(() => options.length - 1 === index, [options]);

  const handleClick = useCallback(() => {
    if (isLast) setOptions(options => [...options, '']);
    else {
      setOptions(options => {
        const newOptions = options;
        newOptions.splice(index, 1);
        return [...newOptions];
      });
    }
  }, [isLast]);

  const handleChange = e => {
    const newOptions = options;
    newOptions[index] = e.target.value;
    setOptions([...newOptions]);
  };

  return (
    <div className="poll-option">
      <div className="poll-answer">
        <TextInput
          prefix={(index + 1).toString()}
          value={option}
          placeholder="Enter answer to question here"
          onChange={handleChange}
          required
        />
      </div>
      <Button variant="white" onClick={handleClick}>
        {isLast ? <IconPlus /> : <IconMinus />}
      </Button>
      <style jsx>{`
        .poll-option {
          display: flex;
          gap: 10px;
          margin: 12px 0;
          flex-flow: row wrap;
        }
        .poll-option .poll-answer {
          flex-grow: 2;
        }
      `}</style>
    </div>
  );
};

export const CreatePollModal = () => {
  const { currentModals, closeModal } = useUIState();
  const { question, setQuestion, options, startPoll } = usePoll();

  return (
    <Modal
      title="Ask your students a question"
      isOpen={currentModals[CREATE_POLL_MODAL]}
      onClose={() => closeModal(CREATE_POLL_MODAL)}
    >
      <div className="create-poll">
        <Field label="Question">
          <TextInput
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Enter the question here"
            required
          />
        </Field>
        <Field label="Answers">
          {options.map((option, index) => (
            <PollOption option={option} index={index} key={index} />
          ))}
        </Field>
        <div className="divider" />

        <div className="footer">
          <Button variant="white" onClick={() => closeModal(CREATE_POLL_MODAL)}>
            Cancel
          </Button>
          <Button onClick={startPoll}>Start Poll</Button>
        </div>

        <style jsx>{`
          .divider {
            border: 1px solid #e6eaef;
            height: 1px;
          }
          .footer {
            margin-top: var(--spacing-xs);
            display: flex;
            gap: 10px;
          }
        `}</style>
      </div>
    </Modal>
  );
};

export default CreatePollModal;
