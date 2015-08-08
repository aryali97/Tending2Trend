<?php
/** Set access tokens here - see: https://dev.twitter.com/apps/ **/
$settings = array(
    'oauth_access_token' => "895890626-EBKN7DgWCMNoWQCUDwUPTL4ZIQDtztcs4P7S95ff",
    'oauth_access_token_secret' => "DhCpuL5e6eAADunFshqMs45hSe3icxFLSoRYqqMi8BFGg",
    'consumer_key' => "QTe03opZ9XcXsLwj55BRXb4qx",
    'consumer_secret' => "wRWOKG7ofG4604cgg0uTVOSdmWuVu4lL8AMCEdq3XNI1TuUn3U"
);

require_once('TwitterAPIExchange.php');
 
$url = "https://api.twitter.com/1.1/statuses/user_timeline.json";
 
$requestMethod = "GET";
 
$getfield = '?screen_name=iagdotme&count=20';
 
$twitter = new TwitterAPIExchange($settings);
echo $twitter->setGetfield($getfield)
             ->buildOauth($url, $requestMethod)
             ->performRequest();
?>