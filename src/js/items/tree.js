import { getFake3dPoint, lerp, lerp2D, subtract, translate } from '../math/utils';
import { Polygon } from '../primitives/polygon';

export class Tree {
    constructor(center, size, height = 200) {
        this.center = center;
        this.size = size; // size of the base
        this.height = height;
        this.base = this.#generateLevel(center, size);
        this.levels = this.#generateLevels();
    }

    #generateLevels() {
        const levels = [];
        const levelCount = 7;
        for (let level = 0; level < levelCount; level++) {
            const t = level / (levelCount - 1);
            const size = lerp(this.size, 40, t);
            levels.push(this.#generateLevel(this.center, size));
        }
        return levels;
    }

    #generateLevel(point, size) {
        const points = [];
        const rad = size / 2;
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
            const noisyRadius = rad * lerp(0.5, 1, Math.random());
            points.push(translate(point, a, noisyRadius));
        }
        return new Polygon(points);
    }

    draw(ctx, viewPoint) {
        const top = getFake3dPoint(this.center, viewPoint, this.height);

        for (let level = 0; level < this.levels.length; level++) {
            const t = level / (this.levels.length - 1);
            const point = lerp2D(this.center, top, t);
            const offset = subtract(point, this.center);
            const color = `rgb(30, ${lerp(50, 200, t)}, 70)`;
            const offsetLevel = Polygon.offset(this.levels[level], offset);
            offsetLevel.draw(ctx, {fill: color, stroke: 'rgba(0,0,0,0)'});
        }
    }
}
