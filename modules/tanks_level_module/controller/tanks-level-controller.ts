import {TanksLevelView} from "../view/tanks-level-view";
import {TanksStates} from "../../global/tanks-states";
import {ITanksLevelData, TanksLevelModel} from "../model/tanks-level-model";
import {AbstractController} from "../../../../../core/lib/mvc/controller";
import {TanksLevelSignals} from "../global/tanks-level-signals";
import {States} from "../../../../../core/global/states";
import {Notifications} from "../../../../../core/global/notifications";
import {
    IKeyboardEvent,
    IWindowEventData
} from "../../../../../core/classes/modules/setup_module/static/setup-interfaces";
import {WindowEventNames} from "../../../../../core/classes/modules/setup_module/static/window-event-names";
import {KeyboardMap} from "../../../../../core/classes/modules/setup_module/static/keyboard-map";

export class TanksLevelController extends AbstractController {
    get view(): TanksLevelView {
        return this._view as TanksLevelView;
    }

    get model(): TanksLevelModel {
        return this._model as TanksLevelModel;
    }

    public onRegister() {
        super.onRegister();
        this.sendNotification(Notifications.REGISTER_WINDOW_EVENT, {
            eventName: WindowEventNames.MOUSE_WHEEL,
            handler: this.onMouseWheel.bind(this),
            states: [TanksStates.LEVEL]
        } as IWindowEventData);
        this.sendNotification(Notifications.REGISTER_WINDOW_EVENT, {
            eventName: WindowEventNames.KEY_DOWN,
            data: [KeyboardMap.ESCAPE],
            handler: this.stopLevel.bind(this),
            states: [TanksStates.LEVEL]
        } as IWindowEventData);
        this.sendNotification(Notifications.REGISTER_WINDOW_EVENT, {
            eventName: WindowEventNames.KEY_DOWN,
            data: [KeyboardMap.W, KeyboardMap.A, KeyboardMap.S, KeyboardMap.D],
            handler: this.moveSceneByKeyboard.bind(this),
            states: [TanksStates.LEVEL]
        } as IWindowEventData);
        this.sendNotification(Notifications.REGISTER_WINDOW_EVENT, {
            eventName: WindowEventNames.KEY_UP,
            data: [KeyboardMap.W, KeyboardMap.A, KeyboardMap.S, KeyboardMap.D],
            handler: this.stopSceneByKeyboard.bind(this),
            states: [TanksStates.LEVEL]
        } as IWindowEventData);
    }

    protected registerNotificationListeners(): void {
        super.registerNotificationListeners();
        this.addNotificationListener(States.MAIN_MENU, this.showLevel.bind(this));
        this.addNotificationListener(TanksStates.LEVEL, this.initLevel.bind(this));
    }

    protected registerSignalListeners(): void {
        super.registerSignalListeners();
        this.addSignalListener(TanksLevelSignals.PAUSE_GAME, this.stopLevel.bind(this));
    }

    protected showLevel(): void {
        const levelData: ITanksLevelData = this.model.getData();
        this.view.layerTransitionInStart();
        this.view.insertLevel(levelData.currentLevel);
        this.view.setupLevel();
    }

    protected initLevel(): void {
        this.view.enableInteractive();
        this.view.showInterface();
    }

    protected stopLevel(): void {
        this.view.disableInteractive();
        this.view.hideInterface();
        this.setState(TanksStates.PAUSE_GAME);
    }

    protected onMouseWheel(data: WheelEvent): void {
        this.view.onZoom(data);
    }

    protected moveSceneByKeyboard(data: IKeyboardEvent): void {
        this.view.moveSceneByKeyboard(data);
    }

    protected stopSceneByKeyboard(data: IKeyboardEvent): void {
        this.view.moveSceneByKeyboard(data, true);
    }
}
