import * as ex from 'excalibur';
import gridSource from './grid.glsl'

export class Grid extends ex.Actor {
    originalCenter!: ex.Vector;
    material!: ex.Material;
    constructor(public size: number) {
        super({
            pos: ex.vec(0, 0),
            anchor: ex.vec(0, 0),
            coordPlane: ex.CoordPlane.Screen,
            z: -Infinity
        })
    }

    onInitialize(engine: ex.Engine): void {
        this.originalCenter = engine.currentScene.camera.pos;
        this.graphics.use(new ex.Rectangle({
            width: engine.screen.resolution.width,
            height: engine.screen.resolution.height,
            color: ex.Color.Transparent // overridden by shader
        }));
        this.material = engine.graphicsContext.createMaterial({
            name: 'grid',
            fragmentSource: gridSource
        });
        this.material.update(shader => {
            shader.trySetUniformFloat('u_spacing', this.size);
            shader.trySetUniformFloat('u_width', 1);
        });
        this.graphics.material = this.material;

        this.graphics.onPreDraw = () => {
            this.material.update(shader => {
                console.log(this.originalCenter.toString(1), engine.currentScene.camera.pos.toString(1));
                const delta = this.originalCenter.sub(engine.currentScene.camera.pos);
                shader.trySetUniformFloatVector('u_camera', delta);
                shader.trySetUniformFloat('u_camera_zoom', engine.currentScene.camera.zoom);
            })
        }
    }
}
