<!DOCTYPE html>
<html>
<?php
$title = 'CSCE645';
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
          <h1>CSCE 645 Research Project (Fall 2021)</h1>
        </div>
        <h5>
          "Interesting Interactions with Granular Material"
        </h5>
      </div>
    </div>
	<div class="row">
		<div class="col s12 m12 l12">
		  <div class="card">
			<div class="card-content">
			  <a href="/CSCE645/proposal.pdf"><span class="card-title">Proposal and Literature Review</span></a>
			  <p>This document introduces the topic of the research project I am doing this semester.</p>
			</div>
		  </div>
		</div>
		<div class="col s12 m12 l12">
		  <div class="card">
			<div class="card-content">
			  <a href="/CSCE645/update1.pdf"><span class="card-title">Progress Update 1</span></a>
			  <p>This document discusses the work done prior to October 28th.</p>
			</div>
		  </div>
		</div>
		<div class="col s12 m12 l12">
		  <div class="card">
			<div class="card-content">
			  <a href="/CSCE645/update2.pdf"><span class="card-title">Progress Update 2</span></a>
			  <p>This document discusses the work done prior to November 18th.</p>
			</div>
		  </div>
		</div>
		<div class="col s12 m12 l12">
		  <div class="card">
			<div class="card-content">
			  <a href="#"><span class="card-title">Final Update</span></a>
			  <p>TODO (Dec 7)</p>
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
