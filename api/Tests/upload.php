<?php

?>
<html>
    <body>
        New Post<br/>
        <form method='post' enctype="multipart/form-data" action="../v1/candidate/new"> 
            Heading:<input type="text" name='name'/><br/>
            Desc: <textarea name="desc">desc</textarea><br/>
            Document:<input type="text" name='type'/><br/>
            Document:<input type="text" name='post'/><br/>
            thumb:<input type="file" name='thumb_img'/><br/>

            <input type="submit" />
        </form> 
        Post Editing<br/>
         <form method='post' enctype="multipart/form-data" action="/apis/api/v1/post/post_142/edit"> 
            Heading:<input type="text" name='code'/><br/>
            Desc: <textarea name="desc">desc</textarea><br/>
            Document:<input type="file" name='doc_pdf'/><br/>
            thumb:<input type="file" name='thumb_img'/><br/>

            year:<input type="text" name='year'/><br/>
            <input type="submit" />
        </form> 
    </body>
</html>
