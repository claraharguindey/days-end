
/*!
 * Global scripts for this website v1.0.0 (https://centrepompidou.fr)
 */

$(document).ready(function(){if($("#secondary-navigation").length){checkOffset(),activeAnchor(),checkAnchorOverflow();var t=$(window).width();$(window).on("resize",function(){var e=$(window).width();t!=e&&(t=e,$("#secondary-menu ul").length&&checkAnchorOverflow())}),document.addEventListener("scroll",function(e){"anchor-scrollable-list"===e.target.id&&checkAnchorOverflow()},!0),$(document).on("click","#secondary-navigation span.menu-arrows",function(){anchorNavScroll($(this).attr("data-direction"))})}});var scrolling=!1;function smoothAnchorScroll(e){if(scrolling=!0,location.pathname.replace(/^\//,"")===e.pathname.replace(/^\//,"")&&location.hostname===e.hostname&&void 0===$(e).data("toggle")&&void 0===$(e).data("slide")){var t=$(e.hash),n=(t=t.length&&t||$("[name="+e.hash.slice(1)+"]")).offset().top;$("#secondary-navigation").hasClass("fixed")||(n-=$("#secondary-navigation").height()),$("html,body").animate({scrollTop:n},500,function(){activeAnchor(),scrolling=!1})}}function checkOffset(){if($(".frame-type-menu_section").length){$(".frame-type-menu_section").offset().top<$(window).scrollTop()+60?($("#secondary-navigation").addClass("fixed"),$("#secondary-navigation").css("top",60),$("#mainnavigation").addClass("no-shadow")):($("#secondary-navigation").removeClass("fixed"),$("#mainnavigation").removeClass("no-shadow"),$("#secondary-navigation ul li a.active").removeClass("active"))}}$(window).bind("scroll",function(){$("#secondary-navigation").length&&(checkOffset(),scrolling||activeAnchor())}),$("#secondary-navigation li a").click(function(){smoothAnchorScroll(this)});var currentAnchor="";function activeAnchor(){var e=$("#active-link-border"),t=$(window).scrollTop();$(".section.section-default > div .element-header.anchor").each(function(e){$(this).offset().top-300<=t&&($("#secondary-navigation ul li a.active").removeClass("active"),$("#secondary-navigation ul li a").eq(e).addClass("active"))});var n=$("#secondary-navigation ul li a.active"),a=$("#secondary-navigation ul");if(n.length&&$("#secondary-navigation").hasClass("fixed")){var o=n.position().left+a.scrollLeft(),i=n.width();if(currentAnchor!=n[0].innerText){currentAnchor=n[0].innerText;var s=60;$(window).width()<BREAKPOINT_MD&&(s=10),a.animate({scrollLeft:o-s},500),e.css("transform","translateX("+o+"px) scaleX("+.01*i+")"),e.css("display","block")}}else e.removeAttr("style"),currentAnchor="",scrolling||a.animate({scrollLeft:0},200),scrolling=!0,window.setTimeout(function(){scrolling=!1},100)}function checkAnchorOverflow(){var e=$("#secondary-navigation ul").outerWidth(),t=$("#secondary-navigation ul li").last().position().left+$("#secondary-navigation ul li").last().width();parseInt(t)>parseInt(e)?$("span.scroll-right").addClass("visible"):$("span.scroll-right").removeClass("visible"),$("#secondary-navigation ul li").first().position().left<0?$("span.scroll-left").addClass("visible"):$("span.scroll-left").removeClass("visible")}function anchorNavScroll(e){var t=$("#secondary-navigation ul").scrollLeft(),n=0;n="right"===e?t+200:t-200,$("#secondary-navigation ul").animate({scrollLeft:n})}var mobile,BREAKPOINT_XS=0,BREAKPOINT_SM=576,BREAKPOINT_MD=768,BREAKPOINT_LG=992,BREAKPOINT_XL=1200;function initCMSCarousels(e,t){var n=e;t.data("desktop-cards-number")&&(n=t.data("desktop-cards-number")),initOwlCarousel(t,2,n,20,!1,!0,!1),t.trigger("refresh.owl.carousel")}function formatImages(){$(".card-img-wrapper img, .img-background-cover").each(function(){var e=$(this),t="url("+e.attr("src")+")";e.parent().css({"background-size":"cover","background-repeat":"no-repeat","background-image":t}),e.hide()}),$(".img-background-contain").each(function(){var e=$(this),t="url("+e.attr("src")+")";e.parent().css({"background-size":"contain","background-repeat":"no-repeat","background-position":"50%","background-image":t}),e.hide()})}function fixedNavbar(){if($(".navbar-variation").length){var e=0;$(".homepage").length?e=$(".carousel-fullscreen").height()-100:$("#news-magazine").length?e=$("#img-cover").height()-100:$("#search-results-page").length?e=$(".frame-type-menu_section").offset().top:$("#concept-page").length?e=$("#concept-header").height()-100:$("#event-page").length&&(e=$("#event-header").height()-100),e<$(window).scrollTop()?$("nav").hasClass("sticky-navbar")||$("nav").addClass("sticky-navbar"):$("nav").hasClass("sticky-navbar")&&$("nav").removeClass("sticky-navbar")}0!=$(window).scrollTop()?$("nav#mainnavigation").addClass("scroll"):$("nav#mainnavigation").removeClass("scroll")}function initPagesNavbar(){var t=$(window).width();$("#pages-links-nav ul").length&&(positionActiveLink(),checkItemsOverflow(),checkPageLinksOffset()),$(window).on("resize",function(){var e=$(window).width();t!=e&&(t=e,$("#pages-links-nav ul").length&&(positionActiveLink(),checkItemsOverflow()))}),document.addEventListener("scroll",function(e){"scrollable-list"===e.target.id&&checkItemsOverflow()},!0),$(document).on("click","#pages-links-nav span.menu-arrows",function(){navScroll($(this).attr("data-direction"))}),$(window).bind("scroll",function(){$("#pages-links-nav ul").length&&checkPageLinksOffset()})}function positionActiveLink(){var e=$("#pages-links-nav ul li.active"),t=e.width();if(e.length){var n=e.position().left,a=($("#pages-links-nav ul").width()-t)/2;$("#pages-links-nav ul").scrollLeft(n-a+10)}}function checkItemsOverflow(){var e=$("#pages-links-nav ul").outerWidth(),t=$("#pages-links-nav ul li:last-child").position().left+$("#pages-links-nav ul li:last-child").width();parseInt(t)>parseInt(e)?$("span.scroll-right").addClass("visible"):$("span.scroll-right").removeClass("visible"),$("#pages-links-nav ul li:first-child").position().left<0?$("span.scroll-left").addClass("visible"):$("span.scroll-left").removeClass("visible")}function navScroll(e){var t=$("#pages-links-nav ul").scrollLeft(),n=0;n="right"===e?t+200:t-200,$("#pages-links-nav ul").animate({scrollLeft:n})}function checkPageLinksOffset(){$(".frame-type-menu_section").length&&($(".frame-type-menu_section").offset().top<$(window).scrollTop()?($("#pages-links-nav").addClass("fixed"),$("#mainnavigation").addClass("no-shadow")):($("#pages-links-nav").removeClass("fixed"),$("#mainnavigation").removeClass("no-shadow"),$("#pages-links-nav ul li a.active").removeClass("active")))}function initOwlCarousel(e,t,n,a,o,i,s){var l=$(e),c=t||2,r=n||4,d=a?20:a,u=o?20:o,h=s||!1;return l.owlCarousel({nav:!0,navText:["<i class='icon-fleche-carrousel left' data-grunticon-embed></i>","<i class='icon-fleche-carrousel' data-grunticon-embed></i>"],slideBy:4,dots:!1,lazyLoad:!0,responsive:{0:{items:c,margin:d,autoWidth:!0},576:{items:3,margin:u,autoWidth:!0},993:{items:r,margin:u,autoWidth:h}}}),$(window).resize(function(){l.trigger("refresh.owl.carousel")}),l.on("drag.owl.carousel",function(e){$(window).width()<768&&($("body").css("overflow","hidden"),document.ontouchmove=function(e){e.preventDefault()})}),l.on("dragged.owl.carousel",function(e){$(window).width()<768&&($("body").css("overflow","auto"),document.ontouchmove=function(e){return!0})}),grunticon(["/typo3conf/ext/piazza_base/Resources/Public/Icons/GruntIcons/icons.data.svg.css","/typo3conf/ext/piazza_base/Resources/Public/Icons/GruntIcons/icons.data.png.css","/typo3conf/ext/piazza_base/Resources/Public/Icons/GruntIcons/icons.fallback.css"],grunticon.svgLoadedCallback),l}function smoothScrollTop(e){if(location.pathname.replace(/^\//,"")===e.pathname.replace(/^\//,"")&&location.hostname===e.hostname&&void 0===$(e).data("toggle")&&void 0===$(e).data("slide")){var t=$(e.hash);t=t.length&&t||$("[name="+e.hash.slice(1)+"]");var n=0;$("#anchors-container").length&&(n=$("#anchors-container").height());var a=t.offset().top-n;scrolling=!0,$("html,body").animate({scrollTop:a},500,function(){activeAnchor(),scrolling=!1})}}function showMoreText(e){var t=e||400;$(".show-more-text").each(function(){var e=$(this).find(".text-content");$(e).height()>t&&($(this).addClass("active"),e.addClass("collapse"),$(this).find(".show-more-btn").removeClass("d-none"))})}$(".owl-carousel.cp-carousel.carousel-card-list").each(function(){initCMSCarousels(4,$(this))}),$(".owl-carousel.cp-carousel.carousel-video-homepage").each(function(){initCMSCarousels(3,$(this))}),$(".owl-carousel.cp-carousel.carousel-event-homepage").each(function(){var e=$(this),t=6;e.parents(".frame-content").length&&(t=4),initCMSCarousels(t,e)}),$(".owl-carousel.cp-carousel.carousel-elastic-art-list").each(function(){var e=$(this);initCMSCarousels(4,$(e))}),$(".owl-carousel.cp-carousel.carousel-elastic-person-list").each(function(){var e=$(this);initCMSCarousels(5,$(e))}),$(".owl-carousel.cp-carousel.carousel-elastic-media-list").each(function(){var e=$(this);initCMSCarousels(5,$(e))}),$(".owl-carousel.cp-carousel.carousel-elastic-product-list").each(function(){var e=$(this);initCMSCarousels(6,$(e))}),$(".owl-carousel.cp-carousel.carousel-elastic-archive-list").each(function(){var e=$(this);initCMSCarousels(5,$(e))}),$(".owl-carousel.cp-carousel.carousel-elastic-event-list").each(function(){var e=$(this);initCMSCarousels(4,$(e))}),function(e,t,n,a){e[a]=e[a]||[],e[a].push({"gtm.start":(new Date).getTime(),event:"gtm.js"});var o=t.getElementsByTagName(n)[0],i=t.createElement(n);i.async=!0,i.src="https://www.googletagmanager.com/gtm.js?id=GTM-TKTGGX9",o.parentNode.insertBefore(i,o)}(window,document,"script","dataLayer"),$(document).ready(function(){(document.documentMode||/Edge/.test(navigator.userAgent))&&formatImages()}),$(document).ready(function(){$("button.lightbox-opener").on("click",function(e){e.preventDefault();var t=$(this).data("rel");$(".carousel-item.active a.lightbox[rel="+t+"]").click()})}),fixedNavbar(),$(".navbar-toggler").on("click",function(){$("nav#mainnavigation").toggleClass("nav-mobile-active"),$("body").toggleClass("nav-mobile-active")}),$(window).on("scroll",function(){fixedNavbar()}),$(document).ready(function(){grunticon(["/typo3conf/ext/piazza_base/Resources/Public/Icons/GruntIcons/icons.data.svg.css","/typo3conf/ext/piazza_base/Resources/Public/Icons/GruntIcons/icons.data.png.css","/typo3conf/ext/piazza_base/Resources/Public/Icons/GruntIcons/icons.fallback.css"],grunticon.svgLoadedCallback)}),$(document).ready(function(){$("body").on("mousedown","*",function(e){($(this).is(":focus")||$(this).is(e.target))&&"none"==$(this).css("outline-style")&&$(this).css("outline","none").on("blur",function(){$(this).off("blur").css("outline","")})})}),$(document).ready(function(){initPagesNavbar()}),$(function(){if(0<$("a.lightbox").length){$("body").append('            <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">                <div class="pswp__bg"></div>                <div class="pswp__scroll-wrap">                    <div class="pswp__container">                        <div class="pswp__item"></div>                        <div class="pswp__item"></div>                        <div class="pswp__item"></div>                    </div>                    <div class="pswp__ui pswp__ui--hidden">                        <div class="pswp__top-bar">                            <div class="pswp__counter"></div>                            <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>                            <button class="pswp__button pswp__button--share" title="Share"></button>                            <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>                            <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>                            <div class="pswp__preloader">                                <div class="pswp__preloader__icn">                                    <div class="pswp__preloader__cut">                                        <div class="pswp__preloader__donut"></div>                                    </div>                                </div>                            </div>                        </div>                        <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">                            <div class="pswp__share-tooltip"></div>                         </div>                        <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>                        <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>                        <div class="pswp__caption">                            <div class="pswp__caption__center"></div>                        </div>                    </div>                </div>            </div>')}function n(e,t){var n=document.querySelectorAll(".pswp")[0],a=[];$("a.lightbox[rel="+t+"]").each(function(){var e={author:$(this).data("author"),title:$(this).attr("title"),date:$(this).data("date"),link:$(this).data("link"),caption:$(this).data("lightbox-caption")?$(this).data("lightbox-caption"):$(this).next("figcaption").text(),src:$(this).attr("href"),w:$(this).data("lightbox-width"),h:$(this).data("lightbox-height"),pid:$(this).index("a.lightbox[rel="+t+"]")};a.push(e)});var o={index:e,addCaptionHTMLFn:function(e,t){t.children[0].innerHTML="",e.title||(e.title="--none--"),e.author&&(t.children[0].innerHTML+='<div class="pswp__caption__author">'+e.author+"</div>"),e.title&&"--none--"!=e.title&&(t.children[0].innerHTML+='<div class="pswp__caption__title">'+e.title+"</div>"),e.date&&(t.children[0].innerHTML+='<div class="pswp__caption__date">'+e.date+"</div>");var n=window.location.pathname.split("/")[1];return e.link&&"fr"===n?t.children[0].innerHTML+="<a href="+e.link+' class="pswp__caption__link button dark" target="_blank">En savoir plus</a>':e.link&&"es"===n?t.children[0].innerHTML+="<a href="+e.link+' class="pswp__caption__link button dark" target="_blank">Más información</a>':e.link&&"en"===n&&(t.children[0].innerHTML+="<a href="+e.link+' class="pswp__caption__link button dark" target="_blank">Find out more</a>'),e.caption&&(t.children[0].innerHTML+='<div class="pswp__caption__subtitle">'+e.caption+"</div>"),!0},spacing:.12,loop:!0,bgOpacity:1,closeOnScroll:!0,history:!0,galleryUID:t,galleryPIDs:!0,closeEl:!0,captionEl:!0,fullscreenEl:!0,zoomEl:!0,shareEl:!1,counterEl:!0,arrowEl:!0,preloaderEl:!0};0<a.length&&new PhotoSwipe(n,PhotoSwipeUI_Default,a,o).init()}$("body").on("click","a.lightbox",function(e){e.preventDefault();var t=$(this).attr("rel");n($(this).index("a.lightbox[rel="+t+"]"),t)});var e=function(){var e=window.location.hash.substring(1),t={};if(e.length<5)return t;for(var n=e.split("&"),a=0;a<n.length;a++)if(n[a]){var o=n[a].split("=");o.length<2||(t[o[0]]=o[1])}return t}();e.pid&&e.gid&&n(parseInt(e.pid),e.gid)}),$("a.scroll-top").click(function(e){e.preventDefault(),smoothScrollTop(this)}),$(window).on("scroll",function(){300<$(this).scrollTop()?$(".scroll-top").addClass("scroll-top-visible"):$(".scroll-top").removeClass("scroll-top-visible")}),$(".show-more-keywords, .show-less-keywords").on("click",function(){$(".show-more-keywords, .show-less-keywords").toggleClass("d-none")}),$(document).ready(function(){$(".show-more-text")&&showMoreText(),$("body").on("click",".show-more-btn",function(){var e=$(this).parent();$(this).addClass("d-none"),e.find(".show-less-btn").toggleClass("d-none")}),$("body").on("click",".show-less-btn",function(){var e=$(this).parent();$("html, body").animate({scrollTop:e.offset().top-100},500),$(this).addClass("d-none"),e.find(".show-more-btn").toggleClass("d-none")})}),$(document).ready(function(){ticketingCartCookieName="stx_cartSummary_CGP_VEL_BTOC";for(var e=decodeURIComponent(document.cookie).split(/; ?/),t=[],n=0;n<e.length;n++){var a=e[n].split("=");t[a[0]]=a[1]}var o=$("#ticketing-cart");if(t[ticketingCartCookieName]){var i=t[ticketingCartCookieName].split("|"),s=i[0],l=i[3];Date.parse(l)>Date.now()?(o.removeClass("d-none"),o.children("#ticket-number").text(s)):o.addClass("d-none")}else o.addClass("d-none")}),$(".carousel-item-type-video").length&&"/"!==$(".carousel-video").find("source").attr("data-alternatesrc")&&($(window).width()<BREAKPOINT_MD&&_loadMobileVideo(),$(window).resize(function(){checkSwitchVideo()}));function checkSwitchVideo(){$(window).width()<BREAKPOINT_MD&&!mobile?_loadMobileVideo():$(window).width()>BREAKPOINT_MD&&mobile&&_loadDesktopVideo()}function _loadMobileVideo(){mobile=!0,$(".carousel-video").each(function(){var e=$(this).find("source");"/"!==e.attr("data-alternatesrc")&&e.attr("src",e.attr("data-alternatesrc"))}),_reloadVideos()}function _loadDesktopVideo(){mobile=!1,$(".carousel-video").each(function(){$(this).find("source").attr("src",$(this).find("source").attr("data-src"))}),_reloadVideos(document.getElementsByTagName("video"))}function _reloadVideos(){$(".carousel-video video").each(function(e,t){t.load()})}var v=document.querySelector("video"),t=document.querySelector('track[kind="chapters"]'),b=document.querySelector("#chapters");function render(){for(var e=t.track.cues,n=0;n<e.length;n++){var a=document.createElement("span");a.innerHTML=e[n].text,a.setAttribute("data-start",e[n].startTime),a.addEventListener("click",seek),document.querySelector("#chapters").appendChild(a)}}function seek(e){v.currentTime=this.getAttribute("data-start"),v.play()}function initChapters(){v=document.querySelector("video"),t=document.querySelector('track[kind="chapters"]'),b=document.querySelector("#chapters"),t&&((document.documentMode||/Edge/.test(navigator.userAgent))&&window.addEventListener("load",render,!1),t.addEventListener("load",render,!1))}initChapters();
(()=>{"use strict";const t=new class{constructor(){this.loading=!1,this.breakpoint=null}init(){this.calculateBreakpoint(),window.addEventListener("scroll",(()=>{window.scrollY>=this.breakpoint&&!this.loading&&"all"!==i.resultsType&&$("#total-results").data("count")>$("#count").data("count")&&(this.loading=!0,$(".display-more.spinner").show(),i.page+=1,$.ajax({url:ajaxUrl3.replace(/&amp;/g,"&"),async:!0,type:"POST",cache:!1,context:this,data:{resultsType:i.resultsType,displayType:i.displayType,filtersList:i.filtersList,terms:i.fulltext,page:i.page,sort:i.sortingType},dataType:"json",success:function(t,e,s){"Grid"==i.displayType?$("#results-cards").append(t.resultsList):$("table.table > tbody:last").append(t.resultsList);var o=$("#count").data("count")+t.count;$("#count").data("count",o)},error:function(t,e,s){console.log(this.url),console.log("[error] "+e+" - "+s),console.debug(t)},complete:()=>{this.loading=!1,grunticon.embedIcons(grunticon.getIcons(grunticon.getCSS(grunticon.href))),$(".display-more.spinner").hide(),this.calculateBreakpoint()}}))}))}calculateBreakpoint(){const t=document.querySelector("#page-footer");this.breakpoint=null,t&&(this.breakpoint=t.getBoundingClientRect().top/2+document.documentElement.scrollTop)}};const e=new class{constructor(){this.carouselsList={arts:{class:"carousel-arts",options:{numberOfItemsDesktop:4,marginMobile:!1,marginDesktop:!1,autoWidthMobile:!0,autoWidthDesktop:!1}},artists:{class:"carousel-artists",options:{numberOfItemsDesktop:5,marginMobile:!1,marginDesktop:!1,autoWidthMobile:!0,autoWidthDesktop:!1}},archives:{class:"carousel-archives",options:{numberOfItemsDesktop:5,marginMobile:!1,marginDesktop:!1,autoWidthMobile:!0,autoWidthDesktop:!1}},infos:{class:"carousel-infos",options:{numberOfItemsDesktop:3,marginMobile:!1,marginDesktop:!1,autoWidthMobile:!0,autoWidthDesktop:!1}},medias:{class:"carousel-medias",options:{numberOfItemsDesktop:5,marginMobile:!1,marginDesktop:!1,autoWidthMobile:!0,autoWidthDesktop:!1}},events:{class:"carousel-events",options:{numberOfItemsDesktop:4,marginMobile:!1,marginDesktop:!1,autoWidthMobile:!0,autoWidthDesktop:!1}},news:{class:"carousel-news",options:{numberOfItemsDesktop:4,marginMobile:!1,marginDesktop:!1,autoWidthMobile:!0,autoWidthDesktop:!1}},products:{class:"carousel-products",options:{numberOfItemsDesktop:6,marginMobile:!1,marginDesktop:!1,autoWidthMobile:!0,autoWidthDesktop:!1}}}}initCarousels(){for(let t in this.carouselsList)initOwlCarousel("."+this.carouselsList[t].class,this.carouselsList[t].options.numberOfItemsMobile,this.carouselsList[t].options.numberOfItemsDesktop,this.carouselsList[t].options.marginMobile,this.carouselsList[t].options.marginDesktop,this.carouselsList[t].options.autoWidthMobile,this.carouselsList[t].options.autoWidthDesktop)}};class s{constructor(){this.resultsType="all",this.displayType="Grid",this.sortingType="default",this.fulltext=null,this.filtersList=[],this.page=1}get resultsType(){return this._resultsType}get displayType(){return this._displayType}get filtersList(){return this._filtersList}get sortingType(){return this._sortingType}set resultsType(t){this._resultsType=t}set displayType(t){this._displayType=t}set filtersList(t){this._filtersList=t}set sortingType(t){this._sortingType=t}init(){const t=document.createElement("a");t.href=window.location.href;const e=t.search.substring(1).split("&");this.fulltext=$("#form-text input").val();const s=$("#resultsType").text();if(this.resultsType=s||"all",""!=e)for(let t=0;t<e.length;t++){let s=e[t].split("=");"sort"==s[0]?this.sortingType=decodeURIComponent(s[1]):"display"==s[0]?this.displayType=decodeURIComponent(s[1]):"terms"==s[0]?this.fulltext=decodeURIComponent(s[1].replace(/\+/g," ")):"cHash"!==s[0]&&this.filtersList.push({type:decodeURIComponent(s[0]),value:decodeURIComponent(s[1])})}$("#form-text").length?this.loadResults():this.resultsType="overlay",this.initListeners()}loadResults(){$("body").removeClass("nav-mobile-active"),$("#form-text").length&&this.activeResultsType(this.resultsType);var s=$(".loader");s.show(),$.ajax({url:ajaxUrl.replace(/&amp;/g,"&"),async:!0,type:"POST",cache:!1,context:this,data:{resultsType:this.resultsType,displayType:this.displayType,filtersList:this.filtersList,terms:this.fulltext,sort:this.sortingType},dataType:"json",success(t,e,s){console.log(e,s),$("#search-container").html(t.resultsList),$("#count").data("count",t.count),$('input[name="terms"]').val(this.fulltext)},error(t,e,s){console.log(this.url,"[error] "+e+" - "+s)},complete(){"all"===this.resultsType&&e.initCarousels(),this.activeResultsType(this.resultsType),this.page=1,t.calculateBreakpoint(),s.hide(),$("#suggestions-box").hide(),this.handleCheckboxes(),checkItemsOverflow(),grunticon.embedIcons(grunticon.getIcons(grunticon.getCSS(grunticon.href),!0))}})}initListeners(){$(window).on("popstate",(t=>{$("#search-results-page").length&&window.location.reload()})),$(document).on("click",".display-type-button",(t=>{this.displayType!==$(t.currentTarget).data("display")&&(this.displayType=$(t.currentTarget).data("display"),this.loadResults(),this.handleUrl())})),$(document).on("click","#search-results-page #pages-links-nav li, .category-title, .show-more-typo",(t=>{if(t.preventDefault(),this.resultsType!==$(t.currentTarget).data("type")){var e="";($(t.currentTarget).find("a").hasClass("active-link")||$(t.currentTarget).hasClass("category-title")||$(t.currentTarget).hasClass("show-more-typo"))&&(e=$(t.currentTarget).find("a").hasClass("active-link")?$(t.currentTarget).find("a").attr("href"):$(t.currentTarget).attr("href"),window.history.pushState("","",e),this.resultsType=$(t.currentTarget).data("type"),this.filtersList=this.filtersList.filter((t=>"fulltext"===t.type)),$("#resultsType").text($(t.currentTarget).data("type")),this.sortingType="default",window.scrollTo(0,0),this.loadResults())}})),window.onresize=()=>{this.filtersPanelResize()},$(document).on("change","#results-sorting",(t=>{this.sortingType=$(t.currentTarget).val(),this.loadResults(),this.handleUrl()})),$(document).on("click","#search-results-page #filters-button-mobile, #search-results-page #filters-mobile-panel-overlay, #search-results-page .close-filters",(t=>{t.preventDefault(),this.filtersPanelResize(),$("#filters-container").toggleClass("show"),$("body").toggleClass("nav-mobile-active"),$("#filters-mobile-panel-overlay.search-overlay").toggleClass("visible")})),$(document).on("keyup","input.search-facet",(t=>{var e=s.cleanCharacters($(t.currentTarget).val().toLowerCase());$("."+$(t.currentTarget).data("filter")).children("li").filter((function(){$(this).toggle(s.cleanCharacters($(this).text().toLowerCase()).indexOf(e)>-1)}))})),$(document).on("click","li.search",(function(){const t=$("#search-overlay input")[0];setTimeout((()=>{t.focus()}),500)})),$(document).on("change",'#form-filters input[type="checkbox"]',(function(){var t=$(this)[0].name,e=$(this).data("group"),s=$('input[name="'+t+'"]:checked').length;s>0?($("#dropdownMenuButton_"+e).addClass("active"),$("#dropdownMenuButton_"+e+" .active-filters-count").html("("+s+")")):($("#dropdownMenuButton_"+e).removeClass("active"),$("#dropdownMenuButton_"+e+" .active-filters-count").html(""))})),$(document).on("click",".dropdown-menu",(function(t){t.stopPropagation()})),$(document).on("submit","#form-filters",(t=>{t.preventDefault();var e=$("#form-filters").serializeArray();$.each(e,((t,e)=>{this.filtersList.find((t=>"artiste"===t.type))?"artiste[]"!==e.name&&this.addFilter({type:e.name,value:e.value}):this.filtersList.find((t=>"domaineCollection"===t.type))?"domaineCollection[]"!==e.name&&this.addFilter({type:e.name,value:e.value}):this.filtersList.find((t=>"typeOeuvre"===t.type))?"typeOeuvre[]"!==e.name&&this.addFilter({type:e.name,value:e.value}):this.addFilter({type:e.name,value:e.value})})),this.sortingType=$("#results-sorting").val(),this.loadResults(),this.handleUrl()})),$(document).on("submit","#form-text",(t=>{t.preventDefault(),$("#suggestions-box").hide(),this.fulltext=$("#form-text input").val(),this.resultsType="all";var e=$(".menu-all").attr("href").split("?")[0];window.history.pushState("","",e),$("#form-text input").blur(),this.loadResults(),this.handleUrl()})),$(document).on("click",".simpleCheckBox",(t=>{t.preventDefault(),!1===$(t.currentTarget).prop("checked")?this.deleteFilter($(t.currentTarget)):this.addFilter({type:$(t.currentTarget).attr("name"),value:$(t.currentTarget).attr("value")}),this.loadResults(),this.handleUrl()})),$(document).on("click",'#form-filters input[type="radio"]',(t=>{t.preventDefault();var e=$("#form-filters").serializeArray(),s=this.filtersList.findIndex((t=>t.type===$(this).data("type")&&t.value!==$(this).data("value")));this.filtersList.splice(s,1),$.each(e,((t,e)=>{this.addFilter({type:e.name,value:e.value})})),this.loadResults(),this.handleUrl()})),$(document).on("click",".delete-filter",(t=>{this.deleteFilter($(t.currentTarget)),this.loadResults(),this.handleUrl()})),$(document).on("click",".reset-filters button",(()=>{this.filtersList=[],this.loadResults(),this.handleUrl()})),$(document).on("click",".search-button-desktop",(t=>{t.preventDefault()}))}static cleanCharacters(t){return Object.entries({Š:"S",š:"s",Ð:"D",Ž:"Z",ž:"z",À:"A",Á:"A",Â:"A",Ã:"A",Ä:"A",Å:"A",Æ:"A",Ç:"C",È:"E",É:"E",Ê:"E",Ë:"E",Ì:"I",Í:"I",Î:"I",Ï:"I",Ñ:"N",Ò:"O",Ó:"O",Ô:"O",Õ:"O",Ö:"O",Ø:"O",Ù:"U",Ú:"U",Û:"U",Ü:"U",Ý:"Y",Þ:"B",ß:"Ss",ầ:"a",à:"a",á:"a",â:"a",ã:"a",ä:"a",å:"a",æ:"a",ç:"c",è:"e",é:"e",ê:"e",ë:"e",ì:"i",í:"i",î:"i",ï:"i",ð:"o",ñ:"n",ò:"o",ó:"o",ô:"o",õ:"o",ö:"o",ø:"o",ù:"u",µ:"u",ĵ:"j",ú:"u",û:"u",ü:"u",ý:"y",þ:"b",ÿ:"y",ƒ:"f",º:"o","°":"o",ª:"a",œ:"oe","¡":"i",ẑ:"z",Ẑ:"Z"}).forEach((([e,s])=>{for(;-1!==t.indexOf(e);)t=t.replace(e,s)})),t}activeResultsType(t){var e=$("#pages-links-nav li");e.removeClass("active"),e.each((function(){$(this).data("type")===t&&$(this).addClass("active")})),this.positionActiveLink()}positionActiveLink(){const t=$("#pages-links-nav ul"),e=$("#pages-links-nav ul li.active"),s=e.width();if(e.length){const i=e.position().left,o=(t.width()-s)/2,a=10;t.scrollLeft(i-o+a)}}deleteFilter(t){var e=this.filtersList.findIndex((e=>e.type===$(t).data("type")&&e.value===$(t).data("value").toString()));e>=0&&this.filtersList.splice(e,1)}addFilter(t){this.filtersList.some((e=>e.value===t.value&&e.type===t.type))||""!==t.value&&this.filtersList.push(t)}handleUrl(){var t=!0,e=window.location.href.split("?")[0];""!==this.fulltext&&(e+="?terms="+this.fulltext,t=!1),"all"!==this.resultsType&&(this.filtersList.forEach((function(s,i){t?(e+="?",t=!1):e+="&",e+=encodeURI(s.type)+"="+encodeURI(s.value)})),"default"!==this.sortingType&&(t?(e+="?sort="+this.sortingType,t=!1):e+="&sort="+this.sortingType),t?(e+="?display="+this.displayType,t=!1):e+="&display="+this.displayType),window.history.pushState("","",e)}handleCheckboxes(){$(".form-group").each((function(t){let e=$(this).find("input:checked").length;e>0&&($(this).find("button.dropdown-toggle").addClass("active"),$(this).find("button.dropdown-toggle .active-filters-count").html("("+e+")"))}));let t=$("#advanced-filters-collapse");t.find("button.active").length>0&&t.addClass("show")}filtersPanelResize(){var t=window.innerHeight;$("#filters-container").css({height:t})}}const i=new s,o=()=>{var t,e=$(".search-input-container"),s=$(".search-input-container input"),o="";function a(t){if(o.length>2){const e=$(window).width()<BREAKPOINT_MD,s="form-text"===t?ajaxSuggestionBox:ajaxSuggestionBoxOverlay;$.ajax({url:s.replace(/&amp;/g,"&"),async:!0,type:"POST",cache:!1,context:this,data:{resultsType:i.resultsType,searchTerm:o,mobile:e},dataType:"json",success:function(e,s,i){"form-text"===t?$("#suggestions").html(e.html):$("#suggestions-overlay").html(e.html),$("#suggestions-box").show()},error:function(t,e,s){console.debug(this.url,"[error] "+e+" - "+s)},complete:function(){var t;grunticon.embedIcons(grunticon.getIcons(grunticon.getCSS(grunticon.href))),function(t){var e=$(".suggestion-text"),s=new RegExp(t,"ig");e.each((function(){$(this)[0].innerHTML=$(this)[0].textContent.replace(s,(function(t){return"<span class='highlighted-term'>"+t+"</span>"}))}))}(o),t=$(".suggestion-text-keywords"),Array.from(t).forEach((function(t,e){t.addEventListener("click",n)}))}})}}function n(t){if("overlay"!==i.resultsType){t.preventDefault(),i.resultsType="all";var e=$(".menu-all").attr("href").split("?")[0];window.history.pushState("","",e)}s.val($(this).text()),i.fulltext=s.val(),i.loadResults(),i.handleUrl()}s.on("focus keyup",(function(){clearTimeout(t),(o=$(this).val()).length>2?t=setTimeout(a,500,$(this).parent().attr("id")):$("#suggestions-box").hide()})),$(window).resize((function(){$("#suggestions-box").hide()})),$(document).mouseup((function(t){e.is(t.target)||0!==e.has(t.target).length||$("#suggestions-box").hide()}))};window.addEventListener("DOMContentLoaded",(()=>{i.init(),t.init(),o()}))})();
$(document).ready(function () {
    let creditsAccordion = $(".credits-accordion");
    let creditsContent = $(".credits-content");
    let creditsBtn = $(".credits-btn");

    $('.credits-btn, .close-credits').on('click', function (e) {
        e.preventDefault();

        creditsContent.toggleClass('hidden');
        creditsAccordion.toggleClass('collapsed');

        creditsBtn.attr('aria-expanded', function(index, attr){
            return attr == 'true' ? false : true;
        });
        creditsContent.attr('aria-hidden', function(index, attr){
            return attr == 'true' ? false : true;
        });
    });
});

(()=>{var e,o=null,t=[],n=$("#concept-page .artworks-thumbnails"),a="/typo3conf/ext/piazza_base/Resources/Public/Images/image-placeholder-white.png",i="/typo3conf/ext/piazza_base/Resources/Public/Images/image-placeholder-person-white.png";function s(e){return e.map((e=>"dzi"===e.type?e.url:e))}function r(){$(".navigator, .osd-control").removeClass("hidden"),$(".navigator").parent().css("pointer-events","unset")}function l(){var e=!1;$(".osd-control").each((function(o,t){var n=!!("ontouchstart"in window)||window.navigator.msMaxTouchPoints>0;$(t).is(":hover")&&!n&&(e=!0)})),e||($(".navigator").addClass("hidden"),$(".navigator").parent().css("pointer-events","none"),$(".osd-control").addClass("hidden"))}function u(){$(".viewer-pagination").html(o.currentPage()+1+"/"+t.length)}function d(e){var o=t[e].consultation,n=$("#consultation-message");if(n.addClass("d-none"),o&&"Droits de diffusion OK"!==o&&"autorisé"!==o){var a=null;switch(o){case"RNA":a="Reproduction non autorisée";break;case"RAA":a="Reproduction en attente d'autorisation";break;case"PDR":a="Pas de reproduction";break;case"RNA|RAA":a="Reproduction non autorisée ou en attente d'autorisation"}n.html(a),n.addClass("d-block")}}function c(){var e,a,i,s;!function(e){$(".owl-item").removeClass("active-osd-image"),$(".owl-item:eq("+e+")").addClass("active-osd-image");var t=o.currentPage()-1,a=o.currentPage()+1,i=$(".artworks-thumbnails .owl-item:eq("+t+")").hasClass("active"),s=$(".artworks-thumbnails .owl-item:eq("+a+")").hasClass("active");i&&s||n.trigger("to.owl.carousel",o.currentPage())}(o.currentPage()),"object"==typeof(e=t[o.currentPage()])&&!1===e.zoomable?($(".navigator, .zoom-buttons-container").hide(),o.setMouseNavEnabled(!1),o.navigator.element.style.display="none"):($(".navigator, .zoom-buttons-container").show(),o.setMouseNavEnabled(!0),o.navigator.element.style.display="block"),u(),a=o.currentPage(),i=$(".credits-accordion-openseadragon"),s=i[a],$(i).removeClass("active"),$(s).addClass("active"),d(o.currentPage())}$("#openseadragon-viewer").length&&(initOwlCarousel(".artworks-thumbnails",2,4,!0,!0,!0,!0),$(".osd-thumbnails li").each((function(){var e=$(this).find("img")[0];if(e){var o=e.dataset;o.dzi?t.push({type:"dzi",url:o.dzi,zoomable:!o.zoom||o.zoom}):o.img&&t.push({type:"image",url:o.img,zoomable:!1})}else{var n=$(this).find("i")[0].dataset.consultation,s=$(this).find("i")[0].dataset.conceptType;t.push({type:"image",url:"personne"===s?i:a,zoomable:!1,consultation:n})}})),OpenSeadragon.setString("Tooltips.FullPage",""),OpenSeadragon.setString("Tooltips.NextPage",""),OpenSeadragon.setString("Tooltips.PreviousPage",""),OpenSeadragon.setString("Tooltips.ZoomIn",""),OpenSeadragon.setString("Tooltips.ZoomOut",""),OpenSeadragon.setString("Tooltips.Home",""),(o=OpenSeadragon({id:"openseadragon-viewer",prefixUrl:"/typo3conf/ext/piazza_base/Resources/Public/Icons/OpenSeadragon/images/default/",tileSources:s(t),autoHideControls:!1,fullPageButton:"osd-full-page-button",zoomInButton:"osd-zoom-in-button",zoomOutButton:"osd-zoom-out-button",nextButton:"osd-next-button",previousButton:"osd-previous-button",showSequenceControl:!0,sequenceMode:!0,showNavigator:!0,navigatorPosition:"ABSOLUTE",navigatorTop:"calc(100% - 200px)",navigatorLeft:"calc(100% - 300px)",navigatorHeight:"200px",navigatorWidth:"300px"})).setControlsEnabled(!1),u(),d(0),t.length>1&&$("#osd-next-button, #osd-previous-button").removeClass("hide-pagination-control"),t.some((e=>![a,i].includes(e.url)))&&$("#osd-full-page-overlay, .full-page-btn").removeClass("disabled"),$("#openseadragon-viewer").on("contextmenu",(e=>e.preventDefault())),function(){$("#osd-close-fullscreen").click((function(){o.setFullPage(!1),o.viewport.goHome()})),$("#osd-full-page-overlay:not('.disabled'), .full-page-btn").click((function(){o.setFullPage(!0),r()})),$("#openseadragon-viewer").on("click mousemove touchmove touchstart",(function(){r(),clearTimeout(e),e=setTimeout(l,2e3)})),o.addHandler("page",(function(){c()})),n.on("initialized.owl.carousel",(function(){$(".owl-item:eq(0)").addClass("active-osd-image")})),$(".osd-thumbnails li").click((function(){var e=$(".artworks-thumbnails li").index($(this));o.goToPage(e)})),o.addHandler("full-page",(function(){c()})),$(document).on("keyup",(function(e){"Escape"==e.key&&(o.setFullPage(!1),o.viewport.goHome())}));var t=$(".credits-accordion-openseadragon"),a=t.find(".osd-credits-content"),i=t.find(".osd-credits-btn"),s=t.find(".close-osd-credits");$(i).add(s).on("click",(function(e){e.preventDefault(),a.toggleClass("hidden"),t.toggleClass("collapsed"),i.attr("aria-expanded",(function(e,o){return"true"!=o})),a.attr("aria-hidden",(function(e,o){return"true"!=o}))}))}())})();
$(document).ready(function() {
    initCarousels();
});

function initCarousels() {
    /**
     * Initialisation des carrousels avec différents paramètres
     */
    var carousels = {
        "medias": {
            class: "carousel-medias",
            options: {
                numberOfItemsDesktop: 5,
                marginMobile: 20,
                marginDesktop: 20,
                autoWidthMobile: true,
                autoWidthDesktop: false
            }
        },
        "events": {
            class: "carousel-events",
            options: {
                numberOfItemsDesktop: 4,
                marginMobile: 20,
                marginDesktop: 20,
                autoWidthMobile: true,
                autoWidthDesktop: false
            }
        },
        "products": {
            class: "carousel-products",
            options: {
                numberOfItemsDesktop: 6,
                marginMobile: 20,
                marginDesktop: 20,
                autoWidthMobile: true,
                autoWidthDesktop: false
            }
        }
    };

    for(carouselType in carousels) {
        initOwlCarousel(
            "." + carousels[carouselType].class,
            carousels[carouselType].options.numberOfItemsMobile,
            carousels[carouselType].options.numberOfItemsDesktop,
            carousels[carouselType].options.marginMobile,
            carousels[carouselType].options.marginDesktop,
            carousels[carouselType].options.autoWidthMobile,
            carousels[carouselType].options.autoWidthDesktop
        );
    }
}
$(document).ready(function () {
    $('.content-bloc').each(function(index, currElement) {
        var isNotLastContentBloc = $('.content-bloc').length - 1 != index;
        var isNotFullWidth = !$(currElement).hasClass('content-bloc-full-width')
        var nextContentBlocIsNotFullWidth = !$('.content-bloc').eq(index + 1).hasClass('content-bloc-full-width');
        if (isNotLastContentBloc && isNotFullWidth && nextContentBlocIsNotFullWidth) {
            $(currElement).addClass('border-bottom')
        }
    })
});