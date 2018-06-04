/*! foxpush-sdk - v2.0.2 - 2018-04-17 */
var FOXPUSH_SDK_version = 2,
    foxpush_config = {},
    foxpush_popup_allowed = !0,
    is_foxpush_frame_loaded = !1,
    _foxpush_object = {
        allow_debug: !0,
        account: "",
        segment_subscribe: [],
        segment_unsubscribe: [],
        tag: [],
        events: {
            onsubscribe: function(e) {},
            ondeny: function(e) {},
            onpermissionrequest: function(e) {}
        }
    };

function _foxpush_removeA(e) {
    for (var o, s, t = arguments, n = t.length; n > 1 && e.length;)
        for (o = t[--n]; - 1 !== (s = e.indexOf(o));) e.splice(s, 1);
    return e
}

function _foxpush_check_segment(e) {
    return (null === localStorage.getItem("foxpush_segmentation") || "" == localStorage.getItem("foxpush_segmentation") ? [] : Object.values(JSON.parse(localStorage.getItem("foxpush_segmentation")))).join(",").indexOf(e) > -1
}

function _foxpush_local_segment(e, o) {
    var s;
    s = null === localStorage.getItem("foxpush_segmentation") || "" == localStorage.getItem("foxpush_segmentation") ? [] : Object.values(JSON.parse(localStorage.getItem("foxpush_segmentation"))), "subscribe" == o ? s.push(e) : _foxpush_removeA(s, e);
    for (var t = {}, n = 0; n < s.length; ++n) void 0 !== s[n] && (t[n] = s[n]);
    localStorage.setItem("foxpush_segmentation", JSON.stringify(t))
}

function _foxpush_subscribe(e) {
    if (void 0 !== localStorage.foxpush_user_token && 0 == _foxpush_check_segment(e)) {
        var o = new XMLHttpRequest;
        o.open("GET", "https://subscribes.foxpush.com/segment/?token=" + localStorage.foxpush_user_token + "&sid=" + e + "&type=subscribe&domain=" + foxpush_config.domain, !0), o.send(), _foxpush_local_segment(e, "subscribe")
    }
}

function _foxpush_unsubscribe(e) {
    if (void 0 !== localStorage.foxpush_user_token && 1 == _foxpush_check_segment(e)) {
        var o = new XMLHttpRequest;
        o.open("GET", "https://subscribes.foxpush.com/segment/?token=" + localStorage.foxpush_user_token + "&sid=" + e + "&type=unsubscribe&domain=" + foxpush_config.domain, !0), o.send(), _foxpush_local_segment(e, "unsubscribe")
    }
}
if (navigator.userAgent.toLowerCase().indexOf("safari/") > -1) _foxpush_object.log = function(e, o) {
    console.log(e, o)
};
else {
    var foxpush_log = console.log;
    _foxpush_object.log = function(e, o) {
        _foxpush_object.allow_debug && void 0 !== o ? foxpush_log(e, o) : _foxpush_object.allow_debug && void 0 === o ? foxpush_log(e) : 0 == _foxpush_object.allow_debug && void 0 !== o && foxpush_log(e, o)
    }
}
for (i = 0; i < _foxpush.length; i++)
    if ("_setDomain" == _foxpush[i][0]) _foxpush_object.account = _foxpush[i][1];
    else if ("_segment" == _foxpush[i][0]) "subscribe" == _foxpush[i][1] ? _foxpush_object.segment_subscribe.push(_foxpush[i][2]) : "unsubscribe" == _foxpush[i][1] && _foxpush_object.segment_unsubscribe.push(_foxpush[i][2]);
else if ("_tag" == _foxpush[i][0]) {
    var obj = {};
    obj[_foxpush[i][1]] = _foxpush[i][2], _foxpush_object.tag.push(obj)
} else "_event" == _foxpush[i][0] ? "function" == typeof _foxpush[i][2] && (_foxpush_object.events[_foxpush[i][1]] = _foxpush[i][2]) : "allow_debug" == _foxpush[i][0] && (_foxpush_object.allow_debug = _foxpush[i][1]);
_foxpush.push = function() {
    if ("_tag" == arguments[0][0] || "_segment" == arguments[0][0] || "_event" == arguments[0][0]) {
        if ("_segment" == arguments[0][0] && "subscribe" == arguments[0][1]) {
            _foxpush_subscribe(parseInt(arguments[0][2]))
        }
        if ("_segment" == arguments[0][0] && "unsubscribe" == arguments[0][1]) {
            _foxpush_unsubscribe(parseInt(arguments[0][2]))
        }
    } else _foxpush_object.log("FoxPush Error :  Wrong Parameter ")
}, _foxpush.getUrlParameter = function(e) {
    e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var o = new RegExp("[\\?&]" + e + "=([^&#]*)").exec(location.search);
    return null === o ? "" : decodeURIComponent(o[1].replace(/\+/g, " "))
}, _foxpush.getContentByMetaTagName = function(e) {
    for (var o = document.getElementsByTagName("meta"), s = 0; s < o.length; s++)
        if (e == o[s].name || e == o[s].getAttribute("property")) return o[s].content;
    return !1
}, _foxpush_templates = {
    box: function(e, o) {
        var s = '<div id="foxpush_box" style="display:none;" class="foxpush_postion_' + e.postion + " fox_dir_" + e.direction + '" >                        <div class="foxpush_icon">                        <img src="' + e.icon + '" alt=""/>                            </div>                        <div class="foxpush_content">                        <h1> ' + e.title + " </h1>                        <h3> " + e.desc + ' </h3>                        <a href="' + o + '" id="foxpush_subscribe" class="foxpush_btn foxpush_allow"> ' + e.allow_text + ' </a>                        <a href="#" id="foxpush_deny" class="foxpush_btn foxpush_block"> ' + e.deny_text + "  </a>                        %%FOXPUSH_COPYRIGHT%%                        </div></div>",
            t = '<span class="foxpush_copyright"><a href="https://www.foxpush.com?ref=' + e.foxsubdomain + '" target="_blank"> Powered by FoxPush </a></span>';
        return s = "free" == e.plan ? s.replace("%%FOXPUSH_COPYRIGHT%%", t) : s.replace("%%FOXPUSH_COPYRIGHT%%", "")
    },
    overlay: function(e) {
        var o = '<div id="foxpush_overlay">                    <div class="foxpush_overlay_box">                        <div class="foxpush_overlay_cover">                            <span class="close" id="foxpush_close_overlay"></span>                            <img src="' + e.icon + '" alt=""/>                        </div>                        <div class="foxpush_overlay_content">                            <h1> ' + e.title + " </h1>                            <h3> " + e.desc + ' </h3>                            <a href="#" id="foxpush_subscribe" class="foxpush_btn foxpush_allow"> ' + e.allow_text + ' </a>                            <a href="#" id="foxpush_deny" class="foxpush_btn foxpush_block"> ' + e.deny_text + "  </a>                        </div>                       %%FOXPUSH_COPYRIGHT%%                    </div>                </div>",
            s = '<span class="foxpush_copyright"><a href="https://www.foxpush.com?ref=' + foxpush_config.foxsubdomain + '" target="_blank"> Powered by FoxPush </a></span>';
        return o = "free" == foxpush_config.plan ? o.replace("%%FOXPUSH_COPYRIGHT%%", s) : o.replace("%%FOXPUSH_COPYRIGHT%%", "")
    },
    icon: function(e) {
        var o = '<div id="foxpush_icon" class="foxpush_' + e.direction + '" draggable="false">                    <div class="foxpush_icon_message" id="foxpush_icon_message">                        <strong>' + foxpush_config.title + "</strong>                        <p>" + foxpush_config.desc + '</p>                       %%FOXPUSH_COPYRIGHT%%                    </div>                        <svg version="1.1" id="foxpushlogo" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 535.5 535.5" style="enable-background:new 0 0 535.5 535.5;" xml:space="preserve">                        <g>                        <g id="notifications-on">                        <path d="M142.8,53.55l-35.7-35.7C45.9,63.75,5.1,135.15,0,216.75h51C56.1,147.9,89.25,89.25,142.8,53.55z M484.5,216.75h51                                            c-5.1-81.6-43.35-153-104.55-198.9l-35.7,35.7C446.25,89.25,479.4,147.9,484.5,216.75z M433.5,229.5                                            c0-79.05-53.55-142.8-127.5-160.65V51c0-20.4-17.85-38.25-38.25-38.25c-20.4,0-38.25,17.85-38.25,38.25v17.85                                            C155.55,86.7,102,150.45,102,229.5v140.25l-51,51v25.5h433.5v-25.5l-51-51V229.5z M267.75,522.75c2.55,0,7.65,0,10.2,0                                            c17.85-2.55,30.6-15.3,35.7-30.6c2.55-5.101,5.1-12.75,5.1-20.4h-102C216.75,499.8,239.7,522.75,267.75,522.75z"/>                        </g>                        </g>                        </svg></div>',
            s = '<span class="foxpush_copyright"><a href="https://www.foxpush.com?ref=' + foxpush_config.foxsubdomain + '" target="_blank"> Powered by FoxPush </a></span>';
        return o = "free" == foxpush_config.plan ? o.replace("%%FOXPUSH_COPYRIGHT%%", s) : o.replace("%%FOXPUSH_COPYRIGHT%%", "")
    },
    bar: "",
    prompt: function(e) {
        if ("" != e.prompt_message && 1 == e.allow_prompt) var o = '<div class="foxpush_prompt_message" id="foxpush_prompt_message"><p>' + e.prompt_message.replace(/(?:\r\n|\r|\n)/g, "<br />") + "</p></div>";
        else o = '<div id="foxpush_prompt_message"></div>';
        return o
    },
    native_html: function(e) {
        return '<div id="foxpush_native_html">        <div class="foxpush_close_button" id="foxpush_close_button"></div>            <div class="arrow_box"></div>            <p class="domain_name"> ' + e.domain_cname + ' wants to </p>        <p class="notification_icon">            <span class="icon">            <svg style="width: 16px; fill: #6c6d6c;enable-background:new 0 0 535.5 535.5;" version="1.1" id="foxpushlogo" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 535.5 535.5" xml:space="preserve">            <g>            <g id="notifications">        <path d="M255,510c28.05,0,51-22.95,51-51H204C204,487.05,226.95,510,255,510z M420.75,357V216.75        c0-79.05-53.55-142.8-127.5-160.65V38.25C293.25,17.85,275.4,0,255,0c-20.4,0-38.25,17.85-38.25,38.25V56.1        c-73.95,17.85-127.5,81.6-127.5,160.65V357l-51,51v25.5h433.5V408L420.75,357z"></path>    </g>    </g>    </svg>        </span>        <span class="text">            Show notifications        </span>        </p>        <div id="foxpush_buttons">            <button type="button" id="foxpush_deny">Block</button>            <button type="button" id="foxpush_subscribe">Allow</button>            </div></div>'
    },
    native_html_mobile: function(e) {
        return '<div id="foxpush_native_html_mobile">            <div id="foxpush_native_mobile_content">            <div class="foxpush_bill_icon">            <svg style="enable-background:new 0 0 535.5 535.5;width: 25px; fill: #4286f5;" version="1.1" id="foxpushlogo" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 535.5 535.5" xml:space="preserve">            <g>            <g id="notifications-on">            <path d="M142.8,53.55l-35.7-35.7C45.9,63.75,5.1,135.15,0,216.75h51C56.1,147.9,89.25,89.25,142.8,53.55z M484.5,216.75h51        c-5.1-81.6-43.35-153-104.55-198.9l-35.7,35.7C446.25,89.25,479.4,147.9,484.5,216.75z M433.5,229.5        c0-79.05-53.55-142.8-127.5-160.65V51c0-20.4-17.85-38.25-38.25-38.25c-20.4,0-38.25,17.85-38.25,38.25v17.85        C155.55,86.7,102,150.45,102,229.5v140.25l-51,51v25.5h433.5v-25.5l-51-51V229.5z M267.75,522.75c2.55,0,7.65,0,10.2,0        c17.85-2.55,30.6-15.3,35.7-30.6c2.55-5.101,5.1-12.75,5.1-20.4h-102C216.75,499.8,239.7,522.75,267.75,522.75z"/>        </g>        </g>        </svg>        </div>        <div class="foxpush_website_name">            <span>' + e.domain_cname + ' wants to send you notifications.</span>        </div>        <div class="foxpush_mobile_closebtn" id="foxpush_close_promptmessage">            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 371.23 371.23" style="enable-background:new 0 0 371.23 371.23;width: 15px;height: 15px" xml:space="preserve">            <polygon points="371.23,21.213 350.018,0 185.615,164.402 21.213,0 0,21.213 164.402,185.615 0,350.018 21.213,371.23   185.615,206.828 350.018,371.23 371.23,350.018 206.828,185.615 " fill="#3d3d3d"/>            </svg>            </div>            <div class="foxpush_mobile_native_content">            <button type="button" id="foxpush_subscribe" class="foxpush_allow_btn">Allow</button>            <button type="button" id="foxpush_deny">Block</button>            </div>            </div>            </div>'
    },
    deny_box: function(e) {
        var o = '<div class="foxpush_blocked_box foxpush_blocked_box_left" style="display: none;" id="foxpush_subscribe"><span><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 535.5 535.5" style="enable-background:new 0 0 535.5 535.5;" xml:space="preserve"><g><g id="notifications-on"><path d="M142.8,53.55l-35.7-35.7C45.9,63.75,5.1,135.15,0,216.75h51C56.1,147.9,89.25,89.25,142.8,53.55z M484.5,216.75h51    c-5.1-81.6-43.35-153-104.55-198.9l-35.7,35.7C446.25,89.25,479.4,147.9,484.5,216.75z M433.5,229.5    c0-79.05-53.55-142.8-127.5-160.65V51c0-20.4-17.85-38.25-38.25-38.25c-20.4,0-38.25,17.85-38.25,38.25v17.85    C155.55,86.7,102,150.45,102,229.5v140.25l-51,51v25.5h433.5v-25.5l-51-51V229.5z M267.75,522.75c2.55,0,7.65,0,10.2,0    c17.85-2.55,30.6-15.3,35.7-30.6c2.55-5.101,5.1-12.75,5.1-20.4h-102C216.75,499.8,239.7,522.75,267.75,522.75z"/></g></g></svg>' + e.short_title + "</span>";
        if (1 == e.allow_block_icon) return o
    },
    css_style: function(e) {
        var o = hexToRgb(e.css.font_color);
        return '<style type="text/css">        :root {            --foxpush_font_color: ' + e.css.font_color + ";            --foxpush_button_bg_color: " + e.css.button_bg_color + ";            --foxpush_button_font_color: " + e.css.button_font_color + ";            --foxpush_bg_color:" + e.css.bg_color + ";            --foxpush_hex_font_color:" + o.r + "," + o.g + "," + o.b + ";        }        </style>"
    },
    data_frame: function(e) {
        return '<iframe src="https://' + e.domain_cname + "/data/?ogtitle=" + _foxpush.getContentByMetaTagName("og:title") + "&title=" + encodeURIComponent(document.title) + "&hurl=" + encodeURIComponent(window.location.href) + '"  style="width: 0px; height: 0px; border: 0px; display: none;"  frameborder="0"></iframe>'
    }
};

function foxpush_browser() {
    var e = !0;

    function o(o) {
        function s(e) {
            var s = o.match(e);
            return s && s.length > 1 && s[1] || ""
        }
        var t, n = s(/(ipod|iphone|ipad)/i).toLowerCase(),
            i = !/like android/i.test(o) && /android/i.test(o),
            r = /nexus\s*[0-6]\s*/i.test(o),
            a = !r && /nexus\s*[0-9]+/i.test(o),
            p = /CrOS/.test(o),
            u = /silk/i.test(o),
            l = /sailfish/i.test(o),
            f = /tizen/i.test(o),
            c = /(web|hpw)os/i.test(o),
            _ = /windows phone/i.test(o),
            h = (/SamsungBrowser/i.test(o), !_ && /windows/i.test(o)),
            d = !n && !u && /macintosh/i.test(o),
            x = !i && !l && !f && !c && /linux/i.test(o),
            m = s(/edge\/(\d+(\.\d+)?)/i),
            g = s(/version\/(\d+(\.\d+)?)/i),
            b = /tablet/i.test(o) && !/tablet pc/i.test(o),
            v = !b && /[^-]mobi/i.test(o),
            w = /xbox/i.test(o);
        /opera/i.test(o) ? t = {
            name: "Opera",
            opera: e,
            version: g || s(/(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i)
        } : /opr|opios/i.test(o) ? t = {
            name: "Opera",
            opera: e,
            version: s(/(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || g
        } : /SamsungBrowser/i.test(o) ? t = {
            name: "Samsung Internet for Android",
            samsungBrowser: e,
            version: g || s(/(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i)
        } : /coast/i.test(o) ? t = {
            name: "Opera Coast",
            coast: e,
            version: g || s(/(?:coast)[\s\/](\d+(\.\d+)?)/i)
        } : /yabrowser/i.test(o) ? t = {
            name: "Yandex Browser",
            yandexbrowser: e,
            version: g || s(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)
        } : /ucbrowser/i.test(o) ? t = {
            name: "UC Browser",
            ucbrowser: e,
            version: s(/(?:ucbrowser)[\s\/](\d+(?:\.\d+)+)/i)
        } : /mxios/i.test(o) ? t = {
            name: "Maxthon",
            maxthon: e,
            version: s(/(?:mxios)[\s\/](\d+(?:\.\d+)+)/i)
        } : /epiphany/i.test(o) ? t = {
            name: "Epiphany",
            epiphany: e,
            version: s(/(?:epiphany)[\s\/](\d+(?:\.\d+)+)/i)
        } : /puffin/i.test(o) ? t = {
            name: "Puffin",
            puffin: e,
            version: s(/(?:puffin)[\s\/](\d+(?:\.\d+)?)/i)
        } : /sleipnir/i.test(o) ? t = {
            name: "Sleipnir",
            sleipnir: e,
            version: s(/(?:sleipnir)[\s\/](\d+(?:\.\d+)+)/i)
        } : /k-meleon/i.test(o) ? t = {
            name: "K-Meleon",
            kMeleon: e,
            version: s(/(?:k-meleon)[\s\/](\d+(?:\.\d+)+)/i)
        } : _ ? (t = {
            name: "Windows Phone",
            windowsphone: e
        }, m ? (t.msedge = e, t.version = m) : (t.msie = e, t.version = s(/iemobile\/(\d+(\.\d+)?)/i))) : /msie|trident/i.test(o) ? t = {
            name: "Internet Explorer",
            msie: e,
            version: s(/(?:msie |rv:)(\d+(\.\d+)?)/i)
        } : p ? t = {
            name: "Chrome",
            chromeos: e,
            chromeBook: e,
            chrome: e,
            version: s(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
        } : /chrome.+? edge/i.test(o) ? t = {
            name: "Microsoft Edge",
            msedge: e,
            version: m
        } : /vivaldi/i.test(o) ? t = {
            name: "Vivaldi",
            vivaldi: e,
            version: s(/vivaldi\/(\d+(\.\d+)?)/i) || g
        } : l ? t = {
            name: "Sailfish",
            sailfish: e,
            version: s(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
        } : /seamonkey\//i.test(o) ? t = {
            name: "SeaMonkey",
            seamonkey: e,
            version: s(/seamonkey\/(\d+(\.\d+)?)/i)
        } : /firefox|iceweasel|fxios/i.test(o) ? (t = {
            name: "Firefox",
            firefox: e,
            version: s(/(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i)
        }, /\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(o) && (t.firefoxos = e)) : u ? t = {
            name: "Amazon Silk",
            silk: e,
            version: s(/silk\/(\d+(\.\d+)?)/i)
        } : /phantom/i.test(o) ? t = {
            name: "PhantomJS",
            phantom: e,
            version: s(/phantomjs\/(\d+(\.\d+)?)/i)
        } : /slimerjs/i.test(o) ? t = {
            name: "SlimerJS",
            slimer: e,
            version: s(/slimerjs\/(\d+(\.\d+)?)/i)
        } : /blackberry|\bbb\d+/i.test(o) || /rim\stablet/i.test(o) ? t = {
            name: "BlackBerry",
            blackberry: e,
            version: g || s(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
        } : c ? (t = {
            name: "WebOS",
            webos: e,
            version: g || s(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
        }, /touchpad\//i.test(o) && (t.touchpad = e)) : /bada/i.test(o) ? t = {
            name: "Bada",
            bada: e,
            version: s(/dolfin\/(\d+(\.\d+)?)/i)
        } : f ? t = {
            name: "Tizen",
            tizen: e,
            version: s(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || g
        } : /qupzilla/i.test(o) ? t = {
            name: "QupZilla",
            qupzilla: e,
            version: s(/(?:qupzilla)[\s\/](\d+(?:\.\d+)+)/i) || g
        } : /chromium/i.test(o) ? t = {
            name: "Chromium",
            chromium: e,
            version: s(/(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || g
        } : /chrome|crios|crmo/i.test(o) ? t = {
            name: "Chrome",
            chrome: e,
            version: s(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
        } : i ? t = {
            name: "Android",
            version: g
        } : /safari|applewebkit/i.test(o) ? (t = {
            name: "Safari",
            safari: e
        }, g && (t.version = g)) : n ? (t = {
            name: "iphone" == n ? "iPhone" : "ipad" == n ? "iPad" : "iPod"
        }, g && (t.version = g)) : t = /googlebot/i.test(o) ? {
            name: "Googlebot",
            googlebot: e,
            version: s(/googlebot\/(\d+(\.\d+))/i) || g
        } : {
            name: s(/^(.*)\/(.*) /),
            version: function(e) {
                var s = o.match(e);
                return s && s.length > 1 && s[2] || ""
            }(/^(.*)\/(.*) /)
        }, !t.msedge && /(apple)?webkit/i.test(o) ? (/(apple)?webkit\/537\.36/i.test(o) ? (t.name = t.name || "Blink", t.blink = e) : (t.name = t.name || "Webkit", t.webkit = e), !t.version && g && (t.version = g)) : !t.opera && /gecko\//i.test(o) && (t.name = t.name || "Gecko", t.gecko = e, t.version = t.version || s(/gecko\/(\d+(\.\d+)?)/i)), t.windowsphone || t.msedge || !i && !t.silk ? t.windowsphone || t.msedge || !n ? d ? t.mac = e : w ? t.xbox = e : h ? t.windows = e : x && (t.linux = e) : (t[n] = e, t.ios = e) : t.android = e;
        var y = "";
        t.windows ? y = function(e) {
            switch (e) {
                case "NT":
                    return "NT";
                case "XP":
                    return "XP";
                case "NT 5.0":
                    return "2000";
                case "NT 5.1":
                    return "XP";
                case "NT 5.2":
                    return "2003";
                case "NT 6.0":
                    return "Vista";
                case "NT 6.1":
                    return "7";
                case "NT 6.2":
                    return "8";
                case "NT 6.3":
                    return "8.1";
                case "NT 10.0":
                    return "10";
                default:
                    return
            }
        }(s(/Windows ((NT|XP)( \d\d?.\d)?)/i)) : t.windowsphone ? y = s(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i) : t.mac ? y = (y = s(/Mac OS X (\d+([_\.\s]\d+)*)/i)).replace(/[_\s]/g, ".") : n ? y = (y = s(/os (\d+([_\s]\d+)*) like mac os x/i)).replace(/[_\s]/g, ".") : i ? y = s(/android[ \/-](\d+(\.\d+)*)/i) : t.webos ? y = s(/(?:web|hpw)os\/(\d+(\.\d+)*)/i) : t.blackberry ? y = s(/rim\stablet\sos\s(\d+(\.\d+)*)/i) : t.bada ? y = s(/bada\/(\d+(\.\d+)*)/i) : t.tizen && (y = s(/tizen[\/\s](\d+(\.\d+)*)/i)), y && (t.osversion = y);
        var k = !t.windows && y.split(".")[0];
        return b || a || "ipad" == n || i && (3 == k || k >= 4 && !v) || t.silk ? t.tablet = e : (v || "iphone" == n || "ipod" == n || i || r || t.blackberry || t.webos || t.bada) && (t.mobile = e), t.msedge || t.msie && t.version >= 10 || t.yandexbrowser && t.version >= 15 || t.vivaldi && t.version >= 1 || t.chrome && t.version >= 20 || t.samsungBrowser && t.version >= 4 || t.firefox && t.version >= 20 || t.safari && t.version >= 6 || t.opera && t.version >= 10 || t.ios && t.osversion && t.osversion.split(".")[0] >= 6 || t.blackberry && t.version >= 10.1 || t.chromium && t.version >= 20 ? t.a = e : t.msie && t.version < 10 || t.chrome && t.version < 20 || t.firefox && t.version < 20 || t.safari && t.version < 6 || t.opera && t.version < 10 || t.ios && t.osversion && t.osversion.split(".")[0] < 6 || t.chromium && t.version < 20 ? t.c = e : t.x = e, t
    }
    var s = o("undefined" != typeof navigator ? navigator.userAgent || "" : "");
    s.test = function(e) {
        for (var o = 0; o < e.length; ++o) {
            var t = e[o];
            if ("string" == typeof t && t in s) return !0
        }
        return !1
    };

    function t(e) {
        return e.split(".").length
    }

    function n(e, o) {
        var s, t = [];
        if (Array.prototype.map) return Array.prototype.map.call(e, o);
        for (s = 0; s < e.length; s++) t.push(o(e[s]));
        return t
    }

    function i(e) {
        for (var o = Math.max(t(e[0]), t(e[1])), s = n(e, function(e) {
                var s = o - t(e);
                return n((e += new Array(s + 1).join(".0")).split("."), function(e) {
                    return new Array(20 - e.length).join("0") + e
                }).reverse()
            }); --o >= 0;) {
            if (s[0][o] > s[1][o]) return 1;
            if (s[0][o] !== s[1][o]) return -1;
            if (0 === o) return 0
        }
    }

    function r(e, t, n) {
        var r = s;
        "string" == typeof t && (n = t, t = void 0), void 0 === t && (t = !1), n && (r = o(n));
        var a = "" + r.version;
        for (var p in e)
            if (e.hasOwnProperty(p) && r[p]) {
                if ("string" != typeof e[p]) throw new Error("Browser version in the minVersion map should be a string: " + p + ": " + String(e));
                return i([a, e[p]]) < 0
            }
        return t
    }
    return s.isUnsupportedBrowser = r, s.compareVersions = i, s.check = function(e, o, s) {
        return !r(e, o, s)
    }, s._detect = o, s
}
var foxpush_browser = foxpush_browser();

function fox_appendHtml(e, o) {
    var s = document.createElement("div");
    for (s.innerHTML = o; s.children.length > 0;) e.appendChild(s.children[0])
}

function IsJsonString(e) {
    try {
        JSON.parse(e)
    } catch (e) {
        return !1
    }
    return !0
}

function foxpsuh_blocked(e) {
    return "blocked" != localStorage.foxpush_status && ("overlay" == foxpush_config.popup_style ? document.getElementById("foxpush_overlay").style.setProperty("display", "none", "important") : "box" == foxpush_config.popup_style ? document.getElementById("foxpush_box").style.setProperty("display", "none", "important") : "icon" == foxpush_config.popup_style ? document.getElementById("foxpush_icon").style.setProperty("display", "none", "important") : "native" == foxpush_config.popup_style && (foxpush_browser.mobile ? document.getElementById("foxpush_native_html_mobile").style.setProperty("display", "none", "important") : document.getElementById("foxpush_native_html").style.setProperty("display", "none", "important"))), 1 == e && (localStorage.foxpush_status = "blocked", localStorage.foxpush_blocktype = "local"), !0
}

function isFacebookApp() {
    var e = navigator.userAgent || navigator.vendor || window.opera;
    return e.indexOf("FBAN") > -1 || e.indexOf("FBAV") > -1
}

function foxpush_window(e, o, s, t, n) {
    var i = !0;
    0 == n && (i = !1);
    var r = void 0 != window.screenLeft ? window.screenLeft : screen.left,
        a = void 0 != window.screenTop ? window.screenTop : screen.top,
        p = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width,
        u = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
    if (i) var l = p / 2 - s / 2 + r,
        f = u / 2 - t / 2 + a;
    else {
        l = 100, f = screen.height;
        s = 1, t = 1
    }
    var c = window.open(e, o, "scrollbars=yes, width=" + s + ", height=" + t + ", top=" + f + ", left=" + l);
    c.blur && c.blur()
}

function hexToRgb(e) {
    var o = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    return o ? {
        r: parseInt(o[1], 16),
        g: parseInt(o[2], 16),
        b: parseInt(o[3], 16)
    } : null
}

function _foxpush_querystring() {
    _foxpush.getUrlParameter("foxpush_style") && ["box", "overlay", "native", "icon"].indexOf(_foxpush.getUrlParameter("foxpush_style")) > -1 && (foxpush_config.popup_style = _foxpush.getUrlParameter("foxpush_style")), _foxpush.getUrlParameter("foxpush_title") && (foxpush_config.title = _foxpush.getUrlParameter("foxpush_title")), _foxpush.getUrlParameter("foxpush_desc") && (foxpush_config.desc = _foxpush.getUrlParameter("foxpush_desc")), _foxpush.getUrlParameter("foxpush_allow_text") && (foxpush_config.allow_text = _foxpush.getUrlParameter("foxpush_allow_text")), _foxpush.getUrlParameter("foxpush_deny_text") && (foxpush_config.deny_text = _foxpush.getUrlParameter("foxpush_deny_text")), _foxpush.getUrlParameter("foxpush_allow_native") && (foxpush_config.allow_native = _foxpush.getUrlParameter("foxpush_allow_native"))
}
var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent",
    eventer = window[eventMethod],
    messageEvent = "attachEvent" == eventMethod ? "onmessage" : "message";
eventer(messageEvent, function(e) {
    if (e.data && void 0 !== e.data.status)
        if (is_foxpush_frame_loaded = !0, "local" != localStorage.foxpush_blocktype && "blocked" != localStorage.foxpush_status && (localStorage.foxpush_status = e.data.status), e.data.token && (localStorage.foxpush_user_token = e.data.token), "allowed" == e.data.status) {
            if (foxpush_popup_allowed = !1, "allowed" != localStorage.foxpush_status) {
                var o = {
                    token: e.data.token,
                    timestamp: new Date
                };
                _foxpush_object.events.onsubscribe(o)
            }
        } else if ("blocked" == e.data.status) {
        o = {
            browser_info: foxpush_browser,
            timestamp: new Date
        };
        _foxpush_object.events.ondeny(o), localStorage.foxpush_blocktype = "remote"
    }
}, !1);
var foxpush_request = new XMLHttpRequest;
foxpush_request.open("GET", "https://json.foxpush.com/" + _foxpush_object.account + ".json?v=" + Math.random(), !0), foxpush_request.onload = function() {
    if (foxpush_request.status >= 200 && foxpush_request.status < 400)
        if (IsJsonString(foxpush_request.responseText)) {
            foxpush_config = JSON.parse(foxpush_request.responseText), _foxpush_querystring(), fox_appendHtml(document.head, _foxpush_templates.css_style(foxpush_config)), fox_appendHtml(document.body, _foxpush_templates.data_frame(foxpush_config)), "free" == foxpush_config.plan && _foxpush_object.log("%c Push notifications powered by: FoxPush.com ", "background: #222; color: #bada55;font-size:20px;");
            var e = 0,
                o = "none",
                s = "",
                t = "",
                n = 0;
            localStorage.foxpush_localstorage = void 0 !== localStorage.foxpush_localstorage ? localStorage.foxpush_localstorage : e, localStorage.foxpush_status = void 0 !== localStorage.foxpush_status ? localStorage.foxpush_status : o, localStorage.foxpush_user_token = void 0 !== localStorage.foxpush_user_token ? localStorage.foxpush_user_token : s, localStorage.foxpush_segmentation = void 0 !== localStorage.foxpush_segmentation ? localStorage.foxpush_segmentation : t, localStorage.foxpush_subscriber_update = void 0 !== localStorage.foxpush_subscriber_update ? localStorage.foxpush_subscriber_update : n;
            var i = !1;
            foxpush_browser.chrome && foxpush_browser.version >= 40 ? i = !0 : foxpush_browser.safari && foxpush_browser.version > 9 ? i = !0 : foxpush_browser.firefox && foxpush_browser.version > 44 ? i = !0 : foxpush_browser.opera && foxpush_browser.version > 42 && (i = !0), localStorage.foxpush_localstorage = 1, foxpush_browser.android && 0 == foxpush_config.allow_mobile && (foxpush_popup_allowed = !1), "allowed" == localStorage.foxpush_status && (foxpush_popup_allowed = !1), foxpush_browser.iphone && (foxpush_popup_allowed = !1);
            var r = function() {
                var e = document.createElement("link");
                e.rel = "stylesheet", e.href = "https://cdn.foxpush.net/sdk/foxpush_SDK_min.css", document.getElementsByTagName("head")[0].appendChild(e)
            };
            try {
                var a = requestAnimationFrame || mozRequestAnimationFrame || webkitRequestAnimationFrame || msRequestAnimationFrame;
                a ? a(r) : window.addEventListener("load", r)
            } catch (e) {
                _foxpush_object.log("FoxPush Error : CSS Error")
            }
            if (0 == foxpush_config.allow_native) setTimeout(function() {
                if ("undefined" == typeof Storage || 1 != i || isFacebookApp()) {
                    if (isFacebookApp()) {
                        e = {
                            layout: "facebook_app",
                            timestamp: new Date
                        };
                        if (_foxpush_object.events.onpermissionrequest(e), 1 == foxpush_popup_allowed && "blocked" != localStorage.foxpush_status && "native" == foxpush_config.popup_style)
                            if (foxpush_browser.mobile) {
                                fox_appendHtml(document.body, _foxpush_templates.native_html_mobile(foxpush_config));
                                document.getElementById("foxpush_close_promptmessage").onclick = function() {
                                    var e = document.getElementById("foxpush_prompt_message");
                                    return void 0 !== e && null != e && e.style.setProperty("display", "none", "important"), foxpsuh_blocked(!0), !1
                                }
                            } else fox_appendHtml(document.body, _foxpush_templates.native_html(foxpush_config))
                    }
                } else if (1 == foxpush_popup_allowed && "blocked" != localStorage.foxpush_status && "overlay" == foxpush_config.popup_style) {
                    fox_appendHtml(document.body, _foxpush_templates.overlay(foxpush_config));
                    var e = {
                        layout: "overlay",
                        timestamp: new Date
                    };
                    _foxpush_object.events.onpermissionrequest(e);
                    document.getElementById("foxpush_close_overlay").onclick = function() {
                        return foxpsuh_blocked(!0), fox_appendHtml(document.body, _foxpush_templates.deny_box(foxpush_config)), !1
                    }
                } else if (1 == foxpush_popup_allowed && "blocked" != localStorage.foxpush_status && "box" == foxpush_config.popup_style) {
                    var e = {
                        layout: "box",
                        timestamp: new Date
                    };
                    _foxpush_object.events.onpermissionrequest(e), fox_appendHtml(document.body, _foxpush_templates.box(foxpush_config, foxpush_config.hostname))
                } else if (1 == foxpush_popup_allowed && "blocked" != localStorage.foxpush_status && "icon" == foxpush_config.popup_style) {
                    e = {
                        layout: "icon",
                        timestamp: new Date
                    };
                    _foxpush_object.events.onpermissionrequest(e), fox_appendHtml(document.body, _foxpush_templates.icon(foxpush_config))
                } else if (1 == foxpush_popup_allowed && "blocked" != localStorage.foxpush_status && "native" == foxpush_config.popup_style) {
                    e = {
                        layout: "box",
                        native: new Date
                    };
                    if (_foxpush_object.events.onpermissionrequest(e), foxpush_browser.mobile) {
                        fox_appendHtml(document.body, _foxpush_templates.prompt(foxpush_config)), fox_appendHtml(document.body, _foxpush_templates.native_html_mobile(foxpush_config));
                        document.getElementById("foxpush_close_promptmessage").onclick = function() {
                            var e = document.getElementById("foxpush_prompt_message");
                            return void 0 !== e && null != e && e.style.setProperty("display", "none", "important"), foxpsuh_blocked(!0), !1
                        }
                    } else fox_appendHtml(document.body, _foxpush_templates.prompt(foxpush_config)), fox_appendHtml(document.body, _foxpush_templates.native_html(foxpush_config))
                } else 1 == foxpush_popup_allowed && "blocked" == localStorage.foxpush_status && fox_appendHtml(document.body, _foxpush_templates.deny_box(foxpush_config));
                var o = document.getElementById("foxpush_deny");
                void 0 !== o && null != o && (o.onclick = function() {
                    var e = document.getElementById("foxpush_prompt_message");
                    void 0 !== e && null != e && e.style.setProperty("display", "none", "important");
                    var o = {
                        browser_info: foxpush_browser,
                        timestamp: new Date
                    };
                    return _foxpush_object.events.ondeny(o), foxpsuh_blocked(!0), fox_appendHtml(document.body, _foxpush_templates.deny_box(foxpush_config)), !1
                });
                var s = document.getElementById("foxpush_close_button");
                void 0 !== s && null != s && (s.onclick = function() {
                    var e = document.getElementById("foxpush_prompt_message");
                    return void 0 !== e && null != e && e.style.setProperty("display", "none", "important"), foxpsuh_blocked(!1), !1
                });
                var t = document.getElementById("foxpush_subscribe");
                void 0 !== t && null != t && (t.onclick = function() {
                    var e = document.getElementById("foxpush_prompt_message");
                    void 0 !== e && null != e && e.style.setProperty("display", "none", "important"), foxpsuh_blocked(!1);
                    var o = foxpush_config.hostname;
                    return isFacebookApp() && (localStorage.foxpush_status = "success", o = "intent://" + foxpush_config.domain_cname + "#Intent;scheme=https;package=com.android.chrome;end"), foxpush_window(o, "foxpsuh_window", 400, 500), !1
                });
                var n = document.getElementById("foxpush_icon");
                void 0 !== n && null != n && (n.onclick = function() {
                    foxpsuh_blocked(!1);
                    foxpush_window(foxpush_config.hostname, "foxpsuh_window", 400, 500)
                })
            }, 3e3);
            else {
                if (foxpush_browser.safari && foxpush_browser.version > 9) {
                    var p = function(e) {
                        _foxpush_object.log(foxpush_config.foxsubdomain), "default" === e.permission ? window.safari.pushNotification.requestPermission("https://safari.foxpush.net", "web.foxpush.com", {
                            title: foxpush_config.domain,
                            subdomain: foxpush_config.foxsubdomain,
                            hostname: window.location.hostname
                        }, p) : "denied" === e.permission ? (localStorage.foxpush_status = "blocked", localStorage.foxpush_user_token = "", _foxpush_object.log("Permission for Notifications was denied")) : "granted" === e.permission && (localStorage.foxpush_status = "allowed", localStorage.foxpush_user_token = e.deviceToken, c(e.deviceToken, "", "", "", "apple"))
                    };
                    if ("pushNotification" in window.safari) {
                        var u = window.safari.pushNotification.permission("web.foxpush.com");
                        p(u)
                    }
                } else {
                    var l = document.createElement("link");
                    l.rel = "manifest", l.href = "/foxpush_manifest.json", document.head.appendChild(l), i && (foxpush_browser.chrome || foxpush_browser.firefox || foxpush_browser.opera) && ("granted" != Notification.permission && "denied" != Notification.permission ? "serviceWorker" in navigator ? navigator.serviceWorker.register("/foxpush_worker.js").then(function(e) {
                        function o() {
                            var e = document.getElementById("foxpush_prompt_message");
                            return void 0 !== e && null != e && e.style.setProperty("display", "none", "important"), !0
                        }
                        navigator.serviceWorker.ready.then(function(e) {
                            fox_appendHtml(document.body, _foxpush_templates.prompt(foxpush_config)), e.pushManager.subscribe({
                                userVisibleOnly: !0
                            }).then(function(e) {
                                if (o(), e) {
                                    var s = JSON.parse(JSON.stringify(e));
                                    localStorage.foxpush_status = "allowed", localStorage.foxpush_user_token = f(e.endpoint);
                                    var t = "gcm";
                                    foxpush_browser.firefox && (t = "mozila"), c(f(e.endpoint), e.endpoint, s.keys.auth, s.keys.p256dh, t)
                                } else _foxpush_object.log("Not yet subscribed to Push")
                            }, function(e) {
                                o(), _foxpush_object.log(e), "denied" === Notification.permission ? (localStorage.foxpush_status = "blocked", localStorage.foxpush_user_token = "", _foxpush_object.log("FoxPush Error : User deny notificaion request")) : _foxpush_object.log("FoxPush Error :" + e)
                            }).catch(function(e) {
                                if (o(), "denied" === Notification.permission) {
                                    localStorage.foxpush_status = "blocked", localStorage.foxpush_user_token = "";
                                    var s = {
                                        browser_info: foxpush_browser,
                                        timestamp: new Date
                                    };
                                    _foxpush_object.events.ondeny(s), _foxpush_object.log("FoxPush Error : User deny notificaion request")
                                } else _foxpush_object.log("FoxPush Error :" + e)
                            })
                        })
                    }).catch(function(e) {
                        _foxpush_object.log("FoxPush Error :" + e)
                    }) : _foxpush_object.log("FoxPush Error: serviceWorker not supported") : "granted" == Notification.permission ? (navigator.serviceWorker.ready.then(function(e) {
                        e.pushManager.getSubscription().then(function(e) {
                            var o = JSON.parse(JSON.stringify(e));
                            ! function(e, o, s, t) {
                                if (0 == localStorage.foxpush_subscriber_update || void 0 === localStorage.foxpush_subscriber_update) {
                                    var n = new XMLHttpRequest;
                                    n.open("GET", "https://subscribes.foxpush.com/subscription_update/?token=" + e + "&endpoint=" + encodeURIComponent(o) + "&auth=" + encodeURIComponent(s) + "&p256dh=" + encodeURIComponent(t), !0), n.onload = function() {
                                        n.status >= 200 && n.status < 400 ? localStorage.foxpush_subscriber_update = 1 : _foxpush_object.log("FoxPush Error : We reached our target server, but it returned an error")
                                    }, n.send()
                                }
                            }(f(o.endpoint), o.endpoint, o.keys.auth, o.keys.p256dh)
                        }).catch(function(e) {
                            _foxpush_object.log("Error during getSubscription(): " + e)
                        })
                    }), localStorage.foxpush_status = "allowed") : (localStorage.foxpush_status = "blocked", localStorage.foxpush_user_token = ""))
                }

                function f(e) {
                    var o = e.split("/");
                    return o[o.length - 1]
                }

                function c(e, o, s, t, n) {
                    var i = window.navigator.userLanguage || window.navigator.language,
                        r = window.location.href,
                        a = new XMLHttpRequest;
                    a.open("GET", "https://subscribes.foxpush.com/subscribe/?token=" + e + "&endpoint=" + encodeURIComponent(o) + "&auth=" + encodeURIComponent(s) + "&p256dh=" + encodeURIComponent(t) + "&ref=" + encodeURIComponent(r) + "&timezone=US/Pacific&lang=" + i + "&domain=" + foxpush_config.domain + "&client_type=" + n, !0), a.onload = function() {
                        if (a.status >= 200 && a.status < 400) {
                            var o = {
                                token: e,
                                timestamp: new Date
                            };
                            _foxpush_object.events.onsubscribe(o)
                        } else _foxpush_object.log("FoxPush Error : We reached our target server, but it returned an error")
                    }, a.send()
                }
            }
        } else _foxpush_object.log("FoxPush Error: Please contact FoxPush support team");
    else _foxpush_object.log("FoxPush Error: Please contact FoxPush support team")
}, foxpush_request.onerror = function() {
    _foxpush_object.log("FoxPush Error: Please contact FoxPush support team")
}, foxpush_request.send();
//# sourceMappingURL=foxpush_SDK_min.map