import * as PIXI from "pixi.js";
import {IPointData} from "pixi.js";
import {Settings} from "../Settings";
import {EventDispatcher} from "../common/EventDispatcher";
import {GameEvents} from "../GameEvents";
import {IClasterData} from "./IClasterData";

export class ServerEmulationModel {

    private _horizontalAmount: number = Settings.baseRoundSetting.horizontal;
    private _verticalAmount: number = Settings.baseRoundSetting.vertical;
    private _iconsAmount: number = Settings.baseRoundSetting.icons;
    private _clusterSize: number = Settings.baseRoundSetting.clusterSize;
    private _maxHorizontalAmount: number = Settings.maxRoundSetting.horizontal;
    private _maxVerticalAmount: number = Settings.maxRoundSetting.vertical;
    private _maxIconsAmount: number = Settings.maxRoundSetting.icons;
    private _maxClusterSize: number = Settings.maxRoundSetting.clusterSize;
    private _currentGameIcons: number[][] = [];
    private _currentGameClusterMap: boolean[][] = [];
    protected dispatcher: PIXI.utils.EventEmitter = EventDispatcher;

    public sendRequest(): void {
        this._currentGameIcons = [];
        this._currentGameClusterMap = [];
        for (let indexRow: number = 0; indexRow < this._verticalAmount; indexRow++) {
            this._currentGameIcons.push([]);
            this._currentGameClusterMap.push([]);
            for (let indexReel: number = 0; indexReel < this._horizontalAmount; indexReel++) {
                const rndIcon: number = Math.floor(Math.random() * this._iconsAmount);
                this._currentGameIcons[indexRow].push(rndIcon);
                this._currentGameClusterMap[indexRow].push(false);
            }
        }
        console.log("Server this._currentGameIcons", this._currentGameIcons);
        this.dispatcher.emit(GameEvents.GAME_RESPONSE);
    }

    public getClasters(): IClasterData[] {
        const clastersData:IClasterData[] = [];
        for (let indexRow: number = 0; indexRow < this._currentGameIcons.length; indexRow++) {
            for (let indexReel: number = 0; indexReel < this._currentGameIcons[indexRow].length; indexReel++) {
                if (!this._currentGameClusterMap[indexRow][indexReel]) {
                    const iconId = this._currentGameIcons[indexRow][indexReel];
                    const pointsClaster:IPointData[] = [];
                    const clasterData: IClasterData = {
                        pointsClaster: pointsClaster
                    };
                    clasterData.pointsClaster.push(this.setPointCluster(indexReel, indexRow));
                    const claster:IClasterData = this.findCluster(indexReel, indexRow, iconId, clasterData);
                    if (claster.pointsClaster.length >= this._clusterSize) {
                        clasterData.pointsClaster.forEach((pointData: IPointData) => {
                            this._currentGameClusterMap[pointData.y][pointData.x] = true;
                        });
                        clastersData.push(claster);
                    }
                }
            }
        }
        return clastersData;
    }

    private findCluster(checkX: number, checkY: number, iconID: number, clasterData: IClasterData): IClasterData {
        if (checkX + 1 < this._currentGameIcons[checkY].length) {
            if (this._currentGameIcons[checkY][checkX + 1] == iconID && !this.checkPointClusterAdded((checkX + 1), checkY, clasterData)) {
                clasterData.pointsClaster.push(this.setPointCluster(checkX + 1, checkY));
                clasterData = this.findCluster((checkX + 1), checkY, iconID, clasterData);
            }
        }
        if (checkX - 1 >= 0) {
            if (this._currentGameIcons[checkY][checkX - 1] == iconID && !this.checkPointClusterAdded((checkX - 1), checkY, clasterData)) {
                clasterData.pointsClaster.push(this.setPointCluster(checkX - 1, checkY));
                clasterData = this.findCluster((checkX - 1), checkY, iconID, clasterData);
            }
        }
        if (checkY + 1 < this._currentGameIcons.length) {
            if (this._currentGameIcons[checkY + 1][checkX] == iconID && !this.checkPointClusterAdded(checkX, (checkY + 1), clasterData)) {
                clasterData.pointsClaster.push(this.setPointCluster(checkX, checkY + 1));
                clasterData = this.findCluster(checkX, (checkY + 1), iconID, clasterData);
            }
        }
        if (checkY - 1 >= 0) {
            if (this._currentGameIcons[checkY - 1][checkX] == iconID && !this.checkPointClusterAdded(checkX, (checkY - 1), clasterData)) {
                clasterData.pointsClaster.push(this.setPointCluster(checkX, checkY - 1));
                clasterData = this.findCluster(checkX, (checkY - 1), iconID, clasterData);
            }
        }

        return clasterData;
    }

    private checkPointClusterAdded(pointX: number, pointY: number, clasterData: IClasterData): boolean {
        let pointForClasterAdded: boolean = false;
        clasterData.pointsClaster.forEach((pointData: IPointData) => {
            if (pointData.x == pointX && pointData.y == pointY) {
                pointForClasterAdded = true;
            }
        });

        return pointForClasterAdded;
    }

    private setPointCluster(pointX: number, pointY: number): IPointData {
        const currentPoint:IPointData = {
            x: pointX,
            y: pointY
        };
        return currentPoint;
    }

    get horizontalAmount(): number {
        return this._horizontalAmount;
    }

    get verticalAmount(): number {
        return this._verticalAmount;
    }

    get iconsAmount(): number {
        return this._iconsAmount;
    }

    get clusterSize(): number {
        return this._clusterSize;
    }

    get maxHorizontalAmount(): number {
        return this._maxHorizontalAmount;
    }

    get maxVerticalAmount(): number {
        return this._maxVerticalAmount;
    }

    get maxIconsAmount(): number {
        return this._maxIconsAmount;
    }

    get maxClusterSize(): number {
        return this._maxClusterSize;
    }

    get currentGameIcons(): number[][] {
        return this._currentGameIcons;
    }

    set horizontalAmount(horizontalAmount: number) {
        this._horizontalAmount = horizontalAmount;
    }

    set verticalAmount(verticalAmount: number) {
        this._verticalAmount = verticalAmount;
    }

    set iconsAmount(iconsAmount: number) {
        this._iconsAmount = iconsAmount;
    }

    set clusterSize(clusterSize: number) {
        this._clusterSize = clusterSize;
    }
}
