import React, { useEffect, useState } from 'react';
import Button from '../Button';
import { Card, CardBody, CardFooter } from '../Card';
import Well from '../Well';
import { ReactComponent as IconArrowRight } from '../../icons/arrow-right-md.svg';
import PropTypes from 'prop-types';
import { BooleanInput, SelectInput, TextInput } from '../Input';
import Field from '../Field';
import ReactLoading from 'react-loading';

export const Intro = ({
  error,
  creating,
  onCreate,
}) => {
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState("30");
  const [isTranscriptionEnabled, setIsTranscriptionEnabled] = useState(false);

  useEffect(() => {
    const date = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000);
    const isoString = date.toISOString();
    setStartTime(isoString.substring(0, (isoString.indexOf("T")|0) + 6|0));
  }, []);

  useEffect(() => {
    const getTranscriptionStatus = async () => {
      const res = await fetch('/api/transcription');
      const resJson = await res.json();
      setIsTranscriptionEnabled(resJson?.isTranscriptionEnabled);
    };

    getTranscriptionStatus();
  });

  return (
    <div className="intro">
      <div className="header">
        <h2 className="title">Create your virtual class room</h2>
        <p>
          Let’s configure the Daily meeting room for your class. We’ll set both a
          starting timestamp and a duration in order to figure the duration of the class.
        </p>
      </div>
      <Card>
        {error && (
          <Well variant="error">
            Failed to create room, {error}
          </Well>
        )}
        {!creating ? (
          <form onSubmit={(e) => {
            e.preventDefault();
            onCreate(startTime, duration);
          }}>
            <CardBody>
              <Field label="Start date and time">
                <TextInput
                  type="datetime-local"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  required
                />
              </Field>
              <Field label="Duration">
                <SelectInput
                  onChange={(e) => setDuration(e.target.value)}
                  value={duration}>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">60 minutes</option>
                </SelectInput>
              </Field>
              <Field label="Transcribe this meeting (show subtitles)">
                <div className="subtitle">Please note that partner fees may apply</div>
                <BooleanInput disabled={!isTranscriptionEnabled} />
              </Field>
            </CardBody>
            <CardFooter divider>
              <Button disabled={creating} type="submit" IconAfter={IconArrowRight}>
                Create room
              </Button>
            </CardFooter>
          </form>
        ): !error && (
          <div className="loading">
            <ReactLoading type="spokes" color="#7B848F" width={25} height={20} />
            <p>Creating room...</p>
          </div>
        )}
      </Card>
      <style jsx>{`
      .intro {
        width: 520px;
      }
      .header {
        text-align: center;
        margin-bottom: var(--spacing-md);
      }
      .header p {
        font-size: 18px;
        font-weight: var(--weight-regular);
        color: #6B7785;
      }
      .title {
        font-size: 32px;
        font-weight: var(--weight-extra-bold);
      }
      .subtitle {
        font-size: 14px;
        font-weight: var(--weight-regular);
        line-height: 100%;
        color: #626262;
        margin-bottom: var(--spacing-xxs);
      }
      .loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .loading p {
        font-weight: 400;
        font-size: 16px;
      }
    `}</style>
    </div>
  );
}

Intro.propTypes = {
  error: PropTypes.string,
  creating: PropTypes.bool.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default Intro;
