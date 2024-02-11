import { Graph } from './math/graph';
import { Point } from './primitives/point';
import { Segment } from './primitives/segment';

const canvas = document.getElementById('canvas');
const addPointBtn = document.getElementById('add-point');
const addSegmentBtn = document.getElementById('add-segment');
const removeSegmentBtn = document.getElementById('remove-segment');
const removePointBtn = document.getElementById('remove-point');
const removeAllBtn = document.getElementById('remove-all');

addPointBtn.addEventListener('click', addRandomPoint);
addSegmentBtn.addEventListener('click', addRandomSegment);
removeSegmentBtn.addEventListener('click', removeRandomSegment);
removePointBtn.addEventListener('click', removeRandomPoint);
removeAllBtn.addEventListener('click', removeAll);


canvas.width = 600;
canvas.height = 600;

const ctx = canvas.getContext('2d');

const p1 = new Point(200, 200);
const p2 = new Point(500, 200);
const p3 = new Point(400, 400);
const p4 = new Point(100, 300);

const s1 = new Segment(p1, p2);
const s2 = new Segment(p1, p3);
const s3 = new Segment(p1, p4);
const s4 = new Segment(p2, p3);

const graph = new Graph([p1, p2, p3, p4], [s1, s2, s3, s4]);
graph.draw(ctx);

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    graph.draw(ctx);
}

function addRandomPoint() {
    const success = graph.tryAddPoint(
        new Point(Math.random() * canvas.width, Math.random() * canvas.height)
    );
    console.log('success: ', success);
    update();
}

function addRandomSegment() {
    let index1 = Math.floor(Math.random() * graph.points.length);
    let index2 = Math.floor(Math.random() * graph.points.length);
    const success = graph.tryAddSegment(
        new Segment(graph.points[index1], graph.points[index2])
    );
    
    console.log('success: ', success);
    update();
}

function removeRandomSegment() {
    if (graph.segments.length === 0) {
        console.log('No segments');
        return;
    }
    const index = Math.floor(Math.random() * graph.segments.length);
    graph.removeSegment(graph.segments[index]);
    update();
}

function removeRandomPoint() {
    if (graph.points.length === 0) {
        console.log('No points');
        return;
    }
    const index = Math.floor(Math.random() * graph.points.length);
    graph.removePoint(graph.points[index]);
    update();
}

function removeAll() {
    graph.dispose();

    update();
}
