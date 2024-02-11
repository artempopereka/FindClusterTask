import {Container, Sprite, Texture} from "pixi.js";
import {Emitter} from "@pixi/particle-emitter";
import {ImageBoxIcons} from "../resources";
import {Settings} from "../Settings";
const configParticle = require('/assets/particles.json');

export class BoxIconView extends Container {

    private particlesAdded: boolean = false;
    private newScale: number;

    constructor(iconId: number, newScale: number) {
        super();
        this.newScale = newScale;
        this.addIconView(iconId);
    }

    public showWin(): void {
        if (!this.particlesAdded) {
            this.particlesAdded = true;
            this.addParticles();
        }
        this.scale.set(0.75);
        this.pivot.x = Settings.boxPivot.x * this.newScale;
        this.pivot.y = Settings.boxPivot.y * this.newScale;
        const p1 = new Promise(() => setTimeout(() => this.onHideWin(), 500));
    }

    public onHideWin(): void {
        this.scale.set(1);
        this.pivot.x = 0;
        this.pivot.y = 0;
        const p1 = new Promise(() => setTimeout(() => this.showWin(), 500));
    }

    private addIconView(iconId: number): void {
        const texture = Texture.from(ImageBoxIcons[iconId]);
        const box = new Sprite(texture);
        box.scale.set(Settings.scaleBox * this.newScale);

        this.addChild(box);
    }

    private addParticles(): void {
        const containerParticles  = new Container();
        containerParticles.scale.set(Settings.scaleParticles * this.newScale);
        containerParticles.x = Settings.particlesPosition.x * this.newScale;
        containerParticles.y = Settings.particlesPosition.y * this.newScale;
        this.addChild(containerParticles);

        var emitter = new Emitter(
            containerParticles,
            configParticle
        );

        emitter.autoUpdate = true;
        emitter.emit = true;
    }
}
