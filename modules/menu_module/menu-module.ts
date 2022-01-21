import {AbstractModule} from "../../../../core/lib/mvc/module";
import {Names} from "../../../../core/global/names";
import {MenuController} from "./controller/menu-controller";
import {MenuView} from "./view/menu-view";

export class MenuModule extends AbstractModule {
    protected registerViews(): void {
        super.registerViews();
        this.addView(Names.Views.MAIN_MENU, MenuView);
    }

    protected registerControllers(): void {
        super.registerControllers();
        this.addController(Names.Views.MAIN_MENU, MenuController);
    }
}
