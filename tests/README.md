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

## Cases

`z` z > 9
`diff` there is a difference
`nDiff` there is no difference
`i0` i = 0
`i1` i = 1
`i2` i = 2
`i3` i = 3
`i4` i = 4
`be1` be = 0
`be2` 0 < be < 5
`be3` be > 5
`dn` direction is north
`de` direction is east
`ds` direction is south
`dw` direction is west

## Actions

`a1` do not create a new buffered extent
`a2` create new extent at the center of the user bounds
`a3-n` create new extent north of closest buffered extent
`a3-e` create new extent east of closest buffered extent
`a3-s` create new extent south of closest buffered extent
`a3-w` create new extent west of closest buffered extent
`a4` remove furthest extent
`a5` fetch data


### be1 north and east tests
z     F   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T
i0    -   T   T   -   -   -   -   -   -   -   -   T   T   -   -   -   -   -   -   -   -
i1    -   -   -   T   T   -   -   -   -   -   -   -   -   T   T   -   -   -   -   -   -
i2    -   -   -   -   -   T   T   -   -   -   -   -   -   -   -   T   T   -   -   -   -
i3    -   -   -   -   -   -   -   T   T   -   -   -   -   -   -   -   -   T   T   -   -
i4    -   -   -   -   -   -   -   -   -   T   T   -   -   -   -   -   -   -   -   T   T
dn    -   -   T   -   T   -   T   -   T   -   T   -   -   -   -   -   -   -   -   -   -
de    -   -   -   -   -   -   -   -   -   -   -   -   T   -   T   -   T   -   T   -   T
ds    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
dw    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
be1   -   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T
be2   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
be3   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
dif   -   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T
nDif  -   -   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F
=======================================================================================
a1    X   -   X   X   X   X   X   X   X   X   X   X   X   X   X   X   X   X   X   X   X
a2    -   X   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a3-n  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a3-e  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a3-s  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a3-w  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a4    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a5    -   X   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -


### be1 south and west tests
z     T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T
i0    T   T   -   -   -   -   -   -   -   -   T   T   -   -   -   -   -   -   -   -
i1    -   -   T   T   -   -   -   -   -   -   -   -   T   T   -   -   -   -   -   -
i2    -   -   -   -   T   T   -   -   -   -   -   -   -   -   T   T   -   -   -   -
i3    -   -   -   -   -   -   T   T   -   -   -   -   -   -   -   -   T   T   -   -
i4    -   -   -   -   -   -   -   -   T   T   -   -   -   -   -   -   -   -   T   T
dn    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
de    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
ds    -   T   -   T   -   T   -   T   -   T   -   -   -   -   -   -   -   -   -   -
dw        -   -   -   -   -   -   -   -   -   -   T   -   T   -   T   -   T   -   T
be1   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T
be2   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
be3   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
dif   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T
nDif  T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F
=======================================================================================
a1    X   X   X   X   X   X   X   X   X   X   X   X   X   X   X   X   X   X   X   X
a2    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a3-n  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a3-e  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a3-s  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a3-w  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a4    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a5    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -


### be2 north and east tests
z     T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T
i0    T   T   -   -   -   -   -   -   -   -   T   T   -   -   -   -   -   -   -   -
i1    -   -   T   T   -   -   -   -   -   -   -   -   T   T   -   -   -   -   -   -
i2    -   -   -   -   T   T   -   -   -   -   -   -   -   -   T   T   -   -   -   -
i3    -   -   -   -   -   -   T   T   -   -   -   -   -   -   -   -   T   T   -   -
i4    -   -   -   -   -   -   -   -   T   T   -   -   -   -   -   -   -   -   T   T
dn    -   T   -   T   -   T   -   T   -   T   -   -   -   -   -   -   -   -   -   -
de    -   -   -   -   -   -   -   -   -   -   -   T   -   T   -   T   -   T   -   T
ds    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
dw    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
be1   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   
be2   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T
be3   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
dif   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T
nDif  T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F
=======================================================================================
a1    X   -   X   -   X   -   X   -   X   X   X   -   X   -   X   -   X   -   X   X
a2    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a3-n  -   X   -   X   -   X   -   X   -   -   -   -   -   -   -   -   -   -   -   -
a3-e  -   -   -   -   -   -   -   -   -   -   -   X   -   X   -   X   -   X   -   -
a3-s  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a3-w  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a4    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a5    -   X   -   X   -   X   -   X   -   -   -   X   -   X   -   X   -   X   -   -


### be2 south and west tests
z     T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T
i0    T   T   -   -   -   -   -   -   -   -   T   T   -   -   -   -   -   -   -   -
i1    -   -   T   T   -   -   -   -   -   -   -   -   T   T   -   -   -   -   -   -
i2    -   -   -   -   T   T   -   -   -   -   -   -   -   -   T   T   -   -   -   -
i3    -   -   -   -   -   -   T   T   -   -   -   -   -   -   -   -   T   T   -   -
i4    -   -   -   -   -   -   -   -   T   T   -   -   -   -   -   -   -   -   T   T
dn    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
de    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
ds    -   T   -   T   -   T   -   T   -   T   -   -   -   -   -   -   -   -   -   -
dw    -   -   -   -   -   -   -   -   -   -   -   T   -   T   -   T   -   T   -   T
be1   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   
be2   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T
be3   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
dif   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T
nDif  T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F
=======================================================================================
a1    X   -   X   -   X   -   X   -   X   X   X   -   X   -   X   -   X   -   X   X
a2    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a3-n  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a3-e  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a3-s  -   X   -   X   -   X   -   X   -   -   -   -   -   -   -   -   -   -   -   -
a3-w  -   -   -   -   -   -   -   -   -   -   -   X   -   X   -   X   -   X   -   -
a4    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a5    -   X   -   X   -   X   -   X   -   -   -   X   -   X   -   X   -   X   -   -



### be3 north and east tests
z     T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T
i0    T   T   -   -   -   -   -   -   -   -   T   T   -   -   -   -   -   -   -   -
i1    -   -   T   T   -   -   -   -   -   -   -   -   T   T   -   -   -   -   -   -
i2    -   -   -   -   T   T   -   -   -   -   -   -   -   -   T   T   -   -   -   -
i3    -   -   -   -   -   -   T   T   -   -   -   -   -   -   -   -   T   T   -   -
i4    -   -   -   -   -   -   -   -   T   T   -   -   -   -   -   -   -   -   T   T
dn    -   T   -   T   -   T   -   T   -   T   -   -   -   -   -   -   -   -   -   -
de    -   -   -   -   -   -   -   -   -   -   -   T   -   T   -   T   -   T   -   T
ds    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
dw    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
be1   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
be2   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
be3   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T
dif   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T
nDif  T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F
=======================================================================================
a1    X   -   X   -   X   -   X   -   X   X   X   -   X   -   X   -   X   -   X   X
a2    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a3-n  -   X   -   X   -   X   -   X   -   -   -   -   -   -   -   -   -   -   -   -
a3-e  -   -   -   -   -   -   -   -   -   -   -   X   -   X   -   X   -   X   -   -
a3-s  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a3-w  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a4    -   X   -   X   -   X   -   X   -   -   -   X   -   X   -   X   -   X   -   -
a5    -   X   -   X   -   X   -   X   -   -   -   X   -   X   -   X   -   X   -   -



### be3 south and west tests
z     T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T
i0    T   T   -   -   -   -   -   -   -   -   T   T   -   -   -   -   -   -   -   -
i1    -   -   T   T   -   -   -   -   -   -   -   -   T   T   -   -   -   -   -   -
i2    -   -   -   -   T   T   -   -   -   -   -   -   -   -   T   T   -   -   -   -
i3    -   -   -   -   -   -   T   T   -   -   -   -   -   -   -   -   T   T   -   -
i4    -   -   -   -   -   -   -   -   T   T   -   -   -   -   -   -   -   -   T   T
dn    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
de    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
ds    -   T   -   T   -   T   -   T   -   T   -   -   -   -   -   -   -   -   -   -
dw    -   -   -   -   -   -   -   -   -   -   -   T   -   T   -   T   -   T   -   T
be1   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
be2   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
be3   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T   T
dif   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T
nDif  T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F   T   F
=======================================================================================
a1    X   -   X   -   X   -   X   -   X   X   X   -   X   -   X   -   X   -   X   X
a2    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a3-n  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a3-e  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
a3-s  -   X   -   X   -   X   -   X   -   -   -   -   -   -   -   -   -   -   -   -
a3-w  -   -   -   -   -   -   -   -   -   -   -   X   -   X   -   X   -   X   -   -
a4    -   X   -   X   -   X   -   X   -   -   -   X   -   X   -   X   -   X   -   -
a5    -   X   -   X   -   X   -   X   -   -   -   X   -   X   -   X   -   X   -   -
