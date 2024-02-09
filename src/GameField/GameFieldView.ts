import {Container, IPointData} from "pixi.js";
import {Settings} from "../Settings";
import {BoxIconView} from "../BoxIcon/BoxIconView";
import {IClasterData} from "../ServerEmulation/IClasterData";

export class GameFieldView extends Container {

    private gameGrid: number[][] = [];
    private boxesContainers: BoxIconView[] = [];

    constructor(gameGrid: number[][]) {
        super();
        this.fillGameField(gameGrid);
    }

    public fillGameField(gameGrid: number[][], newScale: number = 1): void {
        this.gameGrid = gameGrid;
        for (let indexRow: number = 0; indexRow < this.gameGrid.length; indexRow++) {
            const rowPosition = indexRow * Settings.boxSize.height;
            for (let indexReel: number = 0; indexReel < this.gameGrid[indexRow].length; indexReel++) {
                const boxIconView = new BoxIconView(this.gameGrid[indexRow][indexReel], newScale);
                boxIconView.x = indexReel * Settings.boxSize.width * newScale;
                boxIconView.y = rowPosition * newScale;
                this.boxesContainers.push(boxIconView);
                this.addChild(boxIconView);
            }
        }
    }

    public clearGameField(): void {
        this.boxesContainers.forEach(boxIconView => this.removeChild(boxIconView));
        this.boxesContainers = [];
    }

    public showWin(clastersData: IClasterData[]): void {
        clastersData.forEach((clasterData: IClasterData) => {
            clasterData.pointsClaster.forEach((pointData: IPointData) => {
                this.boxesContainers[pointData.y * this.gameGrid[pointData.y].length + pointData.x].showWin();
            });
        });
    }
}
