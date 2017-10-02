<div style="background: {{palette.background}}">
  <div class="center section">
    <a href="#game_top" style="color: black"><h2>{{game.title}}</h2></a>
    <br/>
    <br/>
    <div id="game_top"></div>
    <div style="height: 5px"></div>
    <div style="border: {{#if game.background}}0{{else}}1{{/if}}px solid black; padding: 0px; display: inline-block">
      <canvas id="gameCanvas" style="background: {{#if game.background}}{{game.background}}{{else}}#fff{{/if}}; display: block; margin: 0 auto;"></canvas>
    </div>
    <script>
      var pre_canvas = document.getElementById("gameCanvas");
      pre_canvas.height = window.innerHeight - 10;
      pre_canvas.width = document.body.clientWidth - 10;
    </script>
    {{#if game.template_before}}
      {{{game.template}}}
    {{/if}}
    <script src="/static/games/{{game.script}}"></script>
    <br/>
    <div style="align-content: center; text-align: center; margin: 0 auto">
      <div style="display: inline-block; align-content: center; text-align: center;">
        {{#if game.template_after}}
          {{{game.template}}}
        {{/if}}
        <p style="width: 70%; margin: 0 auto">
          {{{game.caption}}}
        </p>
      </div>
    </div>
  </div>
</div>