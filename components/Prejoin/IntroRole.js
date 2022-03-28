import React from 'react';
import Button from '../Button';
import Capsule from '../Capsule';
import {
  Card,
  CardBody,
} from '../Card';
import Well from '../Well';
import { ReactComponent as IconArrowRight } from '../../icons/arrow-right-md.svg';
import PropTypes from 'prop-types';
import { TextInput } from '../Input';
import Field from '../Field';

export const IntroRole = ({
  error,
  onJoin,
}) => {
  return (
    <div className="role">
      <div className="header">
        <h2>Join your class</h2>
        <p>
          Your virtual class room has been created. You can now join as either
          a teacher or a student, simply click the relevant button below to get
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
          <div className="item">
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

          <div className="item">
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

          <div className="item">
            <Field label="Share student invite link:">
              <TextInput
                value={typeof window !== 'undefined' ? window.location.href: null}
                disabled
              />
            </Field>
          </div>
        </CardBody>
      </Card>
      <style jsx>{`
      .role {
        width: 520px;
      }
      .header {
        text-align: center;
      }
      .header p {
        color: var(--gray-dark);
        font-weight: 400;
      }
      .item {
        margin: 12px 0;
      }
      .divider {
        background: var(--gray-light);
        margin: 0 var(--spacing-xxs);
        height: 1px;
      }
    `}</style>
    </div>
  );
}

IntroRole.propTypes = {
  error: PropTypes.string,
  onJoin: PropTypes.func.isRequired,
};

export default IntroRole;
