import React, { useEffect, useState } from 'react';
import Button from '../Button';
import Capsule from '../Capsule';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from '../Card';
import Field from '../Field';
import { TextInput } from '../Input';
import Well from '../Well';
import { ReactComponent as IconArrowRight } from '../../icons/arrow-right-md.svg';
import Image from 'next/image';
import PropTypes from 'prop-types';

/**
 * Intro
 * ---
 * Specify which room we would like to join
 */
export const Intro = ({
  room,
  error,
  domain,
  onJoin,
}) => {
  const [roomName, setRoomName] = useState();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    setRoomName(room);
  }, [room]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onJoin(roomName, isOwner);
      }}
    >
      <Card>
        <div className="header">
          <CardHeader>Join your virtual class room</CardHeader>
          <p>Your virtual class room has been created. You can now join as either a teacher or a student, simply click the relevant button below to get started.</p>
        </div>
        <CardBody>
          {error && (
            <Well variant="error">
              Failed to obtain token <p>{error}</p>
            </Well>
          )}
          <Field label="Enter room to join">
            <TextInput
              type="text"
              prefix={`${domain}.daily.co/`}
              placeholder="Room name"
              defaultValue={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
            />
          </Field>
          <div className="grid">
            <div className="grid-item">
              <Capsule variant="orange">Teacher Role</Capsule>
              <p>Control the flow of the class, moderate participants and activate teacher tools such as the whiteboard. All students who join the class will have focus on you.</p>
            </div>
            <Button onClick={() => setIsOwner(true)} type="submit" IconAfter={IconArrowRight}>Join as Teacher</Button>

            <div className="grid-item">
              <Capsule variant="blue">Student Role</Capsule>
              <p>Take part in the class as a student. Students can only talk when allowed to by the teacher, cannot share their screen or active the whiteboard.</p>
            </div>
            <Button type="submit" IconAfter={IconArrowRight}>Join as Student</Button>
          </div>
        </CardBody>
        <CardFooter divider>
          <div className="footer">
            <div>Powered by</div>
            <Image src="/assets/daily-logo-dark.svg" width="105" height="42" alt="Daily's Logo" />
          </div>
        </CardFooter>
      </Card>
      <style jsx>{`
        .header {
          text-align: center;
        }
        .header p {
          color: var(--gray-dark);
          font-weight: 400;
        }
        .grid {
          display: grid;
          grid-template-columns: 4fr 2fr;
          grid-gap: var(--spacing-xxs);
          align-items: center;
        }
        .grid-item {
          margin-top: var(--spacing-xxs);
        }
        .divider {
          background: var(--gray-light);
          margin: 0 var(--spacing-xxs);
          height: 1px;
        }
        .footer {
          display: flex;
          align-items: center;
          margin: auto;
        }
      `}</style>
    </form>
  );
};

Intro.propTypes = {
  room: PropTypes.string,
  error: PropTypes.string,
  domain: PropTypes.string.isRequired,
  onJoin: PropTypes.func.isRequired,
  forceFetchToken: PropTypes.bool,
  forceOwner: PropTypes.bool,
};

export default Intro;
