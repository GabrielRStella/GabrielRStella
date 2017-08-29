<div style="background: {{palette.background}}">
  {{#each sections}}
    <div class="center section"style="background: {{this.background}}">
      {{{this.content}}}
    </div>
  {{/each}}
</div>