<div style="background: {{game.background}}">
  <style>* { background: {{game.background}}; padding: 0; margin: 0; } canvas { background: {{game.background}}; display: block; margin: 0 auto; }</style>

  <div style="height: 5px"></div>

  <canvas id="gameCanvas" style="background: ; display: block; margin: 0 auto;"></canvas>

  {{#each game.scriptUrls}}
    <script src="{{this}}"></script>
  {{/each}}
</div>