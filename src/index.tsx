import { render } from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import { setupStore } from "./store";

const rootElement = document.getElementById("root");
const store = setupStore();
render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);

if ((window as any).Cypress) {
  (window as any).store = store;
  console.log(window);
}
