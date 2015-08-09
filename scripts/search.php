<?php
/** Set access tokens here - see: https://dev.twitter.com/apps/ **/
$search = $_REQUEST["search"];
$settings = array(
    'oauth_access_token' => "895890626-EBKN7DgWCMNoWQCUDwUPTL4ZIQDtztcs4P7S95ff",
    'oauth_access_token_secret' => "DhCpuL5e6eAADunFshqMs45hSe3icxFLSoRYqqMi8BFGg",
    'consumer_key' => "QTe03opZ9XcXsLwj55BRXb4qx",
    'consumer_secret' => "wRWOKG7ofG4604cgg0uTVOSdmWuVu4lL8AMCEdq3XNI1TuUn3U"
);

require_once('TwitterAPIExchange.php');

$url = "https://api.twitter.com/1.1/search/tweets.json";
 
$requestMethod = "GET";
 
$getfield = '?q=#' . $search;
$langlong = '38.825,-77.611';
$radius = ',1000mi';
$geocode = 'geocode=' . $langlong . $radius;
$count = 'count=1';
$getfield .= '&' . $geocode . '&' . $count;

$twitter = new TwitterAPIExchange($settings);
echo json_encode($twitter->setGetfield($getfield)
             ->buildOauth($url, $requestMethod)
             ->performRequest());
?>