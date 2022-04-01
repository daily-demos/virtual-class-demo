import { Html, Head, Main, NextScript } from 'next/document';

export const MyDocument = () => {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600&display=optional"
          rel="stylesheet"
        />
        <script src="https://zwibbler.com/zwibbler-demo.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default MyDocument;
