import { Graph } from './math/graph';
import { GraphEditor } from './graph-editor';
import { Viewport } from './viewport';
import { World } from './world';

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
const graphEditor = new GraphEditor(viewport, graph);
graph.draw(ctx);

animate();

function animate() {
    viewport.reset();
    world.generate();
    world.draw(ctx);
    ctx.globalAlpha = 0.3;
    graphEditor.display();
    requestAnimationFrame(animate);
}

function dispose() {
    graphEditor.dispose();
}

function save() {
    localStorage.setItem('graph', JSON.stringify(graph));
}
