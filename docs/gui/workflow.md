# Using the GUI
I introduce how to use optinist GUI in this document.
Optinist GUI is separated "FlowChart" and "Visualize", you can switch pages in the tab.

# FlowChart Page
You can create and run workflow by gui.
<br>
<p align="center">
<img width="500px" src="https://github.com/oist/optinist/blob/develop/docs/images/flowchart/flow_chart.png" alt="flowchart" />

<br/>

## Set Image Input
First, set input images at image node.
This sytetem read data from `tmp/optinist` local directory, so input data need to locate in there. Click "SELECT IMAGE" button and set as input images.  
If you want to use own image data, Click "UPLOAD" button and upload file to `tmp/optinist`.  
An large data file takes long time to upload, so it copy to `tmp/optinist` directly and load file more quickly.  
** Currentlly, input images need to have .tiff or .TIFF extension.(developing other extension)
<br>
<p align="center">
<img width="300px" src="https://github.com/oist/optinist/blob/develop/docs/images/flowchart/imageNode.png" alt="imageNode" />
</p>

<br/>

## Add Algorithm
Next, add algorithm from left treeview.
Select algorithms from the treeview, click "+" button or drag&drop to flowchart.
<br>
<p align="center">
  <img width="300px" src="https://github.com/oist/optinist/blob/develop/docs/images/flowchart/add_algorithm.png" alt="Add Algorithm" />
</p>

<br>

## Set Parameter
Click "PARAM" button and change parameters.
<br>
<p align="center">
<img width="300px" src="https://github.com/oist/optinist/blob/develop/docs/images/flowchart/setparam.png" alt="Set Parameter" />
</p>

<br/>

## Connect Algorithm Edge
To make workflow, connect edges between node to node by drag&drop.  
You can only connect the same color edges (correspond to arguments and returns type, imageType, timeSeries type, ...). However, csv input could be any types, so it is black color and could be connected with any arguments.
<br>
<p align="center">
<img width="300px" src="https://github.com/oist/optinist/blob/develop/docs/images/flowchart/connect_edge.png" alt="Connect Algorithm" />
</p>

<br/>

## Run workflow
After you make workflow graph, click "Run" button and run workflow.
<br>
<p align="center">
<img width="500px" src="https://github.com/oist/optinist/blob/develop/docs/images/flowchart/run_flow.png" alt="Run Workflow" />
</p>

## Finish Run
If the node get select tab in algorithm node, it means that the node is finished running.  
You can check result image, timseries or heatmap data at the visualize page.
<br>
<p align="center">
<img width="500px" src="https://github.com/oist/optinist/blob/develop/docs/images/flowchart/finish_run.png" alt="Finish Run" />
</p>

## CSV Input
Csv input could be any types, so it is shown in black color and could be connected with any arguments.
<br>
<p align="center">
<img width="400px" src="https://github.com/oist/optinist/blob/develop/docs/images/flowchart/csv_connect.png" alt="CSV Connect" />
</p>


<br/>
