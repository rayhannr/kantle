import Document, { Head, Html, Main, NextScript } from "next/document";

// to do stuff with the entire html structure
class MyDocument extends Document {
  render() {
    return (
      <Html lang={process.env.REACT_APP_LOCALE_STRING}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
