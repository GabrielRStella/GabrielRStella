<!DOCTYPE html>
<html>
<?php
$title = 'CSCE641';
include '../../helpers/util.php';
include '../../helpers/header.php';
include '../../helpers/files.php';
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
					The current implementation includes several depth estimation algorithms: a basic cost volume approach, stereo PatchMatch disparity-based depth estimation, n-view PatchMatch, a randomized version of the algorithm from <i>Graph-based multiview depth estimation using segmentation</i> (Mieloch et al. 2017), and several other experimental algorithms based off of these.
				<!-- </p> -->
				<!-- <p style="text-indent: 36px;"> -->
					Preliminary comparisons were done using the first four algorithms on sets of test cases collected using the interactive sandbox. Several parameters were varied: image resolution (320x180, 960x540, 1920x1080), surface texturing (enabled/disabled), and number of secondary views (1 [stereo] or 4). Overall, increasing the input resolution and number of secondary views and enabling surface texturing led to better results (lower estimation error).
				<!-- </p> -->
				<!-- <p style="text-indent: 36px;"> -->
					A notable takeaway from the experiments is that PatchMatch is an <i>extremely</i> effective algorithm; in every case, it had the lowest final error, and it was usually the fastest. Also, though it isn't necessarily apparent from the description, Mieloch et al.'s algorithm is essentially a fast approximation of the cost volume approach; hence, they often had similar asymptotic performance, though the approximation is significantly faster.
				</p>
			</div>
		  </div>
		</div>
		<div class="col s12 m12 l12">
		  <div class="card">
			<div class="card-content center-align">
			  <!-- https://stackoverflow.com/a/23673392 ty aspect ratio -->
			  <iframe style="aspect-ratio: 560/315;" width="100%" src="https://www.youtube.com/embed/rwHK44klv6o" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
			</div>
		  </div>
		</div>
		<div class="col s12 m12 l12">
		  <div class="card">
			<div class="card-content center-align">
			  <!-- https://stackoverflow.com/a/23673392 ty aspect ratio -->
			  <iframe style="aspect-ratio: 560/315;" width="100%" src="https://www.youtube.com/embed/siqBnVs9H-w" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
			</div>
		  </div>
		</div>
		<div class="col s12 m12 l12">
		  <div class="card">
			<div class="card-content">
			  <span class="card-title">Implementation</span>
				<p style="text-indent: 36px;">
					MVDES has three modes of operation. The <i>interactive sandbox</i> generates random scenes using models loaded from a user directory and allows the user to move the camera and adjust render settings.
					For development, the user can watch the depth estimation algorithms work in real-time based on the current view; for benchmarking, the current view can be saved as a "snapshot" for later evaluation.
					The <i>snapshot viewer</i> allows the user to load and view their saved snapshots.
					The <i>evaluator</i> is a batch-mode tool that evaluates a set of estimation algorithms against a set of saved snapshots and reports average error scores over time.
					The data flow of the interactive sandbox is shown below:
				</p>
				<br/>
				<img src="data_flow.png" alt="Dataflow diagram of the interactive sandbox." title="Sandbox Dataflow" class="responsive-img"/>
				<br/>
				<br/>
				<p style="text-indent: 36px;">
					The viewer and evaluator both implement approximately a subset of the above behavior.
					The below images are screenshots taken from the sandbox program; the first shows the ground-truth view, while the second shows estimated depth using PatchMatch-Multi.
			  	</p>
				<br/>
				<img src="screenshot.png" alt="Screenshot of MVDES, containing ground truth images for the measurement views" title="MVDES Screenshot 1" class="responsive-img"/>
				<img src="screenshot2.png" alt="Screenshot of MVDES, containing a view of the estimated depth using PatchMatch-Multi" title="MVDES Screenshot 2" class="responsive-img"/>
			</div>
		  </div>
		</div>
		<div class="col s12 m12 l12">
		  <div class="card">
			<div class="card-content">
			  <span class="card-title">Results</span>
				<p style="text-indent: 36px;">
					Performance was measured using average relative error (percentage error of each estimated depth value, normalized over the image size).
					Four algorithms were tested: 7x7 stereo PatchMatch, 7x7 n-view PatchMatch, 256-value logarithmic Cost Volume, and 2500-segment randomized Mieloch's algorithm. 
					Several parameters were varied to observe their effect on the estimation runtime and accuracy.
					First, enabling surface textures improves performance, since it makes the correspondence problem much easier:
				</p>
				<div class="row">
					<div class="col s12 m6">
						<img src="result_textures_0.png" alt="Result image 1.1: textured vs. textureless surfaces, 320x180 untextured" title="Estimation performance on textured vs. textureless surfaces, 320x180 untextured" class="responsive-img"/>
					</div>
					<div class="col s12 m6">
						<img src="result_textures_1.png" alt="Result image 1.2: textured vs. textureless surfaces, 320x180 textured" title="Estimation performance on textured vs. textureless surfaces, 320x180 textured" class="responsive-img"/>
					</div>
					<div class="col s12 m6">
						<img src="result_textures_2.png" alt="Result image 1.3: textured vs. textureless surfaces, 960x540 untextured" title="Estimation performance on textured vs. textureless surfaces, 960x540 untextured" class="responsive-img"/>
					</div>
					<div class="col s12 m6">
						<img src="result_textures_3.png" alt="Result image 1.4: textured vs. textureless surfaces, 960x540 textured" title="Estimation performance on textured vs. textureless surfaces, 960x540 textured" class="responsive-img"/>
					</div>
				</div>
				<p>
					Increasing resolution improves performance, though most algorithms have runtime linear in the number of pixels:
				</p>
				<div class="row">
					<div class="col s12 m6">
						<img src="result_resolution_0.png" alt="Result image 2.1: PatchMatch multi-res" title="Estimation performance on varying resolution, PatchMatch" class="responsive-img"/>
					</div>
					<div class="col s12 m6">
						<img src="result_resolution_1.png" alt="Result image 2.2: PatchMatch-Multi multi-res" title="Estimation performance on varying resolution, PatchMatch-Multi" class="responsive-img"/>
					</div>
					<div class="col s12 m6">
						<img src="result_resolution_2.png" alt="Result image 2.3: Cost Volume multi-res" title="Estimation performance on varying resolution, Cost Volume" class="responsive-img"/>
					</div>
					<div class="col s12 m6">
						<img src="result_resolution_3.png" alt="Result image 2.4: Mieloch multi-res" title="Estimation performance on varying resolution, Mieloch" class="responsive-img"/>
					</div>
				</div>
				<p>
					Finally, for algorithms that can process more than one measurement image, increasing the number of secondary views increases accuracy at a small runtime cost:
				</p>
				<div class="row">
					<div class="col s12 m6">
						<img src="result_nviews_0.png" alt="Result image 3.1: Stereo" title="Estimation performance on 1080p stereo" class="responsive-img"/>
					</div>
					<div class="col s12 m6">
						<img src="result_nviews_1.png" alt="Result image 3.2: 4-view" title="Estimation performance on 1080p 4-view" class="responsive-img"/>
					</div>
				</div>
				<p style="text-indent: 36px;">
					There are a couple quick takeaways from these figures:
					first, PatchMatch is a highly effective algorithm, yielding the lowest error and often the fastest convergence;
					second, Mieloch et al.'s algorithm can be interpreted as an segment-based approximation of the cost volume approach.
					Though its runtime is technically linear in the number of pixels (due to the pixel clustering step), the constants are very low, so its speed remains high even on large images.
				</p>
				<p style="text-indent: 36px;">
					Even with these highly-effective algorithms, the final error rates were usually greater than 10%. Qualitatively, the error seems to come from three sources.
					Object boundaries (and occlusions) were the primary cause of this error, which none of the tested algorithms could properly resolve.
					Fortunately, the error resulting from this usually decreases proportionally as image resolution increases.
					Another issue was the fact that PatchMatch, as described in the original paper, cannot handle sub-pixel disparity;
					thus, it necessarily has some error, which generally shows up as wavy patterns throughout the image (as disparity goes from e.g. 1 to 2 pixels, the error is greatest where the value should be 1.5).
					Finally, textureless regions always cause issues, since these algorithms only use <i>local</i> information to assign depth/disparity values.
					When a surface has uniform color, a wide range of depth/disparity values will result in the same cost and the algorithm cannot determine the correct value.
				</p>
			</div>
		  </div>
		</div>
		<!-- <div class="col s12 m12 l12">
		  <div class="card">
			<div class="card-content">
			  <span class="card-title">Resources</span>
				<p style="text-indent: 36px;">
					TODO code/slides ig
				</p>
			</div>
		  </div>
		</div> -->
	</div>
  </div>
</div>
<?php
make_footer();
?>
<?php include '../../helpers/materialize.php'; ?>
</body>
</html>
