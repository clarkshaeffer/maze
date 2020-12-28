const ROWS = 15; // maze width
const COLS = 10; // maze height
// 18x24 is too big for maximum call stack size
function Room(row, col) {
    this.visited = false;
    this.topOpen = false;
    this.rightOpen = false;
    this.bottomOpen = false;
    this.leftOpen = false;
    this.row = row;
    this.col = col;
}


let i, j;
let maze = []; // empty 1d array
let rooms = []; // maze is for sprites, rooms is for objects
// let toVisit = [false, false, false, false]; // top, right, bottom, left



function UnvisitedNeighbors(row, col) {
    // let toVisit = [false, false, false, false]; // top, right, bottom, left
    let toVisit = [];
    toVisit.push(rooms[row][col].topOpen);
    toVisit.push(rooms[row][col].rightOpen);
    toVisit.push(rooms[row][col].bottomOpen);
    toVisit.push(rooms[row][col].leftOpen);

    if (row > 0) { // check top
        if (!(rooms[row - 1][col].visited)) {
            toVisit[0] = true;
        }
    }
    if (col + 1 < COLS) { // check right
        let right_visited = rooms[row][col + 1].visited;
        if (!right_visited) {
            toVisit[1] = true;
        }
    }
    if (row + 1 < ROWS) { // check bottom
        if (!(rooms[row + 1][col].visited)) {
            toVisit[2] = true;
        }
    }
    if (col > 0) { // check left
        let left_visited = rooms[row][col - 1].visited;
        if (left_visited == false) {
            toVisit[3] = true;
        }
    }
    // console.log('(' + row + ', ' + col + '): ' + toVisit);
    // rooms;
    return toVisit;
} // end UnvisitedNeighbors


function SetRoomFrame(sprite, room) {
    /* frames:
    0: unvisited
    1: topOpen
    2: topOpen, rightOpen
    3: topOpen, rightOpen, bottomOpen
    4: rightOpen
    5: rightOpen, bottomOpen
    6: rightOpen, bottomOpen, leftOpen
    7: bottomOpen
    8: bottomOpen, leftOpen
    9: bottomOpen, leftOpen, topOpen
    10: leftOpen
    11: leftOpen, topOpen
    12: leftOpen, topOpen, rightOpen
    13: leftOpen, topOpen, rightOpen, bottomOpen
    14: topOpen, bottomOpen
    15: leftOpen, rightOpen
    */
    if (room.visited) {
        if (room.topOpen && !room.rightOpen && !room.bottomOpen && !room.leftOpen) { // only top open
            sprite.setFrame(1);
        }
        else if (room.topOpen && room.rightOpen && !room.bottomOpen && !room.leftOpen) { // top, right
            sprite.setFrame(2);
        }
        else if (room.topOpen && room.rightOpen && room.bottomOpen && !room.leftOpen) { // top, right, bottom
            sprite.setFrame(3);
        }
        else if (!room.topOpen && room.rightOpen && !room.bottomOpen && !room.leftOpen) { // only right open
            sprite.setFrame(4);
        }
        else if (!room.topOpen && room.rightOpen && room.bottomOpen && !room.leftOpen) { // right, bottom
            sprite.setFrame(5);
        }
        else if (!room.topOpen && room.rightOpen && room.bottomOpen && room.leftOpen) { // right, bottom, left
            sprite.setFrame(6);
        }
        else if (!room.topOpen && !room.rightOpen && room.bottomOpen && !room.leftOpen) { // bottom only
            sprite.setFrame(7);
        }
        else if (!room.topOpen && !room.rightOpen && room.bottomOpen && room.leftOpen) { // bottom, left
            sprite.setFrame(8);
        }
        else if (room.topOpen && !room.rightOpen && room.bottomOpen && room.leftOpen) { // bottom, left, top
            sprite.setFrame(9);
        }
        else if (!room.topOpen && !room.rightOpen && !room.bottomOpen && room.leftOpen) { // left only
            sprite.setFrame(10);
        }
        else if (room.topOpen && !room.rightOpen && !room.bottomOpen && room.leftOpen) { // left, top
            sprite.setFrame(11);
        }
        else if (room.topOpen && room.rightOpen && !room.bottomOpen && room.leftOpen) { // left, top, right
            sprite.setFrame(12);
        }
        else if (room.topOpen && room.rightOpen && room.bottomOpen && room.leftOpen) { // all
            sprite.setFrame(13);
        }
        else if (room.topOpen && !room.rightOpen && room.bottomOpen && !room.leftOpen) { // top, bottom
            sprite.setFrame(14);
        }
        else if (!room.topOpen && room.rightOpen && !room.bottomOpen && room.leftOpen) { // left, right
            sprite.setFrame(15);
        }
    }
} // end SetRoomFrame


function FindNeighbor(row, col) {
    let neighbor = 0;
    let neighborFound = false;
    let unvisitedNeighbors = UnvisitedNeighbors(row, col); // get unvisited neighbors
    let exists_unvisited = unvisitedNeighbors.includes(true);

    // WHAT! WHY DOES THIS ENTER THE LOOP WHEN FALSE AT A DEAD END ??
    if (!exists_unvisited) {
        console.log('recursing');
    }
    while (exists_unvisited) {
        while (!neighborFound) {
            neighbor = Math.floor(Math.random() * unvisitedNeighbors.length); // random in toVisit
            if (unvisitedNeighbors[neighbor] == true) {
                neighborFound = true;
            }
        }
        if (neighbor == 0) { // top
            rooms[row][col].topOpen = true;
            SetRoomFrame(maze[row][col], rooms[row][col]);
            row--;
            rooms[row][col].visited = true;
            rooms[row][col].bottomOpen = true;
        }
        else if (neighbor == 1) { // right
            rooms[row][col].rightOpen = true;
            SetRoomFrame(maze[row][col], rooms[row][col]);
            col++;
            rooms[row][col].visited = true;
            rooms[row][col].leftOpen = true;
        }
        else if (neighbor == 2) { // bottom
            rooms[row][col].bottomOpen = true;
            SetRoomFrame(maze[row][col], rooms[row][col]);
            row++;
            rooms[row][col].visited = true;
            rooms[row][col].topOpen = true;
        }
        else if (neighbor == 3) { // left
            rooms[row][col].leftOpen = true;
            SetRoomFrame(maze[row][col], rooms[row][col]);
            col--;
            rooms[row][col].visited = true;
            rooms[row][col].rightOpen = true;
        }
        SetRoomFrame(maze[row][col], rooms[row][col]);
        FindNeighbor(row, col);
    } // end while neighbor
} // end FindNeighbor




class Maze extends Phaser.Scene {
    constructor() {
        super();
    }
    preload() {
        this.load.spritesheet('room', 'assets/room-Sheet.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    create() {
        for (i = 0; i < ROWS; i++) { // for each row
            maze[i] = []; // new 1d array for each element, making a 2d array
            rooms[i] = [];
            for (j = 0; j < COLS; j++) { // for each col
                // j first, then i; phaser moves right->down for coordinates, but I want down->right.
                // maze is for sprites, rooms is for objects
                maze[i][j] = this.add.sprite(j * 32 + 16, i * 32 + 16, 'room'); // frame size is 32x32, offset half for center.
                rooms[i][j] = new Room(i, j);
            } // end for each col
        } // end for each row

        this.cameras.main.setBackgroundColor(0x333333);

        // maze[5][8].setFrame(13); // set frame

        let row = Math.floor(Math.random() * ROWS);
        let col = Math.floor(Math.random() * COLS);

        rooms[row][col].visited = true; // set as visited

        FindNeighbor(row, col);




    } // end create()

    update() {
    } // end update()

}

const config = {
    type: Phaser.AUTO,
    // parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    scene: [Maze]
};

const game = new Phaser.Game(config);





// visisted !!!!!!!!!!