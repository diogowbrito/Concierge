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
                if (warning == "fail_logged") warning = "Necessita de estar logado para utilizar esta competência.";
                if (warning == "fail_simple") warning = "Não conseguimos enviar o recurso.";
                var par = $("#"+id+"warning");
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
                var par = $("#"+id+"warning");
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
  //  var searchtab = $("<li>").attr("id", "tab_bar_search").attr("style", "width:50%").append("<a href='' data-icon='search'>Search</a>");
    var optionstab = $("<li>").append("<a href='options' data-icon='gear'>Options</a>");
    var navbarul = $("<ul>").append(hometab).append(historytab).append(optionstab);
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
                        list = pageWritable.append("<ul data-role='listview' data-inset='true' data-theme='d'></ul>").find('ul');
                    }
                    else {
                        titleold = $(this).attr('title');
                        title = replaceAll(titleold, " ", "_");
                        var html = '<li>';

                        if (title != undefined)
                            html += '<a href="">' + titleold + '</a>';

                        html += '</li>';

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
                    html = '<li title="' + titleList + '">';

                    if (titleList != undefined)
                        html += '<a href="">' + titleList + '</a>';

                    html += '</li>';

                    $(this).children().each(function() {
                        var href = $(this).attr('href');
                        var title = $(this).attr('title');
                        var href_img = $(this).children().attr('href');
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

        var search = $("<input>").attr("type", "search").attr("id", "homepage" + bla + "_service_search").attr("data-theme", "d");
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
        listTitle = $(this).attr('title')
        pageWritable.append("<p>" + listTitle + "</p>");
        var list = pageWritable.append('<ul class="list_class" data-role="listview" data-inset="false" data-theme="d"></ul>').find('ul');

        $(this).find("item").each(function() {
            var attr = $(this).attr('href');
            title = $(this).attr('title');

            if (attr != undefined) {
                if (title != undefined)
                    list.append("<li>" + "<a class='parse' href=" + $(this).attr('href') + "><p>" + $(this).attr("title") + " </p>" + $(this).text() + " </a></li>");
                else
                    list.append("<li>" + "<a class='parse' href=" + $(this).attr('href') + ">" + $(this).text() + "</a></li>");
            }
            else {
                if (title != undefined)
                    list.append("<li class='parse'><p>" + $(this).attr("title") + "</p>" + $(this).text() + "</li>");
                else
                    list.append("<li class='parse'>" + $(this).text() + "</li>");
            }

        });
    });


    if (listTitle == "Histórico") {
        page.find('.link_to_history').addClass('ui-btn-active');
        page.find(':jqmData(role="header")').append("<a href='' class='ui-btn-left link_back' data-icon='arrow-l'>Back</a>");
    }


    page.page();


    $.mobile.pageContainer.append(page);

    <!-- Add the search listener -->


    $.mobile.changePage("#" + page.attr("id"));

    $(".list_class").data("url", next_url);
}

$('.link_back').live('click', function() {
    history.back();


    $('.link_to_history').removeClass('ui-btn-active');
    return false;
});

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
    pageWritable.append("<div id=" + mapId + " style='height:380px;width:520px;'></div>");


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

    var list = pageWritable.append("<ul data-role='listview' data-inset='true' data-theme='c'></ul>").find('ul');

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
                    var html = '<li><h3>' + titleold + '</h3></li>';

                    $(this).children().each(function(index, element) {

                        text = $(this).text();
                        if (element.nodeName == 'entity') {
                            attr = $(this).attr('href');
                            html += '<li><a class="parse" href="' + attr + '" >' + text + '</a></li>';
                        }
                        else if (element.nodeName == 'text') {
                            html += '<li>' + text + '</li>';
                        }
                        else if (element.nodeName == 'email') {
                            attr = $(this).attr('href');
                            html += '<li><a href="mailto:' + text + '" >' + text + '</a></li>';
                        }
                        else if (element.nodeName == 'link') {
                            attr = $(this).attr('href');
                            html += '<li><a href="' + attr + '" >' + text + '</a></li>';
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
                    list.append('<li><a href="mailto:' + text + '" >' + text + '</a></li>');
                else
                    list.append('<li><a href="mailto:' + text + '" >' + text + '</a></li>');
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
    var sendurl = url + "sendresource?url=" + recordurl;
    var voteurl = url + "rateservice?url=" + recordurl;
    var mail_button = "<a class='warning' href='" + sendurl + "' pageid='" + page.attr("id") + "'><img src='/images/buttons/mail2.png'/></a><a class='like' href='" + voteurl + "' pageid='" + page.attr("id") + "'><img src='/images/buttons/like.png'/></a>";
    var paragraph = "<p id='"+page.attr("id")+"warning'></p>";
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
    $(document).bind('scrollstop', function()
    {
        var x = $('body').height() + $(document).scrollTop();
        var y = $(document).height();
        if (x + 61 >= y) {
            next();
        }
    });
}

function next() {
    $.ajax({
        type: "GET",
        url: $(".list_class").data("url"),
        dataType: "xml",
        success: moreList
    });
}

function moreList(xml) {
    var next_url;
//    $(".list_page li.ui-corner-bottom").removeClass("ui-corner-bottom");
    $(xml).find("list").each(function() {
        next_url = $(this).attr('next');
        $(this).find("item").each(function() {
            var attr = $(this).attr('href');
            var title = $(this).attr('title');
            if (attr != undefined) {
                if (title != undefined)
                    $("ul.list_class", $(".ui-page-active :jqmData(role='content')")).append("<li>" + "<a class='parse' href=" + $(this).attr('href') + "><p>" + $(this).attr("title") + " </p>" + $(this).text() + " </a></li>");
                else
                    $("ul.list_class", $(".ui-page-active :jqmData(role='content')")).append("<li>" + "<a class='parse' href=" + $(this).attr('href') + ">" + $(this).text() + "</a></li>");
            }
            else {
                if (title != undefined)
                    $("ul.list_class", $(".ui-page-active :jqmData(role='content')")).append("<li class='parse'><p>" + $(this).attr("title") + "</p>" + $(this).text() + "</li>");
                else
                    $("ul.list_class", $(".ui-page-active :jqmData(role='content')")).append("<li class='parse'>" + $(this).text() + "</li>");
            }

        });
    });

    $(".list_class").data("url", next_url);
    $("ul", $(".ui-page-active")).listview("refresh");
}

$('#serviceLink').live('click', function() {
    getHomepage($(this).attr('href'));
});

$('.parse').live('click', function(event) {
    event.stopPropagation();
    event.preventDefault();
    $.mobile.pageLoading();
    getParse($(this).attr('href')).error();
    $.mobile.ajaxEnabled(false);
});

$('.warning').live('click', function(event) {
    event.stopPropagation();
    event.preventDefault();
    getWarning($(this).attr('href'), $(this).attr('pageid'));
    $.mobile.ajaxEnabled(false);
});

$('.like').live('click', function(event) {
    event.stopPropagation();
    event.preventDefault();
    getLike($(this).attr('href'), $(this).attr('pageid'));
    $.mobile.ajaxEnabled(false);
});

<!-- Pages scripts-->

    $("#home_searchform").live('submit', function() {
        var searched = $(this).find('#search').val();
        searched = replaceAll(searched, " ", "+");
        var url = "http://" + document.domain + ":" + location.port + "/" + "search?keyword=" + searched;
        getParse(url);
        return false;
    });



function logOut() {
    $.mobile.hashListeningEnabled(false);
}

$('#login').live('click', function() {
    logOut();
});

   $('.link_to_homepage').live('click', function() {
      $.mobile.changePage('#web_homepage');
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
        console.log(url);

        return false;
    });
}


