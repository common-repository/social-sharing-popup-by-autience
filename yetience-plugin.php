<?php
/*
Plugin Name: Social Sharing Popup by Autience
Description: Get Visitors to Share your Content
Version: 3.1.4
*/

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

set_include_path("./");

if(!class_exists("Yetience")){
	include 'wordpress/yetience-class.php';
}

//read product.json
$product = json_decode(file_get_contents('product.json', true), true); // decode the JSON into an associative array

//read deployment.json
$deployment_json = json_decode(file_get_contents('deployment.json', true), true); // decode the JSON into an associative array
$deployment = $deployment_json['deployment'];
$yetience_plugin_version = $deployment_json['version'];

new Yetience($product['label'], $product['title'], $product['folder'], dirname(__FILE__), $deployment, $yetience_plugin_version);

?>
