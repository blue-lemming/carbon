import { Component, OnInit } from '@angular/core';
import { TreasureService } from './treasure.service';
import { Type, Orientation, Move } from './treasure.enum';
import { Empty, Mountain, Treasure, Adventurer } from './treasure.model';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-treasure',
    templateUrl: './treasure.component.html',
    styleUrls: ['./treasure.component.sass']
})
export class TreasureComponent implements OnInit {

    newLineSeparator = '\r\n';
    fileMap = '';
    result = '';
    map = [];
    adventurers: Adventurer[] = [];
    orientations = [Orientation.North, Orientation.West, Orientation.South, Orientation.East];

    constructor(private service: TreasureService) { }

    ngOnInit(): void {
    }

    onLoad() {
        this.service.getMap().subscribe(data => {
            this.fileMap = data;
            this.result = '';
            this.map = [];
            this.adventurers = [];
            this.decodeFile();
        });
    }

    onPlay() {
        this.startAdventure();
        this.encodeFile();
    }

    onSave() {
        var blob = new Blob([this.result], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'result.txt');
    }

    //#region adventure
    startAdventure() {
        let moves;
        do {
            moves = 0;
            this.adventurers.forEach(adventurer => {
                if (adventurer.path.length) {
                    this.move(adventurer);
                    moves++;
                }
            });
        } while (moves);
    }

    move(adventurer: Adventurer) {
        const next = adventurer.path.shift();
        let turn = 0;
        switch (next) {
            case Move.Forward:
                this.forward(adventurer);
                break;
            case Move.Left:
                turn++;
                break;
            case Move.Right:
                turn--;
                break;
            default:
        }
        if (turn) {
            // Orientations.length is 4, I use the modulo tool to cycle around the orientations (with the "+ 4" trick for negatives)
            const index = (this.orientations.indexOf(adventurer.orientation) + turn + 4) % 4
            adventurer.orientation = this.orientations[index];
        }
    }

    forward(adventurer: Adventurer) {
        let x = adventurer.x;
        let y = adventurer.y;
        switch (adventurer.orientation) {
            case Orientation.North:
                y--;
                break;
            case Orientation.West:
                x--;
                break;
            case Orientation.South:
                y++;
                break;
            case Orientation.East:
                x++;
                break;
            default:
        }
        // Don't validate the move if the tile is busy by another adventurer
        if (this.adventurers.some(adventurer => adventurer.x === x && adventurer.y === y))
            return;

        switch (this.map[y][x].type) {
            case Type.Mountain:
                break;
            case Type.Treasure:
                this.map[y][x].count--;
                adventurer.count++;
                if (!this.map[y][x].count)
                    this.map[y][x] = new Empty;
            case Type.Empty:
                adventurer.x = x;
                adventurer.y = y;
                break;
            default:
        }

    }
    //#endregion adventure

    //#region decodeFile
    decodeFile() {
        this.fileMap.split(this.newLineSeparator).forEach(fileMapLine => {
            const entryLine = fileMapLine.split(' - ');
            const lineType: Type = entryLine.shift() as Type;
            switch (lineType) {
                case Type.Map:
                    this.decodeMap(entryLine);
                    break;
                case Type.Mountain:
                    this.decodeMountain(entryLine);
                    break;
                case Type.Treasure:
                    this.decodeTreasure(entryLine);
                    break;
                case Type.Adventurer:
                    this.decodeAdventurer(entryLine);
                    break;
                default:
            }
        });
    }

    decodeMap(mapLine: string[]) {
        const [width, height] = this.getCoordinates(mapLine);
        this.map = new Array(height).fill([]).map(_ => new Array(width).fill(new Empty));
    }

    decodeMountain(mountainLine: string[]) {
        const [x, y] = this.getCoordinates(mountainLine);
        this.map[y][x] = new Mountain;
    }

    decodeTreasure(treasureLine: string[]) {
        const count = Number(treasureLine.pop());
        const [x, y] = this.getCoordinates(treasureLine);
        this.map[y][x] = new Treasure(count);
    }

    decodeAdventurer(adventurerLine: string[]) {
        const name = adventurerLine.shift();
        const path = adventurerLine.pop().split('') as Move[];
        const orientation = adventurerLine.pop() as Orientation;
        const [x, y] = this.getCoordinates(adventurerLine);
        this.adventurers.push(new Adventurer(name, path, orientation, x, y))
    }

    getCoordinates(mapLine: string[]): number[] {
        return mapLine.map(char => Number(char) || 0);
    }
    //#endregion decodeFile

    //#region encodeFile
    encodeFile() {
        let width = this.map[0].length;
        let height = this.map.length;
        let result = '';
        let treasureLines = '';

        result += `C - ${this.map[0].length} - ${this.map.length}${this.newLineSeparator}`;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (this.map[y][x].type === Type.Mountain)
                    result += `M - ${x} - ${y}${this.newLineSeparator}`;
                else if (this.map[y][x].type === Type.Treasure)
                    treasureLines += `T - ${x} - ${y} - ${this.map[y][x].count}${this.newLineSeparator}`;
            }
        }
        result += treasureLines;
        result += this.adventurers.map(a => `A - ${a.name} - ${a.x} - ${a.y} - ${a.orientation} - ${a.count}`).join(this.newLineSeparator);
        this.result = result;
    }
    //#endregion encodeFile

    adventurerBorder(x, y) {
        return this.adventurers.some(a => a.x === x && a.y === y) ? 'adventurer' : '';
    }

}