# Layer props and usage

## tile layers
- tileset // of tilesheet export (should add a list somewhere here later)
- collisions // boolean for toggling all collisions (all on by default)
- collisionTop // boolean to toggle collision on the top
- collisionBottom // boolean to toggle collision on the bottom
- collisionLeft // boolean to toggle collision on the left
- collisionRight // boolean to toggle collision on the right

## platforms
this is done with an object layer

add a rectangle object to object layer with class of platform

### custom props
- platform: boolean // required to make it a platform
- width: number
- height: number
- color: hexString
- moveSpeed

for moving platform
- cycleType: reversing | circular (default)

### moving platform
 to make a moving platform add point objects to the platform layer

## trees
using an object layer with class of trees add rects with these props
- tileset: string (the name of the tilesset which is begin imported into draw.. I should list them somewhere in this)
- tileArr: string (will be parsed so format is an array [1,2,3]) 1d array representing the tiles used in the tree so a 1 by 2 tile tree [420, 69] the top tile of the tree would be tile 420 from the tilesheet, the bottom tile of the tree would be tile 69 from the tilesheet