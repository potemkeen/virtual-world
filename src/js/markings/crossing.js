import { Segment } from '../primitives/segment';
import { perpendicular, add, scale } from '../math/utils';
import { Marking } from './marking';

export class Crossing extends Marking {
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);

        this.borders = [this.poly.segments[2], this.poly.segments[0]];
    }

    draw(ctx) {
        const perp = perpendicular(this.directionVector);
        const line = new Segment(
            add(this.center, scale(perp, this.width / 2)),
            add(this.center, scale(perp, -this.width / 2)),
        );
        line.draw(ctx, {width: this.height, color: 'white', dash: [11, 11]});
    }
}
