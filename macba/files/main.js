let initiatedPlayers = [];

function macba_init_audio_players(){
    const audioPlayers = document.querySelectorAll('.podcast-audio');

    audioPlayers.forEach((playerElement) => {
        if(!initiatedPlayers.includes(playerElement)){
            createAudioPlayer(playerElement);
            initiatedPlayers.push(playerElement);
        }
    });
}
if(document.querySelector(".podcast-audio")){
    macba_init_audio_players();
}

function createAudioPlayer(playerElement) {
    const playerButton = playerElement.querySelector(".player-button-bold"),
    audio = playerElement.querySelector("audio"),
    timeline = playerElement.querySelectorAll(".timeline"),
    current = playerElement.querySelector(".current-time"),
    totalTime = playerElement.querySelector(".total-time"),
    tenMore = playerElement.querySelector(".ten-more-button"),
    tenLess = playerElement.querySelector(".ten-less-button"),
    audioStart = playerElement.querySelector(".audioStart"),
    audioEnd = playerElement.querySelector(".audioEnd"),
    overlay = playerElement.closest(".overlay-container");

    if (audio) {
        audio.onloadedmetadata = ()=> totalTime.innerHTML = formatTime(parseInt(audio.duration));
        current.innerHTML = formatTime(parseInt(audio.currentTime));
    }
    function formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return [h, m > 9 ? m : h ? "0" + m : m || "0", s > 9 ? s : "0" + s]
            .filter((a) => a)
            .join(":");
    }

    function toggleAudio() {
        if (audio.paused) {
            audio.play();
            playerButton.classList.replace("stop", "play");
            if(overlay)
                overlay.classList.add("bg-macba-orange");
        } else {
            audio.pause();
            playerButton.classList.replace("play", "stop");
            if(overlay)
                overlay.classList.remove("bg-macba-orange");
        }
    }
    
    if (playerButton) {
        playerButton.addEventListener("click", toggleAudio);
    }

    function audioEnded() {
        playerButton.classList.replace("play", "stop");
        if(overlay)
            overlay.classList.remove("bg-macba-orange");
    }
    if (audio) {
        audio.onended = audioEnded;
    }

    function changeTimelinePosition() {
        timeline.forEach(timeline => {
            const percentagePosition = (100 * audio.currentTime) / audio.duration;
            timeline.style.backgroundSize = `${percentagePosition}% 100%`;
            timeline.value = percentagePosition;
            if (current) {
                current.innerHTML = formatTime(parseInt(audio.currentTime));
            }
        });
    }
    if (audio) {
        audio.ontimeupdate = changeTimelinePosition;
    }

    function changeSeek() {
        const time = (timeline[0].value * audio.duration) / 100;
        audio.currentTime = time;
    }
    function removeOnTimeUpdate() {
        if (audio) {
            audio.ontimeupdate = null;
        }
    }
    function addOnTimeUpdate() {
        if (audio) {
            audio.ontimeupdate = changeTimelinePosition;
        }
    }
    if (timeline.length > 0) {
        timeline.forEach(element => {
            element.addEventListener("change", changeSeek);
            element.addEventListener("mousedown", removeOnTimeUpdate);
            element.addEventListener("mouseup", addOnTimeUpdate);
        });
    }
    function addTen() {
        audio.currentTime += 10;
    }
    function removeTen() {
        audio.currentTime -= 10;
    }
    function startAudio() {
        audio.currentTime = 0;
    }
    function endAudio() {
        audio.currentTime = audio.duration;
    }
    if (tenMore) {
        tenMore.addEventListener("click", addTen);
    }
    if (tenLess) {
        tenLess.addEventListener("click", removeTen);
    }
    if (audioStart) {
        audioStart.addEventListener("click", startAudio);
    }
    if (audioEnd) {
        audioEnd.addEventListener("click", endAudio);
    }
}

var player = null;
var expandedPlayer = null;
var currentAudioIndex = 0;
var magazineAudio = null;

function macba_get_active_player() {
    var playerContainer = jQuery(".macba-player:not(.d-none)").filter(function () {
		return !jQuery(this).closest(".d-none").length;
	})[0];
	var audioPlayer = jQuery(playerContainer).find("audio:not(.d-none, .macba-audio-magazine)").filter(function () {
		return !jQuery(this).closest(".d-none").length;
	})[0];
	var playerButton = jQuery(playerContainer).find(".player-button-bold:not(.d-none, .macba-audio-play)").filter(
		function () {
			return !jQuery(this).closest(".d-none").length;
		}
	)[0];
	return { playerContainer: playerContainer, audioPlayer: audioPlayer, playerButton: playerButton };
}

jQuery(document).on('click', '.macba-play-podcast, .macba-podcast-timeline', async function(){
	currentAudioIndex = 0;
    if(window.innerWidth > 768) {
		jQuery(".macba-desktop-player").removeClass("d-none");
	}else {
		jQuery(".macba-mobile-player").removeClass("d-none");
        expandedPlayer = jQuery(".macba-podcast-mobile-expanded").find(".macba-audio")[0];
	}
    if(player === null)
	    player = macba_get_active_player();
    var isTimeline = jQuery(this).hasClass("macba-podcast-timeline")
    var context = null;
    if(!isTimeline){
        macba_stop_podcast(player.audioPlayer, player.playerButton, false);
        context = jQuery(this);
    }else{
        context = jQuery(".macba-play-single")
    }
    var isMagazineAudio = jQuery(this).hasClass("macba-audio-play")
    var isBlockAudioBig = jQuery(this).hasClass("audio-post-number")

    var newPostId = context.data('postid')
	var newAudios = context.data("audiolinks")
	var newTitle = context.data("title")
	var newSubtitle = context.data("subtitle")
	var newCanal = context.data("canal")
	var newThumbnail = context.data("thumbnail")
    var newPostName = context.data("postname")
	var titleElements = jQuery(".macba-podcast-title");
	var canalElements = jQuery(".macba-podcast-canal");
	var thumbnailElements = jQuery(".macba-podcast-thumbnail");
    var downloadLinks = jQuery(".macba-podcast-download");
    var shareButtons = jQuery(".macba-player").find(".macba-share-button");
    var saveButtons = jQuery(".macba-player").find(".save-button")
    var postIdsSaved = JSON.parse(localStorage.getItem("post_ids_saved"))
    titleElements.each(function(index, element){
		jQuery(element).text(newTitle + ' ' + newSubtitle);
	})
	canalElements.each(function(index, element){
		jQuery(element).text(newCanal);
	})
	thumbnailElements.each(function(index, element){
        if(newThumbnail !== "" && newThumbnail !== undefined){
            jQuery(element).attr("src", newThumbnail);
            jQuery(element).removeClass('d-none')
            //TODO Albert/Isabel: Posar clase al player-container expandit per tal de que es vegi al mig de la pantalla (actualment si no hi ha imatge, es veu a dalt de tot)
            //jQuery(expandedPlayer).parents(".macba-expanded-player-container").removeClass("align-middle")
        }else{
            jQuery(element).addClass('d-none')
            //jQuery(expandedPlayer).parents(".macba-expanded-player-container").addClass("align-middle")
        }
	})
    downloadLinks.each(function(index, element){
        jQuery(element).removeAttr('href');
        jQuery(element).removeAttr('download');
        jQuery(element).removeAttr("data-podcastlinks")
        jQuery(element).removeAttr("data-postname")
        if(newAudios.length === 1){
            element.href = newAudios[0]['link']
            jQuery(element).attr("download", "")
        }else{
            jQuery(element).attr("data-podcastlinks", JSON.stringify(newAudios))
            jQuery(element).attr("data-postname", newPostName)
        }
    })
    shareButtons.each(function(index, element){
        jQuery(element).attr("data-bs-target", "#shareModal-"+newPostId)
    })
    saveButtons.each(function(index, element){
        if(postIdsSaved !== null && Array.isArray(postIdsSaved)){
            var isSaved = postIdsSaved.some(obj => obj.postId === newPostId);
            if(isSaved){
                jQuery(element).addClass('saved-item')
            }else{
                jQuery(element).removeClass('saved-item')
            }
        }
        jQuery(element).data("postid", newPostId)
    })

    // ======= Players Magazine =======
    var isPlayerEmpty = macba_player_is_empty(player)

    //pausa el reproductor de magazine que ja s'estigui reproduint
    if(magazineAudio !== null){
        await magazineAudio.pause()
        jQuery(magazineAudio).parent().siblings(".macba-audio-play")[0]?.classList.replace("play", "stop")
    }
    var newMagazineAudio = macba_get_playing_audio_magazine();

    //comportament normal amb altres audios o comportament d'audios magazines per refrescar els audio sources
    if(!isMagazineAudio || isPlayerEmpty || newMagazineAudio != magazineAudio || isBlockAudioBig){
        await macba_refresh_audio_sources(player.audioPlayer, newAudios);
        if(expandedPlayer){
            await macba_refresh_audio_sources(expandedPlayer, newAudios)
        }
    }
    //si l'audio que es vol reproduir és d'un magazine
    if(isMagazineAudio){
        var hasChanged = newMagazineAudio !== magazineAudio;
        //si ha canviat respecte al reproductor anterior i estem en un block audio en format gran (llistat d'audios)
        if(newMagazineAudio === null && isBlockAudioBig){
            magazineAudio = newMagazineAudio === null ? magazineAudio : newMagazineAudio;
            jQuery(magazineAudio).parent().siblings(".macba-audio-play")[0]?.classList.replace("stop", "play")
        }else
            magazineAudio = newMagazineAudio;
        //si el reproductor no és null, i el reproductor no està en pause o ha canviat, farem play dels audios (primer el reproductor del block que esta muted i després el reproductor fixed).
        //es sincronitza el temps entre els dos reproductors
        if(magazineAudio !== null && (!magazineAudio.paused || hasChanged)){
            await magazineAudio.play();
            await macba_play_podcast(player.audioPlayer, player.playerButton);
            player.audioPlayer.currentTime = magazineAudio.currentTime
        }else{
            await player.audioPlayer.pause()
            player.playerButton.classList.replace("play", "stop");
        }
    }else{//comportament normal si no es magazine
        await macba_play_podcast(player.audioPlayer, player.playerButton);
    }
    if(isTimeline){
        macba_set_audio_to_time(this)
    }

})

jQuery(".macba-magazine-timeline").on("change", function(){
    const time = (this.value * player.audioPlayer.duration) / 100;
    player.audioPlayer.currentTime = time;
})

jQuery(".macba-player-timeline").on("change", function(){
    const time = (this.value * player.audioPlayer.duration) / 100;
    if(magazineAudio !== null)
        magazineAudio.currentTime = time;
})

jQuery(".macba-play-magazine").on("click", function(){
    if(magazineAudio !== null){
        if(!magazineAudio.paused){
            magazineAudio.pause();
            jQuery(magazineAudio).parent().siblings(".macba-audio-play")[0]?.classList.replace("play", "stop");
        }else{
            magazineAudio.play();
            jQuery(magazineAudio).parent().siblings(".macba-audio-play")[0]?.classList.replace("stop", "play");
        }
    }
})

function macba_get_playing_audio_magazine() {
    let playingAudio = null;
    jQuery('.macba-magazine-audio-play').each(function() {
        if (jQuery(this).hasClass('play')) {
            playingAudio = jQuery(this).siblings().find(".macba-audio-magazine")[0];
            return false;
        }
    });
    
    return playingAudio;
}


function macba_player_is_empty(player){
    var playerEmpty = jQuery(player.audioPlayer).children().length === 0;
    return playerEmpty
}

jQuery(".macba-next-podcast").on("click", function(){
	player = macba_get_active_player();
	macba_next_podcast(player.audioPlayer, player.playerButton)
})

jQuery(".macba-prev-podcast").on("click", function(){
	player = macba_get_active_player();
	macba_prev_podcast(player.audioPlayer, player.playerButton)
})

jQuery(".macba-download-podcast-audios").on('click', async function() {
    var podcastLinks = jQuery(this).attr("data-podcastlinks")
    var postName = jQuery(this).attr("data-postname")

    if(podcastLinks !== undefined){
        podcastLinks = JSON.parse(podcastLinks);
        if (podcastLinks.length > 1)
            await macba_download_files(podcastLinks, postName);
    }
});

function macba_set_audio_to_time(timeline){
    player = macba_get_active_player();
	if(!isObjectEmpty(player)){
		var timeline = jQuery(timeline);
		player.audioPlayer.currentTime = timeline.data('minutes')*60+timeline.data('seconds');
	}
}

jQuery(".macba-show-timeline").on("click", function(){
    jQuery(this).toggleClass("macba-timeline-expanded")
    jQuery(".macba-timeline-container").slideToggle();
})

jQuery(".macba-mobile-retract-expanded, .macba-open-expanded-player").on('click', function(){
    player = macba_get_active_player();
    var currentTime = player.audioPlayer.currentTime
    var isAudioPlaying = !player.audioPlayer.paused;
    player.audioPlayer.pause()
    
    jQuery(".macba-mobile-player").toggleClass("d-none")
    jQuery(".macba-podcast-mobile-expanded").slideToggle();
    player = macba_get_active_player();
    if(isAudioPlaying == true){
        player.playerButton.classList.replace("stop", "play");
        macba_play_podcast(player.audioPlayer, player.playerButton, currentAudioIndex)
    }
    player.audioPlayer.currentTime = currentTime;
})

function macba_refresh_audio_sources(player, audios){
    jQuery(player).find("source").remove();
    // console.log("refreshed", jQuery(player));
	jQuery.each(audios, function (index, source) {
		var sourceElement = jQuery("<source>").attr({
			src: source["link"],
			type: "audio/mp3",
		});
		jQuery(player).append(sourceElement);
	});
}

function macba_close_player(){
    var player = macba_get_active_player();

    macba_stop_podcast(player.audioPlayer, player.playerButton);

    if(window.innerWidth > 768) {
        jQuery(".macba-desktop-player").addClass("d-none");
    }else {
        jQuery(".macba-mobile-player").addClass("d-none");
    }
}

async function macba_play_podcast(audioPlayer, playerButton, index = 0){
	var sources = jQuery(audioPlayer).children();
	var numSources = sources.length
	if(index < numSources){
		audioPlayer.src = jQuery(sources[index]).attr('src');
		audioPlayer.load();
		audioPlayer.play();
		playerButton.classList.replace("stop", "play");
	}
}

function macba_stop_podcast(audioPlayer, playerButton, resetTimer = true){
    audioPlayer.pause();
    if(resetTimer)
	    audioPlayer.currentTime = 0;
    playerButton.classList.replace("stop", "play");
}

function macba_next_podcast(audioPlayer, playerButton){
	var sources = jQuery(audioPlayer).children();
	var numSources = sources.length
	if(currentAudioIndex+1 < numSources){
        currentAudioIndex += 1;
		audioPlayer.currentTime = 0;
		macba_play_podcast(audioPlayer, playerButton, currentAudioIndex)
	}else{
        audioPlayer.currentTime = audioPlayer.duration;
    }
}

function macba_prev_podcast(audioPlayer, playerButton){
    if(audioPlayer.currentTime === audioPlayer.duration){
        audioPlayer.currentTime = 0;
        macba_play_podcast(audioPlayer, playerButton, currentAudioIndex)
    }else if(currentAudioIndex > 0){
		currentAudioIndex -= 1;
		macba_play_podcast(audioPlayer, playerButton, currentAudioIndex)
	}
	audioPlayer.currentTime = 0;
}

function isObjectEmpty(obj) {
	for (var prop in obj) {
		if (obj[prop] === undefined) {
			return true;
		}
	}
	return false;
}

//Dark Mode change value
function toggleDarkMode() {
    var darkModeValue = localStorage.getItem('dark_mode');
    var darkMode = (darkModeValue && darkModeValue === '1') ? '0' : '1';
    localStorage.setItem('dark_mode', darkMode);
    var menuElement = document.getElementById('theme-mode-menu');
    if (darkModeValue && darkModeValue === '1') {
        menuElement.innerHTML = `${macba_manual_translations['clar']}`;
    } else {
        menuElement.innerHTML = `${macba_manual_translations['fosc']}`;
    }
    applyDarkModeStyles();
}

function applyDarkModeStyles() {
    var darkModeValue = localStorage.getItem('dark_mode');
    var bodyElement = document.getElementsByTagName('body')[0];
    if (darkModeValue && darkModeValue === '1') {
        bodyElement.classList.add('dark-mode');
    } else {
        bodyElement.classList.remove('dark-mode');
    }
}

if(jQuery("#datepicker")){

	jQuery(function(jQuery) {
        var languageSettings = {
            'ca': {
                monthNames: ['gener', 'febrer', 'març', 'abril', 'maig', 'juny',
                    'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'
                ],
                monthNamesShort: ['gen', 'feb', 'març', 'abr', 'maig', 'juny',
                    'jul', 'ag', 'set', 'oct', 'nov', 'des'
                ],
                dayNames: ['diumenge', 'dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte'],
                dayNamesShort: ['dg', 'dl', 'dt', 'dc', 'dj', 'dv', 'ds'],
                dayNamesMin: ['dg', 'dl', 'dt', 'dc', 'dj', 'dv', 'ds'],
                weekHeader: 'Set',
                dateFormat: 'dd/mm/yy',
                firstDay: 1,
                isRTL: false,
                showMonthAfterYear: false,
                yearSuffix: '',
            },
            'es-ES': {
                monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
                ],
                monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun',
                    'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
                ],
                dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
                dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
                dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
                weekHeader: 'Sem',
                dateFormat: 'dd/mm/yy',
                firstDay: 1,
                isRTL: false,
                showMonthAfterYear: false,
                yearSuffix: '',
            },
            'en': {
                monthNames: ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ],
                monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ],
                dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                weekHeader: 'Wk',
                dateFormat: 'dd/mm/yy',
                firstDay: 0,
                isRTL: false,
                showMonthAfterYear: false,
                yearSuffix: '',
            }
        };
        var currentLanguage = getCurrentLanguage();
        if (languageSettings[currentLanguage]) {
            jQuery.datepicker.setDefaults(languageSettings[currentLanguage]);
        } else {
            jQuery.datepicker.setDefaults(languageSettings['en']);
        }
		jQuery.datepicker.setDefaults(jQuery.datepicker.regional['ca']);
	});
    //crida ajax que retorni els dies que
    var datesWithActivities = null;
    if(jQuery(".slider-activitats").length > 0 || jQuery(".macba-timeline-slider").length > 0){
        macba_set_dates_with_activities();
    }

    var currentDate = new Date();
    var initialMonth = currentDate.getMonth();
    var maxDate = 2;
    jQuery(function() {
		jQuery("#datepicker").datepicker({
			showButtonPanel: true,
			isRTL: true,
            maxDate: "+"+(maxDate+1)+"M",
            currentText: `${macba_manual_translations.esborrar}`,
			onClose: function(dateText, inst) {
				if(window.innerWidth > 992) {
                    jQuery(".datapicker-overlay-desktop").css("display", "none");
				}else {
                    jQuery(".macba-overlay-mobile").css("display", "none");
                    jQuery("body").css("overflowY", "auto");
				}
			},
            beforeShowDay: function(date){

                var currentMonth = date.getMonth()-initialMonth;
                var currentDay = date.getDate()-1;

                if(date.getMonth() >= currentDate.getMonth() && date.getMonth() < (currentDate.getMonth()+maxDate+1)){

                    if(datesWithActivities[currentMonth][currentDay] === true){
                        return [true, ""];
                    }
                    return [false, "disabled-day"];
                }
                return [false, "disabled-day"];
            },
            onChangeMonthYear: function (year, month, inst) {
                var currentYear = currentDate.getFullYear();
                var currentMonth = currentDate.getMonth()+1;

                if ((year < currentYear) || (year === currentYear && month < currentMonth) || (year === currentYear && month > currentMonth + 2)) {
                    if(month > currentMonth + 2)
                        //month = month-2;
                    jQuery(this).datepicker("setDate", new Date(year, month, 1));
                }
            },
            onSelect: async function(dateText, inst){
                macba_update_slider(dateText);
            }
		})
	});
}

function getCurrentLanguage() {
    var currentLanguage = jQuery('html').attr('lang');
    if (!currentLanguage) {
        currentLanguage = 'en';
    }
    return currentLanguage;
}

async function macba_update_slider(dateText){
    var fecha = dateText.split('/');
    fecha = fecha[2] + "-" + fecha[1] + "-" + fecha[0];
    var activitats =  await macba_get_activities_by_date(fecha);
    jQuery(sliderContext).parents('.slider-header-container').siblings('.swiper-wrapper').html(activitats);
}

function macba_set_dates_with_activities(tipologia_activitats, tipologia_public) {
	jQuery.ajax({
		type: "GET",
		url: "/wp-admin/admin-ajax.php",
		data: {
			postType: 1,
			ignoreBetween: false,
            tipologia_activitats: tipologia_activitats,
            tipologia_public: tipologia_public,
			action: "macba_get_days_with_activities_sliders",
		},
		success: function (response) {
            if(response)
			    datesWithActivities = response;
		},
	});
}

async function macba_get_activities_by_date(chosen_date) {
	var result =  await jQuery.ajax({
		type: "POST",
		url: "/wp-admin/admin-ajax.php",
		data: {
			postType: 'activitats',
            date : chosen_date,
			action: "macba_get_slides",
		},
	});

    return result;

}

var sliderContext;
function showDatePickerOverlay(context = null) {
    if (context){
        sliderContext = context;
    }
    if (window.innerWidth > 992) {
        jQuery(".datapicker-overlay-desktop").css("display", "block");
    } else {
        jQuery(".macba-overlay-mobile").css("display", "block");
        jQuery("body").css("overflowY", "hidden");
    }

    if(jQuery('#datepicker')){
        jQuery('.ui-datepicker-current').removeClass('ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all').addClass('remove-date date-picker-remove macba-button button-basic-m cursor-pointer');
        jQuery('.date-picker-remove.remove-date').removeAttr('data-handler');
        jQuery('.date-picker-remove.remove-date').removeAttr('data-event');

        var div = jQuery('<div>', {
            html: jQuery('.date-picker-remove.remove-date').html(),
            class: jQuery('.date-picker-remove.remove-date').attr('class'),
            click: function() {
                var datepicker = jQuery("#datepicker");
                if(datepicker.datepicker('getDate') != null){
                    datepicker.datepicker("setDate", null);
                    datepicker.trigger("change");
                    addClaendarMobileHeader();
                    changeCalendarButtonText();
                }
            }
        });
        
        // Reemplaza el botón con el div
        jQuery('.date-picker-remove.remove-date').replaceWith(div);
        addClaendarMobileHeader();
        changeCalendarButtonText();
    }
}

function addClaendarMobileHeader() {
    var mobileDiv = jQuery('<div class="d-flex d-md-none header-calendar-mobile position-relative"><div class="text-body body-s">Tria el dia</div><div onclick="hideDatepicker();" class="position-absolute header-calendar-close-icon"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="svg-link" d="M16 15.2894L10.7106 10L10 10.7105L15.2895 16L10 21.2895L10.7105 22L16 16.7105L21.2895 22L22 21.2895L16.7106 16L22 10.7105L21.2895 10L16 15.2894Z" fill="#0B0E0D"/></svg></div></div>');

    jQuery('#ui-datepicker-div').prepend(mobileDiv);
}

function changeCalendarButtonText() {
    jQuery('.ui-datepicker-close').text(`${macba_manual_translations.fet}`);
}

function hideDatepicker() {
    jQuery(".macba-overlay-mobile").css("display", "none");
    jQuery("body").css("overflowY", "auto");
    jQuery("#datepicker").datepicker("hide");
}

jQuery(document).on('click', ".save-button", function (event){
    event.preventDefault();
    var button = jQuery(this);
    saveButtonOnClick(button);
});

function saveButtonOnClick(button) {
    var button = jQuery(button);
    var data = button.data();

    button.toggleClass("saved-item");
    var cookieContent = document.cookie.replace(/(?:(?:^|.*;\s*)post_objects_saved\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    var arrayPostIds = JSON.parse(cookieContent !== undefined && cookieContent !== "" ? cookieContent : "[]");
    macba_update_cookies_saved_posts(arrayPostIds, data['postid'], data['posttype'], data['extraimage']);
    var localStoragePostIds = JSON.parse(localStorage.getItem("post_ids_saved"));
    macba_update_cookies_saved_posts(localStoragePostIds, data['postid'], data['posttype'], data['extraimage'], false);
}

function macba_update_cookies_saved_posts(collectionPostObjects, postId, postType, extraImage, isCookie = true){
    if(!collectionPostObjects){
        collectionPostObjects = [];
    }

    const currentDate = new Date();

    const postObject = {
        postId: postId,
        postType: postType,
        extraImage: extraImage,
        fecha: currentDate
    };

    const postIndex = (collectionPostObjects.length > 0) ? collectionPostObjects.findIndex(item => item.postId === postId) : -1;

    if (postIndex === -1) {
        collectionPostObjects.push(postObject);
    } else {
        collectionPostObjects.splice(postIndex, 1);
    }
    collectionPostObjects.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    if(isCookie === true){
        document.cookie = "post_objects_saved=" + JSON.stringify(collectionPostObjects) + "; path=/; ";
    }else{
        localStorage.setItem("post_ids_saved", JSON.stringify(collectionPostObjects));
    }
}

function showOverlay() {
	if(window.innerWidth > 992) {
		document.querySelector(".agrupadora-overlay").style.display = 'block';
	}else {
		document.querySelector(".macba-overlay-mobile").style.display = 'block';
	}
}

// Se guarda la posición de scroll de la pantalla al mostrar los filtros de agenda en mobile porque con css no puedo moverlo mas
var savedScrollPosition = 0;

function showAgendaFiltersOverlay() {
    document.querySelector(".macba-overlay-mobile").style.display = 'block';
    savedScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    window.scrollTo(0, 0);
}


//Dropdown Bootstrap
if(document.querySelectorAll('.bootstrap-dropdown .form-check-label')){
	var dropdowns = document.querySelectorAll('.dropdown');
	var inputLabels = document.querySelectorAll('.bootstrap-dropdown .form-check-label');
	inputLabels.forEach(function (label) {
		label.addEventListener('click', function (event) {
		event.stopPropagation();
		});
	});
	dropdowns.forEach(function(dropdown) {
		dropdown.addEventListener('hidden.bs.dropdown', function () {
			if(window.innerWidth > 992) {
				agrupadoraOverlay = document.querySelector(".agrupadora-overlay")
				if (agrupadoraOverlay)
					agrupadoraOverlay.style.display = 'none';
			}else {
				overlayMobile = document.querySelector(".macba-overlay-mobile")
				if (overlayMobile)
				overlayMobile.style.display = 'none';
                bodyOverflow = document.querySelector("body")
                if (bodyOverflow)
				bodyOverflow.style.overflowY = 'auto';

                agendaFilters = document.getElementById('mobileAgendaFilters');
                if (agendaFilters){
                    window.scrollTo(0, savedScrollPosition);
                }
			}
		});
	});
}

jQuery('#datepicker').change(function (e) {
    e.preventDefault();
    var selectedDate = jQuery(this).datepicker('getDate');
    var postType = jQuery(this).data('posttype');

    var dateDay = null;
    var dateMonth = null;
    var dateYear = null;
    var date = null;

    if(selectedDate != null){
        dateDay  = selectedDate.getDate().toString().padStart(2, '0');
        dateMonth = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
        dateYear = selectedDate.getFullYear();
        date =  dateYear+ "-" + dateMonth + "-" + dateDay;
    }

    jQuery.ajax({
        type: "POST",
        url: "/wp-admin/admin-ajax.php",
        data: {
            action: "macba_get_slides",
            date: date,
            postType: postType
        },success: function(response) {
            var sliderId = jQuery(e.target).parents(".slider-header-container").siblings('.swiper-wrapper').attr('id');
            jQuery("#"+sliderId).html(response);
        },
    })

});

//*********************************
//****** ARCHIVES AND AGENDA ******
//*********************************

var tipologia_activitats = [];
var tipologia_public = [];
var tipologia_archive = [];
var estat_archive = [];
var anys_archive = [];
var currentArchive = jQuery(".agrupadora-template").attr("id");
var currentPage = 1;
var seeMore_original_text = "";

//=================================
//=========== SUBMITS =============
//=================================

jQuery(".submit-filters").on("click", async function () {
    tipologia_archive = [];
    tipologia_public = [];
    estat_archive = [];
    anys_archive = [];
    macba_submit_inputs("tax")
    macba_submit_inputs("tax-public");
    macba_submit_inputs("state")
    macba_submit_inputs("year")
    currentPage = 1;
    // await macba_apply_filter_archive();
});

jQuery(".submit-filters-block-llistat").on("click", async function () {
    tipologia_archive = [];
    estat_archive = [];
    anys_archive = [];
    macba_submit_inputs("tax-activities")
    macba_submit_inputs("tax-public")
    macba_submit_inputs("state")
    macba_submit_inputs("year")
    currentPage = 1;
    await macba_block_llistat_posts_apply_filter();
});

var dropdowns = document.querySelectorAll('.dropdown');
//mirar si fem servir el applyfilter 1 o 2
dropdowns.forEach(function(dropdown) {
    dropdown.addEventListener('hidden.bs.dropdown', async function () {
        tipologia_archive = [];
        estat_archive = [];
        anys_archive = [];
        macba_submit_inputs("tax")
        macba_submit_inputs("tax-activities")
        macba_submit_inputs("tax-public")
        macba_submit_inputs("state")
        macba_submit_inputs("year")
        currentPage = 1;
        await macba_apply_filter_archive();
    });
});


jQuery(".more-expositions").on('click', async function (){
    try {
        var button = jQuery(this);
        await macba_load_content(button, "macba_load_expositions");
    } catch (error) {
        console.error("Error en la carga de exposicions:", error);
    }
});

jQuery(".more-activitats").on('click', async function (){
    try {
        var button = jQuery(this);
        await macba_load_content(button, "macba_load_activitats");
    } catch (error) {
        console.error("Error en la carga de actividades:", error);
    }
});

jQuery(".more-recorreguts").on('click', async function (){
    try {
        var button = jQuery(this);
        await macba_load_content(button, "macba_load_recorreguts");
    } catch (error) {
        console.error("Error en la carga de recorreguts:", error);
    }
});

jQuery(".more-fons").on('click', async function (){
    try {
        var button = jQuery(this);
        await macba_load_content(button, "macba_load_fons");
    } catch (error) {
        console.error("Error en la carga de fons:", error);
    }
});

jQuery(".more-colleccionables").on('click', async function (){
    try {
        var button = jQuery(this);
        await macba_load_content(button, "macba_load_colleccionables");
    } catch (error) {
        console.error("Error en la carga de recorreguts:", error);
    }
});

jQuery(".more-diaris").on('click', async function (){
    try {
        var button = jQuery(this);
        await macba_load_content(button, "macba_load_diaris");
    } catch (error) {
        console.error("Error en la carga de recorreguts:", error);
    }
});

jQuery(".more-desades").on('click', async function (){
    try {
        var button = jQuery(this);
        await macba_load_content(button, "macba_load_desades");
    } catch (error) {
        console.error("Error en la carga de recorreguts:", error);
    }
});

jQuery(".more-block-llistat-posts-content").on('click', async function (){
    try {
        var button = jQuery(this);
        await macba_load_more_llistat_posts_content(button, "macba_block_llistat_posts_apply_filter");
    } catch (error) {
        console.error("Error en la carga de recorreguts:", error);
    }
});

//=================================
//============ ERASES =============
//=================================

jQuery(".erase-filters").on("click", async function () {
    macba_erase_inputs("tax");
    macba_erase_inputs("tax-public");
    macba_erase_inputs("state");
    macba_erase_inputs("years");

    currentPage = 1;
    await macba_apply_filter_archive();
});

jQuery(".erase-tax").on("click", async function () {
    macba_erase_inputs("tax");
    currentPage = 1;
    await macba_apply_filter_archive();
});

jQuery(".erase-tax-activity-public").on("click", async function () {
    macba_erase_inputs("tax-public");
    currentPage = 1;
    await macba_apply_filter_archive();
});

jQuery(".erase-state").on("click", async function () {
    macba_erase_inputs("state");
    currentPage = 1;
    await macba_apply_filter_archive();
});

jQuery(".erase-years").on("click", async function () {
    macba_erase_inputs("year");
    currentPage = 1;
    await macba_apply_filter_archive();
});


//BLOCK LLISTA POSTS

jQuery(".erase-list-filters").on("click", async function () {
    macba_erase_inputs("tax-activities");
    macba_erase_inputs("tax-public");
    macba_erase_inputs("state");
    macba_erase_inputs("years");

    currentPage = 1;
    await macba_block_llistat_posts_apply_filter();
});

jQuery(".erase-list-state").on("click", async function () {
    macba_erase_inputs("state");
    currentPage = 1;
    await macba_block_llistat_posts_apply_filter();
});

jQuery(".erase-list-year").on("click", async function () {
    macba_erase_inputs("year");
    currentPage = 1;
    await macba_block_llistat_posts_apply_filter();
});

jQuery(".erase-list-tax").on("click", async function () {
    macba_erase_inputs("tax-activities");
    currentPage = 1;
    await macba_block_llistat_posts_apply_filter();
});

jQuery(".erase-list-tax-public").on("click", async function () {
    macba_erase_inputs("tax-public");
    currentPage = 1;
    await macba_block_llistat_posts_apply_filter();
});
//=================================
//========== AJAX CALLS ===========
//=================================

var previous_tipologia_archive;
var previous_tipologia_activitats;
var previous_tipologia_public;
var previous_anys_archive;
var previous_estat_archive;

macba_set_previous_filters_values();

async function macba_block_llistat_posts_apply_filter() {
    let postsPerPage = jQuery(".more-block-llistat-posts-content").data("postsperpage")
    let selectedOption = jQuery(".macba-filters-header").attr("selected-option");
    return new Promise(function (resolve, reject) {
        jQuery.ajax({
            type: "POST",
            url: "/wp-admin/admin-ajax.php",
            data: {
                action: "macba_block_llistat_posts_apply_filter",
                tipologia_activitats: tipologia_activitats,
                tipologia_public: tipologia_public,
                year: anys_archive,
                state: estat_archive,
                taxonomy: selectedOption,
                postsPerPage: postsPerPage
            },
            success: function (response) {
                var macba_list_posts = jQuery(".macba-block-llistat-posts");
                if (response.success === true) {
                    jQuery(macba_list_posts).html(response.data.html);
                    jQuery(".result-count").html(response.data.totalResults);
                    if(response.data.totalResults <= postsPerPage){
                        jQuery(".more-block-llistat-posts-content").addClass("d-none")
                    }else{
                        jQuery(".more-block-llistat-posts-content").removeClass("d-none")
                    }
                    macba_updateSaveButtonsByLocalStorage()
                    macba_set_previous_filters_values();
                    resolve();
                } else {
                    if (response.message !== undefined) {
                        jQuery(macba_list_posts).html(response.message);
                    }
                    else {
                        jQuery(macba_list_posts).html("Ha succedit un error al carregar els continguts.");
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reject(errorThrown);
            },
        });
    });
}


function macba_set_previous_filters_values() {
    previous_tipologia_archive = JSON.parse(JSON.stringify(tipologia_archive));
    previous_tipologia_activitats = JSON.parse(JSON.stringify(tipologia_activitats));
    previous_tipologia_public = JSON.parse(JSON.stringify(tipologia_public));
    previous_anys_archive = JSON.parse(JSON.stringify(anys_archive));
    previous_estat_archive = JSON.parse(JSON.stringify(estat_archive));
}

function macba_filters_have_changed() {
    return (
        JSON.stringify(previous_tipologia_archive) !== JSON.stringify(tipologia_archive) ||
        JSON.stringify(previous_tipologia_activitats) !== JSON.stringify(tipologia_activitats) ||
        JSON.stringify(previous_tipologia_public) !== JSON.stringify(tipologia_public) ||
        JSON.stringify(previous_anys_archive) !== JSON.stringify(anys_archive) ||
        JSON.stringify(previous_estat_archive) !== JSON.stringify(estat_archive)
    );
}

//Cargar de nuevo las expos (se llama siempre que cambian i se aplican los filtros)
async function macba_apply_filter_archive() {
    var filterChanged = macba_filters_have_changed();
    if(!filterChanged)
        return;
	return new Promise(function (resolve, reject) {
        if(currentArchive === undefined){
            resolve();
            return;
        }
		var action_to_call = "macba_load_" + currentArchive;
		jQuery.ajax({
			type: "POST",
			url: "/wp-admin/admin-ajax.php",
			data: {
				action: action_to_call,
				tipologia_archive: tipologia_archive,
                tipologia_public: tipologia_public,
				estat_archive: estat_archive,
				anys_archive: anys_archive,
			},
			success: function (response) {
                // console.log(response);
				var buttonClass = ".more-" + currentArchive;
				var button = jQuery(buttonClass);
				var offset = button.data("offset");
				var macba_rows = jQuery(".macba-rows");
				var offsetStr = response["data"]["offsetStr"];
				var offsetStrOlder = response["data"]["offsetStrOlder"];
                var isOld = response["data"]['isOld'];
				var maxPages = response["data"]["maxPages"];
				var htmlToAppend = response["data"]["html"];

				jQuery(macba_rows).html(htmlToAppend);
				button.data("offset", Number(offsetStr));
				button.data("offsetold", Number(offsetStrOlder));
                button.data("isold", isOld);

				// currentPage++;
				if (maxPages > currentPage) {
					button.show();
				} else {
					button.hide();
				}

				macba_updateSaveButtonsByLocalStorage();
				macba_set_result_counter(
					".result-count",
					response["data"]["totalResults"]
				);
                macba_set_previous_filters_values();

				resolve();
			},
			error: function (jqXHR, textStatus, errorThrown) {
				reject(errorThrown);
			},
		});
	});
}

async function macba_load_content(button, action) {
    return new Promise(function (resolve, reject) {
        var postsPerPage = button.data("postsperpage");
        var offset = button.data("offset");
        var offsetOld = button.data("offsetold");
        var isOld = button.data("isold") ?? false;

        jQuery.ajax({
            type: "POST",
            url: "/wp-admin/admin-ajax.php",
            data: {
                action: action,
                postsPerPage: postsPerPage,
                offset: offset,
                offsetOld: offsetOld,
                is_load_more: true,
                tipologia_archive: tipologia_archive,
                estat_archive: estat_archive,
                anys_archive: anys_archive,
                isOld: isOld
            },
            beforeSend: function () {
                button.text("...");
            },
            success: function (response) {
                var macba_rows = jQuery(".macba-rows");
                var offsetStr = response['data']['offsetStr'];
                var offsetStrOlder = response['data']['offsetStrOlder'];
                var isOld = response['data']['isOld'] ?? false;
                var maxPages = response['data']['maxPages'];
                var htmlToAppend = response['data']['html'];

                jQuery(macba_rows).append(htmlToAppend);
                button.data("offset", Number(offsetStr));
                button.data("offsetold", Number(offsetStrOlder));
                button.data("isold", isOld);

                currentPage++;
                if (maxPages > currentPage) {
                    button.show();
                } else {
                    button.hide();
                }
                macba_init_audio_players();
                macba_updateSaveButtonsByLocalStorage()
                resolve();
            },
            complete: function () {
                button.text(`${macba_manual_translations['mostrar-ne més']}`);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reject(errorThrown);
            },
        });
    });
}

async function macba_load_more_llistat_posts_content(button, action) {
    currentPage++;
    var offset = button.data("offset");
    var postsPerPage = button.data("postsperpage");
    var taxonomy = button.data("taxonomy");
    return new Promise(function (resolve, reject) {
        jQuery.ajax({
            type: "POST",
            url: "/wp-admin/admin-ajax.php",
            data: {
                action: action,
                tipologia_activitats: tipologia_activitats,
                tipologia_public: tipologia_public,
                year: anys_archive,
                state: estat_archive,
                offset: offset,
                postsPerPage: postsPerPage,
                paged: currentPage,
                taxonomy: taxonomy
            },
            success: function (response) {
                var macba_rows = jQuery(".macba-rows");
                if (response.success === true) {
                    jQuery(macba_rows).html(response.data.html);
                    if(response.data.totalResults < currentPage * postsPerPage){
                        jQuery(".more-block-llistat-posts-content").addClass("d-none")
                    }else{
                        jQuery(".more-block-llistat-posts-content").removeClass("d-none")
                    }
                    macba_updateSaveButtonsByLocalStorage()
                    resolve();
                } else {
                    if (response.message !== undefined) {
                        jQuery(macba_rows).html(response.message);
                    }
                    else {
                        jQuery(macba_rows).html("Ha succedit un error al carregar els continguts.");
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reject(errorThrown);
            },
        });
    });
}


//=================================
//======== UTIL FUNCTIONS =========
//=================================

function macba_erase_inputs(filter_to_erase){
    var filter_class = ".input-"+filter_to_erase;
    jQuery(filter_class).each(function () {
        var checkbox = jQuery(this).find("input[type='checkbox']");
        checkbox.prop("checked", false);
    });
    switch(filter_to_erase){
        case "tax":
            tipologia_archive = [];
            break;
        case "tax-activities":
            tipologia_activitats = [];
            break;
        case "tax-public":
            tipologia_public = [];
            break;
        case "state":
            estat_archive = [];
            break;
        case "year":
            anys_archive = [];
            break;
    }
}

function macba_submit_inputs(filter_to_submit){
    var filter_class = ".input-"+filter_to_submit;
    var addedFilters = [];
    jQuery(filter_class).each(function () {
		var checkbox = jQuery(this).find("input[type='checkbox']");
		if (checkbox.prop("checked")) {
			var idValue = checkbox.attr("id");
            if (!addedFilters.includes(idValue)) {
                addedFilters.push(idValue);
            }
		}
	});
    switch(filter_to_submit){
        case "tax":
            tipologia_archive = addedFilters;
            break;
        case "tax-activities":
            tipologia_activitats = addedFilters;
            break;
        case "tax-public":
            tipologia_public = addedFilters;
            break;
        case "state":
            estat_archive = addedFilters;
            break;
        case "year":
            anys_archive = addedFilters;
            break;
    }
}

function macba_replace_special_chars(string) {
    return string.replace(/[^\w\s]/gi, '').replace(/\s+/g, '');
}

function macba_format_number(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function macba_set_result_counter(class_to_replace, totalResults){
    var resultCount = jQuery(class_to_replace).first().text().split(" ");
    for (let i = 0; i < resultCount.length; i++) {
        resultCount[i] = macba_replace_special_chars(resultCount[i]);
    }
    resultCount[0] = macba_format_number(totalResults);
    jQuery(class_to_replace).text(resultCount.join(" "))
}

//*************************
//*END ARCHIVES AND AGENDA*
//*************************

function macba_updateSaveButtonsByLocalStorage(){
    var cookieContent = document.cookie.replace(/(?:(?:^|.*;\s*)post_objects_saved\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if(cookieContent !== undefined && cookieContent !== ""){
        var arrayPostsSaved = JSON.parse(cookieContent);
        if (arrayPostsSaved !== null) {
            jQuery(".save-button").each(function (index, element) {
                var data = jQuery(element).data();
                Object.entries(arrayPostsSaved).forEach(function([key, value]) {
                    if(value['postId'] === data['postid']){
                        jQuery(element).addClass('saved-item');
                    }else{
                        jQuery(element).remove('saved-item');
                    }
                })
            });
        }
    }
}

// document ready
jQuery(document).ready(function () {
	macba_updateSaveButtonsByLocalStorage();

    var cookieContent = document.cookie.replace(/(?:(?:^|.*;\s*)post_objects_saved\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if(cookieContent === undefined || cookieContent === ""){
        var localStoragePostIds = JSON.parse(localStorage.getItem("post_ids_saved"));
        document.cookie = "post_objects_saved=" + JSON.stringify(localStoragePostIds) + "; path=/; ";
    }

	var filtersContainer = jQuery(".fixed-filters");

	if (filtersContainer.length) {
		var header = jQuery("header");
		var originalPosition = filtersContainer.offset().top;
		var offsetTop = undefined;
		const barraFiltros = document.querySelector(".macba-filters-offset");
		if (barraFiltros) {
			offsetTop = barraFiltros.offsetTop;
		}
		

		if (header.length) {
			jQuery(window).on("scroll", function () {
				if (window.pageYOffset > offsetTop) {
					filtersContainer.addClass("fix");
				} else {
					filtersContainer.removeClass("fix");
				}
			});
		}
	}

    // ANCHORS
    jQuery('.dropdown-item a').on('click', function() {
        jQuery('.dropdown-menu').removeClass('show');
    });

    var filtersContainer = jQuery('.fixed-menu-scroll');

    if(filtersContainer.length) {
        var header = jQuery('header');
        var originalPosition = filtersContainer.offset().top;
        const offsetTop = filtersContainer.offset().top;

        if (header.length) {
            jQuery(window).on('scroll', function () {
                if (window.pageYOffset > offsetTop) {
                    filtersContainer.addClass("fix");
                } else {
                    filtersContainer.removeClass("fix");
                }
            });
        }
    }

    jQuery(".show-more-accordion").on("click", function(){
        jQuery(this).siblings("#accordionFlushExample").children(".accordion-item").children(".accodrion-box.hide-accordion-item").removeClass("hide-accordion-item");
        jQuery(this).toggleClass("d-none");
    })

    //Show more obras masonry
    jQuery("#macba_load_more_obras_masonry").on('click', function(){
        var button = jQuery(this);
        var maxImagesPer = button.data("maximageper");
        var hiddenItems = jQuery(".grid-item.d-none").slice(0, maxImagesPer);
        hiddenItems.removeClass('d-none');
        if(hiddenItems.length > maxImagesPer){
            button.show();
        }else{
            button.hide();
        }
    });

    //Actor fitxa
    var showMoreButton = jQuery('.show-more-actor-content');
    var secondContentPart = jQuery('#secondContentPart');

    showMoreButton.on('click', function() {
        if (secondContentPart.hasClass('d-none')) {
            secondContentPart.removeClass('d-none');
            showMoreButton.addClass('d-none');
        }
    });
    // Llistat Posts first load
    if (jQuery("#llistatPosts").length) {
        if (jQuery("#llistatPosts").hasClass("llistar-activitats")) {
            tipologia_archive = [];
            estat_archive = [];
            anys_archive = [];
            macba_submit_inputs("tax-activities")
            macba_submit_inputs("tax-public")
            macba_submit_inputs("state")
            macba_submit_inputs("year")
            currentPage = 1;
            macba_block_llistat_posts_apply_filter();
        }
    }

    macba_initStreamVideos();
});

// Automatically load videos in stream format using HLS Library
function macba_initStreamVideos() {

    if(Hls.isSupported()) {
        jQuery('video:not(.stream-loaded)').each(function() {
            var src = this.src;
            if(src != null && src != "" && src.includes(".m3u8")){
                var video = this;
                var hls = new Hls();
                hls.loadSource(src);
                hls.attachMedia(video);
                jQuery(video).addClass("stream-loaded");
            }
        });
    }
}

/////////////////////////////////////////////////////////////
///////////// functions shared fons hierarchy ///////////////
/////////////////////////////////////////////////////////////
function getSelectedDocumentsNum(buttonResults, textResults) {
    filters = getFiltersSelected();
    callInfo = jQuery.ajax({
        type: "POST",
        url: "/wp-admin/cerca-avancada/admin-ajax.php",
        data: {
            action: "macba_get_documents_by_filters",
            filters: filters
        },
        success: function(response) {
            let formattedTotal = formatNumberWithDot(response);
            if(buttonResults == "resultDocHierarchy" && Object.keys(filtersCleaned).length === 0)formattedTotal = '';
            document.getElementById(buttonResults).innerHTML = formattedTotal +' '+ textResults;
        },
        error: function(error) {
            console.error(error);
        }
    });
}

function getSelectedDocumentsNumExtendButtonText(buttonResults, textResults, textResults2) {
    filters = getFiltersSelected();
    callInfo = jQuery.ajax({
        type: "POST",
        url: "/wp-admin/admin-ajax.php",
        data: {
            action: "macba_get_documents_by_filters",
            filters: filters
        },
        success: function(response) {
            let formattedTotal = formatNumberWithDot(response);
            let svg = '<svg class="svg-button-icon" width="16" height="16" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.93359 12.6031L11.0674 4.46931L5.62065 4.46051L5.62065 3.49245L12.2161 3.49245L12.6671 3.48047L12.6551 3.93148L12.6551 10.5269H11.7314L11.6783 5.08014L3.54442 13.214L2.93359 12.6031Z" fill="white"/></svg>'
            if(buttonResults == "resultDocHierarchy" && Object.keys(filtersCleaned).length === 0)formattedTotal = '';
            document.getElementById(buttonResults).removeAttribute('disabled');
            document.getElementById(buttonResults).innerHTML = textResults+' '+formattedTotal +' '+ textResults2+svg;
        },
        error: function(error) {
            console.error(error);
        }
    });
}

function getFiltersSelected() {
    filters = {
        'artists': [],
        'e-objectNames': [],
        'e-collection': [],
        'e-status': [],
        'e-img': [],
        'e-access': [],
        'e-year': [],
        'e-acquisitionYear': [],
        'a-year': [],
        'a-activity': [],
        'digital-content': [],
        'd-file-type': [],
        'd-material': [],
        'd-year': [],
        'fons': [],
        'tem-genres': [],
        'tem-subjects': [],
        'tem-subActors': [],
        'tem-coverages': [],
        'language': [],
        'd-activity': [],
    };

    jQuery('#modalLlistat input[type="checkbox"]:checked').each(function() {
        filters['artists'].push(jQuery(this).attr('id'));
    });

    jQuery('#modalLlistatArtistesDoc input[type="checkbox"]:checked').each(function() {
        filters['artists'].push(jQuery(this).attr('id'));
    });

    jQuery('#modalLlistatFonsDetall input[type="checkbox"]:checked').each(function() {
        filters['fons'].push(jQuery(this).attr('id'));
    });

    jQuery('#modalLlistatIdioma input[type="checkbox"]:checked').each(function() {
        filters['language'].push(jQuery(this).attr('id'));
    });

    let checkbox = ['e-objectNames', 'e-collection', 'e-status', 'e-img', 'e-access', 'a-activity', 'digital-content', 'd-file-type', 'd-material', 'd-activity'];
    checkbox.forEach(categ => {
        withcheckbox = document.getElementsByClassName(categ);
        Array.from(withcheckbox).forEach(function(currentElem) {
            if (currentElem.checked) {
                filters[categ].push(currentElem.value);
            }
        });
    });

    let tematica = ['tem-genres', 'tem-subjects', 'tem-subActors', 'tem-coverages'];
    tematica.forEach(categ => {
        withTematica = document.getElementsByClassName(categ);
        Array.from(withTematica).forEach(function(currentElem) {
            var valueInput = currentElem.querySelector('input');
            if (currentElem.classList.contains('button-bold')) {
                filters[categ].push(valueInput.value);
            }
        });
    });

    let dates = ['d-year', 'a-year', 'e-year', 'e-acquisitionYear'];
    dates.forEach(date => {
        const startYear = document.getElementById(`${date}1`);
        const endYear = document.getElementById(`${date}2`);
        if(startYear != null && endYear != null){
            if (startYear.value > 0 && endYear.value > 0) {
                filters[date].push(`${startYear.value}-${endYear.value}`);
            }
        }
    })

    filters = cleanEmptyFilters(filters);
    return filters;
}

function cleanEmptyFilters(filters) {
    filtersCleaned = {};
    Object.keys(filters).forEach(key => {
        if (filters[key].length !== 0) {
            filtersCleaned[key] = filters[key];
        }
    });
    return filtersCleaned;
}

function getResults(category_type, url) {
    let params = selectedFiltersToParams(category_type);
    window.location.href = url + '?' + params;
}

function selectedFiltersToParams(category_type) {
    let filters = getFiltersSelected();
    let params = "type=obra";
    if (category_type == 'artist') {
        params = "type=artist";
    } else if (category_type == 'document') {
        params = "type=document";
    }
    for (const [key, value] of Object.entries(filters)) {
        if (value) {
            let newParam = "&" + key + "=";
            value.forEach(v => {
                newParam += v + ',';
            });
            params += newParam;
        }
    }
    return params;
}

function formatNumberWithDot(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

//Search Menu functions

function toggleSearchMenuDisplay() {
	var searchMenu = document.getElementById("searchMenu");
	if (searchMenu.style.display === 'none' || searchMenu.style.display === '') {
		searchMenu.style.display = 'block';
	} else {
		searchMenu.style.display = 'none';
	}
}

function toggleRadioSearchMenuDisplay() {
	var searchMenu = document.getElementById("radioSearchMenu");
	var mainMenu = document.getElementById("radioMainMenu");
	var hamburgerIcon = document.getElementById("radioMenuHamIc");
	var closeIcon = document.getElementById("radioMenuCloseIc");

    if(mainMenu.style.display = 'flex'){
        hamburgerIcon.classList.remove('d-none');
        hamburgerIcon.classList.add('d-flex');
        closeIcon.classList.remove('d-flex');
        closeIcon.classList.add('d-none');
        mainMenu.style.display = 'none';
    }
	if (searchMenu.style.display === 'none' || searchMenu.style.display === '') {
		searchMenu.style.display = 'block';
	} else {
		searchMenu.style.display = 'none';
	}
}

let shouldHideElement = false;

function hideElement(elementId) {
    let element = document.getElementById(elementId);

    if (element) {
        element.style.display = 'none';
    }
}

const hideButtons = document.querySelectorAll('.hideElementBtn');

hideButtons.forEach(button => {
    button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        hideElement(targetId);
    });
});

function toggleModal(id) {
	var modal = document.getElementById(id);

	if (modal.style.display === 'none' || modal.style.display === '') {
		modal.style.display = 'block';
	} else {
		modal.style.display = 'none';
	}
}

function toggleMenuDisplay() {
	var mainMenu = document.getElementById("mainMenu");
    var header = document.getElementById("main-header");
    var mainContent = document.getElementById("main-content");

	if (mainMenu.style.display === 'none' || mainMenu.style.display === '') {
		header.style.display = 'none';
		mainMenu.style.display = 'flex';
        // mainContent.style.marginTop = '-56px';
	} else {
		header.style.display = 'block';
		mainMenu.style.display = 'none';
        // mainContent.style.marginTop = '0';
	}
}
var menuOpen = false;
function toggleRadioMenuDisplay() {
	var mainMenu = document.getElementById("radioMainMenu");
	var searchMenu = document.getElementById("radioSearchMenu");
	var hamburgerIcon = document.getElementById("radioMenuHamIc");
	var closeIcon = document.getElementById("radioMenuCloseIc");

	if (searchMenu.style.display === 'block') {
		searchMenu.style.display = 'none';
	}

	if (mainMenu.style.display === 'none' || mainMenu.style.display === '') {
		if(window.innerWidth > 768) {
			closeIcon.classList.remove('d-none');
			closeIcon.classList.add('d-flex');
			hamburgerIcon.classList.remove('d-flex');
			hamburgerIcon.classList.add('d-none');
		}
		mainMenu.style.display = 'flex';
        jQuery('body').addClass("prevent-scroll")
	} else {
		if(window.innerWidth > 768) {
			hamburgerIcon.classList.remove('d-none');
			hamburgerIcon.classList.add('d-flex');
			closeIcon.classList.remove('d-flex');
			closeIcon.classList.add('d-none');
		}
		mainMenu.style.display = 'none';
        jQuery('body').removeClass("prevent-scroll")
    }
}

function toggleTextVisibility(inputField, introSearchSvgId) {
	const introSearchSvg = document.getElementById(introSearchSvgId);

	if (inputField.value.trim() !== "") {
		introSearchSvg.classList.remove("d-none");
	} else {
		introSearchSvg.classList.add("d-none");
	}
}

function toggleTextVisibilityMobile() {
    const introSvg = document.getElementById("introSvgMobile");
    const inputField = document.querySelector(".mobile-cercar");

    if (inputField.value.trim() !== "") {
        introSvg.classList.remove("d-none");
    } else {
        introSvg.classList.add("d-none");
    }
}

const translationDe = `${macba_manual_translations['de']}`;
const translationResultats = `${macba_manual_translations['resultats']}`;

let inputBasicSearch = document.getElementById('basicSearch');
if(inputBasicSearch){
    inputBasicSearch.addEventListener('input', updateWidth);
}
function updateWidth() {
    if (inputBasicSearch.value.length === 0) {
        inputBasicSearch.style.width = '100%';
    } else {
        inputBasicSearch.style.width = ((inputBasicSearch.value.length + 5)* 11) + 'px';
    }
}

let inputSearchText = document.getElementById('searchTextInput');
if(inputSearchText){
    inputSearchText.addEventListener('input', inputUpdateWidth);
}

function inputUpdateWidth() {
    if (inputSearchText.value.length === 0) {
        inputSearchText.style.width = '100%';
    } else {
        inputSearchText.style.width = ((inputSearchText.value.length + 5)* 11) + 'px';
    }
}

var basicSearch = jQuery("#basicSearch")
var isPodcastPage = basicSearch.data("ispodcastpage");
let basicSearchInput = "";
let basicSearchData = null;
let currentPageBasicSearch = 0;
let totalPagesBasicSearch = 0;
let basicSearchPaginationButtons = [];
let tripleDotButtons = [];
const minSearch = 3;
const maxPagesIndex = 5;
// jQuery("#basicSearch").on("input", async function(){
//     basicSearchInputString = jQuery(this).val();
//     var suggestedSearch = jQuery("#searchBasicSuggestion")

//     if(basicSearchInputString.length >= minSearch){
//         await macba_basic_search(basicSearchInputString, false, isPodcastPage)
//             .catch(function(){
//                 //Handling abort
//             })
//     }else{
//         suggestedSearch.addClass('d-none')
//     }
// })

jQuery('#basicSearch').keypress(async function(e) {
    if (e.which === 13) {
        basicSearchInputString = jQuery(this).val();
        var suggestedSearch = jQuery("#searchBasicSuggestion")
        suggestedSearch.addClass('d-none')
        if(basicSearchInputString.length >= minSearch){
            currentPageBasicSearch = 0;
            await macba_basic_search(basicSearchInputString, false, isPodcastPage)
                .catch(function(){
                    //Handling abort
                })
            macba_update_search_history(basicSearchInputString)
        }else{
            macba_toggle_visibility_search_basic_elements();
        }
    }
});

jQuery("#searchBasicSuggestion").on('click', async function(){
    var suggestedSearch = jQuery(this)
    var suggestedText = jQuery("#suggestionText")[0].innerText
    var basicSearchInput = jQuery("#basicSearch")
    basicSearchInput.val(suggestedText)
    suggestedSearch.addClass('d-none')
    await macba_basic_search(suggestedText, false, isPodcastPage)
    macba_update_search_history(suggestedText)
})

jQuery('.main-cerca-form').on('click', function(e) {
    var posX = e.pageX;
    var formWidth = jQuery(this).children(".form-content").width()
    var windowWidth = jQuery(window).width();
    if (posX <= windowWidth - formWidth && windowWidth >= 768) {
        if(jQuery(this).hasClass('radio-web-macba')){
            toggleRadioSearchMenuDisplay();
        }else{
            toggleSearchMenuDisplay();
        }
    }
})

jQuery('.searchHistoryLabel').on("click", function(){
    var searchLabel = jQuery(this).contents().filter(function() {
        return this.nodeType === 3; // Filtrar solo nodos de texto
    }).first().text();
    jQuery("#basicSearch").val(searchLabel).trigger('input')
})

jQuery(".submit-search").on("click", async function() {
    basicSearchInputString = basicSearch.val();
    var suggestedSearch = jQuery("#searchBasicSuggestion")
    suggestedSearch.addClass('d-none')
    if(basicSearchInputString.length >= 3){
        await macba_basic_search(basicSearchInputString, false, isPodcastPage)
        macba_update_search_history(basicSearchInputString)
    }else{
        macba_toggle_visibility_search_basic_elements()
    }
})
var abortBasicSearch = false;
async function macba_basic_search(inputString, isSuggestion = false, isPodcastPage = false) {

    jQuery("#spinner").addClass("d-flex");

    if(!abortBasicSearch){
        abortBasicSearch = true;
        return new Promise(function (resolve, reject) {
            jQuery.ajax({
                type: "POST",
                url: "/wp-admin/admin-ajax.php",
                data: {
                    action: "macba_basic_search",
                    isSuggestion: isSuggestion,
                    inputString: inputString,
                    isPodcastPage: isPodcastPage
                },
                success: function (response) {
                    basicSearchData = response['data'];
                    var suggSearch = jQuery("#searchBasicSuggestion");
                    if (isSuggestion === true || "suggestion" in basicSearchData) {
                        var suggestionText = basicSearchData["suggestion"];
                        if(suggestionText && suggestionText.length > 0){
                            var suggestionTextDom = jQuery("#suggestionText");
                            suggestionTextDom.html(suggestionText);
                            suggSearch.removeClass("d-none");
                        }
                    } else {
    
                        var countResults = ("posts" in basicSearchData) ? basicSearchData['posts'].length : 0;
    
                        if(countResults > 0){
                            jQuery("#searchBasicNoResults").addClass("d-none");
                            jQuery("#searchBasicAdvanced").removeClass("d-none");
                            jQuery("#searchBasicExtraAdv").addClass("d-none");
                            jQuery("#searchBasicSearchList").addClass("d-none");
                            jQuery("#searchBasicSuggestion").addClass("d-none");
                            jQuery("#searchBasicContainer").removeClass("d-none")
    
                            if(countResults > 10)
                                jQuery("#searchBasicPagination").removeClass('d-none');
                            else
                                jQuery("#searchBasicPagination").addClass('d-none');
    
                            var resultLabel = jQuery("#searchResultLabel");
                            resultLabel.removeClass("d-none")
                            resultLabel.text("1" + (countResults >= 10 ? "-10" : (countResults !== 1 ? "-"+countResults : "")) + ` ${translationDe} ` + countResults + ` ${translationResultats}`);
                            macba_generate_result_items();
                        }else{
                            jQuery(".search-item").remove();
                            jQuery("#searchBasicContainer").removeClass("d-none")
                            jQuery("#searchBasicNoResults").removeClass("d-none");
                            jQuery("#searchBasicAdvanced").addClass("d-none");
                            jQuery("#searchBasicPagination").addClass("d-none");
                            jQuery("#searchResultLabel").addClass("d-none")
                            jQuery("#searchBasicSuggestion").addClass("d-none");
                            jQuery("#searchBasicExtraAdv").addClass("d-none");
                            jQuery("#searchBasicSearchList").addClass("d-none");
                        }
                    }
                    resolve();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    reject(errorThrown);
                },
                complete: function() {
                    abortBasicSearch = false;
                    jQuery("#spinner").removeClass("d-flex");
                }
            });
        });
    }
}

function macba_generate_result_items(isCreatePagination = true){
    var itemPosts = macba_create_search_basic_items(basicSearchData['posts'].slice((currentPageBasicSearch)*10, (currentPageBasicSearch+1)*10));
    jQuery(".search-item").remove();

    var itemsPart1 = itemPosts.slice(0,6);
    var itemsPart2 = itemPosts.slice(6,10).reverse();

    var labelCount = jQuery("#searchBasicAdvanced");
    labelCount.removeClass('d-none');
    itemsPart1.forEach(item => {
        labelCount.before(item)
    });
    itemsPart2.forEach(item => {
        labelCount.after(item)
    });
    if(isCreatePagination)
        macba_pagination_search_basic();
}

function macba_create_search_basic_items(posts){

    var itemPosts = [];

    posts.forEach(post => {
        var item = document.createElement('a');
        item.classList.add('search-item', 'card-data');
        item.href = post['post_link'];

        var type = document.createElement('div');
        type.classList.add('macba-type');
        type.textContent = post['post_type'];

        var title = document.createElement('div');
        title.classList.add('card-title');
        title.textContent = post['post_title'];

        var description = document.createElement('div');
        description.classList.add('card-description', 'text-body', 'body-m')
        description.textContent = post['post_subtitle'];

        item.appendChild(type)
        item.appendChild(title)
        item.appendChild(description)

        itemPosts.push(item)
    });

    return itemPosts;
}

function macba_pagination_search_basic(isCreate = true, pageNum = -1){
    if(isCreate === true){
        var buttonClasses = ['search-basic-page-button', 'pagination-number', 'macba-button', 'button-basic-m', 'd-flex', 'align-items-center', 'justify-content-center'];
        totalPagesBasicSearch = Math.ceil(basicSearchData['posts'].length / 10);
        var container = jQuery("#searchBasicPaginationContainer")

        container.children().remove();
        tripleDotButtons = [];
        basicSearchPaginationButtons = [];

        for (let i = 0; i < totalPagesBasicSearch; i++) {
            var buttonPage = document.createElement('button')
            buttonPage.classList.add(...buttonClasses)
            buttonPage.textContent = i+1;
            buttonPage.onclick = function(){
                var pageNum = jQuery(this).text()
                currentPageBasicSearch = parseInt(pageNum)-1;
                macba_generate_result_items(false)
                macba_update_pagination(currentPageBasicSearch);
                macba_update_result_label();
                jQuery("#searchBasicScroll").animate({ scrollTop: 0 }, 600);
            }
            if(i === 0){
                buttonPage.classList.add("pagination-focus")
            }
            if(i > 4 && i !== totalPagesBasicSearch-1){
                buttonPage.classList.add('d-none');
            }
            basicSearchPaginationButtons.push(buttonPage)
            if(i === 0 || (i === 4 && totalPagesBasicSearch > 6)){
                var tripleDotButton = document.createElement('button')
                tripleDotButton.classList.add(...buttonClasses)
                tripleDotButton.classList.add('triple-dot-button')
                tripleDotButton.textContent = "...";
                if(i === 0)
                    tripleDotButton.classList.add('d-none');
                tripleDotButtons.push(tripleDotButton)
            }
        }
        var countDots = 0;
        var countButtons = 0;
        for (let j = 0; j < totalPagesBasicSearch+tripleDotButtons.length; j++) {
            if(j == 1 || j == totalPagesBasicSearch+tripleDotButtons.length-3){
                container.append(tripleDotButtons[countDots]);
                countDots++;
            }
            container.append(basicSearchPaginationButtons[countButtons]);
            countButtons++;
        }
    }else{
        if(pageNum !== -1){
            currentPageBasicSearch = pageNum;
        }
        macba_generate_result_items(false);
        jQuery("#searchBasicScroll").animate({ scrollTop: 0 }, 600);
    }
}

jQuery(".search-basic-pagination-next").on("click", function () {
    if (currentPageBasicSearch+1 < totalPagesBasicSearch){
        currentPageBasicSearch++;
        macba_generate_result_items(false, currentPageBasicSearch);
        macba_update_pagination(currentPageBasicSearch);
        macba_update_result_label();
        jQuery("#searchBasicScroll").animate({ scrollTop: 0 }, 600);
    }
});

jQuery(".search-basic-pagination-prev").on("click", function () {
    if (currentPageBasicSearch > 0) {
        currentPageBasicSearch--;
        macba_generate_result_items(false, currentPageBasicSearch);
        macba_update_pagination(currentPageBasicSearch);
        macba_update_result_label();
        jQuery("#searchBasicScroll").animate({ scrollTop: 0 }, 600);
    }
});

function macba_update_pagination(pageNum){
    if (tripleDotButtons.length > 1) {
        basicSearchPaginationButtons.forEach((value, index) => {
            //si es el primer o l'ultim, no els amagis
            if((index !== 0 && index !== totalPagesBasicSearch-1)){
                jQuery(value).addClass("d-none")
            }
        });

        //depenent en quina pàgina es cliqui, es mostraran unes pagines o altres
        //limit esquerra = 5 (p.e. 1 2 3 4 5 ... 10)
        //limit dret =     5 (p.e. 1 ... 6 7 8 9 10)
        //en el cas de que estigui entre mig de 5 i totalPages - 5, es mostra un per sota i un per sobre (p.e. 1 ... 25 26 27 ... 50)
        var minPage = pageNum - (pageNum > totalPagesBasicSearch-5 ? 5-(totalPagesBasicSearch - pageNum) : ( pageNum < 4 ? pageNum : 1));
        var maxPage = pageNum + (pageNum > totalPagesBasicSearch-5 ? totalPagesBasicSearch - pageNum : (pageNum < 4 ? 5-pageNum: 2));
        basicSearchPaginationButtons.slice(minPage, maxPage).forEach((value, index) => {
            jQuery(value).removeClass("d-none")
        })

        //condicions per mostrar les elipsis
        // si la pagina actual es superior o igual a 4 es mostrarà l'elipsis inferior
        // si la pagina actual es superior al totalPages - 5 s'amagarà l'elipsis superior
        if (pageNum >= 4) {
            jQuery(tripleDotButtons[0]).removeClass("d-none");
        } else {
            jQuery(tripleDotButtons[0]).addClass("d-none");
        }

        if (pageNum > totalPagesBasicSearch - 5) {
            jQuery(tripleDotButtons[1]).addClass("d-none");
        } else {
            jQuery(tripleDotButtons[1]).removeClass("d-none");
        }
    }

    jQuery(".pagination-number").each(function(index, element){
        var pagination = jQuery(this)

        pagination.removeClass("pagination-focus");
        if(pagination.text() == pageNum+1){
            pagination.addClass("pagination-focus")
        }
    });

}

function macba_update_search_history(inputString) {
    let stringsArray = [];
    const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)searchHistory\s*=\s*([^;]*).*$)|^.*$/, "$1");
    if (cookieValue) {
        stringsArray = JSON.parse(cookieValue);
    }

    const stringIndex = stringsArray.indexOf(inputString);

    if (stringIndex !== -1) {
        stringsArray.splice(stringIndex, 1);
        stringsArray.unshift(inputString);
    } else {
        stringsArray.unshift(inputString);

        if (stringsArray.length > 5) {
            stringsArray.pop();
        }
    }

    document.cookie = `searchHistory=${JSON.stringify(stringsArray)}; path=/`;

    jQuery(".searchHistoryHolder").each(function(index) {
        if(stringsArray[index] !== undefined){
            var holder = jQuery(this);
            holder.removeClass("d-none");
            holder.children(".searchHistoryLabel").text(stringsArray[index]);
        }
    });
    jQuery('.searchHistoryLabel').each(function(index, element) {
        jQuery(this).text(stringsArray[index]);
    })
}

//actualitza el label dels resultats (p.e. 21-30 de 300 resultats)
function macba_update_result_label(){
    var resultLabel = jQuery("#searchResultLabel");
    var minRange = (currentPageBasicSearch*10)+1;
    var maxRange = (currentPageBasicSearch+1)*10;
    var totalPosts = basicSearchData['posts'].length;
    resultLabel.text("1" + (countResults >= 10 ? "-10" : (countResults !== 1 ? "-"+countResults : "")) + ` ${translationDe} ` + countResults + ` ${translationResultats}`);
    resultLabel.text(newLabel);
}

function macba_toggle_visibility_search_basic_elements(){
    jQuery("#searchBasicExtraAdv").removeClass("d-none");
    jQuery("#searchBasicSearchList").removeClass("d-none");
    jQuery(".search-item").remove();
    jQuery("#searchBasicAdvanced").addClass("d-none");
    jQuery("#searchBasicPagination").addClass("d-none");
    jQuery("#searchResultLabel").addClass("d-none")
    jQuery("#searchBasicContainer").addClass("d-none")
    jQuery("#searchBasicNoResults").addClass("d-none");
}
//Content height control

var innerContainer = document.querySelector(".wp-block-group__inner-container");
var innerContainerHeight = innerContainer ? innerContainer.scrollHeight : 0;

if (innerContainerHeight > 12 * 26) {
    var showMoreButton = document.createElement("button");
    showMoreButton.className = "macba-button button-basic-m button-secondary button-minimal show-more mt-7";
    showMoreButton.innerHTML = `
        ${macba_manual_translations['mostrar-ne més']}
        <svg class="svg-chevron-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
        <path d="M9.68892 12.4577L14.8517 6.75116L15.6278 7.60682L10.077 13.7151L9.68892 14.1244L9.30087 13.7151L3.75 7.60682L4.52611 6.75L9.68892 12.4577Z" fill="#0B0E0D" fill-opacity="0.4" />
        </svg>
    `;

    innerContainer.insertAdjacentElement("afterend", showMoreButton);

    showMoreButton.addEventListener("click", function () {
        if(innerContainer.style.display == "block"){
            innerContainer.style.display = "-webkit-box";
            showMoreButton.innerHTML = `
                ${macba_manual_translations['mostrar-ne més']}
                <svg class="svg-chevron-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                <path d="M9.68892 12.4577L14.8517 6.75116L15.6278 7.60682L10.077 13.7151L9.68892 14.1244L9.30087 13.7151L3.75 7.60682L4.52611 6.75L9.68892 12.4577Z" fill="#0B0E0D" fill-opacity="0.4" />
                </svg>
            `;
        }else {
            innerContainer.style.display = "block";
            showMoreButton.innerHTML = `
                ${macba_manual_translations['mostrar-ne menys']}
                <svg class="svg-chevron-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none" style="transform: rotateX(180deg)">
                <path d="M9.68892 12.4577L14.8517 6.75116L15.6278 7.60682L10.077 13.7151L9.68892 14.1244L9.30087 13.7151L3.75 7.60682L4.52611 6.75L9.68892 12.4577Z" fill="#0B0E0D" fill-opacity="0.4" />
                </svg>
            `;
        }
    });
}

var llistaBodyContainers = document.querySelectorAll(".llista-body");

llistaBodyContainers.forEach(function(llistaBodyContainer) {
    var llistaBodyContainerHeight = llistaBodyContainer ? llistaBodyContainer.scrollHeight : 0;

    if (llistaBodyContainerHeight > 78) {
        var showMoreButton = document.createElement("button");
        showMoreButton.className = "macba-button button-basic-m button-secondary button-minimal show-more mt-7";
        showMoreButton.innerHTML = `
            ${macba_manual_translations['mostrar-ne més']}
            <svg class="svg-chevron-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
            <path d="M9.68892 12.4577L14.8517 6.75116L15.6278 7.60682L10.077 13.7151L9.68892 14.1244L9.30087 13.7151L3.75 7.60682L4.52611 6.75L9.68892 12.4577Z" fill="#0B0E0D" fill-opacity="0.4" />
            </svg>
        `;

        llistaBodyContainer.insertAdjacentElement("afterend", showMoreButton);

        showMoreButton.addEventListener("click", function () {
            if (llistaBodyContainer.style.display == "block") {
                llistaBodyContainer.style.display = "-webkit-box";
                showMoreButton.innerHTML = `
                    ${macba_manual_translations['mostrar-ne més']}
                    <svg class="svg-chevron-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                    <path d="M9.68892 12.4577L14.8517 6.75116L15.6278 7.60682L10.077 13.7151L9.68892 14.1244L9.30087 13.7151L3.75 7.60682L4.52611 6.75L9.68892 12.4577Z" fill="#0B0E0D" fill-opacity="0.4" />
                    </svg>
                `;
            } else {
                llistaBodyContainer.style.display = "block";
                showMoreButton.innerHTML = `
                    ${macba_manual_translations['mostrar-ne menys']}
                    <svg class="svg-chevron-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none" style="transform: rotateX(180deg)">
                    <path d="M9.68892 12.4577L14.8517 6.75116L15.6278 7.60682L10.077 13.7151L9.68892 14.1244L9.30087 13.7151L3.75 7.60682L4.52611 6.75L9.68892 12.4577Z" fill="#0B0E0D" fill-opacity="0.4" />
                    </svg>
                `;
            }
        });
    }
});

var svgTitle = null;
//Artwork Modal
function showArtworkModal(startAt, id, countTotal, textCaption, slugObra = false, detailObraLink = false) {
    var modal = jQuery('#artwork-modal.'+id)
    var modalGrid = modal.children(".artwork-modal-grid")
    var modalSlider = modalGrid.children(".artwork-modal-slider."+id)
    var modalSwiper = modalSlider[0].swiper

    modal.css('display', 'flex');
    modalSwiper.slideTo(startAt);
    modal.children(".macba_modal_header").children(".macba_caption_index_slide").text((startAt+1) + " " + textCaption + " " + countTotal);

    var modalWrapper = jQuery(modalSlider).children(".swiper-wrapper")
    var content = jQuery(modalWrapper.children(".swiper-slide")[startAt]).data("content");
    if(typeof content === 'string'){
        content = JSON.parse(content)
    }
    svgTitle = (svgTitle === null) ? jQuery(modalGrid.children()[0]).children(".macba_caption_obra_title").find("svg").first().clone() : svgTitle;
    jQuery(modalGrid.children()[0]).children(".macba_caption_obra_title").html(content[0]);
    if((slugObra !== false && detailObraLink !== false) && (slugObra !== '' && detailObraLink !== '')){
        jQuery(modalGrid.children()[0]).children(".macba_caption_obra_title").attr("href", detailObraLink+slugObra);
        jQuery(modalGrid.children()[0]).children("a.macba_caption_obra_title").removeClass("d-none");
        jQuery(modalGrid.children()[0]).children("div.macba_caption_obra_title").addClass("d-none");
        jQuery(modalGrid.children()[0]).children(".macba_caption_obra_title").append(svgTitle)
    } else {
        jQuery(modalGrid.children()[0]).children("a.macba_caption_obra_title").addClass("d-none");
        jQuery(modalGrid.children()[0]).children("div.macba_caption_obra_title").removeClass("d-none");
    }
    jQuery(modalGrid.children()[0]).children(".macba_caption_creation_year").html(content[1]);
    jQuery(modalGrid.children()[0]).children(".macba_caption_artist_name").html(content[2]);
}

function showIndividualArtworkModal(imgUrl, obraUrl, title, subtitle, subsubtitle ) {
    var modal = jQuery('#artwork-modal')

    modal.css('display', 'flex');
    var artworkContent = jQuery('.artwork-modal-content');
    jQuery(artworkContent).find(".macba_caption_obra_url").attr("href", obraUrl);
    jQuery(artworkContent).find(".macba_caption_obra_title").html(title);
    jQuery(artworkContent).find(".macba_caption_creation_year").html(subtitle);
    jQuery(artworkContent).find(".macba_caption_artist_name").html(subsubtitle);
    jQuery(artworkContent).find(".macba_caption_img_src").attr('src', imgUrl);
}

function hideArtworkModal(id) {
    var modal = jQuery('#artwork-modal.'+id)
    modal.css('display', 'none');
}

function hideIndividualArtworkModal() {
    var modal = jQuery('#artwork-modal')
    modal.css('display', 'none');
}

function toggleTagsContainerExpand(button) {
    var tagsContainer = jQuery(button).parent().find('.filter-tags-container');
    var tagsContainerButton = jQuery(button).parent().find('.button-expand-tags');
    tagsContainer.toggleClass('expand');
    tagsContainerButton.toggleClass('expand');
}

//Artist Modal
function showArtistsModal( id ) {
    var modal = jQuery('#artist-modal.'+id)
    modal.css('display', 'block');
}

function hideArtistsModal(id) {
    var modal = jQuery('#artist-modal.'+id)
    modal.css('display', 'none');
}

//detail pages
var contentShown = false;
// programa detail - mostrar més/menys
function showMoreContentOrHide() {
	if (contentShown) {
        jQuery('.fitxa-detail-more, .macba-show-more-series').text(`${macba_manual_translations['mostrar-ne més']}`);
		jQuery("#arrow-show-more").removeClass("flip-horizontal");
	} else {
        jQuery('.fitxa-detail-more, .macba-show-more-series').text(`${macba_manual_translations['mostrar-ne menys']}`);
		jQuery("#arrow-show-more").addClass("flip-horizontal");
	}
	contentShown = !contentShown;
};

//Show more

function toggleParagraphText(element) {
    var paragraphText = element.parentNode.querySelector('.paragraph-text');
    paragraphText.classList.toggle('expand');
    element.classList.toggle('expand');
}

function toggleExpandParentDiv(element) {
    var technicalContent = element.parentNode.querySelector('.technical-info');
    technicalContent.classList.toggle('container-collapsed');
    element.classList.toggle('expand');
}

function toggleExpandTagsDiv(element) {
    var tagsContent = element.parentNode.parentNode.querySelector('.radio-web-search-tags');
    tagsContent.classList.toggle('container-collapsed');
    element.classList.toggle('expand');
}

document.addEventListener('DOMContentLoaded', function() {

    var tourItemContentList = document.querySelectorAll('.five-lines-content-text');

    tourItemContentList.forEach(function(tourItemContent) {
        var contentHeight = tourItemContent.scrollHeight;

        if (contentHeight < 6 * parseFloat(getComputedStyle(tourItemContent).lineHeight)) {
            tourItemContent.parentNode.parentNode.querySelector('.show-more').classList.toggle('hidden');
        }
    });
    var tourItemContentList = document.querySelectorAll('.twelve-lines-content-text');

    tourItemContentList.forEach(function(tourItemContent) {
        var contentHeight = tourItemContent.scrollHeight;

        if (contentHeight < 12 * parseFloat(getComputedStyle(tourItemContent).lineHeight)) {
            tourItemContent.parentNode.parentNode.querySelector('.show-more').classList.toggle('hidden');
        }
    });

    var technicalContentList = document.querySelectorAll('.technical-info-parent');

    technicalContentList.forEach(function(technicalContent) {
        var technicalItemsContent = technicalContent.querySelector('.technical-info');
        var contentHeight = technicalItemsContent.scrollHeight;

        if (contentHeight > 411) {
            technicalContent.querySelector('.show-more').classList.toggle('hidden');
            technicalItemsContent.classList.toggle('container-collapsed');
        }
    });

    //Fix checkboxes checked when backing from another page when filters applied
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
});

//Download files into zip
async function macba_download_files(arrayFiles, current_post) {
    const zip = new JSZip();
    await Promise.all(arrayFiles.map(async (download) => {
        const data = await new Promise((resolve, reject) => {
            JSZipUtils.getBinaryContent(download.link, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });

        zip.file(download.name, data, {
            binary: true
        });
    }));

    const archive = await zip.generateAsync({
        type: 'blob'
    });

    const link = document.createElement('a');

    link.href = window.URL.createObjectURL(archive);
    link.download = current_post+'.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

jQuery(".macba-share-podcast-copy").on('click', async function(){
    var url = jQuery(this).data('url');

    // Verificar si el navegador admite la API del Portapapeles
    if (navigator.clipboard) {
        // Intentar copiar el texto al portapapeles
        await navigator.clipboard.writeText(url);
    } else {
        var tempInput = document.createElement("input");
        tempInput.setAttribute("type", "text");
        tempInput.setAttribute("value", url);
        document.body.appendChild(tempInput);
        tempInput.select();
        tempInput.setSelectionRange(0, 99999);
        document.execCommand("copy");
        document.body.removeChild(tempInput);
    }
    this.parentNode.querySelector('.close-button').click();
});

//Show more
function toggleParagraphBlocks(element) {
    var paragraphBlocks = element.parentNode.querySelector('.paragraph-text');
    paragraphBlocks.classList.toggle('d-none');
    element.classList.toggle('expand');
}

function playVideo(button) {
    var video = button.previousElementSibling; // Obtén el elemento video hermano anterior al botón

    video.play();
    button.classList.add('d-none');
}

jQuery(".video-selector").on("click", function () {
	const $this = jQuery(this);
	const id = $this.data("id");
	const blockId = $this.data("block-id");
	const section = jQuery(`.section-videos[data-block-id='${blockId}']`);
	const videos = section.data("videos");

	if (id != null && videos != null) {
        var allowed = true;
        if("isAllowed" in videos[id]){
            allowed = videos[id].isAllowed;
        }
		const chosenVideo = videos[id];
		section.find(".video-title").text(chosenVideo.title);
        if(chosenVideo.isCoeli === true && chosenVideo?.slug && chosenVideo?.detailLink){
            section.find("a.video-title").removeClass("d-none").attr("href", chosenVideo.detailLink+chosenVideo.slug)
            section.find("div.video-title").addClass("d-none")
        }else{
            section.find("a.video-title").addClass("d-none")
            section.find("div.video-title").removeClass("d-none")
        }
		section.find(".video-description").html(chosenVideo.description);
		section.attr("current-video", id);

        function updateVideoSection(videoType) {
            const $videoContainer = section.find(`.${videoType}`);
            const otherTypes = ["local", "youtube", "vimeo"].filter(
                (type) => type !== videoType
            );
        
            otherTypes.forEach((type) => section.find(`.${type}`).addClass("d-none"));
            var videoOverlay = section.find(`.${videoType}`);
            videoOverlay.removeClass("d-none")
            if(allowed){
                videoOverlay.removeClass("locked")
            }else{
                videoOverlay.addClass("locked")
            }
            if (videoType === "youtube") {
                $videoContainer
                    .find(".iframe-youtube")
                    .attr(
                        "src",
                        `https://www.youtube.com/embed/${chosenVideo.ytId}?controls=1`
                    );
            } else if (videoType === "vimeo") {
                $videoContainer
                .find(".iframe-vimeo")
                .attr(
                    "src",
                    `https://player.vimeo.com/video/${chosenVideo.vimeoId}?h=0&autoplay=0`
                    );
            } else {
                $videoContainer.find("video").attr("src", allowed ? chosenVideo.media.mediaUrl : "");
            }

            if(chosenVideo?.thumbnail){
                $videoContainer.find("video").attr("poster", chosenVideo.thumbnail);
            }
                
            const mediaId =
                videoType === "localVideo"
                    ? chosenVideo.media.mediaId
                    : videoType === "youtube"
                    ? chosenVideo.ytId
                    : chosenVideo.vimeoId;
            section
                .find(".share-button")
                .attr("data-bs-target", `#shareModal-${mediaId}`);
            section.find(".save-button").attr("data-postid", mediaId);
            section.find(".save-button").attr("data-posttype", videoType);
        }
		if (chosenVideo.isLink) {
			if (chosenVideo.isYt) {
				updateVideoSection("youtube");
			} else if (chosenVideo.isVimeo) {
				updateVideoSection("vimeo");
			} else {
				updateVideoSection("local");
			}
		} else {
			updateVideoSection("local");
		}
	}
});
// Mobile slider with view, posar l'id 'sliderImgView' a l'img on mostrar la imatge seleccionada

function showImgToView(img) {
    src = img.getAttribute('src');
    view = document.getElementById('sliderImgView');
    previewItems = document.getElementsByClassName('slider-mobile-items');

    view.setAttribute("src", src);
    for (let i = 0; i < previewItems.length; i++) {
        previewItems[i].classList.remove('selected');
    }
    img.classList.add('selected');
}

// Video play

function isElementInViewport(el) {
    // /* Ventana de Visualización*/
    // var posTopView = jQuery(window).scrollTop();
    // var posButView = posTopView + jQuery(window).height();
    // /* Elemento a validar*/
    // var elemTop = jQuery(elem).offset().top;
    // var elemBottom = elemTop + jQuery(elem).height();
    // /* Comparamos los dos valores tanto del elemento como de la ventana*/
    // return ((elemBottom < posButView && elemBottom > posTopView) || (elemTop >posTopView && elemTop< posButView));

    var rect = el.getBoundingClientRect();
    var elementVerticalCenter = (rect.top + rect.bottom) / 2;
    var windowVerticalCenter = window.innerHeight / 2;

    return (
        elementVerticalCenter >= 0 &&
        elementVerticalCenter <= window.innerHeight &&
        Math.abs(elementVerticalCenter - windowVerticalCenter) < window.innerHeight / 2
    );
}

function handleScroll() {
    var videos = document.querySelectorAll('.video-lazy');
    videos.forEach(function(video) {

        if (isElementInViewport(video) && video.paused) {
            video.play();
        } else if (!isElementInViewport(video) && !video.paused) {
            video.pause();
        }
    });
}

document.addEventListener('scroll', handleScroll);
handleScroll();

// Publicacions Scroll

function scrollToFitxaTecinca() {
    var elem = document.querySelector('.technical-info-parent');

    if (elem) {
        var posicionElemento = elem.getBoundingClientRect().top;
        var posicionActual = window.scrollY || window.pageYOffset;
        var nuevaPosicion = posicionElemento + posicionActual - 100;

        window.scrollTo({
            top: nuevaPosicion,
            behavior: 'smooth'
        });
    }
}

function toggleSlideFons(){
    jQuery('#cerca-facetada-fons-audiovisual').slideToggle();
}

// document.addEventListener("DOMContentLoaded", () => {
//     const cursorsTrackers = document.querySelectorAll('.cursor-tracker');

//     cursorsTrackers.forEach(cursorTracker => {
//         const veureMesButton = cursorTracker.querySelector('.veure-mes-button');
    
//         cursorTracker.addEventListener('mousemove', (e) => {
//             veureMesButton.style.left = (e.clientX - 30)+ 'px';
//             veureMesButton.style.top = (e.clientY - 30) + 'px';
//         }); 
    
//         cursorTracker.addEventListener('mouseover', () => {
//             veureMesButton.classList.remove('d-none');
//         });
        
//         cursorTracker.addEventListener('mouseleave', () => {
//             veureMesButton.classList.add('d-none');
//         });
//     }); 
// });