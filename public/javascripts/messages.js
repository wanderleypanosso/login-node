(function(){
    $(document).ready(function(){
        $(".alert").each( function(index, element){
            $(this).delay((index + 1) * 100).queue(function(){
                $(this).addClass("in");
            });
        });
    });
})()
