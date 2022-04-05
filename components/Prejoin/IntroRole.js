import React from 'react';
import Button from '../Button';
import Capsule from '../Capsule';
import { Card, CardBody } from '../Card';
import Well from '../Well';
import { ReactComponent as IconArrowRight } from '../../icons/arrow-right-md.svg';
import PropTypes from 'prop-types';
import { TextInput } from '../Input';
import Field from '../Field';
import { ClipboardButton } from '../Clipboard';

export const IntroRole = ({ error, onJoin }) => {
  return (
    <div className="role">
      <div className="header">
        <h2>Join your class</h2>
        <p>
          Your virtual class room has been created. You can now join as either a
          teacher or a student, simply click the relevant button below to get
          started.
        </p>
      </div>
      <Card>
        <CardBody>
          {error && (
            <Well variant="error">
              Failed to obtain token <p>{error}</p>
            </Well>
          )}
          <div>
            <Capsule variant="orange">Teacher Role</Capsule>
            <p>
              Control the flow of the class, moderate participants and activate
              teacher tools such as the whiteboard. All students who join the
              class will have focus on you.
            </p>
            <Button
              variant="white"
              onClick={() => onJoin(true)}
              IconAfter={IconArrowRight}
            >
              Join as Teacher
            </Button>
          </div>

          <div className="divider" />

          <div>
            <Capsule variant="blue">Student Role</Capsule>
            <p>
              Take part in the class as a student. Students can only talk when
              allowed to by the teacher, cannot share their screen or active the
              whiteboard.
            </p>
            <Button
              variant="white"
              onClick={() => onJoin(false)}
              IconAfter={IconArrowRight}
            >
              Join as Student
            </Button>
          </div>

          <div className="divider" />

          <div>
            <Field label="Share student invite link:">
              <ClipboardButton
                value={
                  typeof window !== 'undefined' ? window.location.href : null
                }
              />
            </Field>
          </div>
        </CardBody>
      </Card>
      <style jsx>{`
        .role {
          width: 520px;
        }
        .role :global(.capsule) {
          margin: 0;
          padding: var(--spacing-xxxs);
          border-radius: 6px;
        }
        .header {
          text-align: center;
          margin-bottom: var(--spacing-md);
        }
        .header h2 {
          font-size: 32px;
          color: var(--text-darkest);
          font-weight: var(--weight-extra-bold);
        }
        .header p {
          color: #6b7785;
          font-weight: var(--weight-regular);
        }
        .divider {
          background: var(--gray-light);
          margin: var(--spacing-md) 0;
          height: 1px;
        }
      `}</style>
    </div>
  );
};

IntroRole.propTypes = {
  error: PropTypes.string,
  onJoin: PropTypes.func.isRequired,
};

export default IntroRole;
