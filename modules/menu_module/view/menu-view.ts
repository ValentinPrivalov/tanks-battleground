import { AbstractView, ITransitionSettings } from '../../../../../creator/core/lib/mvc/view';
import { Button } from '../../../../../creator/core/lib/pixi/button';
import { PointerEvents } from '../../../../../creator/core/global/pointer-events';
import { MenuNames } from '../global/menu-names';
import { MenuSignals } from '../global/menu-signals';
import { Layer } from '../../../../../creator/core/lib/pixi/layer';

export class MenuView extends AbstractView {
    protected startButton: Button;
    protected transitionSettings: ITransitionSettings = {
        fadeInTime: 0.2,
        fadeOutTime: 0.2
    };

    public onCreated(): void {
        super.onCreated();
        this.startButton = new Button(this.findChildByName(MenuNames.START_BUTTON) as Layer);
        this.startButton.on(PointerEvents.DOWN, () => {
            this.raiseSignal(MenuSignals.START_PRESSED);
        });
    }

    public enableInteractive(): void {
        super.enableInteractive();
        this.startButton.enable = true;
    }
}
