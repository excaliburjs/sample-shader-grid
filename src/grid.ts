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
            const res = ex.vec(engine.screen.resolution.width, engine.screen.resolution.height);
            const offset = res.sub(res.scale(1 / engine.currentScene.camera.zoom)).scale(.5);
            shader.trySetUniformFloatVector('u_offset', offset);
            shader.trySetUniformFloatColor('u_background_color', ex.Color.ExcaliburBlue);
            shader.trySetUniformFloatColor('u_line_color', ex.Color.Black);
        });
        this.graphics.material = this.material;

        this.graphics.onPreDraw = () => {
            this.material.update(shader => {
                const delta = this.originalCenter.sub(engine.currentScene.camera.pos);
                const res = ex.vec(engine.screen.resolution.width, engine.screen.resolution.height);
                const offset = res.sub(res.scale(1 / engine.currentScene.camera.zoom)).scale(.5);
                shader.trySetUniformFloatVector('u_offset', offset);
                shader.trySetUniformFloatVector('u_camera', delta);
                shader.trySetUniformFloat('u_camera_zoom', engine.currentScene.camera.zoom);
            })
        }
    }
}
