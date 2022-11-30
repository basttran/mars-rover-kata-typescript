class Mars {
    public readonly columns: number;
    public readonly rows: number;
    constructor(columns: number, rows: number) {
        this.columns = columns;
        this.rows = rows;
    }
}

type Direction = "N" | "S" | "E" | "W"
class Rover {
    readonly x: number;
    readonly y: number;
    readonly direction: Direction;
    constructor(x: number, y: number, direction: Direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
    }

    toString(): string {
        return `${this.x} ${this.y} ${this.direction}`
    }
}

interface Command {
    execute(rover: Rover): Rover
}
const directions: Direction[] = ['N', 'W','S', 'E']
class TurnLeft implements Command {
    execute(rover: Rover): Rover {
        const index = directions.findIndex((direction) => rover.direction === direction) 
        return new Rover(rover.x, rover.y, directions[(index +1) % 4] )
    }
}

class TurnRight implements Command {
    execute(rover: Rover): Rover {
        throw new Error("Method not implemented.");
    }
}

class Forward implements Command {
    execute(rover: Rover): Rover {
        throw new Error("Method not implemented.");
    }
}

class Translator {
    translate(commands : string): Command[]  {
        return [...commands].map((command) => {
            if(command === 'L') {
                return new TurnLeft()
            } 
            if(command === 'R') {
                return new TurnRight()
            } 
            if(command === 'F') {
                return new Forward()
            }
            throw new Error('Invalid command.');
        })
    }

}
class Controller {
    readonly mars: Mars;
    constructor (mars: Mars) {
        this.mars = mars
    }
    execute(roverState: Rover, commands: Command[]): Rover {
        return roverState;
    }
}

describe('Rover acceptance test', () => {
    it.skip('Should send the rover to the right position', () => {
        //Given
        const mars = new Mars(5,5)
        const initialRover = new Rover(1,2,"N")
        const commands = new Translator().translate("LFLFLFLFF")
        const controller = new Controller(mars)
        //When
        const newRoverState = controller.execute(initialRover, commands)
        //Then 
        expect(newRoverState.toString()).toBe('1 3 N')
    })
})
describe('Rover', () => {
    it('Should return a rover representation', () => {
        //Given
        const rover = new Rover(1, 3, 'N');
        //When
        //Then 
        expect(rover.toString()).toEqual('1 3 N')

    })
})
describe('Translator', () => {
    it('Should return commands', () => {
        //Given
        const translator = new Translator()
        //When
        const commands = translator.translate("LFR")
        //Then 
        expect(commands).toHaveLength(3)
        expect(commands[0]).toBeInstanceOf(TurnLeft)
        expect(commands[1]).toBeInstanceOf(Forward)
        expect(commands[2]).toBeInstanceOf(TurnRight)
    })
    it('Should return an error for incorrect instruction', () => {
        //Given
        const translator = new Translator()
        //When
        //Then 
        expect(() => translator.translate("LR°")).toThrow()
    })
})
describe('Commands', () => {
    it.each([['N', 'W'], ['S', 'E'], ['E', 'N'], ['W', 'S']])('Should return a rover with new state', (initialDirection: any, expectedDirection: any) => {
        //Given
        const rover = new Rover(1,2, initialDirection)
        //When
        const command = new TurnLeft()
        const updatedRover = command.execute(rover)
        //Then 
        expect(updatedRover.toString()).toEqual(`1 2 ${expectedDirection}`)
    })
})




// class Rover {
//     constructor(private x: number, private y: number, private initialDirection: string) {

//     }
//     direction: string = this.initialDirection

//     position: any = {
//         x: this.x,
//         y: this.y
//     }

//     commands: string[] = []

//     handleCommands(commands: string[]) {
//         this.commands = commands
//     }   
// }


// describe('Rover behaviour', () => {
//     it('Should instantiate with intial position and direction for Mars Rover', () => {
//         //Given
//         const marsRover = new Rover(0,0,'N')
//         //When

//         //Then
//         expect(marsRover.position.x).toEqual(0);
//         expect(marsRover.position.y).toEqual(0);
//         expect(marsRover.direction).toEqual('N');
//     })
//     it('Should take an array of commands', () => {
//         //Given
//         const commands: string[] = []
//         const marsRover = new Rover(0,0,'N')
//         //When
//         marsRover.handleCommands(commands)
//         //Then
//         expect(marsRover.commands).toEqual(commands);
//     })
// })