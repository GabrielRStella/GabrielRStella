<div style="height: 5px"></div>

<canvas id="gameCanvas" style="background: #fff; display: block; margin: 0 auto;"></canvas>

<script src="game_tetris.js">
</script>
<div style="align-content: center; text-align: center; margin: 0 auto">
  <div style="display: inline-block">
    <div style="height: 10px"></div>
    <input id="game_mode_btn" type="button" value="Click Me!" onclick="clickCallback();" />
    <p>
      Match 4 blocks of the same color to create a solid piece.<br/>
      Line up row of solid pieces to erase the row.<br/>
      Match more than 4 blocks of the same color to instantly remove them.<br/>
      Match a bunch for a surprise!
    </p>
  </div>
</div>