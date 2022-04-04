import React, { useEffect, useState } from 'react';
import Button from '../Button';
import { Card, CardBody, CardFooter } from '../Card';
import Well from '../Well';
import { ReactComponent as IconArrowRight } from '../../icons/arrow-right-md.svg';
import PropTypes from 'prop-types';
import { BooleanInput, SelectInput, TextInput } from '../Input';
import Field from '../Field';
import ReactLoading from 'react-loading';
import moment from 'moment';

export const Intro = ({ error, creating, onCreate }) => {
  const [startTime, setStartTime] = useState(
    moment().format(moment.HTML5_FMT.DATETIME_LOCAL),
  );
  const [duration, setDuration] = useState('30');
  const [isTranscriptionEnabled, setIsTranscriptionEnabled] = useState(false);
  const [enableTrans, setEnableTrans] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const getTranscriptionStatus = async () => {
      const res = await fetch('/api/transcription');
      return await res.json();
    };

    getTranscriptionStatus().then(res => {
      setIsTranscriptionEnabled(res?.isTranscriptionEnabled);
      setLoaded(true);
    });
  });

  return (
    <div className="intro">
      <div className="header">
        <h2 className="title">Create your virtual class room</h2>
        <p>
          Let’s configure the Daily meeting room for your class. We’ll set both
          a starting timestamp and a duration in order to figure the duration of
          the class.
        </p>
      </div>
      <Card>
        {error && <Well variant="error">An error occurred, {error}</Well>}
        {!creating ? (
          <form
            onSubmit={e => {
              e.preventDefault();
              onCreate(startTime, duration, enableTrans);
            }}
          >
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
                  onChange={e => setDuration(e.target.value)}
                  value={duration}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">60 minutes</option>
                </SelectInput>
              </Field>
              <Field label="Transcribe this meeting (show subtitles)">
                <div className="subtitle">
                  {loaded && !isTranscriptionEnabled ? (
                    <>
                      Transcription is not available. To use transcription,
                      follow{' '}
                      <a href="https://docs.daily.co/reference/daily-js/events/transcription-events#main">
                        these instructions
                      </a>{' '}
                      for enabling it
                    </>
                  ) : (
                    <>Please note that partner fees may apply</>
                  )}
                </div>
                <BooleanInput
                  value={enableTrans}
                  onChange={e => setEnableTrans(e.target.checked)}
                  disabled={!isTranscriptionEnabled}
                />
              </Field>
            </CardBody>
            <CardFooter divider>
              <Button
                disabled={creating}
                type="submit"
                IconAfter={IconArrowRight}
              >
                Create room
              </Button>
            </CardFooter>
          </form>
        ) : (
          !error && (
            <div className="loading">
              <ReactLoading
                type="spokes"
                color="#7B848F"
                width={25}
                height={25}
              />
              <p>Creating room...</p>
            </div>
          )
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
          color: #6b7785;
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
          margin-top: var(--spacing-xs);
          font-weight: var(--weight-bold);
          font-size: 16px;
          line-height: 100%;
          color: var(--text-default);
        }
      `}</style>
    </div>
  );
};

Intro.propTypes = {
  error: PropTypes.string,
  creating: PropTypes.bool.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default Intro;
