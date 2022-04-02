import React from 'react';
import GlobalStyle from '../components/GlobalStyle';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { useWindowSize } from '../hooks/useWindowSize';
import { Card, CardBody, CardHeader } from '../components/Card';

function App({ Component, pageProps }) {
  const size = useWindowSize();

  return (
    <>
      <Head>
        <title>Daily - {process.env.PROJECT_TITLE}</title>
      </Head>
      <GlobalStyle />
      {size.width <= 540 ? (
        <div className="not-responsive">
          <Card>
            <CardHeader>Uh-oh, sorry, page is not mobile friendly</CardHeader>
            <CardBody>
              We are very sorry to say that the page is not mobile friendly,
              please try on a larger screens for better experience!
            </CardBody>
          </Card>
        </div>
      ) : (
        <Component
          asides={App.asides}
          modals={App.modals}
          customTrayComponent={App.customTrayComponent}
          customAppComponent={App.customAppComponent}
          {...pageProps}
        />
      )}
      <style jsx>{`
        .not-responsive {
          display: flex;
          width: 100vw;
          height: 100vh;
          justify-content: center;
          align-items: center;
          padding: 1.5rem;
        }
      `}</style>
    </>
  );
}

App.defaultProps = {
  Component: null,
  pageProps: {},
};

App.propTypes = {
  Component: PropTypes.elementType,
  pageProps: PropTypes.object,
};

App.asides = [];
App.modals = [];
App.customTrayComponent = null;
App.customAppComponent = null;

export default App;
