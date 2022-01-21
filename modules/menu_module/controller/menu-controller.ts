import {AbstractController} from "../../../../../core/lib/mvc/controller";
import {States} from "../../../../../core/global/states";
import {MenuView} from "../view/menu-view";
import {MenuSignals} from "../global/menu-signals";
import {TanksStates} from "../../global/tanks-states";
import {Notifications} from "../../../../../core/global/notifications";
import {IWindowEventData} from "../../../../../core/classes/modules/setup_module/static/setup-interfaces";
import {KeyboardMap} from "../../../../../core/classes/modules/setup_module/static/keyboard-map";
import {WindowEventNames} from "../../../../../core/classes/modules/setup_module/static/window-event-names";

export class MenuController extends AbstractController {
    get view(): MenuView {
        return this._view as MenuView;
    }

    public onRegister() {
        super.onRegister();
        this.sendNotification(Notifications.REGISTER_WINDOW_EVENT, {
            eventName: WindowEventNames.KEY_DOWN,
            data: [KeyboardMap.SPACE, KeyboardMap.ENTER],
            handler: this.closeMenu.bind(this),
            states: [States.MAIN_MENU, TanksStates.PAUSE_GAME]
        } as IWindowEventData);
    }

    protected registerNotificationListeners(): void {
        super.registerNotificationListeners();
        this.addNotificationListener(States.MAIN_MENU, this.showMenu.bind(this));
        this.addNotificationListener(TanksStates.PAUSE_GAME, this.gamePaused.bind(this));
    }

    protected registerSignalListeners(): void {
        super.registerSignalListeners();
        this.addSignalListener(MenuSignals.START_PRESSED, this.closeMenu.bind(this));
    }

    protected showMenu(): void {
        this.view.layerTransitionInStart();
        this.view.enableInteractive();
    }

    protected gamePaused(): void {
        this.showMenu();
    }

    protected closeMenu(): void {
        this.view.disableInteractive();
        this.view.layerTransitionOutStart(() => {
            this.setState(TanksStates.LEVEL);
        });
    }
}
