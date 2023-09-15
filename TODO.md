- Fix platform leaving screen while tabbed away (fixed)
- Consider refactoring gameObject to characterObject and gameObject to separate player/enemy from world elements (done-ish)
- Add the actual sidescrolling (done)
- Fix side collisions, and getting stuck in ground (worked around)
- Fix multiples of 9 for tilesheet not showing correctly (fixed)
- Make moving platforms come from tiled (done, maybe not well, but done)


- Add level maker function (needs work still)
- Add layers from tiled as in trees in front of player should block the player
- Maybe allow player to traverse between layers to allow different movement options
- Add documentations for how to use tiled with this

- Make player start come from tiled

- Add rest of collision logic with weights
- Finish adding pushable blocks that consider being pinned to a wall (not just plowing through)
- Add reset to reset all positions and such



- Add score
- Add enemies
- Add enemy "AI"

- Add player sprite and animations via sprite sheet
- Add to sprite type all that is needed for sprite animations
- Mabe add compose option for gameObjects to be of multiple blocks and colors that move in relation to each other maybe make it an array that sets the x and y relative to obj.x and obj.y 