import React, { useEffect, useState } from 'react';
import Button from '../Button';
import { Card, CardBody, CardFooter } from '../Card';
import Well from '../Well';
import { ReactComponent as IconArrowRight } from '../../icons/arrow-right-md.svg';
import PropTypes from 'prop-types';
import { SelectInput, TextInput } from '../Input';
import Field from '../Field';
import ReactLoading from 'react-loading';

export const Intro = ({
  error,
  creating,
  onCreate,
}) => {
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState("30");

  useEffect(() => {
    const date = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000);
    const isoString = date.toISOString();
    setStartTime(isoString.substring(0, (isoString.indexOf("T")|0) + 6|0));
  }, []);

  return (
    <div className="intro">
      <div className="header">
        <h2>Create your virtual class room</h2>
        <p>
          Let’s configure the Daily meeting room for your class. We’ll set both a
          starting timestamp and a duration in order to figure the duration of the class.
        </p>
      </div>
      <Card>
        {error && (
          <Well variant="error">
            Failed to create room <p>{error}</p>
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
            </CardBody>
            <CardFooter divider>
              <Button disabled={creating} type="submit" IconAfter={IconArrowRight}>
                Create room
              </Button>
            </CardFooter>
          </form>
        ): (
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
      }
      .header p {
        font-weight: 400;
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
