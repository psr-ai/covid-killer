import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

function Row(props) {
    const {row} = props;
    const [open, setOpen] = React.useState(true);
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell align="right">{row.address}</TableCell>
                <TableCell align="right">{row.block_name}</TableCell>
                <TableCell align="right">{row.pincode}</TableCell>
                <TableCell align="right">{row.lat}</TableCell>
                <TableCell align="right">{row.long}</TableCell>
                <TableCell align="right">{row.from}</TableCell>
                <TableCell align="right">{row.to}</TableCell>
                <TableCell align="right">{row.fee_type}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Slots
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Available Capacity</TableCell>
                                        <TableCell align="right">Min Age Limit</TableCell>
                                        <TableCell align="right">Vaccine</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.sessions.map((session) => (
                                        <TableRow key={session.session_id}>
                                            <TableCell component="th" scope="row">
                                                {session.date}
                                            </TableCell>
                                            <TableCell>{session.available_capacity}</TableCell>
                                            <TableCell align="right">{session.min_age_limit}</TableCell>
                                            <TableCell align="right">
                                                {session.vaccine}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        name: PropTypes.string.isRequired,
        center_id: PropTypes.number.isRequired,
        address: PropTypes.string.isRequired,
        block_name: PropTypes.string.isRequired,
        pincode: PropTypes.number.isRequired,
        lat: PropTypes.number.isRequired,
        long: PropTypes.number.isRequired,
        from: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired,
        sessions: PropTypes.arrayOf(
            PropTypes.shape({
                session_id: PropTypes.string.isRequired,
                date: PropTypes.string.isRequired,
                available_capacity: PropTypes.number.isRequired,
                min_age_limit: PropTypes.number.isRequired,
                vaccine: PropTypes.string.isRequired,
            }),
        ).isRequired
    }).isRequired,
};

export default function SlotsTable({ rows }) {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell/>
                        <TableCell>Location Name</TableCell>
                        <TableCell align="right">Address</TableCell>
                        <TableCell align="right">Block Name</TableCell>
                        <TableCell align="right">Pincode</TableCell>
                        <TableCell align="right">Latitude</TableCell>
                        <TableCell align="right">Longitude</TableCell>
                        <TableCell align="right">Open from</TableCell>
                        <TableCell align="right">Open till</TableCell>
                        <TableCell align="right">Fee Type</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <Row key={row.center_id} row={row}/>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}