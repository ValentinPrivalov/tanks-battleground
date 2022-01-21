import {AbstractModel} from "../../../../../core/lib/mvc/model";
import {TanksLevelNames} from "../global/tanks-level-names";

export class TanksLevelModel extends AbstractModel {
    protected data: ITanksLevelData = {
        currentLevel: TanksLevelNames.LEVEL_1
    }
}

export interface ITanksLevelData {
    currentLevel: string;
}
