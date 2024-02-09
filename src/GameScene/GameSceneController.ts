import {GameSceneView} from "./GameSceneView";
import {ServerEmulationModel} from "../ServerEmulation/ServerEmulationModel";
import {ComponentController} from "../common/ComponentController";
import {GameEvents} from "../GameEvents";
import {IClasterData} from "../ServerEmulation/IClasterData";
import {sound} from "@pixi/sound";

export class GameSceneController extends ComponentController {

    private _gameSceneModel: ServerEmulationModel;
    private _gameSceneView: GameSceneView;

    constructor(gameModel: ServerEmulationModel, gameView: GameSceneView) {
        super();
        this._gameSceneModel = gameModel;
        this._gameSceneView = gameView;

        this.attachListeners();
    }

    private attachListeners() {
        this.dispatcher.addListener(GameEvents.GAME_START, this.onGameStart, this);
        this.dispatcher.addListener(GameEvents.GAME_RESPONSE, this.onGameResponse, this);
    }

    private onGameStart() {
        this._gameSceneView.clearGameField();
        this._gameSceneView.disableButtons();
        this._gameSceneModel.sendRequest();
    }

    private onGameResponse() {
        this._gameSceneView.fillGameField();
        const p1 = new Promise(() => setTimeout(() => this.onShowWin(), 500));;
    }

    private onShowWin() {
        this._gameSceneView.enableButtons();
        const clasterData:IClasterData[] = this._gameSceneModel.getClasters();
        console.log("clasterData -> ", clasterData);
        this._gameSceneView.showWin(clasterData);
        if (clasterData.length > 0) {
            sound.add('my-sound', './assets/sounds/claste_win.wav');
            sound.play('my-sound');
        }
    }
}