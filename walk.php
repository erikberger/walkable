<?php

$start = $_POST['start'];
$end = $_POST['end'];

$key = "hidden";

$request = "https://maps.googleapis.com/maps/api/distancematrix/json?mode=walking&parameters&units=imperial&origins=place_id:{$start}&destinations=place_id:{$end}&key=".$key;


// create curl resource
$ch = curl_init();

// set url
curl_setopt($ch, CURLOPT_URL, $request);

//return the transfer as a string
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

// $output contains the output string
$output = curl_exec($ch);

// close curl resource to free up system resources
curl_close($ch);

echo $output;
?>
