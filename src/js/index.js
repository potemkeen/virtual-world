import { Graph } from './math/graph';
import { GraphEditor } from './editors/graph-editor';
import { Viewport } from './viewport';
import { scale } from './math/utils';
import { StopEditor } from './editors/stop-editor';
import { CrossingEditor } from './editors/crossing-editor';
import { StartEditor } from './editors/start-editor';
import { YieldEditor } from './editors/yield-editor';
import { ParkingEditor } from './editors/parking-editor';
import { TargetEditor } from './editors/target-editor';
import { LightEditor } from './editors/light-editor';
import { World } from './world';

const editors = {
    graph: GraphEditor,
    stop: StopEditor,
    crossing: CrossingEditor,
    parking: ParkingEditor,
    start: StartEditor,
    light: LightEditor,
    yield: YieldEditor,
    target: TargetEditor,
};

const canvas = document.getElementById('canvas');
const disposeBtn = document.getElementById('dispose');
const saveBtn = document.getElementById('save');
const fileInput = document.getElementById('file-input');

disposeBtn.addEventListener('click', dispose);
saveBtn.addEventListener('click', save);
fileInput.addEventListener('change', load);

canvas.width = 600;
canvas.height = 600;

const ctx = canvas.getContext('2d');

const worldString = localStorage.getItem('world');
const worldInfo = worldString ? JSON.parse(worldString) : null;
let world = worldInfo ? World.load(worldInfo) : new World(new Graph());
const graph = world.graph;

const viewport = new Viewport(canvas, world.zoom, world.offset);

const tools = {};
for (const title in editors) {
    const btn = document.getElementById(title);
    btn.addEventListener('click', () => setMode(title));
    const Editor = editors[title];
    tools[title] = {button: btn, editor: new Editor(viewport, title === 'graph' ? graph : world)};
}

let oldGraphHash = graph.hash();

setMode('graph');

animate();

function animate() {
    viewport.reset();
    if (graph.hash() !== oldGraphHash) {
        world.generate();
        oldGraphHash = graph.hash();
    }
    const viewPoint = scale(viewport.getOffset(), -1);
    world.draw(ctx, viewPoint);
    ctx.globalAlpha = 0.3;
    for (const tool of Object.values(tools)) {
        tool.editor.display();
    }
    requestAnimationFrame(animate);
}

function dispose() {
    tools.graph && tools.graph.editor.dispose();
    world.markings.length = 0;
}

function load() {
    const file = event.target.files[0];

    if (!file) {
        alert('No file selected!');
        return;
    }

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = (event) => {
        const fileContent = event.target.result;
        const jsonData = JSON.parse(fileContent);
        world = World.load(jsonData);
        localStorage.setItem('world', JSON.stringify(world));
        location.reload();
    }
}

function save() {
    world.zoom = viewport.zoom;
    world.offset = viewport.offset;

    const element = document.createElement('a');
    element.setAttribute(
        'href',
        `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(world))}`
    );
    const fileName = 'name.world';
    element.setAttribute('download', fileName);
    element.click();

    localStorage.setItem('world', JSON.stringify(world));
}

function setMode(mode) {
    disableEditors();
    tools[mode].button.classList.remove('off');
    tools[mode].editor.enable();
}

function disableEditors() {
    for (const tool of Object.values(tools)) {
        tool.editor.disable();
        tool.button.classList.add('off');
    }
}
