import { OUTCOME_ODDS } from "@/config/OutcomeOdds";
import { GAME_SETTINGS } from "@/config/GameSettings";
import { GameState } from "@/domain/services/game_event_services/GameStateService";
import { log } from "console";
import { getRelativeSector } from "@/domain/utils/GetRelativeSector";

export class EventExecutionService {
  static canMoveBackOnRebound(state: GameState): boolean {
    const minSector =
      state.possession === "home"
        ? state.halfTime
          ? 3
          : 1
        : state.halfTime
        ? 1
        : 3;
    return state.currentSector !== minSector;
  }

  static checkForSubstitution(state: GameState) {
    const gameProgress = (state.ticksElapsed / GAME_SETTINGS.gameTicks) * 100;

    // If the game is not past the substitution threshold, treat it as retain possession
    if (gameProgress < GAME_SETTINGS.substitutionThreshold) {
      log(`🔄 Substitution rolled too early. Retaining possession.`);
      return;
    }

    // Check if both teams have reached max substitutions
    if (
      state.homeSubstitutions >= GAME_SETTINGS.maxSubstitutions &&
      state.awaySubstitutions >= GAME_SETTINGS.maxSubstitutions
    ) {
      log(
        `🚫 No more substitutions allowed (Max: ${GAME_SETTINGS.maxSubstitutions} per team). Retaining possession.`
      );
      return;
    }

    log(`🔄 A SUBSTITUTION has been made!`);
  }

  static handleAdvance(state: GameState) {
    const roll = Math.random() * 100;

    if (roll < OUTCOME_ODDS.advance.retain_possession) {
      state.currentSector += state.possession === "home" ? 1 : -1;
      log(
        `${state.possession.toUpperCase()} advances to Sector ${
          state.currentSector
        }`
      );
    } else if (
      roll <
      OUTCOME_ODDS.advance.retain_possession +
        OUTCOME_ODDS.advance.rebound.chance
    ) {
      log(`${state.possession.toUpperCase()} attempt results in a REBOUND.`);

      const reboundRoll = Math.random() * 100;

      if (this.canMoveBackOnRebound(state)) {
        if (reboundRoll < OUTCOME_ODDS.advance.rebound.outcomes.move_back) {
          state.currentSector += state.possession === "home" ? -1 : 1;
          log(
            `${state.possession.toUpperCase()} REBOUND - Moved BACK to Sector ${
              state.currentSector
            }`
          );
        } else {
          log(
            `${state.possession.toUpperCase()} REBOUND - Retains possession in Sector ${
              state.currentSector
            }`
          );
        }
      } else {
        log(
          `${state.possession.toUpperCase()} REBOUND - Stays in Sector ${
            state.currentSector
          }`
        );
      }
    } else {
      log(
        `${state.possession.toUpperCase()} failed to advance, possession switches.`
      );
      state.switchPossession();
    }
  }

  static handleShot(state: GameState) {
    const shotRoll = Math.random() * 100;

    if (shotRoll < OUTCOME_ODDS.shot.on_target.chance) {
      log(`${state.possession.toUpperCase()} takes a SHOT ON TARGET!`);

      const outcomeRoll = Math.random() * 100;

      if (outcomeRoll < OUTCOME_ODDS.shot.on_target.outcomes.goal) {
        log(`${state.possession.toUpperCase()} SCORES! ⚽`);
        if (state.possession === "home") {
          state.homeScore++;
        } else {
          state.awayScore++;
        }
        state.switchPossession();
        state.resetSectorAfterGoal();
      } else if (
        outcomeRoll <
        OUTCOME_ODDS.shot.on_target.outcomes.goal +
          OUTCOME_ODDS.shot.on_target.outcomes.save
      ) {
        log(`❌ Saved by the keeper!`);
        state.switchPossession();
      } else if (
        outcomeRoll <
        OUTCOME_ODDS.shot.on_target.outcomes.goal +
          OUTCOME_ODDS.shot.on_target.outcomes.save +
          OUTCOME_ODDS.shot.on_target.outcomes.rebound.chance
      ) {
        log(`🔄 Rebound! The attacking team keeps the ball.`);

        const reboundRoll = Math.random() * 100;

        if (this.canMoveBackOnRebound(state)) {
          if (
            reboundRoll <
            OUTCOME_ODDS.shot.on_target.outcomes.rebound.outcomes.move_back
          ) {
            state.currentSector += state.possession === "home" ? -1 : 1;
            log(
              `${state.possession.toUpperCase()} REBOUND - Moved BACK to Sector ${
                state.currentSector
              }`
            );
          } else {
            log(
              `${state.possession.toUpperCase()} REBOUND - Retains possession in Sector ${
                state.currentSector
              }`
            );
          }
        } else {
          log(
            `${state.possession.toUpperCase()} REBOUND - Stays in Sector ${
              state.currentSector
            }`
          );
        }
      } else if (
        outcomeRoll <
        OUTCOME_ODDS.shot.on_target.outcomes.goal +
          OUTCOME_ODDS.shot.on_target.outcomes.save +
          OUTCOME_ODDS.shot.on_target.outcomes.rebound.chance +
          OUTCOME_ODDS.shot.on_target.outcomes.corner
      ) {
        log(`🏳️ Corner kick awarded!`);
      } else {
        log(`🔄 Possession switches after the shot!`);
        state.switchPossession();
      }
    } else {
      log(`${state.possession.toUpperCase()} MISSES the target completely!`);

      const outcomeRoll = Math.random() * 100;

      if (outcomeRoll < OUTCOME_ODDS.shot.off_target.outcomes.corner) {
        log(`🏳️ Corner kick awarded!`);
      } else if (
        outcomeRoll <
        OUTCOME_ODDS.shot.off_target.outcomes.corner +
          OUTCOME_ODDS.shot.off_target.outcomes.rebound.chance
      ) {
        log(`🔄 Rebound! The attacking team keeps the ball.`);

        const reboundRoll = Math.random() * 100;
        log(`🔄 Shot Rebound Roll: ${reboundRoll}`);

        if (this.canMoveBackOnRebound(state)) {
          if (
            reboundRoll <
            OUTCOME_ODDS.shot.off_target.outcomes.rebound.outcomes.move_back
          ) {
            state.currentSector += state.possession === "home" ? -1 : 1;
            log(
              `${state.possession.toUpperCase()} REBOUND - Moved BACK to Sector ${
                state.currentSector
              }`
            );
          } else {
            log(
              `${state.possession.toUpperCase()} REBOUND - Retains possession in Sector ${
                state.currentSector
              }`
            );
          }
        } else {
          log(
            `${state.possession.toUpperCase()} REBOUND - Stays in Sector ${
              state.currentSector
            }`
          );
        }
      } else {
        log(`🔄 Possession switches after the miss!`);
        state.switchPossession();
      }
    }
  }

  static handleFoul(state: GameState) {
    const foulingTeam = state.possession === "home" ? "away" : "home"; // Defending team commits the foul
    log(`${foulingTeam.toUpperCase()} commits a FOUL!`);

    // 🎲 **Main Foul Outcome Roll** (decides retain possession, yellow, or red)
    const foulRoll = Math.random() * 100;

    if (foulRoll < OUTCOME_ODDS.foul.retain_possession) {
      log(`✅ No card issued. Play resumes.`);
    } else if (
      foulRoll <
      OUTCOME_ODDS.foul.retain_possession + OUTCOME_ODDS.foul.yellow
    ) {
      log(`🟨 Yellow Card issued to ${foulingTeam.toUpperCase()}!`);
    } else if (
      foulRoll <
      OUTCOME_ODDS.foul.retain_possession +
        OUTCOME_ODDS.foul.yellow +
        OUTCOME_ODDS.foul.red
    ) {
      log(`🟥 Red Card issued to ${foulingTeam.toUpperCase()}!`);
    }

    // 🔵 **Attacking team always retains possession**
    log(`🔵 ${state.possession.toUpperCase()} retains possession.`);

    // 🎯 **Penalty Check (only in attacking sector)**
    const attackingSector = state.possession === "home" ? 3 : 1;
    if (state.currentSector === attackingSector) {
      const penaltyRoll = Math.random() * 100;

      if (penaltyRoll < OUTCOME_ODDS.foul.penalty) {
        log(`⚽ PENALTY awarded to ${state.possession.toUpperCase()}!`);
      }
    }

    // 🤕 **Injury Roll (completely independent)**
    const injuryRoll = Math.random() * 100;

    if (injuryRoll < OUTCOME_ODDS.foul.injury) {
      log(`🤕 Injury occurred to a player on ${foulingTeam.toUpperCase()}!`);
    }
  }

  static handleReroll(state: GameState) {
    const roll = Math.random() * 100;

    if (roll < OUTCOME_ODDS.reroll.substitution) {
      log(`🔄 Substitution triggered by roll.`);
      this.checkForSubstitution(state);
    } else if (
      roll <
      OUTCOME_ODDS.reroll.substitution + OUTCOME_ODDS.reroll.retain_possession
    ) {
      log(`🔄 Play continues. Possession retained.`);
    } else {
      log(`🔄 Play results in a REBOUND.`);

      const reboundRoll = Math.random() * 100;
      const sector = getRelativeSector(state);

      if (
        reboundRoll < OUTCOME_ODDS.reroll.rebound.outcomes.move_back &&
        sector !== "defensive" // Prevent moving back from defensive sector
      ) {
        state.currentSector += state.possession === "home" ? -1 : 1;
        log(`🔄 Rebound - Ball moves BACK to Sector ${state.currentSector}`);
      } else {
        log(`🔄 Rebound - Ball stays in Sector ${state.currentSector}`);
      }
    }
  }

  static handleThrowIn(state: GameState) {
    const throwInRoll = Math.random() * 100;
    log(`🎲 Throw-In Roll: ${throwInRoll}`);

    if (throwInRoll < OUTCOME_ODDS.throw_in.retain_possession) {
      log(
        `🏳️‍🌫️ THROW-IN for ${state.possession.toUpperCase()} - Possession retained.`
      );
    } else {
      state.switchPossession();
      log(
        `🔄 THROW-IN - Possession switches to ${state.possession.toUpperCase()}.`
      );
    }
  }
}
