import {Container, Sprite, Texture, Text, Rectangle} from "pixi.js";
import {ImageAssets} from "../resources";
import {Settings} from "../Settings";
import {PlusMinusView} from "../PlusMinusBtn/PlusMinusView";
import {GameEvents} from "../GameEvents";

export class SettingFieldView extends Container {

    private plusBtn: PlusMinusView;
    private minusBtn: PlusMinusView;
    private valueField: Text;
    private limit: number;
    private value: number;

    constructor(text: string, value: number, limit: number) {
        super();
        this.init(text);
        this.limit = limit;
        this.value = value;
        this.valueField = this.addValue();
        this.plusBtn = this.addPlusBtn();
        this.minusBtn = this.addMinusBtn();
        this.addListeners();
    }

    public disableButtons(): void {
        this.plusBtn.enabled = false;
        this.minusBtn.enabled = false;
    }

    public enableButtons(): void {
        this.plusBtn.enabled = true;
        this.minusBtn.enabled = true;
    }

    private init(text: string): void {
        const texture = Texture.from(ImageAssets.fieldFrame);
        const field = new Sprite(texture);
        field.scale.set(Settings.scaleBox);
        this.addChild(field);

        const labelText = new Text(text, Settings.labelsCommnon.style);
        labelText.scale.set(Settings.scaleText);
        labelText.anchor.set(0.5, 0.5);
        labelText.x = Settings.labelPosition.x;
        labelText.y = Settings.labelPosition.y;
        this.addChild(labelText);
    }

    private addValue(): Text {
        const valueText = new Text(this.value.toString(), Settings.valuesCommnon.style);
        valueText.scale.set(Settings.scaleText);
        valueText.anchor.set(0.5, 0.5);
        valueText.x = Settings.labelPosition.x;
        valueText.y = Settings.labelPosition.valueY;
        this.addChild(valueText);

        return valueText;
    }

    private addPlusBtn(): PlusMinusView {
        const plusBtn = new PlusMinusView(true, this.limit);
        plusBtn.x = Settings.plusPosition.x;
        plusBtn.y = Settings.plusPosition.y;
        plusBtn.interactive = true;
        plusBtn.buttonMode = true;
        plusBtn.hitArea = new Rectangle(Settings.hitAreaPosition.x, Settings.hitAreaPosition.y, Settings.hitAreaWidth, Settings.hitAreaWidth);
        this.addChild(plusBtn);

        return plusBtn;
    }

    private addMinusBtn(): PlusMinusView {
        const minusBtn = new PlusMinusView(false, this.limit);
        minusBtn.x = Settings.minusPosition.x;
        minusBtn.y = Settings.minusPosition.y;
        minusBtn.interactive = true;
        minusBtn.buttonMode = true;
        minusBtn.hitArea = new Rectangle(Settings.hitAreaPosition.x, Settings.hitAreaPosition.y, Settings.hitAreaWidth, Settings.hitAreaWidth);
        this.addChild(minusBtn);

        return minusBtn;
    }

    private addListeners() {
        this.plusBtn.on("pointerdown", this.onPlusDown, this);
        this.plusBtn.on("pointerup", this.onPlusUp, this);
        this.plusBtn.on("pointerupoutside", this.onPlusUp, this);
        this.minusBtn.on("pointerdown", this.onMinusDown, this);
        this.minusBtn.on("pointerup", this.onMinusUp, this);
        this.minusBtn.on("pointerupoutside", this.onMinusUp, this);
    }

    private onPlusDown() {
        if (this.value < this.limit && this.plusBtn.enabled) {
            this.value++;
            this.valueField.text = this.value.toString();
            this.emit(GameEvents.SETTING_CHANGED, this.value);
            this.plusBtn.onDownBtn();
        }
    }

    private onPlusUp() {
        if (this.limit >= this.value) {
            this.plusBtn.onUpBtn();
        }
    }

    private onMinusDown() {
        if (this.value > 1 && this.minusBtn.enabled) {
            this.value--;
            this.valueField.text = this.value.toString();
            this.emit(GameEvents.SETTING_CHANGED, this.value);
            this.minusBtn.onDownBtn();
        }
    }

    private onMinusUp() {
        if (this.value >= 1) {
            this.minusBtn.onUpBtn();
        }
    }
}
