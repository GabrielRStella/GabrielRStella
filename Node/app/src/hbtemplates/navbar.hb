<div style="background-color: {{palette.color}}; color: {{palette.text}}; font-size: 24px">
  <div style="padding: 10px; display: inline-block">{{{title}}}</div>
  <div style="float: right; display: inline-block; align-content: right; text-align: right">
    <style>
      .navbar-link {
        color: {{palette.text}};
        {{#if palette.button}}background-color: {{palette.button}};{{/if}}
        transition: background-color 0.25s ease;
        display: inline-block;
        padding: 10px
      }
      .navbar-link:hover {background-color: {{palette.hover}};}
    </style>
    {{#each links}}
      <a href="{{this.to}}"><div class="navbar-link">{{this.title}}</div></a>
    {{/each}}
  </div>
</div>