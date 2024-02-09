import {Rectangle, Sprite, Text, Texture} from "pixi.js";
import {ImageAssets} from "../resources";
import {Settings} from "../Settings";
import {GameEvents} from "../GameEvents";
import { sound } from '@pixi/sound';
import {ButtonView} from "../common/ButtonView";

export class PlayView extends ButtonView {

    constructor() {
        super();
        this.init();
    }

    private init(): void {
        this.addView();
        this.addListeners();
    }

    private addView(): void {
        const texture = Texture.from(ImageAssets.btnPlay);
        const view = new Sprite(texture);
        view.scale.set(Settings.scalePlay);
        this.addChild(view);

        this.interactive = true;
        this.buttonMode = true;
        this.hitArea = new Rectangle(0, 0, Settings.hitAreaPlaySize.width, Settings.hitAreaPlaySize.height);

        const valueText = new Text(Settings.playBtn.text, Settings.valuesCommnon.style);
        valueText.scale.set(Settings.scaleText);
        valueText.anchor.set(0.5, 0.5);
        valueText.x = Settings.labelStartPosition.x;
        valueText.y = Settings.labelStartPosition.y;
        this.addChild(valueText);

        this.pivot.x = 25;
        this.pivot.y = 10;
    }

    private addListeners() {
        this.on("pointerdown", this.onDownBtn, this);
        this.on("pointerup", this.onUpBtn, this);
        this.on("pointerupoutside", this.onUpBtn, this);
    }

    private onDownBtn(): void {
        if (this.enabled) {
            this.enabled = false;
            this.emit(GameEvents.GAME_START);
            this.scale.set(0.8);
            sound.add('my-sound', './assets/sounds/btn_p.wav');
            sound.play('my-sound');
        }
    }

    private onUpBtn(): void {
        this.scale.set(1);
    }
}
