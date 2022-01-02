
let msg_body = $('#msg');
let msg = $('#msg');
var timer;
var main_array = db.reverse();
var r_time = 0;
var pagin = 30;
let setting = (key, val = false) => {
    if (!key && !val) {
        return false;
    } else if (val) {
        localStorage.setItem(key, val);
    } else {
        return localStorage.getItem(key);
    }
}

let my_event = (state) => {
    var evt = $.Event('my_event');
    evt.state = state;
    $(window).trigger(evt);
}

let set_color = () => {
    var bg = setting('theme');
    if (bg) {
        $('#thm').html(`:root {
            --theme_bg: ${bg}
        }`);
        $('.color').each(function () {
            $(this).html('');
        });
        $('.color').each(function () {
            if ($(this).attr('data-tm') == bg) {
                $(this).html('&check;');
            }
        });
    }
}
let floor_up = (num) => {
    return (Math.floor(num) < num) ? Math.floor(num) + 1 : Math.floor(num);
}
let is_sender = (sender_name) => {
    return (sender_name == config.sender);
}
let render_photo = (photo_array) => {
    var photo_op = '';
    if (photo_array.length) {
        photo_op += `<div class="img_content">
                        <div class="img_wrap">`
        photo_array.forEach(poto => {
            var img_link = poto.uri.split('/').reverse()[0];
            photo_op += `<div class="img_wrap">
                                <img class="img_cont" src="${config.folder}/photos/${img_link}" alt="Image">
                            </div>`;
        });
        photo_op += `</div>
                    </div>`;
    }
    return photo_op;
}
let render_reaction = (reaction_array) => {
    var reaction_op = ''; 
    if (reaction_array.length) {
        reaction_op += `<div class="reaction">
                    <span class="react">`;
        reaction_array.forEach(imoj => {
            reaction_op += `${imoj.reaction}`;
        });
        reaction_op += `</span>
                    <span class="number">
                        ${reaction_array.length}
                    </span>
                </div>`;// reaction end
    }
    return reaction_op;
}

let make_chat = (obj, highlight=false, go_ind = false) => {
    var made = '';
    var element = obj;
    var go_i = false;
    if (obj.ind) {
        var go_i = false;
    }
    var profile = (element.sender_name == config.sender) ? config.sender_profile : config.reciver_profile;
    var sender = (element.sender_name == config.sender);
    var sender_class = (element.sender_name == config.sender) ? 'sender' : '';
    var date = new Date(element.timestamp_ms);
    var date_option = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };
    var time_option = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }
    var date_to_show = date.toLocaleDateString('en', date_option);
    var time_at = date.toLocaleString('en-US', time_option);
    if (element.is_unsent == 0) {
        var hli = false;
        if (highlight && element.content) {
            const match_highlight = fuzzysort.single(highlight, element.content);
            var match = fuzzysort.highlight(match_highlight, '<span class="and">', '</span>');
            if (match_highlight) {
                var hli = true;
            }
        }
        made += `<div class="msg_wrap ${(hli) ? 'hi_li_go' : ''}" ${(element.ind) ? 'hli_ind="'+element.ind+'"' : ''} ${(Number(obj.ind) == Number(go_ind)) ? 'go_ind="'+go_ind+'"' : ''}>
                    <div class="msg ${sender_class}">
                        <div class="img">
                            <img src="${profile}" alt="">
                        </div>
                        <div class="msg_group ${sender_class}">
                            <div class="msg_time ${sender_class}">
                                ${date_to_show} ${time_at}
                            </div>`;
        /**
         * image content and message content start
         */
        //  render_reaction(element.reactions)
        if (element.content) {
            made += `<div class="msg_content_group">
                                <div class="content ${(hli) ? 'go_to' : ''}">
                                    ${(element.reactions) ? render_reaction(element.reactions) : ''}
                                    ${(hli) ? match : element.content}
                                </div>
                            </div>`;
        }
        if (element.photos) {
            made += render_photo(element.photos);
        }
        /**
         * image content and message content start
         */
        made += `</div> 
                    </div>
                </div>`;
    } else {
        made += `<div class="msg_wrap">
                    <div class="msg ${sender_class}">
                        <div class="img">
                            <img src="profile/user1.jpg" alt="">
                        </div>
                        <div class="msg_group ${sender_class}">
                            <div class="msg_time sender">
                                January 28, 2021 2:59 PM
                            </div><div class="msg_content_group">
                                <div class="content">
                                    ${(is_sender(element.sender_name)) ? 'You' : element.sender_name} unsent a message
                                </div>
                            </div></div> 
                    </div>
                </div>`;
    }
    made += '</div>'; // msg_wrap end
    return made;
}
/**
 * Returns a range of data page by page from an array 
 * @param par_page a int number thats define how many item returned per page
 * @param which array want to devide into page
 * @param page Optional! which page you want to go. By default it return first page
 * @param index optional! If define an index it will return that page which containes this index
 */

let paginate = (par_page, arr, page = false, index=false) => { 
    var page = (page) ? page : 1;
    var arr_len = arr.length;
    var t_p = arr.length / par_page;
    var last_p = floor_up(t_p);
    if (index) {
        var indf = (index + 1) / par_page;
        page = floor_up(indf);
        if (page > last_p) {
            page = last_p;
        }
    }
    var column = [];
    var o_s = (page - 1) * par_page;
    var o_l = ((o_s + par_page) > arr_len) ? arr.length : (o_s + par_page);
    for (let i = o_s; i < o_l; i++) {
        if (index) {
            arr[i].ind = i;
        }
        column.push(arr[i]);
    }
    
    var op = {
        current_page: page,
        data: column,
        from: o_s,
        to: o_l,
        last_page: last_p,
        per_page: par_page,
        total: arr_len
    }
    return op;
}
// paginate(10, main_array, false, 30);
let render_setup = (output) => {
    setting('page', output.current_page);
    $('#ind').val(output.current_page);
    $('#ind').attr('max', output.last_page);
    $('.current_total').html(output.total);
    $('.img_cont').on('error', function (e) {
        $(this).attr('src', 'profile/user1.jpg');
    });
    if (msg.has('.load_more').length == 0) {
        msg.append(`<div class="flex flex_center"><button class="nl load_more">Load More</button></div>`);
    }
    set_color();
}

let load_msg = (page = 1, cb = false) => {
    var output = paginate(pagin, main_array, page);
    var opt = '';
    output.data.map((elem, ind) => {
        opt += make_chat(elem);
    });
    if (cb) {
        cb(opt, msg_body, output);
    } else {
        msg_body.animate({ scrollTop: 0 }, 100, function () {
            msg_body.html(opt);
            render_setup(output);
            r_time = 0;
            my_event('load_end');
        });
    }
}


let load_next = () => {
    var v = $('#ind').val();
    var to = Number(v) + 1;
    var max = $('#ind').attr('max');
    if (Number(v) < Number(max)) {
        $('#ind').val(to);
        clearTimeout(timer);
        timer = setTimeout(() => {
            load_msg(to);
        }, 100);
    }
}

let load_before = () => {
    var v = $('#ind').val();
    var to = Number(v) - 1;
    if (to > 0) {
        $('#ind').val(to);
        clearTimeout(timer);
        timer = setTimeout(() => {
            load_msg(to);
        }, 20);
    }
}
$('#next').on('click', function () {
    load_next();
});
$('#prev').on('click', function () {
    load_before();
});

$('#ind').on('input', function (e) {
    clearTimeout(timer);
    var v = $(this).val();
    var m = $(this).attr('max');
    var val = Number(v);
    var max = Number(m);
    if (val <= 0 || val > max) {
        e.preventDefault();
        $(this).val(setting('page'));
    } else {
        timer = setTimeout(() => {
            load_msg(val);
        }, 200);
    }
});


function load_more() {
    var v = $('#ind').val();
    var to = Number(v) + 1;
    var m_to = Number(v) - 1; 
    var max = $('#ind').attr('max');
    if (Number(v) < Number(max)) {
        $this = $('.load_more');
        $parent = $this.parent();
        $this.attr('disabled', 'true');
        $this.addClass('loader');
        $('#ind').val(to);
        load_msg(to, (op, body, output) => {
            setting('page', output.current_page); 
            $parent.before(op);
            render_setup(output);
            $this.removeAttr('disabled');
            $this.removeClass('loader');
            if (r_time >= 1) {
                msg.find('.msg').each((ind, itm) => {
                    if (ind < output.per_page) {
                        $(itm).remove();
                    }
                });
            }
            r_time++;
        });
    }
}

$(window).on('my_event', function(e) {
    if (e.state == 'load_end') {
        $('.load_more').click(function() {
            load_more();
        });
    }
});

$('.color').click(function() {
	var bg = $(this).attr('data-tm');
	setting('theme', bg);
	set_color();
});

$('#dark_toggle').click(function() {
    $('body').toggleClass('dark_mode');
    if (setting('mode') == 'dark') {
        setting('mode', 'light');
    } else {
        setting('mode', 'dark');
    }
});
if (setting('mode') == 'dark') {
    $('body').addClass('dark_mode');
}


if (setting('page')) {
    var l_p = setting('page');
    var pgn = paginate(pagin, main_array, setting('page'));
    if (pgn.data.length == 0) {
        load_msg(1);
    } else {
        load_msg(setting('page'));
    }
} else {
    load_msg(1);
}



/**
 * Search function start 
 */
function filter_on_obj(objList, text) {
    if (undefined === text || text === '') return [];
    return objList.filter(s_obj => {
        let flag;
        for (let prop in s_obj) {
            flag = false;
            flag = s_obj[prop].toString().indexOf(text) > -1;
            if (flag)
                break;
        }
        return flag;
    });
}

$('#search_fld').on('input', function() {
    var $this = $(this);
    var $val = $this.val();
    var result = $('#result');
    var rev;
    clearTimeout(timer);
    timer = setTimeout(() => {
        // var op = filter_on_obj(main_array ,$val);
        // var fsrt = fuzzysort.go($val, main_array, {key: 'content'});
        var search_obj = fuzzysort.go($val, main_array, {allowTypo: false,limit: 100, key: 'content'});
        var s_result = '';
        rev = search_obj;
        rev.map(function(itm) {
            var obj = itm.obj;
            var date = new Date(obj.timestamp_ms);
            var date_option = {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            };
            var time_option = {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            }
            var date_to_show = date.toLocaleDateString('en', date_option);
            var time_at = date.toLocaleString('en-US', time_option);
            const match_highlight = fuzzysort.single($val, obj.content);
            var match = fuzzysort.highlight(match_highlight, '<span class="and">', '</span>');
            s_result += `<li class="result_itm" obj_ind="${itm.obj_index}">
                            <div class="profile">
                                <img src="${(is_sender(obj.sender_name) ? config.sender_profile : config.reciver_profile)}" alt="">
                            </div>
                            <div class="inf">
                                <div class="name">
                                    ${obj.sender_name}
                                </div>
                                <div class="match">
                                    <div>${match}</div>
                                    <small>${date_to_show} At ${time_at}</small>
                                </div>
                            </div>
                        </li>`;
        });
        result.html(s_result);
        
        $('.result_itm').click(function() {
            var obj_ind = $(this).attr('obj_ind'); 
            var opt = '';
            var src_pagin;
            function g_pagin(in_d) {
                src_pagin = paginate(pagin, main_array, false, Number(in_d));
                src_pagin.data.map((elem, ind) => {
                    opt += make_chat(elem, $val);
                });
            }
            g_pagin(obj_ind);
            function ir() {
                $('.left_aside').removeClass('active');
                msg_body.html(opt);
                render_setup(src_pagin);
                r_time = 0;
                my_event('load_end');
                // msg_body.find('.and')[0];
                // $.scrollTo($('.and'), 100);
                var tg_id = Number(obj_ind);
                // var adn = $('.hi_li_go').attr('hli_ind');
                var t_obj = $('[hli_ind='+tg_id+']');
                var w_h = window.innerHeight / 2;
                var to_go = $('[hli_ind='+obj_ind+']');
                    to_go.addClass('go_focus');
                msg_body.animate({ scrollTop: t_obj.offset().top - w_h + 60 }, 100);
                // msg_body.animate({ scrollTop: 0 }, 100, function () {
                // });
            }
            ir();
            // head over controll
            $('.had_over').addClass('active');
            $('.s_cancel').click(function() {
                $('.had_over').removeClass('active');
            });
            var m_c = 1;
            var t_c = rev.length;
            rev.map((item, c_ind) => {
                if (obj_ind == item.obj_index) {
                    m_c = c_ind + 1;
                }
            });
            $('.match_stat').html(t_c);
            $('.current').html(m_c);
            $('.up').click(function() {
                if ((m_c -1) >= 1) {
                    g_pagin(m_c - 1);
                    $('.current').html(m_c - 1);
                    m_c -= 1;
                    ir();
                }
            });
            $('.down').click(function() { 
                if ((m_c + 1) <= t_c) {
                    g_pagin(m_c + 1);
                    $('.current').html(m_c + 1);
                    m_c += 1;
                    ir();
                }
            });
            
        });
    }, 1000);
});
// 1622636146645
// (s_obj.timestamp_ms == date)
function go_a_date(arr, date) {
    if (undefined === date || date === '') return [];
    var snd = new Date(date);
    var snd_d = snd.getDate();
    var snd_m = snd.getMonth();
    var snd_y = snd.getFullYear();
    return arr.filter((s_obj, index) => {
        let flag;
        var nd = new Date(s_obj.timestamp_ms);
        var tms_d = nd.getDate();
        var tms_m = nd.getMonth();
        var tms_y = nd.getFullYear();
        s_obj.ind = index;
        flag = (snd_d == tms_d && snd_m == tms_m && snd_y == tms_y);
        flag = (snd_m == tms_m && snd_y == tms_y);
        flag = (snd_d == tms_d && snd_y == tms_y);
        flag = (snd_d == tms_d && snd_m == tms_m);
        flag = (snd_m == tms_m);
        flag = (snd_y == tms_y);
        return flag;
    });
}
// go_a_date(main_array, '2020-01-01')
// p_a_d
$('.date_p_and_go').click(function() {
    var t_date = $('#p_a_d').val();
    if (t_date) {
        var op_of_date = go_a_date(main_array, t_date);
        if (op_of_date.length) {
            var op_ind = op_of_date[0].ind;
            var opt = '';
            var src_pagin = paginate(pagin, main_array, false, Number(op_ind));
            var opt = '';
            src_pagin.data.map((elem, ind) => {
                opt += make_chat(elem, false, Number(op_ind));
            });
            msg_body.animate({ scrollTop: 0 }, 100, function () {
                msg_body.html(opt);
                render_setup(src_pagin);
                r_time = 0;
                my_event('load_end');
                var to_go = $('[go_ind='+op_ind+']');
                to_go.addClass('go_focus');
                var w_h = window.innerHeight / 2;
                msg_body.animate({ scrollTop: to_go.offset().top - w_h + 60 }, 100);
            });
        }
    }
});

