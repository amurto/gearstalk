import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from '../hooks/http-hook';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from "@material-ui/pickers";
import LoadingSpinner from '../utils/LoadingSpinner';
import Alert from '@material-ui/lab/Alert';
import { Button, Typography, Dialog, DialogActions, DialogContent }from '@material-ui/core';

interface Props {
    open: boolean;
    video: { [key: string] : any };
    setVideo: (responseData: {}) => void;
    handleClose: () => void;
}

const TimeDialog: React.FC<Props> = ({ open, video, setVideo, handleClose }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const auth = useContext(AuthContext);
    
    // eslint-disable-next-line
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const handleDateChange = (date) => {
        setSelectedDate(date)
    }

    useEffect(() => {
        if (open && video) {
            setSelectedDate(new Date(video.date + "T" + video.time + "+05:30"))
        }
    }, [open, video])

    const updateTimeHandler = async () => {
        if (selectedDate && video) {
            console.log(selectedDate.toString())
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/video/updatevideotimestamp',
                    'PATCH',
                    JSON.stringify({
                        'video_id': video._id.$oid,
                        'time': selectedDate.toString()
                    }),
                    {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + auth.token
                    }
                )
                setVideo(responseData)
                handleClose()
            } catch (err) {
                console.log(err)
            }
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogContent>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div>
                        {error && (
                            <Alert variant="outlined" style={{ color: '#f44336', marginBottom: '10px' }} severity="error" onClose={clearError}>
                                {error}
                            </Alert>
                        )}
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Typography variant='h5' style={{ color: '#758cd1' }}>Date</Typography>
                                <KeyboardDateTimePicker
                                    variant="inline"
                                    ampm={false}
                                    label="Select Date and Timestamp"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    onError={console.log}
                                    format="yyyy/MM/dd HH:mm"
                                />
                            </MuiPickersUtilsProvider>
                        )}
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
            <Button onClick={updateTimeHandler} disabled={isLoading} color="primary">
                Update
            </Button>
            <Button onClick={handleClose} color="primary" autoFocus>
                Cancel
            </Button>
            </DialogActions>
        </Dialog>
  );
}

export default TimeDialog;