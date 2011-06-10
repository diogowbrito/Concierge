// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

function getHomepage(url) {

    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: url,
            dataType: "xml",
            success: parseHomepage
        });
    });

}

function getParse(url) {
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: url,
            dataType: "xml",
            success: parse
        });
    });
}

function getWarning(url, id) {

    var warning;
    $.get(
    url,
    function(data) {
        warning = $(data).find("status").text();
        var page = $('#'+id);
        var pageWritable = $("[data-role=content]", page.get(0));

        if(warning == "sucess") warning = "O recurso foi enviado com sucesso para a sua caixa de correio";
        if(warning == "fail_logged") warning = "Faça login para realizar esta acção";
        if(warning == "fail_simple") warning = "Não conseguimos enviar o recurso";
        pageWritable.append("<p>" + warning + "</p>");
    },
    "xml"
    );

}

function createPage(id, logged) {

    var page = $('<div>').attr("data-role", "page").attr("id", id).attr("data-url", id).attr("data-position", "inline").attr("data-theme","a");
    var url = "http://" + document.domain + ":" + location.port + "/";
    var log;
    <!-- Draw Header-->
    if(logged=='true')
       log = "<a id='login' href='" + url + "logout' class='ui-btn-right' data-icon='gear'>Logout</a>";
    else log = "<a href='" + url + "login' class='ui-btn-right' data-icon='gear'>Login</a>";
    var headerbody = log +
            "<h1 id='logo' class='ui-title'>Concierge</h1>";

    var header = $('<div>').attr("data-role", "header").attr("data-position", "fixed").append(headerbody);
    <!-- Draw Search-->
    var searchformbody = $('<input>').attr("type", "search").attr("id", "search").attr("value", "").attr("width", "100%");
    var searchform = $('<form>').attr("id", "search_form").append(searchformbody);
    var search = $('<div>').attr("data-role", "footer").attr("data-role", "fieldcontain").attr("width", "100%").attr("class", "hidden_search").attr("style", "text-align:center; visibility:hidden").append(searchform);

    <!-- Draw Content-->
    var content = $('<div>').attr("data-role", "content");

    <!-- Draw Footer nav bar-->

    var historytab = $("<li>").attr("style", "width:25%").append("<a class='parse' href='" + url + "history' data-icon='grid'>History</a>");
    var searchtab = $("<li>").attr("id", "tab_bar_search").attr("style", "width:50%").append("<a href='' data-icon='search'>Search</a>");
    var optionstab = $("<li>").attr("style", "width:25%").append("<a href='options' data-icon='gear'>Options</a>");
    var navbarul = $("<ul>").append(historytab).append(searchtab).append(optionstab);
    var navbar = $("<div>").attr("data-role", "navbar").append(navbarul);

    <!-- Draw footer and append nav bar-->
    var footer = $('<div>').attr("data-role", "footer").attr("data-id", "navbar").attr("data-position", "fixed").append(navbar);


    <!-- Draw the final page-->
    var finalpage = page.append(header).append(content).append(search).append(footer);


    return $(finalpage)
}


function parse(xml) {

    if ($(xml).find("list").length != 0) {
        parseList(xml);
    }

    if ($(xml).find("record").length != 0) {
        parseRecord(xml);
    }

     if ($(xml).find("map").length != 0) {
        parseMap(xml);
    }
}

function parseHomepage(xml) {
    var logged;
    $(xml).find("record").each(function() {
        logged = $(this).attr('logged');
    });

    var bla = Math.floor(1000 * (Math.random() % 1));
    var page = createPage("homepage" + bla, logged);
    var pageWritable = $("[data-role=content]", page.get(0));
    var list;
    var titleold;
    var title;


    $(xml).find("record").each(function() {
        pageWritable.append("<p>" + $(this).attr('title') + "</p>");
        $(this).children().each(function(index, element) {
            switch (element.nodeName) {
                case 'text':
                    if ($(this).children().size() == 0) {
                        pageWritable.append("<p>" + $(this).text() + "</p>");
                        list = pageWritable.append("<ul data-role='listview' data-inset='true' data-theme='c'></ul>").find('ul');
                    }
                    else {
                        titleold = $(this).attr('title');
                        title = replaceAll(titleold, " ", "_");
                        var html = '<li class="slide" title="' + title + '">';

                        if (title != undefined)
                            html += '<a href="">' + titleold + '</a>';

                        html += '</li>';

                        $(this).children().each(function(index, element) {
                            text = $(this).text();
                            if (element.nodeName == 'entity') {
                                attr = $(this).attr('href');
                                ctitle = $(this).attr('title');
                                if (ctitle != undefined)
                                    html += '<li data-theme="d"><p>'+ctitle+'</p><a class="parse" href="' + attr + '" >' + text + '</a></li>';
                                else
                                    html += '<li data-theme="d"><a class="parse" href="' + attr + '" >' + text + '</a></li>';
                            }
                            else if (element.nodeName == 'text') {
                                ctitle = $(this).attr('title');
                                if (ctitle != undefined)
                                    html += '<li data-theme="d"><p>'+ctitle+'</p>' + text + '</li>';
                                else
                                    html += '<li data-theme="d">' + text + '</li>';
                            }
                            else if (element.nodeName == 'email') {
                                attr = $(this).attr('href');
                                ctitle = $(this).attr('title');
                                if (ctitle != undefined)
                                    html += '<li data-theme="d"><p>'+ctitle+'</p><a class="parse" href="' + attr + '" >' + text + '</a></li>';
                                else
                                    html += '<li data-theme="d"><a class="parse" href="' + attr + '" >' + text + '</a></li>';
                            }
                            else if (element.nodeName == 'link') {
                                attr = $(this).attr('href');
                                ctitle = $(this).attr('title');
                                if (ctitle != undefined)
                                    html += '<li data-theme="d"><p>'+ctitle+'</p><a class="parse" href="' + attr + '" >' + text + '</a></li>';
                                else
                                    html += '<li data-theme="d"><a class="parse" href="' + attr + '" >' + text + '</a></li>';
                            }

                        });

                        list.append(html);
                    }
                    break;
                case 'link':
                    list.append('<li><a class="parse" href="' + $(this).attr('href') + '">' + $(this).text() + '</a></li>');
                    break;
                case 'list':
                        var titleList = $(this).attr('title');
                        html = '<li title="' + titleList + '">';

                        if (titleList != undefined)
                            html += '<a href="">' + titleList + '</a>';

                        html += '</li>';

                        $(this).children().each(function() {
                            var href = $(this).attr('href');
                            var title = $(this).attr('title');
                            var href_img = $(this).children().attr('href');
                            var size_img = $(this).children().attr('size');
                            html += '<li data-theme="c"><a class="parse" href="'+href+'">' +
                                    '<img src="'+href_img+'" size="'+size_img+'" />'+title+'</a></li>';

                        });

                        list.append(html);
                    break;
            }
        });
    });

    if($(xml).find("search").text() != "") {

    var search = $("<input>").attr("type", "search").attr("id", "homepage" + bla + "_service_search");
    var divdatarole =  $('<div>').attr("data-role", "fieldcontain").append(search);

    var serviceSearchForm = $("<form>").attr("id", "homepage" + bla + "_service_search_form").append(divdatarole);
          pageWritable.append(serviceSearchForm);


    var homeUrl = document.location;
    page.find(':jqmData(role="header")').append("<a href="+homeUrl+" class='ui-btn-left' data-icon='arrow-l'>Back</a>");

    page.page();

    $.mobile.pageContainer.append(page);



    <!-- Add the search listener -->
    callServiceLive("homepage" + bla, $(xml).find("search").text());
    callLive("homepage" + bla);

    }

    else {

    var homeUrl = document.location;
    page.find(':jqmData(role="header")').append("<a href="+homeUrl+" class='ui-btn-left' data-icon='arrow-l'>Back</a>");

    page.page();

    $.mobile.pageContainer.append(page);

    }

    $.mobile.changePage("#" + page.attr("id"));

}

function parseList(xml){

    var logged;
    $(xml).find("list").each(function() {
        logged = $(this).attr('logged');
    });

    var pageRandomId = Math.floor(1000 * (Math.random() % 1));

    var page = createPage("list" + pageRandomId, logged);
    var pageWritable = $("[data-role=content]", page.get(0));
    var next_url;

        $(xml).find("list").each(function() {
            next_url = $(this).attr('next');
            pageWritable.append("<p>" + $(this).attr('title') + "</p>");
            var list = pageWritable.append('<ul data-role="listview" data-inset="true" data-theme="c"></ul>').find('ul');

            $(this).find("item").each(function() {
                var attr = $(this).attr('href');
                var title = $(this).attr('title');
                if (attr != undefined) {
                    if (title != undefined)
                        list.append("<li>" + "<a class='parse' href=" + $(this).attr('href') + "><p>" + $(this).attr("title") + " </p>" + $(this).text() +" </a></li>");
                    else
                        list.append("<li>" + "<a class='parse' href=" + $(this).attr('href') + ">" + $(this).text() +"</a></li>");
                }
                else {
                    if (title != undefined)
                        list.append("<li class='parse'><p>" + $(this).attr("title") + "</p>" + $(this).text() + "</li>");
                    else
                        list.append("<li class='parse'>" + $(this).text() + "</li>");
                }

            });
            pageWritable.append('<a class="next">next</a>');
        });
     page.page();


    $.mobile.pageContainer.append(page);

    <!-- Add the search listener -->
    callLive("list" + pageRandomId);


    $.mobile.changePage("#" + page.attr("id"));

//    $("ul").append('<li class="tttt"></li>');
    $(".next").data("teste", next_url);
}

function parseMap(xml) {
    var logged;
    $(xml).find("map").each(function() {
        logged = $(this).attr('logged');
    });

    var pageRandomId = Math.floor(1000 * (Math.random() % 1));
    var page = createPage("map" + pageRandomId, logged);

    var pageWritable = $("[data-role=content]", page.get(0));
    var title = $(xml).find("map").attr('title');
                           var mapId = "map_canvas" + pageRandomId;
    pageWritable.append("<div id="+mapId+" style='height:380px;width:520px;'></div>");


    $(xml).find("map").children().each(function(index, element) {
        switch (element.nodeName) {
            case 'link':
                kmlUrl = $(this).attr("href");
             break;
        }
    });

  //  page.find(':jqmData(role="content")').css({'padding' : ''});


    page.page();
    $.mobile.pageContainer.append(page);

        var center = new google.maps.LatLng(38.660998431780286, -9.204448037385937) ;
        var myOptions = {
            zoom: 15,
            center: center,
            panControl : false,
            zoomControl : false,
            mapTypeControl : false,
            scaleControl : false,
            streetViewControl : false,
            overviewMapControl : false,
            mapTypeId: google.maps.MapTypeId.SATELLITE
        }

    var map = new google.maps.Map(document.getElementById(mapId), myOptions);
    var ctaLayer = new google.maps.KmlLayer(kmlUrl);
    ctaLayer.setMap(map);


    $.mobile.changePage("#" + page.attr("id"));
    page.find('.ui-content').css({'padding':'0'});
}

function parseRecord(xml) {

    console.log("parse record");
    var logged;
    $(xml).find("record").each(function() {
        logged = $(this).attr('logged');
    });

    var pageRandomId = Math.floor(1000 * (Math.random() % 1));
    var page = createPage("record" + pageRandomId, logged);
    var pageWritable = $("[data-role=content]", page.get(0));
    var titleold;
    var title = $(xml).find("record").attr('title');
    var recordurl = $(xml).find("record").attr('url');
    pageWritable.append("<p>" + title + "</p>");

    var list = pageWritable.append("<ul data-role='listview' data-inset='true' data-theme='d'></ul>").find('ul');

    $(xml).find("record").children().each(function(index, element) {
        var text;
        var title;
        switch (element.nodeName) {
            case 'text':
                if ($(this).children().size() == 0) {
                    text = $(this).text();
                    title = $(this).attr('title');
                    if (title == undefined)
                        list.append('<li>' + text + '</li>');
                    else
                        list.append('<li><p>' + title + '</p>' + text + '</li>');
                }
                else {
                    titleold = $(this).attr('title');
                    title = replaceAll(titleold, " ", "_");
                    var html = '<li class="slide activeZero 0" title="' + title + '">';
                    if (title != undefined)
                        html += '<a href="">' + titleold + '</a>';

                    $(this).children().each(function(index, element) {

                        text = $(this).text();
                        if (element.nodeName == 'entity') {
                            attr = $(this).attr('href');
                            html += '<li class="slide_items ' + title + '"><a class="parse" href="' + attr + '" >' + text + '</a></li>';
                        }
                        else if (element.nodeName == 'text') {
                            html += '<li class="slide_items ' + title + '">' + text + '</li>';
                        }
                        else if (element.nodeName == 'email') {
                            attr = $(this).attr('href');
                            html += '<li class="slide_items ' + title + '"><a href="mailto:' + text + '" >' + text + '</a></li>';
                        }
                        else if (element.nodeName == 'link') {
                            attr = $(this).attr('href');
                            html += '<li class="slide_items ' + title + '"><a href="mailto:' + text + '" >' + text + '</a></li>';
                        }

                    });
                    html += '</li>';
                    list.append(html);
                }
                break;

            case 'entity':
                text = $(this).text();
                title = $(this).attr('title');
                var attr = $(this).attr('href');
                if (title == undefined)
                    list.append('<li><a class="parse" href="' + attr + '">' + text + '</a></li>');
                else
                    list.append('<li><a class="parse" href="' + attr + '"><p>' + title + '</p>' + text + '</a></li>');
                break;

            case 'email':
                text = $(this).text();
                title = $(this).attr('title');
                if (title == undefined)
                    list.append('<li><a class="email" href="' + attr + '">' + text + '</a></li>');
                else
                    list.append('<li><a class="email" href="' + attr + '"><p>' + title + '</p>' + text + '</a></li>');
                break;
            case 'link':
                text = $(this).text();
                attr = $(this).attr('href');
                title = $(this).attr('title');
                if (title == undefined)
                    list.append('<li><a class="parse" href="' + attr + '">' + text + '</a></li>');
                else
                    list.append('<li><a class="parse" href="' + attr + '"><p>' + title + '</p>' + text + '</a></li>');
                break;
            case 'external_link':
                text = $(this).text();
                attr = $(this).attr('href');
                title = $(this).attr('title');
                if (title == undefined)
                    list.append('<li><a class="external_link" target="_blank" href="' + attr + '">' + text + '</a></li>');
                else
                    list.append('<li><a class="external_link" target="_blank" href="' + attr + '"><p>' + title + '</p>' + text + '</a></li>');
                break;

        }
    });

    var url = "http://" + document.domain + ":" + location.port + "/";
    var sendurl = url+"sendresource?url="+recordurl;
    var mail_button = "<a class='warning' href='"+sendurl+"' pageid='"+page.attr("id")+"'><img src='/images/buttons/mail2.png'/></a><a class='like' href='"+sendurl+"' pageid='"+page.attr("id")+"'><img src='/images/buttons/like.png'/></a>";
    pageWritable.append(mail_button);

    page.page();
    $.mobile.pageContainer.append(page);

     <!-- Add the search listener -->
    callLive("record" + pageRandomId);

    $.mobile.changePage("#" + page.attr("id"));
    $(".slide_items").hide();
}

$(".next").live('click', function(){
     $.ajax({
            type: "GET",
            url: $(this).data("teste"),
            dataType: "xml",
            success: moreList
        });
});

function moreList(xml){
         var next_url;
         $(xml).find("list").each(function() {
            next_url = $(this).attr('next');

            $(this).find("item").each(function() {
                var attr = $(this).attr('href');
                var title = $(this).attr('title');
                if (attr != undefined) {
                    if (title != undefined)
                        $("ul").append("<li>" + "<a class='parse' href=" + $(this).attr('href') + "><p>" + $(this).attr("title") + " </p>" + $(this).text() +" </a></li>");
                    else
                        $("ul").append("<li>" + "<a class='parse' href=" + $(this).attr('href') + ">" + $(this).text() +"</a></li>");
                }
                else {
                    if (title != undefined)
                        $("ul").append("<li class='parse'><p>" + $(this).attr("title") + "</p>" + $(this).text() + "</li>");
                    else
                        $("ul").append("<li class='parse'>" + $(this).text() + "</li>");
                }

            });
        });

    $(".next").data("teste", next_url);
}

$('#serviceLink').live('click', function() {
    getHomepage($(this).attr('href'));
});

$('.parse').live('click', function(event) {
    event.stopPropagation();
    event.preventDefault();
    $.mobile.pageLoading();
    getParse($(this).attr('href'));
    $.mobile.ajaxEnabled(false);
});

$('.warning').live('click', function(event) {
    event.stopPropagation();
    event.preventDefault();
    getWarning($(this).attr('href'), $(this).attr('pageid'));
    $.mobile.ajaxEnabled(false);
});

$('.slide').live('click', function() {

    var t = "." + $(this).attr("title");
    $(t).slideToggle("slow");

});

<!-- Pages scripts-->

$("#tab_bar_hp_search").live('click', function() {
    if ($(".hidden_home_search").css("visibility") == "hidden") {
        $(".hidden_home_search").hide().css({visibility: "visible"}).fadeIn("slow");
    } else {
        $(".hidden_home_search").fadeOut("slow", function() {
            $(this).show().css({visibility: "hidden"});
            $("#tab_bar_hp_search").find("a").removeClass("ui-btn-active");
        });
    }
});


$('#home_searchform').live('submit', function() {
    var searched = $('#search').val();
    searched = replaceAll(searched, " ", "+");

    $(".hidden_home_search").fadeOut("slow", function() {
        $(this).show().css({visibility: "hidden"});
        $("#tab_bar_hp_search").find("a").removeClass("ui-btn-active");

    });

    var url = document.location+"search?keyword=" + searched;
    getParse(url);

    return false;
});

$('.activeZero').live("click", function() {
    if ($(this).hasClass("0")) {
        $(this).removeClass("0");
    } else {
        $(this).removeClass("ui-btn-active");
        $(this).addClass("0");
    }
});

function logOut() {
    $.mobile.hashListeningEnabled(false);
}

$('#login').live('click', function() {
    logOut();
});

function replaceAll(string, token, newtoken) {
    while (string.indexOf(token) != -1) {
        string = string.replace(token, newtoken);
    }
    return string;
}

function callServiceLive(pageIdentification, searchLink) {

        var page = $("#"+pageIdentification);

        var searchForm = page.find("#"+pageIdentification + "_service_search_form");

        searchForm.live('submit', function() {


            var searched = page.find("#" + pageIdentification + "_service_search").val();

            searched = replaceAll(searched, " ", "+");

            var url = searchLink + searched;
            getParse(url);
            console.log(url);

        return false;
    });
}

function callLive(pageIdentification) {

    var page = $("#"+pageIdentification);
    var searchbar = page.find("#tab_bar_search");

    searchbar.live('click', function() {
        var navbardistancetotop = page.find('.ui-footer-fixed')[0].style.top.replace("px", "");
        var hidden_home_search = page.find(".hidden_search");

        if (hidden_home_search.css("visibility") == "hidden") {
            hidden_home_search.css('top', (navbardistancetotop - 100) + 'px');
            hidden_home_search.hide().css({visibility: "visible"}).fadeIn("slow");
        } else {
            hidden_home_search.fadeOut("slow", function() {
                $(this).show().css({visibility: "hidden"});
                $("#" + pageIdentification).find("#tab_bar_search").find("a").removeClass("ui-btn-active");
            });
        }
    });

    var searchForm = page.find("#search_form");
    searchForm.live('submit', function() {

        var searched = page.find('#search').val();
        searched = replaceAll(searched, " ", "+");

        page.find(".hidden_search").fadeOut("slow", function() {
            $(this).show().css({visibility: "hidden"});
            page.find("#tab_bar_hp_search").find("a").removeClass("ui-btn-active");
        });

        var url = "http://" + document.domain + ":" + location.port + "/" +"search?keyword=" + searched;
        getParse(url);

        return false;
    });

}