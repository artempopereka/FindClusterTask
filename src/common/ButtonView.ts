import {Container} from "pixi.js";

export class ButtonView extends Container {

    private _enabled: boolean = true;

    constructor() {
        super();
    }

    set enabled(enabled: boolean) {
        this._enabled = enabled;
    }

    get enabled(): boolean {
        return this._enabled;
    }
}
