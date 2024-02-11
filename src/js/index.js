import { Graph } from './math/graph';
import { Point } from './primitives/point';
import { Segment } from './primitives/segment';
import { GraphEditor } from './graph-editor';

const canvas = document.getElementById('canvas');

canvas.width = 600;
canvas.height = 600;

const ctx = canvas.getContext('2d');

const p1 = new Point(200, 200);
const p2 = new Point(500, 200);
const p3 = new Point(400, 400);
const p4 = new Point(100, 300);
window.p1 = p1;
const s1 = new Segment(p1, p2);
const s2 = new Segment(p1, p3);
const s3 = new Segment(p1, p4);
const s4 = new Segment(p2, p3);

const graph = new Graph([p1, p2, p3, p4], [s1, s2, s3, s4]);
const graphEditor = new GraphEditor(canvas, graph);
graph.draw(ctx);

animate();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    graphEditor.display();

    requestAnimationFrame(animate);
}
