<!-- https://www.w3schools.com/css/tryit.asp?filename=trycss_dropdown_navbar -->

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
        color: {{palette.color}};
        {{#if palette.button}}background-color: {{palette.button}};{{else}}background-color: {{palette.color}};{{/if}}
        transition: background-color 0.25s ease;
        display: block;
        padding: 10px;
      }
      .navbar-link a {
        color: {{palette.text}};
      }
      .navbar-link:hover {background-color: {{palette.hover}};}
      .navbar-dropdown {
        display: none;
      }
      .nabvar-holder {
        display: inline-block;
      }
      .navbar-holder:hover .navbar-dropdown {
        display: block;
      }
    </style>
    {{#each links}}
      <div class="navbar-holder">
        <div class="navbar-link">
          <a href="{{this.to}}">{{this.title}}</a>
        </div>
        {{#if this.sub}}
          <div class="navbar-dropdown">
            {{#each this.sub}}
              <div class="navbar-link" style="display: block"><a href="{{this.to}}">{{this.title}}</a></div>
            {{/each}}
          </div>
        {{/if}}
      </div>
    {{/each}}
  </div>
</div>