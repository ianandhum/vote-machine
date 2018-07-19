<?php
//should be updated sync

//DERPRECIATED::
//server host
define("SERVER_HOST","http://votehost.local/");

define("SERVER_HOME","http://votehost.local/api/");

define("SERVER","votehost.local");


//mysql host name
define("DB_HOST_NAME","localhost");

//mysql user name
define("USER_DB_USER_NAME","anandhu");

//mysql user password
define("USER_DB_USER_PASSWORD","1234");

/**
 * static declarations
 *Note if you dont know how to handle these macros be sure you leave it unchanged
 */
//token-identifiers
define("ACTIVE_USER_NAME_IDENTIFIER","user_name");

define("ACTIVE_USER_TOKEN_IDENTIFIER","user_id");

//max len 32
define("SESSVAR_LEN",5);



//userLevels

define("NAIVE_USER","PLVL01");

define("DATA_USER","PLVL02");

define("STD_USER","PLVL03");

define("ADVANCED_USER","PLVL04");

define("ADMIN_USER","PLVL05");

//data configurations

define("APP_NAME","Vote Machine 101");

define("DB_NAME","votter");

define("USER_DB_TABLE","tbl_users");

define("DATA_DB_TABLE","tbl_data");




//php files

define("FILE_PHP_CONFIG","config.php");
define("CLASS_PHP_USER","User.class.php");
define("FILE_PHP_CONSTCONFIG","constantConfig.php");
define("DIR_CONFIG","config/");

//asset storage
define("DIR_STORE","Storage");

define("DIR_THUMB","Storage/thumbnails");

//Application data

define("INIT_ID","1000");

define("CANDIDATE_PREFIX","_");

define("DEFAULT_THUMB","thumb_default.png");

define("STANDARDS","STD01,STD02,STD03,STD04,STD05,STD06,STD07,STD08,STD09,STD10,STD11,STD12");

?>
