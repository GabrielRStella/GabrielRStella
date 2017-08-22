<div style="background: {{palette.background}}">
  <div class="center section">
    {{#each games}}
      <a href="/games/{{this.path}}">{{this.title}}</a>
      <br/>
    {{/each}}
  </div>
</div>