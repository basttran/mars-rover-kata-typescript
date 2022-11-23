class Rover {
    constructor(private x: number, private y: number, private initialDirection: string) {

    }
    direction: string = this.initialDirection

    position: any = {
        x: this.x,
        y: this.y
    }

    commands: string[] = []

    handleCommands(commands: string[]) {
        this.commands = commands
    }   
}


describe('Rover behaviour', () => {
    it('Should instantiate with intial position and direction for Mars Rover', () => {
        //Given
        const marsRover = new Rover(0,0,'N')
        //When

        //Then
        expect(marsRover.position.x).toEqual(0);
        expect(marsRover.position.y).toEqual(0);
        expect(marsRover.direction).toEqual('N');
    })
    it('Should take an array of commands', () => {
        //Given
        const commands: string[] = []
        const marsRover = new Rover(0,0,'N')
        //When
        marsRover.handleCommands(commands)
        //Then
        expect(marsRover.commands).toEqual(commands);
    })
})