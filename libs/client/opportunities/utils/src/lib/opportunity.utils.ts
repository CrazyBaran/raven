import { ItemArgs, ItemDisabledFn } from '@progress/kendo-angular-dropdowns';

export class OpportunityUtils {
  public static canMoveToStage(
    stage: {
      configuration: {
        droppableFrom: string[];
      };
    },
    stageId: string | undefined | null,
  ): boolean {
    if (!stageId) {
      return false;
    }

    return Boolean(
      stage.configuration &&
        !stage.configuration.droppableFrom.includes(stageId),
    );
  }

  public static getDisabledItemFn(
    currentStageId: string | undefined | null,
  ): ItemDisabledFn {
    return (item: ItemArgs): boolean => {
      return OpportunityUtils.canMoveToStage(item.dataItem, currentStageId);
    };
  }

  public static stageRequiresRound(stage?: { displayName: string }): boolean {
    if (!stage) {
      return false;
    }
    return !['outreach', 'met', 'won', 'pass', 'lost'].some((s) =>
      stage.displayName.toLowerCase().includes(s),
    );
  }

  public static isLostStage(stage?: { displayName: string }): boolean {
    if (!stage) {
      return false;
    }
    return ['lost'].some((s) => stage.displayName.toLowerCase().includes(s));
  }

  public static isWonStage(stage?: { displayName: string }): boolean {
    if (!stage) {
      return false;
    }
    return ['won'].some((s) => stage.displayName.toLowerCase().includes(s));
  }

  public static isPassStage(stage?: { displayName: string }): boolean {
    if (!stage) {
      return false;
    }
    return ['pass'].some((s) => stage.displayName.toLowerCase().includes(s));
  }

  public static isTerminalStage(stage?: { displayName: string }): boolean {
    if (!stage) {
      return false;
    }
    return (
      this.isLostStage(stage) ||
      this.isPassStage(stage) ||
      this.isWonStage(stage)
    );
  }
}
