import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasureComponent } from './treasure.component';
import { TreasureService } from './treasure.service';
import { of } from 'rxjs';

describe('TreasureComponent', () => {
    let component: TreasureComponent;
    let fixture: ComponentFixture<TreasureComponent>;

    class mockService {}

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TreasureComponent],
            providers: [
                { provide: TreasureService, useClass: mockService },
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TreasureComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.newLineSeparator = '\n';
    });

    describe('should has the right result : ', () => {
        const test = (input: string, expected: string) => {
            it(`[${input}] should return ${expected}`, () => {
                component.fileMap = input;

                component.map = [];
                component.adventurers = [];
                component.decodeFile();
                component.startAdventure();
                component.encodeFile();

                expect(component.result).toEqual(expected);
            });
        };

        test(`C - 3 - 4
M - 1 - 0
M - 2 - 1
T - 0 - 3 - 2
T - 1 - 3 - 3
A - Lara - 1 - 1 - S - AADADAGGA`,
            `C - 3 - 4
M - 1 - 0
M - 2 - 1
T - 1 - 3 - 2
A - Lara - 0 - 3 - S - 3`);

        test(`C - 3 - 4
M - 1 - 0
M - 2 - 1
T - 0 - 3 - 2
T - 1 - 3 - 3
A - Lara - 1 - 1 - S - AADADAGGA
A - Ronflex - 0 - 3 - S - `,
            `C - 3 - 4
M - 1 - 0
M - 2 - 1
T - 0 - 3 - 2
T - 1 - 3 - 1
A - Lara - 1 - 3 - S - 2
A - Ronflex - 0 - 3 - S - 0`);

        test(`C - 3 - 4
M - 1 - 0
M - 2 - 1
T - 0 - 3 - 2
T - 1 - 3 - 3
A - Lara - 1 - 2 - S - ADADAGGA
A - James - 1 - 1 - S - AAADADA`,
            `C - 3 - 4
M - 1 - 0
M - 2 - 1
T - 1 - 3 - 1
A - Lara - 0 - 2 - S - 2
A - James - 0 - 3 - N - 2`);



    });

});