<!DOCTYPE html>
<html>
<?php
$title = 'CSCE641';
include '../helpers/util.php';
include '../helpers/header.php';
include '../helpers/files.php';
?>
<body>
<?php
make_nav();
?>
<div class="container">
  <div class="section">
    <div class="row center-align">
      <div class="col s12">
        <div class="center-align">
          <h1>CSCE 641 Research Project (Spring 2023)</h1>
        </div>
        <h5>
          "MVDES: Multi-View Depth Estimation Sandbox"
        </h5>
      </div>
    </div>
	<div class="row">
		<div class="col s12 m12 l12">
		  <div class="card">
			<div class="card-content">
			  <span class="card-title">Abstract</span>
				<p style="text-indent: 36px;">
					Reconstructing 3D information from 2D images is one of the most important problems in computer vision. Several variants of the problem exist; an important one is <i>multi-view depth estimation</i>, in which algorithms attempt to estimate the depth of objects in an image based on parallax from other measurement images of the same scene. Though this has been a central focus of research for decades, it is still an open problem; existing methods have several problems, for example: computational efficiency, handling of object edges and occlusions, and robustness to noise.
				<!-- </p> -->
				<!-- <p style="text-indent: 36px;"> -->
					MVDES (<i>Multi-View Depth Estimation Sandbox</i>) is a collection of tools for developing and evaluating depth estimation algorithms by producing synthetic datasets. It consists of three components: an interactive sandbox that can generate and render scenes, as well as display the real-time output of a selected depth estimation algorithm and produce test case "snapshots"; an application that allows the user to view their saved snapshots; and a benchmarking program that evaluates several depth estimation algorithms on the snapshots.
				</p>
				<p style="text-indent: 36px;">
					The current implementation includes several depth estimation algorithms: a basic cost volume approach, PatchMatch disparity-based depth estimation, a randomized version of the algorithm from <i>Graph-based surface reconstruction from stereo pairs using image segmentation</i> (Bleyer and Gelautz 2005), and several other experimental algorithms based off of these.
				<!-- </p> -->
				<!-- <p style="text-indent: 36px;"> -->
					Preliminary comparisons were done using the first three algorithms on several sets of test cases collected using the interactive sandbox. Several parameters were varied: image resolution (320x180, 960x540, 1920x1080), surface texturing (enabled/disabled), and number of secondary views (1 [stereo] or 4). Overall, increasing resolution and enabling surface texturing led to better results (lower estimation error), while increasing the number of secondary views had little noticeable effect on the quantitative error (though it did increase the perceived quality of the estimated depth maps).
				<!-- </p> -->
				<!-- <p style="text-indent: 36px;"> -->
					A notable takeaway from the experiments is that PatchMatch is an <i>extremely</i> effective algorithm; in every case, it had the best efficiency and lowest final error. Also, though it isn't apparent from the description, Mieloch et al.'s algorithm is actually a fast approximation of the cost volume approach; hence, they often had similar asymptotic performance, though the approximation is significantly faster.
				</p>
			</div>
		  </div>
		</div>
		<div class="col s12 m12 l12">
		  <div class="card">
			<div class="card-content center-align">
				TODO put presentation video here
			  <!-- https://stackoverflow.com/a/23673392 ty aspect ratio -->
			  <iframe style="aspect-ratio: 560/315;" width="100%" src="https://www.youtube.com/embed/EYtFH2bFCfg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
			</div>
		  </div>
		</div>
		<div class="col s12 m12 l12">
		  <div class="card">
			<div class="card-content center-align">
				TODO put demo video here
			  <!-- https://stackoverflow.com/a/23673392 ty aspect ratio -->
			  <iframe style="aspect-ratio: 560/315;" width="100%" src="https://www.youtube.com/embed/EYtFH2bFCfg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
			</div>
		  </div>
		</div>
		<div class="col s12 m12 l12">
		  <div class="card">
			<div class="card-content">
			  <span class="card-title">Results</span>
			  <p>TODO recreate the presentation results here with figures and stuff</p>
			</div>
		  </div>
		</div>
	</div>
  </div>
</div>
<?php
make_footer();
?>
<?php include '../helpers/materialize.php'; ?>
</body>
</html>
