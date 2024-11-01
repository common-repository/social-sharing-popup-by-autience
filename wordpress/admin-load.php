<!-- Put product name as a js variable -->

<script type="text/javascript">
	var yetience  = <?php $this->print_files_to_load("admin","admin-interface/loader");?>;

	window.yetience = yetience;


	//finding wordpress version
	yetience.wordpress_version = "<?php bloginfo('version'); ?>";
	

	yetience.path = '<?php echo plugins_url()."/".($this->plugin_folder);?>';

	yetience.adminPath = '<?php echo plugins_url()."/".($this->plugin_folder)."/admin-interface";?>';
</script>

<script type="text/javascript">
	yetience.pageList = <?php echo Yetience::getAllPages() ?>;
</script>
<script type="text/javascript">
	yetience.categories = <?php echo Yetience::getCategories(); ?>;
	
</script>
<script type="text/javascript">
	yetience.product= '<?php echo $this->product_label ?>';
	yetience.title = '<?php echo $this->plugin_title ?>';
	yetience.version = '<?php echo $this->plugin_version ?>';

</script>

<?php
	//$this->initialize_id();//initializ_id commented because php makes two post calls instead of one
	$this->enque_js($this->admin_js);
	wp_enqueue_style('yetience-loader-wordpress');
?>


<div class="yetience-container">

	<?php
		include "admin-interface/src/platform_index.html";
	?>

	<div class="row">
		<div class="yel-last-screen col-md-8 col-md-offset-2">

			<form method="post" action="options.php">
			  <?php
			    settings_fields( 'yetience-'.($this->product_label).'-options' );
			    do_settings_sections( 'yetience-'.($this->product_label).'-options' );
			  ?>
			  	<table class="form-table" style="display:none">
			      <tr valign="top">   
			     	<td>
			        	<input id="yetience_setup" type="input" name="yetience_<?php echo ($this->product_snake)?>_setup" value="<?php echo $this->get_encoded_setup(); ?>"?>
			      	</td>
			     
			      </tr>
			    </table>
		      

		      	<div id="yetience_submit_button" class="" style="display:none">
		      		

			      	<div>
			  			<center>
			  				<div id="autience-save-message"></div>
			  				<!-- <div id="autience-save-message" class="yel-ls-text"></div> -->

		      				<?php submit_button();?>
		      				<span id="autience-undo-message" style="display:none">To undo your changes, Refresh the Browser.</span>
		      			</center>
		      			
			  		</div>
			  	</div>
		  	</form>

		</div>
	  	
	</div>
</div>
<script  type="text/javascript">
yetience.encoded_setup = document.getElementById('yetience_setup').value;

	window.yetienceCallWhenDefined = function(obj, fn, cb){
		if(obj[fn]){
			obj[fn](cb)
		}else{
			setTimeout(function(){
				window.yetienceCallWhenDefined(obj, fn, cb)
			},500)
		}
	}

	window.yetienceCallWhenDefined(window, 'defineYetience', function(){
		console.log('in callback of defineYetience')

		window.yetienceCallWhenDefined(window, 'defineAdminYetience', function(){
			console.log('in callback of defineAdminYetience')
		})
	})

</script>



<!--Start of Zopim Live Chat Script-->
<script type="text/javascript">
window.$zopim||(function(d,s){var z=$zopim=function(c){z._.push(c)},$=z.s=
d.createElement(s),e=d.getElementsByTagName(s)[0];z.set=function(o){z.set.
_.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute("charset","utf-8");
$.src="//v2.zopim.com/?3oZmEID4osTxJ4YduwFkMJNilkZGHx0q";z.t=+new Date;$.
type="text/javascript";e.parentNode.insertBefore($,e)})(document,"script");
</script>
<!--End of Zopim Live Chat Script-->
