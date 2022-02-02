import {Entry} from "../../creator/core/classes/entry";
import {Names} from "../../creator/core/global/names";
import {Configs} from "../../creator/core/lib/services/configs";
import {LoadingNames} from "../../creator/core/classes/modules/loading_module/static/loading-names";
import {IMapPath} from "../../creator/core/classes/modules/loading_module/static/loading-interfaces";
import {MenuModule} from "./modules/menu_module/menu-module";
import {StateManager} from "../../creator/core/lib/services/state-manager";
import {TanksStates} from "./modules/global/tanks-states";
import {States} from "../../creator/core/global/states";
import {TanksModules} from "./modules/global/tanks-names";
import {TanksLevelModule} from "./modules/tanks_level_module/tanks-level-module";

class TanksBattleground extends Entry {
    protected _gameVersion: string = '0.1.7';

    protected initModules() {
        super.initModules();
        this.addModule(TanksModules.MENU_MODULE, MenuModule);
        this.addModule(TanksModules.LEVEL_MODULE, TanksLevelModule);
    }

    protected initGameConfigs(): void {
        super.initGameConfigs();
        const configs: Configs = this.services.get(Names.Services.CONFIGS);
        configs.gameName = 'Tanks Battleground';
        configs.addProperty(LoadingNames.ASSETS, LoadingNames.SCENE, 'scene.json');
        configs.addProperty(LoadingNames.ASSETS, LoadingNames.LEVELS, [{name: 'level_1', path: 'level.json'}] as Array<IMapPath>);
    }

    protected initStates() {
        super.initStates();
        const stateManager: StateManager = this.services.get(Names.Services.STATE_MANAGER);
        stateManager.registerState(TanksStates.LEVEL, {from: [States.MAIN_MENU, TanksStates.PAUSE_GAME]});
        stateManager.registerState(TanksStates.PAUSE_GAME, {from: [TanksStates.LEVEL]});
    }
}

window.onload = () => {
    (window as any).Entry = new TanksBattleground();
}
