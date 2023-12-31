import { createMachine } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { canJoinGuard } from './guards'
import { GridState, Player, PlayerColor } from "../types";

enum GameStates  {
    LOBBY = "LOBBY",
    PLAY = "PLAY",
    VICTORY = "VICTORY",
    DRAW = "DRAW",
}

export const GameModel = createModel({
    player:[] as Player[],
    currentPlayer : null as null | Player["id"],
    rowLength: 4,
    grid: [
        ["E","E","E","E","E","E","E",],
        ["E","E","E","E","E","E","E",],
        ["E","E","E","E","E","E","E",],
        ["E","E","E","E","E","E","E",],
        ["E","E","E","E","E","E","E",],
        ["E","E","E","E","E","E","E",],
        ["E","E","E","E","E","E","E",],
    ] as GridState
}, {
    events: {
        join: (playerId: Player["id"], name: Player["name"]) => ({playerId, name}),
        leave: (playerId: Player["id"]) => ({playerId}),
        chooseColor: (playerId: Player["id"], color: PlayerColor) => ({playerId, color}),
        start: (playerId: Player["id"]) => ({playerId}),
        dropToken: (playerId: Player["id"], x: number) => ({playerId, x}),
        restart: () => ({}),
    }
})

export const GameMachine = GameModel.createMachine({
    id: "game",
    context: GameModel.initialContext,
    initial: GameStates.LOBBY,
    states: {
        [GameStates.LOBBY]: {
            on:{
                join:{
                    cond: canJoinGuard,
                    target: GameStates.LOBBY
                },
                leave:{
                    target: GameStates.LOBBY
                },
                start: {
                    target: GameStates.PLAY
                }
            }
        },
        [GameStates.PLAY]:{
            on: {
                dropToken: {
                    target: GameStates.VICTORY
                }    
            }
        },
            [GameStates.VICTORY]: {
                on: {
                    restart: {
                        target:GameStates.LOBBY
                    }
                }
        },
        [GameStates.DRAW]: {
            on: {
                restart: {
                    target:GameStates.LOBBY
                }
            }
        }
    }
})