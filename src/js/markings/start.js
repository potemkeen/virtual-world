import { angle } from '../math/utils';
import { Marking } from './marking';
import car from '../../../static/car.png';


export class Start extends Marking {
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);

        this.img = new Image();
        this.img.src = car;
        this.type = 'start';
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(angle(this.directionVector) - Math.PI / 2);

        ctx.drawImage(this.img, -this.img.width / 2, -this.img.height / 2)

        ctx.restore();
    }
}