<div style="background: {{palette.foreground}}">
  <div class="section">
  <div class="row">
    {{#each games}}
      <div class="col s4" style="vertical-align: top">
        <div style="padding: 10px; border: 2px solid #000000; border-radius: 10px; background: {{this.background}}; cursor: pointer"
          onclick="window.location.assign('/games/{{this.path}}')">
        <div style="display: inline-block; width: 128px; height: 128px;">
          <img style="width: 128px; height: 128px; border: 2px solid {{this.foreground}}; border-radius: 8%" src="/static/games/thumbnails/{{this.path}}.png" />
        </div>
        <div style="display: inline-block; width: 5px"></div>
        <div style="display: inline-block; vertical-align: top; width: calc(100% - 145px)">
          <h5 style="color: {{this.foreground}}">{{this.title}}</h5>
          <p style="color: {{this.foreground}}"><br/>{{this.description}}</p>
        </div>
        </div>
      </div>
    {{/each}}
  </div>
  </div>
</div>