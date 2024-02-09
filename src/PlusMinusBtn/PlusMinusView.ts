import {Sprite, Texture} from "pixi.js";
import {ImageAssets} from "../resources";
import {Settings} from "../Settings";
import {sound} from "@pixi/sound";
import {ButtonView} from "../common/ButtonView";

export class PlusMinusView extends ButtonView {

    private _limit: number;
    private _increment: boolean;

    constructor(increment: boolean = true, limit: number) {
        super();
        this._limit = limit;
        this._increment = increment;
        this.init();
    }

    public onDownBtn(): void {
        this.scale.set(0.8);
        sound.add('my-sound', './assets/sounds/btn_p.wav');
        sound.play('my-sound');
    }

    public onUpBtn(): void {
        this.scale.set(1);
    }

    private init(): void {
        this.addIconView();
    }

    private addIconView(): void {
        const imageIcon = this._increment ? ImageAssets.btnPlus : ImageAssets.btnMinus;
        const texture = Texture.from(imageIcon);
        const btn = new Sprite(texture);
        btn.scale.set(Settings.scaleBox);
        btn.pivot.x = Settings.pivotPlusMinus;
        btn.pivot.y = Settings.pivotPlusMinus;

        this.addChild(btn);
    }
}
