import React, { useState } from "react";
import uuid from "uuid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import CamMap from "../database/CamMap";

interface Props {
  latitude: number;
  longitude: number;
  address: string;
}

const SpotDialog: React.FC<Props> = ({ latitude, longitude, address }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [viewState, setViewState] = useState({
    latitude: latitude,
    longitude: longitude,
    zoom: 11,
    pitch: 40.5,
    bearing: 0.7,
  });

  const handleChangeViewState = ({ viewState }) => setViewState(viewState);

  return (
    <>
      <Button
        startIcon={<LocationOnIcon />}
        style={{ width: "60%" }}
        onClick={handleClickOpen}
      >
        Location
      </Button>
      <Dialog
        open={open}
        fullWidth={true}
        maxWidth={"md"}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Location on Map"}</DialogTitle>
        <DialogContent>

            <CamMap
              width="100%"
              height="50vh"
              viewState={viewState}
              onViewStateChange={handleChangeViewState}
              libraries={[
                {
                  longitude: longitude,
                  latitude: latitude,
                  _id: {
                    $oid: uuid(),
                  },
                  formatted_address: address,
                },
              ]}
            />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SpotDialog;
