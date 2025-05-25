# RANDOM FOREST GENERATOR

## Made By: Andy Liu

**Instructions To Run:** 
The program should work on the latest stable version of Chrome. However, if it does not run, 
try creating a localhost server and opening the HTML file through that. I ran my file by selecting "Start Server Logging" 
in the VSCode Command Palette and then copying the link provided into "Debug: Open Link" (also in the Command Palette).
NOTE: THERE MAY BE PERFORMANCE ISSUES SO IF THAT IS THE CASE, TRY RUNNING IN VSCODE BY LOOKING AT A PREVIEW OR ON A 
LOCALHOST SERVER

**Overview of Scene:**
In this scene, I created a randomly generated forest using the concept of Hierarchical Modeling which we learned in class.
Most branches/segments of each tree are coded to have a random rotation and location in the scene. This creates dynamic looking
and feeling forest which can be used for future game projects that I may want to develop. The code for the actual creation of the 
tree objects takes inspiration from the robot arm demo given in the textbook coding examples by Angel. I used functions for each 
segment of the tree to be drawn out and then called each of them in the drawRobot() function to create a random tree. I had many ideas 
for this project but unfortunately ran out of time and wasn't able to fully realize this project.

**Acknowledgements:**
To create this project, I used helper functions from the textbook coding examples. For example, the cylinder function I took and 
modified from https://www.cs.unm.edu/~angel/BOOK/INTERACTIVE_COMPUTER_GRAPHICS/SEVENTH_EDITION/CODE/GEOMETRY/geometryTest2.html.
The code for the tree was also inspired by https://www.cs.unm.edu/~angel/BOOK/INTERACTIVE_COMPUTER_GRAPHICS/SEVENTH_EDITION/CODE/09/robotArm.js
which goes in depth into hierarchical modeling for a robot arm which I thought could be applied to modelling trees. The vertex and 
fragment shaders were the same as the one I used in the previous assignment and are taken and modified from the textbook explanation
on how to implement per-fragment shading and from the textbook's coding examples. There is a texture fragment shader that I included
but didn't use which is also from the textbook examples. I didn't use it because I couldn't implement textures in time, unfortunately. 

