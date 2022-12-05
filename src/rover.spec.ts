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
    static from(roverState: string) {
        const state = roverState.split(' ')
        return new Rover(parseInt(state[0], 10), parseInt(state[1], 10), state[2] as any)
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
        const index = directions.findIndex((direction) => rover.direction === direction) 
        return new Rover(rover.x, rover.y, directions[(index + 3 ) % 4] )
    }
}

class Forward implements Command {
    execute(rover: Rover): Rover {
        const transforms = [[0, 1], [-1, 0], [0, -1], [1, 0]]
        const index = directions.findIndex((direction) => rover.direction === direction) 
        const vector = transforms[index]

        return new Rover(rover.x + vector[0], rover.y + vector[1] , rover.direction)
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
    execute = (roverState: Rover, commands: Command[]): Rover => { 
        const newState = commands.reduce((state, command) => command.execute(state), roverState) 
        return new Rover (Controller.adjust(newState.x, this.mars.columns), Controller.adjust(newState.y, this.mars.rows), newState.direction)
    };
    static adjust = (coordinate: number, axisLength: number): number => (( coordinate % axisLength )+ axisLength) % axisLength
}

describe('Rover acceptance test', () => {
    it('Should send the rover to the right position', () => {
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
    it('Should send the rover to the right position when going "over" south', () => {
        //Given
        const mars = new Mars(5,5)
        const initialRover = new Rover(0,0,"S")
        const commands = new Translator().translate("FFF")
        const controller = new Controller(mars)
        //When
        const newRoverState = controller.execute(initialRover, commands)
        //Then 
        expect(newRoverState.toString()).toBe('0 2 S')
    })
    it('Should send the rover to the right position when going "over" west', () => {
        //Given
        const mars = new Mars(5,5)
        const initialRover = new Rover(0,0,"W")
        const commands = new Translator().translate("FFFFFFFF")
        const controller = new Controller(mars)
        //When
        const newRoverState = controller.execute(initialRover, commands)
        //Then 
        expect(newRoverState.toString()).toBe('2 0 W')
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
    it.each([['N', 'W'], ['S', 'E'], ['E', 'N'], ['W', 'S']])('Should return a rover with new state when rover rotates to left', (initialDirection: any, expectedDirection: any) => {
        //Given
        const rover = new Rover(1,2, initialDirection)
        //When
        const command = new TurnLeft()
        const updatedRover = command.execute(rover)
        //Then 
        expect(updatedRover.toString()).toEqual(`1 2 ${expectedDirection}`)
    })
    it.each([['N', 'E'], ['S', 'W'], ['E', 'S'], ['W', 'N']])('Should return a rover with new state when rover rotates to right', (initialDirection: any, expectedDirection: any) => {
        //Given
        const rover = new Rover(1,2, initialDirection)
        //When
        const command = new TurnRight()
        const updatedRover = command.execute(rover)
        //Then 
        expect(updatedRover.toString()).toEqual(`1 2 ${expectedDirection}`)
    })
    it.each([['1 2 N', '1 3 N'], ['1 2 S', '1 1 S'], ['1 2 E', '2 2 E'], ['1 2 W', '0 2 W']])('Should return a rover with new state when rover go forward', (initialState: any, expectedState: any) => {
        //Given
        const rover = Rover.from(initialState)
        //When
        const command = new Forward()
        const updatedRover = command.execute(rover)
        //Then 
        expect(updatedRover.toString()).toEqual(expectedState)
    })
})



