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
        {{#if palette.button}}background-color: {{palette.button}};{{else}}background-color: {{palette.color}};{{/if}}
        transition: background-color 0.25s ease;
        display: inline-block;
        padding: 10px
      }
      .navbar-link a {
        color: {{palette.text}};
      }
      .navbar-link:hover {background-color: {{palette.hover}};}
      .navbar-dropdown {
        position: absolute;
        display: none;
      }
      .navbar-link:hover .navbar-dropdown {
        display: block;
      }
    </style>
    {{#each links}}
      <div class="navbar-link">
        <a href="{{this.to}}">{{this.title}}</a>
        {{#if this.sub}}
          <div class="navbar-dropdown">
            {{#each this.sub}}
              <div class="navbar-link" style="display: block">{{this.title}}</div>
            {{/each}}
          </div>
        {{/if}}
      </div>
    {{/each}}
  </div>
</div>