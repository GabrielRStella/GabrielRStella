<div style="background: {{background}}">
  <div style="height: {{#if size}}{{size}}{{else}}150{{/if}}px" class="valign-wrapper">
    <div style="margin-left: 20px" class="center-align">
      <h1 style="color: {{palette.color}}; font-size: 72px">{{{title}}}</h1>
    </div>
  </div>
</div>
<div style="background-color: {{palette.color}}; color: {{palette.text}}; font-size: 24px">
  <div style="padding: 10px; display: inline-block">{{{nav}}}</div>
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