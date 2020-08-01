import React, { useState } from "react";
import { useAttribute } from "../context/attribute-context";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import { SketchPicker } from "react-color";

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "none !important",
  },
  shape: {
    width: 25,
    height: 25,
  },
  shapeCircle: {
    borderRadius: "50%",
  },
  typography: {
    padding: theme.spacing(2),
  },
}));

interface ColorCircleProps {
  id: string;
  index: number;
  color: { hex: string };
}

const ColorCircle: React.FC<ColorCircleProps> = (props) => {
  const classes = useStyles();

  // eslint-disable-next-line
  const [{ attributes }, dispatch] = useAttribute();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleColorChange = (color) => {
    dispatch({
      type: "updateColor",
      value: color,
      pid: props.id,
      idx: props.index
    });
  };

  const handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <div
        className={clsx(classes.shape, classes.shapeCircle)}
        style={{ backgroundColor: `${props.color.hex}` }}
        onClick={handleClick}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <SketchPicker
          color={props.color.hex}
          onChangeComplete={handleColorChange}
        />
      </Popover>
    </div>
  );
};

export default ColorCircle;
