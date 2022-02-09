import { IKeyboardEvent } from '../../../../../creator/core/classes/modules/setup_module/static/setup-interfaces';
import { IVelocity, IZoomEdges } from '../global/tanks-level-interfaces';
import gsap from 'gsap';
import { AbstractView } from '../../../../../creator/core/lib/mvc/view';
import { TanksLevelNames } from '../global/tanks-level-names';
import { Layer } from '../../../../../creator/core/lib/pixi/layer';
import { Button } from '../../../../../creator/core/lib/pixi/button';
import { PointerEvents } from '../../../../../creator/core/global/pointer-events';
import { TanksLevelSignals } from '../global/tanks-level-signals';
import { InteractionEvent, Point } from 'pixi.js';
import { Names } from '../../../../../creator/core/global/names';
import { GraphicsModel } from '../../../../../creator/core/classes/modules/graphics_module/model/graphics-model';
import { ISceneSize } from '../../../../../creator/core/classes/modules/graphics_module/static/graphics-interfaces';
import { ITiledPoint } from '../../../../../creator/core/lib/tiled/tiled-interfaces';
import { KeyboardMap } from '../../../../../creator/core/classes/modules/setup_module/static/keyboard-map';

export class TanksLevelView extends AbstractView {
    protected map: Layer;
    protected interface: Layer;
    protected menuButton: Button;
    protected spawnPoint: ITiledPoint;
    protected zoomTween: GSAPTween;
    protected zoomScaleStep: number = 2000;
    protected zoomEdges: IZoomEdges = {
        minScale: 0.3,
        maxScale: 1
    };

    protected initialZoom = 0.5;
    protected dragging: boolean = false;
    protected pointerPos: Point = null;
    protected beforeDragMapPos: Point = null;
    protected sceneSize: ISceneSize;
    protected mapVelocity: IVelocity = { vx: 0, vy: 0, speed: 7 };

    public onCreated(): void {
        super.onCreated();
        this.sceneSize = (this.getModel(Names.Views.MAIN_SCENE) as GraphicsModel).getData();
        this.map = this.findChildByName(TanksLevelNames.MAP) as Layer;
        this.interface = this.findChildByName(TanksLevelNames.INTERFACE) as Layer;
        this.menuButton = new Button(this.findChildByName(TanksLevelNames.MENU_BUTTON) as Layer);
        this.menuButton.on(PointerEvents.DOWN, () => {
            this.raiseSignal(TanksLevelSignals.PAUSE_GAME);
        });

        this.display.interactive = true;
        this.display.on(PointerEvents.DOWN, this.startDrag.bind(this));
        this.display.on(PointerEvents.MOVE, this.onDrag.bind(this));
        this.display.on(PointerEvents.UP, this.endDrag.bind(this));
        this.display.on(PointerEvents.OUT, this.endDrag.bind(this));
    }

    public insertLevel(levelName: string): void {
        this.interface.visible = false;
        this.map.addChild(this.sceneManager.get(levelName) as Layer);
        // const resource: LoaderResource = this.loadingModel.getSpine('tank_A');
        // console.log(resource)
        // const spine = new Spine(resource.spineData);
        // this.map.addChild(spine);
    }

    public setupLevel(): void {
        const spawn: Layer = this.findChildByName(TanksLevelNames.SPAWN) as Layer;
        this.spawnPoint = spawn.properties[TanksLevelNames.SPAWN_POINT];
        this.moveSceneTo(this.spawnPoint.x, this.spawnPoint.y);
        this.startZoom(this.initialZoom);
        this.map.position.set(this.sceneSize.width / 2, this.sceneSize.height / 2);
    }

    public enableInteractive(): void {
        super.enableInteractive();
        this.menuButton.enable = true;
    }

    public showInterface(): void {
        this.interface.visible = true;
        this.interface.alpha = 0;
        gsap.to(this.interface, {
            duration: 0.3,
            alpha: 1
        });
    }

    public hideInterface(): void {
        gsap.to(this.interface, {
            duration: 0.3,
            alpha: 0,
            onComplete: () => {
                this.interface.visible = false;
            }
        });
    }

    public disableInteractive(): void {
        super.disableInteractive();
        this.menuButton.enable = false;
        this.mapVelocity.vx = 0;
        this.mapVelocity.vy = 0;
    }

    public onZoom(data: WheelEvent): void {
        const scaleValue: number = data.deltaY / this.zoomScaleStep;
        const currentScale: number = this.map.scale.x;
        const newScaleValue: number = currentScale - scaleValue;

        if (newScaleValue >= this.zoomEdges.maxScale) {
            this.startZoom(this.zoomEdges.maxScale);
        } else if (newScaleValue <= this.zoomEdges.minScale) {
            this.startZoom(this.zoomEdges.minScale);
        } else {
            this.startZoom(newScaleValue);
        }
    }

    protected startZoom(scale: number): void {
        this.zoomTween?.kill();
        this.zoomTween = gsap.to(this.map.scale, {
            duration: 0.3,
            x: scale,
            y: scale
        });
    }

    protected moveSceneTo(x: number, y: number): void {
        const leftBound: number = this.getMapBounds(TanksLevelNames.LEFT_BOUND);
        const topBound: number = this.getMapBounds(TanksLevelNames.TOP_BOUND);
        const rightBound: number = this.getMapBounds(TanksLevelNames.RIGHT_BOUND);
        const bottomBound: number = this.getMapBounds(TanksLevelNames.BOTTOM_BOUND);

        const pointX: number = x < leftBound ? leftBound : x > rightBound ? rightBound : x;
        const pointY: number = y < topBound ? topBound : y > bottomBound ? bottomBound : y;

        this.map.pivot.set(pointX, pointY);
    }

    protected startDrag(event: InteractionEvent): void {
        this.dragging = true;
        this.pointerPos = new Point(event.data.global.x, event.data.global.y);
        this.beforeDragMapPos = new Point(this.map.pivot.x, this.map.pivot.y);
    }

    protected onDrag(event: InteractionEvent): void {
        if (this.dragging) {
            const offsetX: number = (event.data.global.x - this.pointerPos.x) / this.map.scale.x;
            const offsetY: number = (event.data.global.y - this.pointerPos.y) / this.map.scale.y;
            const x: number = this.beforeDragMapPos.x - offsetX;
            const y: number = this.beforeDragMapPos.y - offsetY;
            this.moveSceneTo(x, y);
        }
    }

    protected endDrag(): void {
        this.dragging = false;
        this.pointerPos = null;
        this.beforeDragMapPos = null;
    }

    protected getMapBounds(bound: string): number {
        let value: number = 0;
        switch (bound) {
            case TanksLevelNames.LEFT_BOUND:
                value = 0;
                break;
            case TanksLevelNames.TOP_BOUND:
                value = 0;
                break;
            case TanksLevelNames.RIGHT_BOUND:
                value = this.map.width / this.map.scale.x;
                break;
            case TanksLevelNames.BOTTOM_BOUND:
                value = this.map.height / this.map.scale.y;
                break;
        }

        return value;
    }

    protected onUpdate(): void {
        super.onUpdate();
        const x: number = this.map.pivot.x + this.mapVelocity.vx;
        const y: number = this.map.pivot.y + this.mapVelocity.vy;
        this.moveSceneTo(x, y);
    }

    public moveSceneByKeyboard(data: IKeyboardEvent, stop: boolean = false): void {
        switch (data.keyCode) {
            case KeyboardMap.W:
                this.mapVelocity.vy = stop ? 0 : -this.mapVelocity.speed;
                break;
            case KeyboardMap.A:
                this.mapVelocity.vx = stop ? 0 : -this.mapVelocity.speed;
                break;
            case KeyboardMap.S:
                this.mapVelocity.vy = stop ? 0 : this.mapVelocity.speed;
                break;
            case KeyboardMap.D:
                this.mapVelocity.vx = stop ? 0 : this.mapVelocity.speed;
                break;
        }
    }
}
