import React, { useState } from "react";
import uuid from "uuid";

import { AttributeState, Actions } from "../../types";
import { newColor } from "../utils/utils";

import { AttributeProvider } from "../context/attribute-context";

import { CssBaseline, Container } from "@material-ui/core";
import SearchGrid from "./SearchGrid";


const Search: React.FC = () => {
  const [videos, setVideos] = useState<{ [key: string]: any }[]>([]);
  const initialAttribute: AttributeState = {
    attributes: [
      {
        id: uuid(),
        labels: ["shirt"],
        colors: [newColor],
      },
    ],
  };

  const reducer = (state: AttributeState, action: Actions) => {
    let attributes = state.attributes;
    switch (action.type) {
      case "changeAttribute":
        return {
          ...state,
          attributes: [action.newAttribute],
        };

      case "addWholePerson":
        return {
          attributes: [
            ...state.attributes,
            {
              id: uuid(),
              labels: action.labels,
              colors: action.colors,
            },
          ],
        };

      case "addPerson":
        return {
          attributes: [
            ...state.attributes,
            {
              id: uuid(),
              labels: ["shirt"],
              colors: [newColor],
            },
          ],
        };

      case "deletePerson":
        const newAttributes = attributes.filter(
          (attribute) => attribute.id !== action.pid
        );
        return {
          attributes: newAttributes,
        };

      case "addLabel":
        attributes.forEach(function (attribute, index) {
          if (attribute.id === action.pid) {
            if (!attribute.labels.includes(action.value))
              attribute.labels.push(action.value);
          }
        });
        return {
          attributes: attributes,
        };

      case "removeLabel":
        attributes.forEach(function (attribute, index) {
          if (attribute.id === action.pid) {
            const newLabels = attribute.labels.filter(
              (label) => label !== action.value
            );
            attribute.labels = newLabels;
          }
        });
        return {
          attributes: attributes,
        };

      case "addColor":
        attributes.forEach(function (attribute, index) {
          if (attribute.id === action.pid) {
            // if (!attribute.colors.includes(action.value))
            attribute.colors.push(action.value);
          }
        });
        return {
          attributes: attributes,
        };

      case "updateColor":
        attributes.forEach(function (attribute, index) {
          if (attribute.id === action.pid) {
            attribute.colors[action.idx] = action.value;
          }
        });
        return {
          attributes: attributes,
        };

      case "removeColor":
        attributes.forEach(function (attribute, index) {
          if (attribute.id === action.pid) {
            attribute.colors.pop();
          }
        });
        return {
          attributes: attributes,
        };

      default:
        return state;
    }
  };

  return (
    <AttributeProvider initialAttribute={initialAttribute} reducer={reducer}>
      <CssBaseline />
      <Container maxWidth="xl">
        <SearchGrid videos={videos} setVideos={setVideos} />
      </Container>
    </AttributeProvider>
  );
};

export default Search;
