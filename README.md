# RANDOM FOREST GENERATOR

## Made By: Andy Liu

**Instructions To Run:** 
Download the project as a zip file. Unzip the folder and open the scene.html file in your preferred browser. The program should work on the latest stable version of Chrome.

If it does not run, try creating a localhost server and opening the scene.html file through that. I ran my file by selecting "Start Server Logging" in the VSCode Command Palette and then copying the link provided into "Debug: Open Link" (also in the Command Palette). NOTE: THERE MAY BE PERFORMANCE ISSUES. IF THAT IS THE CASE, TRY RUNNING IN VSCODE BY LOOKING AT A PREVIEW OR ON A LOCALHOST SERVER.

**Overview of Scene:**
In this scene, I created a randomly generated forest using the concept of Hierarchical Modelling, which we learned in class. Most branches/segments of each tree are coded to have a random rotation and location in the scene. This creates a dynamic looking and feeling skeleton of a forest. The code for the creation of the tree objects takes inspiration from the robot arm demo given in the textbook coding examples by Angel. I used functions for each tree segment to be drawn out, then called each of them in the drawRobot() function to create a random tree. I had many ideas for this project, but unfortunately ran out of time and couldn't fully realize them.

**Acknowledgements:**
To create this project, I used helper functions from the textbook coding examples. For example, the cylinder function I took and modified from https://www.cs.unm.edu/~angel/BOOK/INTERACTIVE_COMPUTER_GRAPHICS/SEVENTH_EDITION/CODE/GEOMETRY/geometryTest2.html. The code for the tree was also inspired by https://www.cs.unm.edu/~angel/BOOK/INTERACTIVE_COMPUTER_GRAPHICS/SEVENTH_EDITION/CODE/09/robotArm.js, which goes in depth into hierarchical modelling for a robot arm, which I thought could be applied to modelling trees. The vertex and fragment shaders were the same as the ones I used in the previous assignment and were taken and modified from the textbook explanation on how to implement per-fragment shading and from the textbook's coding examples. There is a texture fragment shader that I included but didn't use, which is also from the textbook examples. I didn't use it because I couldn't implement textures in time. 

