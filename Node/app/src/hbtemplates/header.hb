<!-- https://www.w3schools.com/css/tryit.asp?filename=trycss_dropdown_navbar -->

<div style="background: url(/header)">
  <div style="height: 108px" class="valign-wrapper">
    <div style="margin-left: 20px" class="center-align">
      <h1 style="color: #000000; font-size: 72px">Gabriel R Stella</h1>
    </div>
  </div>
</div>
<div style="background-color: #000000; color: #ffffff; font-size: 24px; padding: 10px;">
  <div style="display: inline-block">Navigation</div>
  <div style="float: right; display: inline-block; align-content: right; text-align: right; overflow: hidden;">
    <style>
      .navbar-link {
        text-align: center;
        background-color: #000000;
        transition: background-color 0.25s ease;
        display: inline-block;
        border-top: 1px solid white;
        border-bottom: 1px solid white;
        width: 150px;
        cursor: pointer;
      }
      .navbar-link:hover {
        background-color: #505050;
      }
      .navbar-link a {
        color: #ffffff;
        padding: 10px;
      }
      .navbar-dropdown {
        display: none;
        position: absolute;
      }
      .navbar-link:hover .navbar-dropdown {
        display: block;
        width: inherit;
      }
      .navbar-dropdown .navbar-link {
        border-top: none;
        border-bottom: none;
      }
    </style>
    {{#each links}}
        <div class="navbar-link" onclick="window.location.assign('{{this.to}}')">
          <a href="{{this.to}}">{{this.title}}</a>
          {{#if this.sub}}
            <div class="navbar-dropdown">
              {{#each this.sub}}
                <div class="navbar-link" onclick="window.location.assign('{{this.to}}')"><a href="{{this.to}}">{{this.title}}</a></div>
              {{/each}}
            </div>
          {{/if}}
        </div>
    {{/each}}
  </div>
</div>