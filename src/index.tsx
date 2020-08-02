import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import theme from "@chakra-ui/theme"
// import theme from 'chakra';
import { ChakraProvider, CSSReset, ThemeProvider } from "@chakra-ui/core"

import * as serviceWorker from './serviceWorker';
import store from './app/store';

import 'index.scss';
import MyTheme from 'mytheme';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import { Message } from "models/messages";

const gameMessagesContextDefault = [[] as Message[], (newValue: Message[]) => {}, () => {}];
const GameMessagesContext = React.createContext(gameMessagesContextDefault);

export const GameMessagesProvider = (props: React.PropsWithChildren<{}>) => {
  const ctxValue = useLocalStorage('gameMessages', [] as Message[]);
  return (
    <GameMessagesContext.Provider value={ctxValue}>
      {props.children}
    </GameMessagesContext.Provider>
  )
};

export const useGameMessages = () => useContext(GameMessagesContext);

const render = () => {
  const App = require('./app/App').default;

  ReactDOM.render(
    <Provider store={store}>
      <ChakraProvider theme={MyTheme}>
        <CSSReset />
        <GameMessagesProvider>
          <App />
        </GameMessagesProvider>
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
