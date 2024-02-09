import * as PIXI from "pixi.js"
import {Container} from "pixi.js";
import {ServerEmulationModel} from "../ServerEmulation/ServerEmulationModel";
import {GameFieldView} from "../GameField/GameFieldView";
import {Settings} from "../Settings";
import {SettingFieldView} from "../SettingField/SettingFieldView";
import {GameEvents} from "../GameEvents";
import {PlayView} from "../PlayBtn/PlayView";
import {EventDispatcher} from "../common/EventDispatcher";
import {IClasterData} from "../ServerEmulation/IClasterData";
import {getSpine} from "../spine-example";
import {Spine} from "pixi-spine";
import {sound} from "@pixi/sound";

export class GameSceneView extends Container {

    private serverEmulationModel: ServerEmulationModel;
    private gameField: GameFieldView;
    private gameSpine: Spine;
    private settingFieldView: SettingFieldView[];
    private playView: PlayView;
    protected dispatcher: PIXI.utils.EventEmitter = EventDispatcher;

    constructor(serverEmulationModel: ServerEmulationModel) {
        super();
        this.serverEmulationModel = serverEmulationModel;
        this.gameField = this.addGameField();
        this.playView = this.addPlayButton();
        this.gameSpine = this.addSpine();
        this.settingFieldView = [];
        //this.gameSpine.visible = false;
        this.startGameScene();
    }

    public fillGameField(): void {
        let newScaleBox: number = 1;
        if (this.serverEmulationModel.verticalAmount > Settings.baseRoundSetting.vertical) {
            newScaleBox = Settings.baseRoundSetting.vertical / this.serverEmulationModel.verticalAmount;
        }
        if (this.serverEmulationModel.horizontalAmount > Settings.baseRoundSetting.horizontal) {
            const hScaleBox = Settings.baseRoundSetting.horizontal / this.serverEmulationModel.horizontalAmount;
            newScaleBox = newScaleBox < hScaleBox ? hScaleBox : hScaleBox;
        }
        this.gameField.fillGameField(this.serverEmulationModel.currentGameIcons, newScaleBox);
    }

    public clearGameField(): void {
        this.gameField.clearGameField();
        sound.add('my-sound', './assets/sounds/start_game.wav');
        sound.play('my-sound');
        this.gameSpine.visible = true;
    }

    public showWin(clasterData: IClasterData[]): void {
        this.gameField.showWin(clasterData);
        this.gameSpine.visible = false;
    }

    public disableButtons(): void {
        this.playView.enabled = false;
        this.settingFieldView.forEach((settingFieldView: SettingFieldView) => {
            settingFieldView.disableButtons()
        });
    }

    public enableButtons(): void {
        this.playView.enabled = true;
        this.settingFieldView.forEach((settingFieldView: SettingFieldView) => {
            settingFieldView.enableButtons()
        });
    }

    private startGameScene(): void {
        const horizontalFieldView = new SettingFieldView(Settings.horizontalField.text, this.serverEmulationModel.horizontalAmount, this.serverEmulationModel.maxHorizontalAmount);
        horizontalFieldView.x = Settings.horizontalField.x;
        this.addChild(horizontalFieldView);
        horizontalFieldView.on(GameEvents.SETTING_CHANGED, this.onHorizontalFieldChanged, this);
        this.settingFieldView.push(horizontalFieldView);

        const verticalFieldView = new SettingFieldView(Settings.verticalField.text, this.serverEmulationModel.verticalAmount, this.serverEmulationModel.maxVerticalAmount);
        verticalFieldView.x = Settings.verticalField.x;
        this.addChild(verticalFieldView);
        verticalFieldView.on(GameEvents.SETTING_CHANGED, this.onVerticalFieldChanged, this);
        this.settingFieldView.push(verticalFieldView);

        const iconsFieldView = new SettingFieldView(Settings.iconsField.text, this.serverEmulationModel.iconsAmount, this.serverEmulationModel.maxIconsAmount);
        iconsFieldView.x = Settings.iconsField.x;
        this.addChild(iconsFieldView);
        iconsFieldView.on(GameEvents.SETTING_CHANGED, this.onIconsFieldChanged, this);
        this.settingFieldView.push(iconsFieldView);

        const clustersFieldView = new SettingFieldView(Settings.clustersField.text, this.serverEmulationModel.clusterSize, this.serverEmulationModel.maxClusterSize);
        clustersFieldView.x = Settings.clustersField.x;
        this.addChild(clustersFieldView);
        clustersFieldView.on(GameEvents.SETTING_CHANGED, this.onClustersFieldChanged, this);
        this.settingFieldView.push(clustersFieldView);

        this.gameSpine.visible = false;
    }

    private addPlayButton(): PlayView {
        const playBtn = new PlayView();
        playBtn.x = Settings.playBtn.x;
        playBtn.y = Settings.playBtn.y;
        this.addChild(playBtn);
        playBtn.on(GameEvents.GAME_START, this.onPlayBtn, this);
        return playBtn;
    }

    private addSpine(): Spine {
        const spineExample = getSpine();
        spineExample.position.y = 80;
        spineExample.position.x = 220;
        spineExample.scale.set(0.05);
        this.addChild(spineExample);
        return spineExample;
    }

    private addGameField(): GameFieldView {
        const gameFieldView = new GameFieldView(this.serverEmulationModel.currentGameIcons);
        gameFieldView.x = Settings.gameFiledPosition.x;
        gameFieldView.y = Settings.gameFiledPosition.y;
        this.addChild(gameFieldView);
        return gameFieldView;
    }

    private onHorizontalFieldChanged(value: number): void {
        this.serverEmulationModel.horizontalAmount = value;
    }

    private onVerticalFieldChanged(value: number): void {
        this.serverEmulationModel.verticalAmount = value;
    }

    private onIconsFieldChanged(value: number): void {
        this.serverEmulationModel.iconsAmount = value;
    }

    private onClustersFieldChanged(value: number): void {
        this.serverEmulationModel.clusterSize = value;
    }

    private onPlayBtn(): void {
        this.dispatcher.emit(GameEvents.GAME_START);
    }
}
