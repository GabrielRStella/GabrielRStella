<div style="background: {{palette.background}}">
  <div class="center section">
    <a href="#game_top">{{game.title}}</a>
    <br/>
    <div id="game_top"></div>
    <canvas id="gameCanvas" style="background: #fff; display: block; margin: 0 auto;"></canvas>
    <script src="/static/games/{{game.script}}"></script>
    <br/>
    <div style="align-content: center; text-align: center; margin: 0 auto">
      <div style="display: inline-block">
        {{{game.template}}}
        <p>
          {{{game.caption}}}
        </p>
      </div>
    </div>
  </div>
</div>