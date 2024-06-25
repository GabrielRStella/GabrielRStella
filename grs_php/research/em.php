<?php
$pname = "em";
include 'project_begin.php';
?>

<div class="section">
    <!-- <div class="divider"></div> -->
    <div class="center-align">
        <h2>Tuxedo</h2>
    </div>
    <div class="row flow-text">
        <p>
            Tuxedo is a software suite containing the reference implementation of our bowtie streaming algorithms. It contains the following components:
        </p>
        <ol>
            <li>I/O scheduling algorithms capable of achieving theoretically-optimal (minimal) seek counts</li>
            <!-- <li>Optimized overlapped io</li> -->
            <li>Dynamic algorithm for multi-pass bowtie optimization</li>
            <li>Hardware benchmarking tools for collecting single-pass and multi-pass rate tables</li>
            <li>The <i>Block File System</i>, a simulated filesystem that reduces native filesystem overhead during complex tasks</li>
            <li>The <i>Hook System</i>, a tool that can trace, process, and replay the I/Os of any Windows application</li>
        </ol>
        <p>
            The software package also implements an efficient external-memory distribution sort, <i>TuxedoSort</i>, which has been tested on single-machine sorts up to 40TB using only 20GB of memory.
            On this challenging task, TuxedoSort was over 8x faster than the next-fastest system, finishing the sort in only 24 hours.
        </p>
        <p>Tuxedo's source code can be requested via email.</p>
    </div>
    <!-- <div class="divider"></div> -->
</div>

<div class="section">
    <!-- <div class="divider"></div> -->
    <div class="center-align">
        <h2>Bucket Game (D<sub>1</sub>)</h2>
    </div>
    <div class="row">
        <!-- <p>Below is a simulation of the scheduler's memory usage during a special case of bowtie streaming.</p> -->
        
        <div style="height: 10px;"></div>
        <!-- <h4 style="display: inline;">Bucket Game D<sub>1</sub></h4> -->
        <div style="height: 10px;"></div>
        <!-- options go here --> <div id="react-app"></div>
        <div style="align-content: center; text-align: center;">
        <div style="border: solid 1px black;">
            <canvas id="bucket-canvas"></canvas>
        </div>
        </div>
        <div style="height: 1px;"></div>
        <p>
        This is a simulation of the <i>bucket game</i> introduced in our paper on bowtie streaming. It demonstrates the distribute-from-file case, or <i>D<sub>1</sub></i> in the paper's notation. 
        </p>
        <script src="/files/scripts/buckets-canvas.js"></script>
        <script src="/files/scripts/buckets-react.js"></script>
    </div>
    <!-- <div class="divider"></div> -->
</div>



<?php
include 'project_end.php';
?>