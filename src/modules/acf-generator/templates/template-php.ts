export const template = `<% if(data.subfields) { %><?php
<% data.subfields.forEach((subfield) =>{ %>$<%= subfield.variableName %> = get_sub_field( '<%= subfield.name %>' );
<% }) %>?>
<% } %>
<section class="module <%= data.className %>">
</section>`;
