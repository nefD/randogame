import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import theme from "@chakra-ui/theme"
// import theme from 'chakra';
import { ChakraProvider, CSSReset, ThemeProvider } from "@chakra-ui/core"

import * as serviceWorker from './serviceWorker';
import store from './app/store';

import 'index.scss';
import MyTheme from 'mytheme';

const render = () => {
  const App = require('./app/App').default;

  ReactDOM.render(
    <Provider store={store}>
      <ChakraProvider theme={MyTheme}>
        <CSSReset />
        <App />
      </ChakraProvider>
    </Provider>,
    document.getElementById('root'),
  );
};

render();

if (process.env.NODE_ENV === 'development' && (module as any).hot) {
  (module as any).hot.accept('./app/App', render);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
