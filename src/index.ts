import {Application, Loader} from "pixi.js";
import "./style.css";
import {Settings} from "./Settings";
import {ServerEmulationModel} from "./ServerEmulation/ServerEmulationModel";
import {GameSceneView} from "./GameScene/GameSceneView";
import {GameSceneController} from "./GameScene/GameSceneController";

declare const VERSION: string;

const gameWidth = Settings.board.width;
const gameHeight = Settings.board.height;

console.log(`Welcome from pixi-typescript-find-cluster-task ${VERSION}`);

const app = new Application({
    backgroundColor: 0xd3d3d3,
    width: gameWidth,
    height: gameHeight,
});
//globalThis.__PIXI_APP__ = app;

window.onload = async (): Promise<void> => {
    await loadGameAssets();

    document.body.appendChild(app.view);

    const serverEmulationModel = new ServerEmulationModel();
    serverEmulationModel.sendRequest();

    const gameSceneView = new GameSceneView(serverEmulationModel);
    app.stage.addChild(gameSceneView);

    const gameSceneController = new GameSceneController(serverEmulationModel, gameSceneView);

    resizeCanvas();
};

async function loadGameAssets(): Promise<void> {
    return new Promise((res, rej) => {
        const loader = Loader.shared;
        loader.add("atlas", "./assets/atlas-img-task.json");
        loader.add("pixie", "./assets/spine-assets/pixie.json");
        loader.add("particle", "./assets/spark_yellow.png");
        loader.add("particleconfig", "./assets/particles.json");
        loader.add("btn_snd", "./assets/sounds/btn_p.wav");
        loader.add("win_snd", "./assets/sounds/claste_win.wav");
        loader.add("start_snd", "./assets/sounds/start_game.wav");

        loader.onComplete.once(() => {
            res();
        });

        loader.onError.once(() => {
            rej();
        });

        loader.load();
    });
}

function resizeCanvas(): void {
    const resize = () => {

        const ratio = window.innerHeight / gameHeight;

        const newWidth = Math.ceil(gameWidth * ratio);
        const newHeight = Math.ceil(gameHeight * ratio);

        app.renderer.resize(window.innerWidth, window.innerHeight);
        app.stage.height = newHeight;
        app.stage.width = newWidth;

        app.stage.scale.x = app.stage.scale.y;
    };

    resize();

    window.addEventListener("resize", resize);
}
