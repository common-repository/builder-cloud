(function() {
  tinymce.PluginManager.add('buildercloud_tc_button', function(editor, url) {
    editor.addButton('buildercloud_tc_button', {
      title : 'Builder Cloud',
      type : 'menubutton',
      icon : 'icon buildercloud-own-icon',
      menu : [{
        text : 'Homes',
        value : '[buildercloud_homes]',
        onclick : function() {
          editor.insertContent(this.value());
        }
      }, {
        text : 'Plans',
        value : '[buildercloud_plans]',
        onclick : function() {
          editor.insertContent(this.value());
        }
      }, {
        text : 'Communities',
        value : '[buildercloud_communities]',
        onclick : function() {
          editor.insertContent(this.value());
        }
      }]
    });
  });
})();
