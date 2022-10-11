# TESTS

## Definitions

`Buffered Extent` Refers to the bounds used for the app to
fetch map data (e.g. geojson)

`Buffered Extents (be)` refers to the number of buffered
extents.

`User Bounds (u)` refers to the area of the map that the
user is able to see.

`Zoom Level (z)` The Users zoom level on the map

`Intersects (i)` The number of buffered extents that is
intersecting with the user bounds

`Direction (d)` Refers to the user bounds being outside
the buffered extents in a specific direction from center
of buffered extents
> e.g. north, south east, west, ...etc

`Difference (diff)` Refers to the user bounds having a 
difference from the buffered extents
> i.e. leaving the buffered extents

## Reduced Decision Tables

### Cases

`z`   zoom level is within rendering bounds (T or F)
`be0` be = 0
`be1` 1 <= be <=4
`be2` be = 5
`dn`  dif is north of buffered extents
`de`  dif is east of buffered extents
`ds`  dif is south of buffered extents
`dw`  dif is west of buffered extents
`dne` dif is north east of buffered extents
`dse` dif is south east of buffered extents
`dsw` dif is south west of buffered extents
`dnw` dif is north west of buffered extents
`dif` there is a difference between user bounds and buffered extents (T or F)

### Actions

IMPOSSIBLE
a1            Do not create extent
a2            Create extent at current center
a3-n          Create extent NORTH of closest extent
a3-e          Create extent EAST of closest extent
a3-s          Create extent SOUTH of closest extent
a3-w          Create extent WEST of closest extent
a3-ne         Create extent NORTH EAST of closest extent
a3-se         Create extent SOUTH EAST of closest extent
a3-sw         Create extent SOUTH WEST of closest extent
a3-nw         Create extent NORTH WEST of closest extent
a4            Remove furthest extent
a5            Fetch data from new extent

### Tables

`z`         T         T         T         T         T         T         T         T
`i`         i0,i1,i2  i0,i1,i2  i0,i1,i2  i0,i1,i2  i0,i1,i2  i0,i1,i2  i0,i1,i2  i0,i1,i2
`be`        be1       be1       be1       be1       be2       be2       be2       be2
`d`         dn        de        ds        dw        dn        de        ds        dw
`dif`       T         T         T         T         T         T         T         T
==========================================================================================
IMPOSSIBLE  -         -         -         -         -         -         -         -
a1          -         -         -         -         -         -         -         -
a2          -         -         -         -         -         -         -         -
a3-n        X         -         -         -         X         -         -         -
a3-e        -         X         -         -         -         X         -         -
a3-s        -         -         X         -         -         -         X         -
a3-w        -         -         -         X         -         -         -         X
a3-ne       -         -         -         -         -         -         -         -
a3-se       -         -         -         -         -         -         -         -
a3-sw       -         -         -         -         -         -         -         -
a3-nw       -         -         -         -         -         -         -         -
a4          -         -         -         -         X         X         X         X
a5          X         X         X         X         X         X         X         X


`z`         T         T         T         T         T         T         T         T
`i`         i0,i2,i3  i0,i2,i3  i0,i2,i3  i0,i2,i3  i0,i2,i3  i0,i2,i3  i0,i2,i3  i0,i2,i3
`be`        be1       be1       be1       be1       be2       be2       be2       be2
`d`         dne       dse       dsw       dnw       dne       dse       dsw       dnw
`dif`       T         T         T         T         T         T         T         T  
==========================================================================================
IMPOSSIBLE  -         -         -         -         -         -         -         -
a1          -         -         -         -         -         -         -         -
a2          -         -         -         -         -         -         -         -
a3-n        -         -         -         -         -         -         -         -
a3-e        -         -         -         -         -         -         -         -
a3-s        -         -         -         -         -         -         -         -
a3-w        -         -         -         -         -         -         -         -
a3-ne       X         -         -         -         X         -         -         -
a3-se       -         X         -         -         -         X         -         -
a3-sw       -         -         X         -         -         -         X         -
a3-nw       -         -         -         X         -         -         -         X
a4          -         -         -         -         X         X         X         X
a5          X         X         X         X         X         X         X         X


`z`         T
`i`         i0
`be`        be0
`d`         -
`dif`       F
===============
IMPOSSIBLE  -
a1          -
a2          X
a3-n        -
a3-e        -
a3-s        -
a3-w        -
a3-ne       -
a3-se       -
a3-sw       -
a3-nw       -
a4          -
a5          X



`z`         T
`i`         i1
`be`        be2,be3
`d`         dne,dse,dsw,dnw
`dif`       T  
===========================
IMPOSSIBLE  X
a1          -
a2          -
a3-n        -
a3-e        -
a3-s        -
a3-w        -
a3-ne       -
a3-se       -
a3-sw       -
a3-nw       -
a4          -
a5          -


`z`         T
`i`         i3
`be`        -
`d`         dn,de,ds,dw
`dif`       T
=======================
IMPOSSIBLE  X
a1          -
a2          -
a3-n        -
a3-e        -
a3-s        -
a3-w        -
a3-ne       -
a3-se       -
a3-sw       -
a3-nw       -
a4          -
a5          -


`z`         T
`i`         -
`be`        be0
`d`         -
`dif`       T  
==========================
IMPOSSIBLE  X
a1          -
a2          -
a3-n        -
a3-e        -
a3-s        -
a3-w        -
a3-ne       -
a3-se       -
a3-sw       -
a3-nw       -
a4          -
a5          -


`z`         T
`i`         i1,i2,i4
`be`        be1,be2
`d`         -
`dif`       F
====================
IMPOSSIBLE  -
a1          X
a2          -
a3-n        -
a3-e        -
a3-s        -
a3-w        -
a3-ne       -
a3-se       -
a3-sw       -
a3-nw       -
a4          -
a5          -


`z`         F
`i`         -
`be`        -
`d`         -
`dif`       -
==================
IMPOSSIBLE  -
a1          X
a2          -
a3-n        -
a3-e        -
a3-s        -
a3-w        -
a3-ne       -
a3-se       -
a3-sw       -
a3-nw       -
a4          -
a5          -

