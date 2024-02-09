import * as PIXI from "pixi.js"
import { EventDispatcher } from "./EventDispatcher";

export class ComponentController {

    protected dispatcher: PIXI.utils.EventEmitter = EventDispatcher;

}