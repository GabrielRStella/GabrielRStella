<?php
$pname = "em";
include 'project_begin.php';
?>

<div class="section">
    <!-- <div class="divider"></div> -->
    <div class="center-align">
        <h2>Tuxedo</h2>
    </div>
    <div class="row">
        <p>Tuxedo is the reference implementation of our bowtie streaming and multi-pass optimization algorithms. Its major features are:</p>
        <ol>
        <li>hitting near theoretical optimal run lengths</li>
        <li>Optimized overlapped io</li>
        <li>extreme-speed em sort, tested up to 40tb on a single machine [sorted 40tb using 20gb ram in 24 hrs; the next-fastest system took more than a week]</li>
        </ol>
        <p>Tuxedo's source code will be released on GitHub soon. For now, a copy can be requested via email.</p>
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