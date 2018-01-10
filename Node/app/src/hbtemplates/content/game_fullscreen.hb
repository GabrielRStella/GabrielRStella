<div style="background: {{game.page_background}}">
  <style>* { background: {{game.page_background}}; padding: 0; margin: 0; } canvas { background: {{game.canvas_background}}; display: block; margin: 0 auto; }</style>

  {{{game.template.before}}}
  <canvas id="gameCanvas"></canvas>
  {{{game.template.after}}}

  {{#each game.scriptUrls}}
    <script src="{{this}}"></script>
  {{/each}}
</div>