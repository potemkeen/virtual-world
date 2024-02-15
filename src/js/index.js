import { Graph } from './math/graph';
import { GraphEditor } from './editors/graph-editor';
import { Viewport } from './viewport';
import { World } from './world';
import { scale } from './math/utils';
import { StopEditor } from './editors/stop-editor';
import { CrossingEditor } from './editors/crossing-editor';
import { StartEditor } from './editors/start-editor';
import { YieldEditor } from './editors/yield-editor';
import { ParkingEditor } from './editors/parking-editor';
import { TargetEditor } from './editors/target-editor';
import { LightEditor } from './editors/light-editor';

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

disposeBtn.addEventListener('click', dispose);
saveBtn.addEventListener('click', save);

canvas.width = 600;
canvas.height = 600;

const ctx = canvas.getContext('2d');

const graphString = localStorage.getItem('graph');
const graphInfo = graphString ? JSON.parse(graphString) : null;

const graph = graphInfo ? Graph.load(graphInfo) : new Graph();
const world = new World(graph);

const viewport = new Viewport(canvas);
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

function save() {
    localStorage.setItem('graph', JSON.stringify(graph));
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
