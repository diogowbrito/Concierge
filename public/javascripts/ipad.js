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
    return $.ajax({
        type: "GET",
        url: url,
        dataType: "xml",
        success: parse
    });
}

function getWarning(url, id) {

    var warning;
    $.get(
            url,
            function(data) {
                warning = $(data).find("status").text();

                if (warning == "sucess") warning = "O recurso foi enviado com sucesso para a sua caixa de correio.";
                if (warning == "fail_logged") warning = "Necessita de estar logado para utilizar esta funcionalidade.";
                if (warning == "fail_simple") warning = "Não conseguimos enviar o recurso.";
                var par = $("#" + id + "warning");
                par.html(warning);

            },
            "xml"
            );

}

function getLike(url, id) {

    var warning;
    $.get(
            url,
            function(data) {
                warning = $(data).find("status").text();

                if (warning == "sucess") warning = "Obrigado pelo seu voto!";
                if (warning == "already_vote") warning = "Já votou num recurso deste serviço. Obrigado.";
                if (warning == "fail_simple") warning = "Não conseguimos enviar o recurso.";
                var par = $("#" + id + "warning");
                par.html(warning);
            },
            "xml"
            );

}

function getFavourite(url, id) {

    var warning;
    $.get(
            url,
            function(data) {
                warning = $(data).find("status").text();

                if (warning == "sucess") warning = "O recurso foi adicionado com sucesso aos favoritos.";
                if (warning == "already_favorite") warning = "Já adicionou este recurso como favorito.";
                if (warning == "fail_logged") warning = "Necessita de estar logado para utilizar esta funcionalidade.";
                if (warning == "fail_simple") warning = "Não conseguimos enviar o recurso.";
                var par = $("#" + id + "warning");
                par.html(warning);

            },
            "xml"
            );

}

function createPage(id, logged) {

    var page = $('<div>').attr("data-role", "page").attr("id", id).attr("data-url", id).attr("data-position", "inline").attr("data-theme", "a");
    var url = "http://" + document.domain + ":" + location.port + "/";
    var log;
    <!-- Draw Header-->
    if (logged == 'true')
        log = "<a id='login' href='" + url + "logout' class='ui-btn-right' data-icon='gear'>Logout</a>";
    else log = "<a href='" + url + "login' class='ui-btn-right' data-icon='gear'>Login</a>";
    var headerbody = log +
            "<h1 id='logo' class='ui-title link_to_homepage'>Concierge</h1>";

    var header = $('<div>').attr("data-role", "header").attr("data-position", "fixed").append(headerbody);
    <!-- Draw Search-->
    var searchformbody = $('<input>').attr("type", "search").attr("id", "search").attr("value", "").attr("width", "100%");
    var searchform = $('<form>').attr("id", "search_form").append(searchformbody);
    var search = $('<div>').attr("data-role", "footer").attr("data-role", "fieldcontain").attr("width", "100%").attr("class", "hidden_search").attr("style", "text-align:center; visibility:hidden").append(searchform);

    <!-- Draw Content-->
    var content = $('<div>').attr("data-role", "content");

    <!-- Draw Footer nav bar-->

    var hometab = $("<li>").append("<a class='link_to_homepage' data-icon='home' href=''>Home</a>");
    var historytab = $("<li>").append("<a class='parse link_to_history' href='" + url + "history' data-icon='grid'>History</a>");
    var favouritestab = $("<li>").append("<a class='parse link_to_favourites' href='" + url + "favourites' data-icon='star'>Favourites</a>");

    //  var searchtab = $("<li>").attr("id", "tab_bar_search").attr("style", "width:50%").append("<a href='' data-icon='search'>Search</a>");
    var optionstab = $("<li>").append("<a href='options' data-icon='gear'>Options</a>");
    var navbarul;

    if (logged == 'true') {
        navbarul = $("<ul>").append(hometab).append(historytab).append(favouritestab).append(optionstab);
    }
    else {
        navbarul = $("<ul>").append(hometab).append(historytab);
    }

    var navbar = $("<div>").attr("data-role", "navbar").append(navbarul);

    <!-- Draw footer and append nav bar-->
    var footer = $('<div>').attr("data-role", "footer").attr("data-id", "navbar").append(navbar);


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
                        list = pageWritable.append("<ul data-role='listview' data-inset='true' data-theme='c' data-dividertheme='d'></ul>").find('ul');
                    }
                    else {
                        titleold = $(this).attr('title');
                        title = replaceAll(titleold, " ", "_");
                        var html = '<li data-role="list-divider">' + titleold + '</li>';

                        $(this).children().each(function(index, element) {
                            text = $(this).text();
                            if (element.nodeName == 'entity') {
                                attr = $(this).attr('href');
                                ctitle = $(this).attr('title');
                                if (ctitle != undefined)
                                    html += '<li data-theme="d"><p>' + ctitle + '</p><a class="parse" href="' + attr + '" >' + text + '</a></li>';
                                else
                                    html += '<li data-theme="d"><a class="parse" href="' + attr + '" >' + text + '</a></li>';
                            }
                            else if (element.nodeName == 'text') {
                                ctitle = $(this).attr('title');
                                if (ctitle != undefined)
                                    html += '<li data-theme="d"><p>' + ctitle + '</p>' + text + '</li>';
                                else
                                    html += '<li data-theme="d">' + text + '</li>';
                            }
                            else if (element.nodeName == 'email') {
                                attr = $(this).attr('href');
                                ctitle = $(this).attr('title');
                                if (ctitle != undefined)
                                    html += '<li data-theme="d"><p>' + ctitle + '</p><a class="parse" href="' + attr + '" >' + text + '</a></li>';
                                else
                                    html += '<li data-theme="d"><a class="parse" href="' + attr + '" >' + text + '</a></li>';
                            }
                            else if (element.nodeName == 'link') {
                                attr = $(this).attr('href');
                                ctitle = $(this).attr('title');
                                if (ctitle != undefined)
                                    html += '<li data-theme="d"><p>' + ctitle + '</p><a class="parse" href="' + attr + '" >' + text + '</a></li>';
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
                    html = '<li data-role="list-divider">';

                    if (titleList != undefined)
                        html += titleList;

                    html += '</li>';

                    $(this).children().each(function() {
                        var href = $(this).attr('href');
                        var title = $(this).attr('title');
                        var href_img = $(this).children().attr('src');
                        var size_img = $(this).children().attr('size');
                        html += '<li data-theme="c"><a class="parse" href="' + href + '">' +
                                '<img src="' + href_img + '" size="' + size_img + '" />' + title + '</a></li>';

                    });

                    list.append(html);
                    break;
            }
        });
    });

    if ($(xml).find("search").text() != "") {

        var search = $("<input>").attr("type", "search").attr("id", "homepage" + bla + "_service_search").attr("data-theme", "c");
        var divdatarole = $('<div>').attr("data-role", "fieldcontain").append(search);

        var serviceSearchForm = $("<form>").attr("id", "homepage" + bla + "_service_search_form").append(divdatarole);
        pageWritable.append(serviceSearchForm);


        var homeUrl = document.location;
        page.find(':jqmData(role="header")').append("<a href='' class='ui-btn-left link_to_homepage' data-icon='arrow-l'>Back</a>");

        page.page();

        $.mobile.pageContainer.append(page);


        <!-- Add the search listener -->
        callServiceLive("homepage" + bla, $(xml).find("search").text());

    }

    else {

        var homeUrl = document.location;
        page.find(':jqmData(role="header")').append("<a href='' class='ui-btn-left link_to_homepage' data-icon='arrow-l'>Back</a>");

        page.page();

        $.mobile.pageContainer.append(page);

    }

    $.mobile.changePage("#" + page.attr("id"));

}

function parseList(xml) {

    var logged;
    $(xml).find("list").each(function() {
        logged = $(this).attr('logged');
    });

    var pageRandomId = Math.floor(1000 * (Math.random() % 1));

    var page = createPage("list" + pageRandomId, logged);
    page.attr("class", "list_page");

    var pageWritable = $("[data-role=content]", page.get(0));


    var next_url;
    var listTitle;

    $(xml).find("list").each(function() {
        next_url = $(this).attr('next');
        listTitle = $(this).attr('title');
        pageWritable.append("<p>" + listTitle + "</p>");
        var list = pageWritable.append('<ul class="list_class" data-role="listview" data-inset="false" data-theme="c" data-dividertheme="d"></ul>').find('ul');

        $(this).find("item").each(function() {
            var attr = $(this).attr('href');
            title = $(this).attr('title');
            var opt = $(this).attr('option');
            if (attr != undefined) {
                if (title != undefined) {
                    list.append('<li data-role="list-divider">' + $(this).attr("title") + '</li>');
                    list.append("<li>" + "<a class='parse' href=" + $(this).attr('href') + ">" + $(this).text() + " </a></li>");
                }
                else
                if (opt != undefined)
                    list.append("<li data-icon='delete'>" + "<a class='parse' href=" + $(this).attr('href') + ">" + $(this).text() + "</a></li>");
                else
                    list.append('<li>' + "<a data-panel='main' class='parse' href='" + $(this).attr('href') + "'>" + $(this).text() + "</a></li>");
            }
            else {
                if (title != undefined) {
                    list.append('<li data-role="list-divider">' + $(this).attr("title") + '</li>');
                    list.append('<li data-theme="d">' + $(this).text() + '</li>');
                }
                else
                    list.append("<li data-theme='d'>" + $(this).text() + "</li>");
            }

        });
    });


    if (listTitle == "Histórico") {
        page.find('.link_to_history').addClass('ui-btn-active');
        page.find(':jqmData(role="header")').append("<a href='' class='ui-btn-left link_back' data-icon='arrow-l'>Back</a>");
    } else if (listTitle == "Favoritos") {
        page.find('.link_to_favourites').addClass('ui-btn-active');
        page.find(':jqmData(role="header")').append("<a href='' class='ui-btn-left link_back' data-icon='arrow-l'>Back</a>");
    }


    page.page();


    $.mobile.pageContainer.append(page);

    <!-- Add the search listener -->


    $.mobile.changePage("#" + page.attr("id"));

    $(".list_class").data("next_url", next_url);
}


$(document).ready(function() {
    $("#web_homepage").find("#home_searchform").parent().parent().parent().find('.home_btn').addClass('ui-btn-active');
    var pathname = window.location.pathname;
    if (pathname.indexOf('options') != -1) {
        $('.link_to_options').addClass('ui-btn-active');
    }
});

$('.link_back').live('click', function() {
    $("#web_homepage").find('.home_btn').addClass('ui-btn-active');
    $('.link_to_history').removeClass('ui-btn-active');
    $('.link_to_options').removeClass('ui-btn-active');
    history.back();
    return true;
});

$('.link_to_homepage').live('click', function() {
    $("#web_homepage").find('.home_btn').addClass('ui-btn-active');
    $('.link_to_history').removeClass('ui-btn-active');
    $.mobile.changePage('#web_homepage');
    return true;
});

var map = null;
var ctaLayer = null;
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
    var height = $(window).height();
    var width = $(window).width();

    pageWritable.append("<div id=" + mapId + " style='height:"+height+"px;width:"+width+"px;' class='map'></div>");


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

    var center = new google.maps.LatLng(38.660998431780286, -9.204448037385937);
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


    $.mobile.changePage("#" + page.attr("id"));


    map = new google.maps.Map(document.getElementById(mapId), myOptions);
    ctaLayer = new google.maps.KmlLayer(kmlUrl);
    ctaLayer.setMap(map);

    page.find('.ui-content').css({'padding':'0'});
}

$('div[data-role=page]').live('pagehide',function(event, ui){
    var page = $(this).find('div.map');
    if (page.length != 0) {
        map = null;
    }

});



function parseRecord(xml) {

    var logged;
    $(xml).find("record").each(function() {
        logged = $(this).attr('logged');
    });

    var pageRandomId = Math.floor(1000 * (Math.random() % 1));
    var page = createPage("record" + pageRandomId, logged);
    var pageWritable = $("[data-role=content]", page.get(0));
    var titleold;
    var recordtitle = $(xml).find("record").attr('title');
    var recordurl = $(xml).find("record").attr('url');
    pageWritable.append("<p>" + recordtitle + "</p>");

    var list = pageWritable.append("<ul data-role='listview' data-inset='true' data-theme='d' data-dividertheme='d'></ul>").find('ul');

    $(xml).find("record").children().each(function(index, element) {
        var text;
        var title;
        var label;
        switch (element.nodeName) {
            case 'text':
                if ($(this).children().size() == 0) {
                    text = $(this).text();
                    title = $(this).attr('title');
                    label = $(this).attr('label');
                    if (title == undefined && label != undefined) {
                        title = label;
                    }
                    if (title == undefined) {
                        list.append('<li data-role="list-divider">' + text + '</li>');
                    }
                    else {
                        list.append('<li data-role="list-divider">' + title + '</li>');
                        list.append('<li data-theme="d">' + text + '</li>');
                    }
                }
                else {
                    titleold = $(this).attr('title');
                    title = replaceAll(titleold, " ", "_");
                    var html = '<li data-role="list-divider">' + titleold + '</li>';

                    $(this).children().each(function(index, element) {

                        text = $(this).text();
                        if (element.nodeName == 'entity') {
                            attr = $(this).attr('href');
                            html += '<li data-theme="d"><a class="parse" href="' + attr + '" >' + text + '</a></li>';
                        }
                        else if (element.nodeName == 'text') {
                            html += '<li data-theme="d">' + text + '</li>';
                        }
                        else if (element.nodeName == 'email') {
                            text = $(this).text();
                            title = $(this).attr('title');
                            if (title != undefined) {
                                html += '<li>' + title + '</li>';
                                html += '<li data-theme="d"><a href="mailto:' + text + '" >' + text + '</a></li>';
                            }
                            else
                                html += '<li data-theme="d"><a href="mailto:' + text + '" >' + text + '</a></li>';
                        }
                        else if (element.nodeName == 'link') {
                            attr = $(this).attr('href');
                            html += '<li data-theme="d"><a class="parse" href="' + attr + '" >' + text + '</a></li>';
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
                    list.append('<li data-theme="c"><a class="parse" href="' + attr + '">' + text + '</a></li>');
                else {
                    list.append('<li data-role="list-divider">' + title + '</li>');
                    list.append('<li data-theme="d"><a class="parse" href="' + attr + '">' + text + '</a></li>');
                }
                break;

            case 'email':
                text = $(this).text();
                title = $(this).attr('title');
                if (title == undefined)
                    list.append('<li data-theme="c"><a href="mailto:' + text + '" >' + text + '</a></li>');
                else {
                    list.append('<li data-role="list-divider">' + title + '</li>');
                    list.append('<li data-theme="d"><a href="mailto:' + text + '" >' + text + '</a></li>');
                }
                break;
            case 'link':
                text = $(this).text();
                attr = $(this).attr('href');
                title = $(this).attr('title');
                if (title == undefined)
                    list.append('<li data-theme="c"><a class="parse" href="' + attr + '">' + text + '</a></li>');
                else {
                    list.append('<li data-role="list-divider">' + title + '</li>');
                    list.append('<li data-theme="d"><a class="parse" href="' + attr + '">' + text + '</a></li>');
                }
                break;
            case 'external_link':
                text = $(this).text();
                attr = $(this).attr('href');
                title = $(this).attr('title');
                if (title == undefined)
                    list.append('<li data-theme="c"><a class="external_link" target="_blank" href="' + attr + '">' + text + '</a></li>');
                else {
                    list.append('<li data-role="list-divider">' + title + '</li>');
                    list.append('<li data-theme="d"><a class="external_link" target="_blank" href="' + attr + '">' + text + '</a></li>');
                }
                break;
            case 'date':
                text = $(this).text();
                label = $(this).attr('label');
                list.append('<li data-role="list-divider">' + label + '</li>');
                list.append('<li data-theme="d">' + text + '</li>');
                break;

        }
    });

    var url = "http://" + document.domain + ":" + location.port + "/";
    var sendurl = url + "sendresource?url=" + recordurl;
    var voteurl = url + "rateservice?url=" + recordurl;
    var favouriteurl = url + "addfavourite?url=" + recordurl + "&title=" + recordtitle;
    var mail_button = "<a class='warning' href='" + sendurl + "' pageid='" + page.attr("id") + "'><img src='/images/buttons/mailicon3.png'/></a>" +
            "<a class='like' href='" + voteurl + "' pageid='" + page.attr("id") + "'><img src='/images/buttons/like.png'/></a>"
            + "<a class='favourite' href='" + favouriteurl + "' pageid='" + page.attr("id") + "'><img src='/images/buttons/favourite.png'/></a>";
    var paragraph = "<p id='" + page.attr("id") + "warning'></p>";
    pageWritable.append(mail_button).append(paragraph);

    page.page();
    $.mobile.pageContainer.append(page);

    <!-- Add the search listener -->

    $.mobile.changePage("#" + page.attr("id"));
}

$(".list_page").live('pageshow', function() {
    scroll();
});

$(".list_page").live('pagebeforehide', function() {
    $(document).unbind('scrollstop');
});

function scroll() {
    $(document).unbind('scrollstop');
    $(document).bind('scrollstop', function() {
        var x = $('body').height() + $(document).scrollTop();
        var y = $(document).height();
        if (x >= y) {
            next();
        }
    });
}

function next() {
    if ($(".list_class").data('next_url') != "") {
        $.ajax({
            type: "GET",
            url: $(".list_class").data("next_url"),
            dataType: "xml",
            success: moreList
        });
    }
}

function moreList(xml) {
    var next_url;
    $(xml).find("list").each(function() {
        next_url = $(this).attr('next');
        $(this).find("item").each(function() {
            var attr = $(this).attr('href');
            var title = $(this).attr('title');
            if (attr != undefined) {
                if (title != undefined) {
                    $("ul.list_class", $(".ui-page-active :jqmData(role='content')")).append('<li data-role="list-divider">' + $(this).attr("title") + '</li>');
                    $("ul.list_class", $(".ui-page-active :jqmData(role='content')")).append("<li>" + "<a class='parse' href=" + $(this).attr('href') + ">" + $(this).text() + " </a></li>");
                }
                else
                    $("ul.list_class", $(".ui-page-active :jqmData(role='content')")).append("<li>" + "<a class='parse' href=" + $(this).attr('href') + ">" + $(this).text() + "</a></li>");
            }
            else {
                if (title != undefined) {
                    $("ul.list_class", $(".ui-page-active :jqmData(role='content')")).append('<li data-role="list-divider">' + $(this).attr("title") + '</li>');
                    $("ul.list_class", $(".ui-page-active :jqmData(role='content')")).append("<li class='parse'>" + $(this).text() + "</li>");
                }
                else
                    $("ul.list_class", $(".ui-page-active :jqmData(role='content')")).append("<li class='parse'>" + $(this).text() + "</li>");
            }

        });
    });

    $(".list_class").data("next_url", next_url);
    $('ul:first', $('.ui-page-active')).listview('refresh');
}

$('#serviceLink').live('click', function(   ) {
    getHomepage($(this).attr('href'));
});

$('.parse').live('click', function(event) {
    event.stopPropagation();
    event.preventDefault();
    $.mobile.pageLoading();
    getParse($(this).attr('href')).error();
    $.mobile.ajaxEnabled = false;
});

$('.warning').live('click', function(event) {
    event.stopPropagation();
    event.preventDefault();
    getWarning($(this).attr('href'), $(this).attr('pageid'));
    $.mobile.ajaxEnabled = false;
});

$('.like').live('click', function(event) {
    event.stopPropagation();
    event.preventDefault();
    getLike($(this).attr('href'), $(this).attr('pageid'));
    $.mobile.ajaxEnabled = false;
});

$('.favourite').live('click', function(event) {
    event.stopPropagation();
    event.preventDefault();
    getFavourite($(this).attr('href'), $(this).attr('pageid'));
    $.mobile.ajaxEnabled = false;
});

<!-- Pages scripts-->

$("#home_searchform").live('submit', function() {
    var searched = $(this).find('#search').val();
    searched = replaceAll(searched, " ", "+");
    var url = "http://" + document.domain + ":" + location.port + "/" + "search?keyword=" + searched;
    getParse(url);
    $.mobile.ajaxEnabled = false;
    return false;
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

    var page = $("#" + pageIdentification);

    var searchForm = page.find("#" + pageIdentification + "_service_search_form");

    searchForm.live('submit', function() {
        var searched = page.find("#" + pageIdentification + "_service_search").val();
        searched = replaceAll(searched, " ", "+");
        var url = searchLink + searched;
        getParse(url);
        $.mobile.ajaxEnabled = false;
        return false;
    });
}


