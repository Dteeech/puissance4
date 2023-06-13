import { GameContext, GameEvent, GameEvents, GameGuard } from "../types"

export const canJoinGuard : GameGuard<"join"> = (context, event) => {
    return context.players.length < 2 && context.player.find(p => p.id === event.playerId) === undefined
} 