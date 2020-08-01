import React, { createContext, useContext, useReducer } from "react";
import { AttributeState, Actions } from "../../types";

interface AttributeProps {
  reducer: (
    state: AttributeState,
    action: Actions
  ) => {
    attributes: any[];
  };
  initialAttribute: AttributeState;
  children: React.ReactNode;
}

export const AttributeContext = createContext<
  [AttributeState, React.Dispatch<Actions>]
>([null, null]);

export const AttributeProvider: React.FC<AttributeProps> = ({
  reducer,
  initialAttribute,
  children,
}) => (
  <AttributeContext.Provider value={useReducer(reducer, initialAttribute)}>
    {children}
  </AttributeContext.Provider>
);

export const useAttribute = () => useContext(AttributeContext);
