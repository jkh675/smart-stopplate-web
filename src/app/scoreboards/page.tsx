"use client";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import {
    Button,
    Card,
    CardActionArea,
    Divider,
    Grid,
    Paper,
    PaperProps,
    Stack,
    Typography,
    styled,
} from "@mui/material";
import React from "react";
import { Mutation, Query } from "@/gql_dto";
import { useRouter } from "next/navigation";
import { EROUTE_LIST, ROUTE_LIST } from "@/constant";

const GET_ALL_SCOREBOARDS_QUERY = gql`
    query {
        getAllScoreboards {
            createdAt
            id
            isLocked
            name
        }
    }
`;
const LOCK_SCOREBOARD_MUTATION = gql`
    mutation LockScoreboard($id: Int!) {
        lockScoreboard(id: $id){
            id
        }
    }
`;
const SUBSCRIBE_TO_SCOREBOARD_UPDATE_MUTATION = gql`
    subscription SubscribeToScoreboardUpdate {
        subscribeToScoreboardUpdate
    }
`;

export default function ScoreboardsPage() {
    const router = useRouter();
    const all_scoreboards = useQuery<Query>(GET_ALL_SCOREBOARDS_QUERY);
    const [lock_scoreboard, lock_scoreboard_info] = useMutation<Mutation>(LOCK_SCOREBOARD_MUTATION);
    const _ = useSubscription(SUBSCRIBE_TO_SCOREBOARD_UPDATE_MUTATION, {
        onData(options) {
            all_scoreboards.refetch();
        },
    });
    if (all_scoreboards.loading) return <pre>Loading...</pre>;
    if (all_scoreboards.error)
        return <pre>ERROR: {JSON.stringify(all_scoreboards.error)}</pre>;
    if (!all_scoreboards.data) return <pre>No data</pre>;
    return (
        <>
            <Stack gap={2} divider={<Divider />}>
                {all_scoreboards.data.getAllScoreboards.map((v) => (
                    <Card elevation={10} key={v.id} >
                        <Grid container alignItems={"center"}>
                            <Grid item xs={8} md={11}>
                                <CardActionArea onClick={() => {
                                    router.push(`${ROUTE_LIST[EROUTE_LIST.Scoreboards].dir}/${v.id}`);
                                }}>
                                    <Grid sx={{ padding: 1 }} container spacing={2} alignItems={"center"}>
                                        <Grid item xs={12}>
                                            <Typography
                                                variant="h4"
                                                sx={{ textAlign: "left" }}
                                            >
                                                {v.name}
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sx={{ justifyContent: "center" }}
                                        >
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    textAlign: "left",
                                                    justifyContent: "center",
                                                    fontSize: "small"
                                                }}
                                                color={"GrayText"}
                                            >
                                                {new Date(v.createdAt).toLocaleDateString() + new Date(v.createdAt).toLocaleTimeString()}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardActionArea>

                            </Grid>
                            <Grid item xs={4} md={1}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    fullWidth
                                    disabled={v.isLocked}
                                    sx={{ height: 100 }}
                                    onClick={() => {
                                        if (!confirm("Are you sure you want to lock this scoreboard? after locked the score inside of this scoreboar will be IMMUTABLE ! "))
                                            return
                                        if (prompt(`Type this scoreboard (${v.name}) to process the lock action`) === v.name) {
                                            lock_scoreboard({
                                                variables: {
                                                    id: v.id
                                                }
                                            });
                                            return
                                        } else {
                                            alert("Wrong name")
                                        }
                                    }}
                                >
                                    Lock
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>
                ))}
            </Stack >
        </>
    );
}