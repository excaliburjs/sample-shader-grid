import * as ex from 'excalibur';
import { Grid } from './grid';

const game = new ex.Engine({
    width: 80 * 16,
    height: 60 * 16,
    displayMode: ex.DisplayMode.FitScreen
});

game.add(new Grid(200));
game.add(new ex.Actor({
    pos: ex.vec(0, 0),
    anchor: ex.vec(0, 0),
    color: ex.Color.Red,
    width: 200,
    height: 200
}));


let currentPointer!: ex.Vector;
let down = false;
game.input.pointers.primary.on('down', (e) => {
   currentPointer = e.worldPos;
   down = true;
});
game.input.pointers.primary.on('up', (e) => {
   down = false;
});

game.input.pointers.primary.on('move', (e) => {
    if (down) {
        // drag the camera
        const currentCameraScreen = game.screen.worldToScreenCoordinates(game.currentScene.camera.pos)
        const delta = currentCameraScreen.sub(e.screenPos).scale(1/game.currentScene.camera.zoom);
        game.currentScene.camera.pos = currentPointer.add(delta);
    }
})


game.input.pointers.primary.on('wheel', (wheelEvent) => {
   // wheel up
   game.currentScene.camera.pos = currentPointer;
   if (wheelEvent.deltaY < 0) {
      game.currentScene.camera.zoom *= 1.02;
   } else {
      game.currentScene.camera.zoom /= 1.02;
   }
});

game.start().then(() => {
    currentPointer = game.currentScene.camera.pos;
});