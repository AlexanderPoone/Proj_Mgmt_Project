import moment from 'moment';
import { v4 as uuid } from 'uuid';
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
} from '@material-ui/core';
import { Box } from '@material-ui/system';

const RepoGridCell = (props) => {

    return (
        <Card sx={props.sx} onClick={() => {
            props.onClick(props.item);
        }}>
            <CardContent>
                <Typography variant="h2"
                    color="text.secondary"
                    style={{ wordWrap: "break-word" }}
                    sx={{ marginBottom: 1 }}>
                    {props.item?.name ?? ''}
                </Typography>
                <Typography variant="h6"
                    color="text.secondary"
                    style={{ wordWrap: "break-word" }}
                    sx={{ marginBottom: 1 }}>
                    {props.item?.owner?.login ?? ''}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{ wordWrap: "break-word" }}
                    sx={{ marginBottom: 1 }}>
                    {props.item?.description ?? ''}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default RepoGridCell;