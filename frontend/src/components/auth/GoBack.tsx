import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Grid } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
const GoBack:React.FC = () => {
    let history = useHistory();
    return (
        <Grid style={{ padding: "10px" }} container>
            <Grid style={{ textAlign: "left" }} item xs={12}>
            <Button onClick={() => history.goBack()} variant="contained" color="secondary" startIcon={<ArrowBackIosIcon />}>
                Back
            </Button>
            </Grid>
        </Grid>
    )
}

export default GoBack;