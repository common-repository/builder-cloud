<?php
/**
 * @package Builder_Cloud
 * @version 0.1
 */
/*
Plugin Name: Builder Cloud
Plugin URI: https://www.mybuildercloud.com
Description: Builder Cloud - Display your communities, homes, and plans from Builder Cloud on your Wordpress website.
Author: Jerome Walker
Version: 0.1
Author URI: https://www.builderdesigns.com
License: GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: buildercloud
Domain Path: /languages
*/

class BuilderCloud{
  function __construct(){
    wp_register_script('dir-pagination', plugins_url('/scripts/dirPagination.min.js', __FILE__));
    wp_register_script('angular-filter', plugins_url('/scripts/angular-filter.min.js', __FILE__));
    wp_register_script('angularjs', plugins_url('/scripts/angular.1.6.4.min.js', __FILE__), array(), null, false);
    wp_register_script('leaflet_js', plugins_url('/scripts/leaflet/leaflet.js', __FILE__));

    wp_enqueue_style('load-fa', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css' );
    wp_enqueue_style('leaflet_js', plugins_url('/scripts/leaflet/leaflet.css', __FILE__));
    wp_enqueue_style('buildercloud_style_css', plugins_url('/style.css', __FILE__));

    wp_enqueue_script('buildercloud', plugins_url('/buildercloud.js', __FILE__), array('angularjs', 'dir-pagination', 'angular-filter', 'leaflet_js'));

    add_action('admin_head', 'buildercloud_tinymce_button');
    function buildercloud_tinymce_button() {
      global $typenow;
      if ( !current_user_can('edit_posts') && !current_user_can('edit_pages') )  return;
      if( ! in_array( $typenow, array( 'post', 'page' ) ) ) return;
      if ( get_user_option('rich_editing') == 'true') {
          add_filter("mce_external_plugins", "buildercloud_add_tinymce_plugin");
          add_filter('mce_buttons', 'buildercloud_register_my_tc_button');
      }
    }
    function buildercloud_add_tinymce_plugin($plugin_array) {
      $plugin_array['buildercloud_tc_button'] = plugins_url( '/text-button.js', __FILE__ );
      return $plugin_array;
    }
    function buildercloud_register_my_tc_button($buttons) {
     array_push($buttons, "buildercloud_tc_button");
     return $buttons;
    }

    add_action( 'admin_init', 'register_buildercloudsettings' );
    function register_buildercloudsettings(){
      register_setting('buildercloud_options', 'builder_id');
    }

    add_action('admin_menu', 'buildercloud_options_page');
    function buildercloud_options_page_html(){
      if (!current_user_can('manage_options')) {
          return;
      }
      ?>
      <div class="wrap">
        <h1><?= esc_html(get_admin_page_title()); ?></h1>
        <form action="options.php" method="post">
          <?php
          settings_fields('buildercloud_options');
          do_settings_sections('buildercloud');
          submit_button('Save Settings');
          ?>
        </form>
      </div>
      <?php
    }
    function buildercloud_setting_section_callback_function( $arg ) {
      $bid = esc_attr( get_option('builder_id') );
      $success = 'Builder ID must be exactly 24 characters long and include only characters A-F and/or 0-9.';
      if (builder_id_format_valid($bid)){
        $builder = file_get_contents("https://api2.mybuildercloud.com/api/v1/builders/{$bid}?projection={%22name%22:1,%22address%22:1}");
        $builder = json_decode($builder, true);
        $success = "Builder Found:<br> {$builder['name']}<br> {$builder['address']['streetAddress']}<br> {$builder['address']['addressLocality']}, {$builder['address']['addressRegion']} {$builder['address']['postalCode']} <br> ";
      }
      ?>
        Step 1, log in to Builder Cloud with your username and password.<br>
        Enter your Builder ID number below.<br>
        This will establish a connection with Builder Cloud.<br>
        <input type="text" name="builder_id" size="26" maxlength="24" value="<?php echo $bid ?>" /><br>
        <?php echo $success ?>
      <?php
    }
    function buildercloud_options_page() {
      add_settings_section('bc', 'Welcome to Builder Cloud', 'buildercloud_setting_section_callback_function', 'buildercloud');
      add_menu_page('Builder Cloud', 'Builder Cloud', 'manage_options', 'buildercloud', 'buildercloud_options_page_html', plugin_dir_url(__FILE__) . 'custom-icon.png', 200);
    }

    add_shortcode( 'buildercloud_homes', 'buildercloud_homes' );
    function buildercloud_homes( $atts, $content = null ){
      if ($_GET['id']){
        return builder_id().file_get_contents( plugins_url('/templates/home.html', __FILE__) );
      }
      else{
        return builder_id().file_get_contents( plugins_url('/templates/homes.html', __FILE__) );
      }
    }

    add_shortcode( 'buildercloud_plans', 'buildercloud_plans' );
    function buildercloud_plans( $atts, $content = null ){
      if ($_GET['id']){
        return builder_id().file_get_contents( plugins_url('/templates/plan.html', __FILE__) );
      }
      else{
        return builder_id().file_get_contents( plugins_url('/templates/plans.html', __FILE__) );
      }
    }

    add_shortcode( 'buildercloud_communities', 'buildercloud_communities' );
    function buildercloud_communities( $atts, $content = null ){
      if ($_GET['id']){
        return builder_id().file_get_contents( plugins_url('/templates/community.html', __FILE__) );
      }
      else{
        return builder_id().file_get_contents( plugins_url('/templates/communities.html', __FILE__) );
      }
    }

    function builder_id (){
      global $wpdb;

      $query = 'SELECT * FROM '.$wpdb->prefix.'posts WHERE post_content LIKE "%[buildercloud_communities]%" AND post_status = "publish" AND post_type = "page" AND post_parent = 0 ORDER BY menu_order';
      $bcComPage = $wpdb->get_results($query, 'ARRAY_A');
      $bcComPage = '/'.$bcComPage[0]['post_name'];

      $query = 'SELECT * FROM '.$wpdb->prefix.'posts WHERE post_content LIKE "%[buildercloud_homes]%" AND post_status = "publish" AND post_type = "page" AND post_parent = 0 ORDER BY menu_order';
      $bcInvPage = $wpdb->get_results($query, 'ARRAY_A');
      $bcInvPage = '/'.$bcInvPage[0]['post_name'];

      $query = 'SELECT * FROM '.$wpdb->prefix.'posts WHERE post_content LIKE "%[buildercloud_plans]%" AND post_status = "publish" AND post_type = "page" AND post_parent = 0 ORDER BY menu_order';
      $bcModPage = $wpdb->get_results($query, 'ARRAY_A');
      $bcModPage = '/'.$bcModPage[0]['post_name'];

      $bid = esc_attr( get_option('builder_id') );
      $purl = plugins_url('', __FILE__);

      if (builder_id_format_valid($bid)){
        return "<script>var BUILDERCLOUD = {}; BUILDERCLOUD.BID = '{$bid}'; BUILDERCLOUD.PURL = '{$purl}'; BUILDERCLOUD.homes = '{$bcInvPage}'; BUILDERCLOUD.communities = '{$bcComPage}'; BUILDERCLOUD.plans = '{$bcModPage}';</script>";
      }
      else{
        return "<script>var BID = false</script>";
      }
    }

    function builder_id_format_valid($bid){
      if (strlen($bid) != 24) return false;
      return true;
    }
  }
}

$buildercloud = new BuilderCloud;

?>
