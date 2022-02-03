$(window).scroll(function() {
    var scroll = $(window).scrollTop();
    var os = $('.section-title').first().offset().top;
    var ht = $('.section-title').height();
    if(scroll > 965){
        $('.section-title').addClass('changePos');
    }

});