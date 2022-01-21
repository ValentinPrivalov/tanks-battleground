import {TanksLevelView} from "./view/tanks-level-view";
import {TanksLevelController} from "./controller/tanks-level-controller";
import {TanksLevelModel} from "./model/tanks-level-model";
import {AbstractModule} from "../../../../core/lib/mvc/module";
import {TanksViews} from "../global/tanks-names";

export class TanksLevelModule extends AbstractModule {
    protected registerModels(): void {
        super.registerModels();
        this.addModel(TanksViews.LEVEL, TanksLevelModel);
    }

    protected registerViews(): void {
        super.registerViews();
        this.replaceView(TanksViews.LEVEL, TanksLevelView);
    }

    protected registerControllers(): void {
        super.registerControllers();
        this.addController(TanksViews.LEVEL, TanksLevelController);
    }
}
