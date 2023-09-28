- Fix platform leaving screen while tabbed away (fixed)
- Consider refactoring gameObject to characterObject and gameObject to separate player/enemy from world elements (done-ish)
- Add the actual sidescrolling (done)
- Fix side collisions, and getting stuck in ground (worked around)
- Fix multiples of 9 for tilesheet not showing correctly (fixed)
- Make moving platforms come from tiled (done, maybe not well, but done)
- Add layers from tiled as in trees in front of player should block the player (done)
- Add documentations for how to use tiled with this (done-ish)
- Add player sprite and animations via sprite sheet (sort of)
- Abstract moving objects more so that the function to move the object and the hitbox and such is all in one place so that I don't have to change multiple places again (done)
- Add separate collision boxes for characters separate from the height and width (done)


- Make conditions and such part of the attack object
- Make sure attacks are modular so that Characters can implement different attacks for their available slots
- Add more attacks (including ranged)

- Add level maker function (needs work still)
- Modularize the sprite animation so that the draw will run the animation for the current action (mostly have it)
- clean up sprite and animated stuff asap
- Maybe allow player to traverse between layers to allow different movement options
- Make player start come from tiled



- Add rest of collision logic with weights
- Finish adding pushable blocks that consider being pinned to a wall (not just plowing through)
- Add reset to reset all positions and such



- Add score
- Add enemies
- Add enemy "AI"

- Add to sprite type all that is needed for sprite animations
- Mabe add compose option for gameObjects to be of multiple blocks and colors that move in relation to each other maybe make it an array that sets the x and y relative to obj.x and obj.y 
- Add dev mode, that logs things, and maybe a console to effect the game and showing hitboxes and such