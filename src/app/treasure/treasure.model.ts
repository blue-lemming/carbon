import { Type, Orientation, Move } from './treasure.enum';

export class Empty {
    constructor(
        public type: string = Type.Empty
    ) { }
}

export class Mountain {
    constructor(
        public type: string = Type.Mountain
    ) { }
}

export class Treasure {
    constructor(
        public count: number,
        public type: string = Type.Treasure
    ) { }
}

/**
 * an adventurer object
 */
export class Adventurer {
    /**
     * @param name the adventurer name
     * @param path an array of direction
     * @param count how many treasures found
     */
    constructor(
        public name: string,
        public path: Move[],
        public orientation: Orientation,
        public x: number,
        public y: number,
        public type: string = Type.Adventurer,
        public count: number = 0
    ) { }
}