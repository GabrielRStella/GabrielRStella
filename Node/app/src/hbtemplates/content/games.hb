<div style="background: white">
  <div class="container">
  <div class="section">
    <div style="height: 10px"></div>
    <h1 style="display: inline; padding: 10px">Games</h1>
    <div style="height: 10px"></div>
    <div class="divider"></div>
    <br/>
  {{#each games}}
    <div class="row">
      <div class="col s12" style="vertical-align: top">
        <div style="padding: 10px; border: 2px solid #000000; border-radius: 10px; background: {{this.background}}; cursor: pointer"
          onclick="window.location.assign('{{this.url}}')">
        <div style="display: inline-block; width: 128px; height: 128px;">
          <img style="width: 128px; height: 128px; border: 2px solid {{this.foreground}}; border-radius: 8%" src="{{this.thumbnailUrl}}" />
        </div>
        <div style="display: inline-block; width: 5px"></div>
        <div style="display: inline-block; vertical-align: top; width: calc(100% - 145px)">
          <h5 style="color: {{this.foreground}}">{{this.title}}</h5>
          <p style="color: {{this.foreground}}"><br/>{{this.description}}</p>
        </div>
        </div>
      </div>
    </div>
  {{/each}}
  </div>
  </div>
</div>